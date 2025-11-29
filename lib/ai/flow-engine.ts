/**
 * Flow Engine
 * AI ilan oluşturma akışını yönetir
 */

import { callGroq, estimateTokens, type GroqMessage } from './groq-client'
import { detectIntent, isLongMessage } from './intent-detector'
import { SYSTEM_PROMPT, createSummaryPrompt } from './prompt-system'
import { checkUserBlock, blockUser } from './block-handler'
import { MANUAL_MODE_MESSAGE, ManualModeReason } from './manual-mode'

export interface FlowState {
  userId: string
  messages: GroqMessage[]
  totalTokens: number
  questionCount: number
  isActive: boolean
  isManualMode: boolean
  manualModeReason: ManualModeReason | null
}

const MAX_TOKENS = 450 // Token limiti
const MAX_QUESTIONS = 3 // Maksimum soru sayısı

/**
 * Flow Engine Class
 */
export class FlowEngine {
  private state: FlowState

  constructor(userId: string) {
    this.state = {
      userId,
      messages: [],
      totalTokens: 0,
      questionCount: 0,
      isActive: false,
      isManualMode: false,
      manualModeReason: null,
    }
  }

  /**
   * İlk mesajı işle - Intent kontrolü yap
   * @param message - Kullanıcı mesajı
   * @param initialCategory - Arama barından gelen kategori (opsiyonel)
   */
  async processInitialMessage(
    message: string,
    initialCategory?: string
  ): Promise<{
    shouldProceed: boolean
    localMessage?: string
    aiResponse?: string
  }> {
    // Ban kontrolü
    const blockStatus = await checkUserBlock(this.state.userId)
    if (blockStatus.isBlocked) {
      return {
        shouldProceed: false,
        localMessage: `Bu alan sohbet için değildir. ${blockStatus.remainingMinutes} dakika sonra tekrar deneyin.`,
      }
    }

    // Intent kontrolü
    const intent = detectIntent(message)

    // Gereksiz sohbet tespiti
    if (intent.isChatIntent) {
      await blockUser(this.state.userId)
      return {
        shouldProceed: false,
        localMessage: 'Bu alan sohbet için değildir. 30 dakika sonra tekrar deneyin.',
      }
    }

    // Hizmet talebi yoksa AI kapat
    if (!intent.isServiceRequest) {
      return {
        shouldProceed: false,
        localMessage:
          'Bu alan sohbet alanı değildir. Lütfen kısa ve net hizmet ihtiyacınızı yazın.',
      }
    }

    // Uzun mesaj kontrolü
    if (isLongMessage(message)) {
      await blockUser(this.state.userId)
      return {
        shouldProceed: false,
        localMessage: 'Bu alan sohbet için değildir. 30 dakika sonra tekrar deneyin.',
      }
    }

    // AI'yi başlat
    this.state.isActive = true
    
    // Eğer kategori varsa, otomatik hoş geldin mesajı ekle
    let initialUserMessage = message
    if (initialCategory) {
      // Kategori ile başla - daha doğal bir mesaj oluştur
      initialUserMessage = `${initialCategory} hizmeti arıyorum`
    }
    
    this.state.messages.push({
      role: 'user',
      content: initialUserMessage,
    })

    // İlk AI cevabını al
    try {
      const response = await callGroq(this.state.messages, SYSTEM_PROMPT)
      this.state.totalTokens += response.tokenUsage.total
      this.state.messages.push({
        role: 'assistant',
        content: response.content,
      })

      return {
        shouldProceed: true,
        aiResponse: response.content,
      }
    } catch (error) {
      console.error('AI error:', error)
      this.state.isManualMode = true
      this.state.manualModeReason = ManualModeReason.SYSTEM_ERROR
      return {
        shouldProceed: false,
        localMessage: MANUAL_MODE_MESSAGE,
      }
    }
  }

  /**
   * Mesajı işle
   */
  async processMessage(message: string): Promise<{
    aiResponse?: string
    isComplete: boolean
    listingData?: any
    shouldSwitchToManual: boolean
    localMessage?: string
  }> {
    // Token limiti kontrolü
    if (this.state.totalTokens >= MAX_TOKENS) {
      this.state.isManualMode = true
      this.state.manualModeReason = ManualModeReason.TOKEN_LIMIT
      return {
        shouldSwitchToManual: true,
        localMessage: MANUAL_MODE_MESSAGE,
      }
    }

    // Gereksiz sohbet kontrolü
    const intent = detectIntent(message)
    if (intent.isChatIntent || isLongMessage(message)) {
      await blockUser(this.state.userId)
      this.state.isActive = false
      return {
        shouldSwitchToManual: false,
        localMessage: 'Bu alan sohbet için değildir. 30 dakika sonra tekrar deneyin.',
      }
    }

    // Mesajı ekle
    this.state.messages.push({
      role: 'user',
      content: message,
    })

    // AI cevabını al
    try {
      const response = await callGroq(this.state.messages, SYSTEM_PROMPT)
      this.state.totalTokens += response.tokenUsage.total
      this.state.questionCount++

      this.state.messages.push({
        role: 'assistant',
        content: response.content,
      })

      // "İlanı yayınlayayım mı?" kontrolü
      const isComplete = response.content.toLowerCase().includes('ilanı yayınlayayım mı')

      // Token limiti kontrolü (cevap sonrası)
      if (this.state.totalTokens >= MAX_TOKENS) {
        this.state.isManualMode = true
        this.state.manualModeReason = ManualModeReason.TOKEN_LIMIT
        return {
          shouldSwitchToManual: true,
          localMessage: MANUAL_MODE_MESSAGE,
        }
      }

      // Soru limiti kontrolü
      if (this.state.questionCount >= MAX_QUESTIONS && !isComplete) {
        // Son özeti oluştur
        const summaryPrompt = createSummaryPrompt(this.state.messages)
        try {
          const summaryResponse = await callGroq(
            [{ role: 'user', content: summaryPrompt }],
            SYSTEM_PROMPT
          )

          // JSON parse dene
          let listingData = null
          try {
            const jsonMatch = summaryResponse.content.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              listingData = JSON.parse(jsonMatch[0])
            }
          } catch (e) {
            // JSON parse başarısız, manuel mode'a geç
            this.state.isManualMode = true
            this.state.manualModeReason = ManualModeReason.TOKEN_LIMIT
            return {
              shouldSwitchToManual: true,
              localMessage: MANUAL_MODE_MESSAGE,
            }
          }

          return {
            aiResponse: 'İlanınız hazır. İlanı yayınlayayım mı?',
            isComplete: true,
            listingData,
          }
        } catch (e) {
          this.state.isManualMode = true
          this.state.manualModeReason = ManualModeReason.SYSTEM_ERROR
          return {
            shouldSwitchToManual: true,
            localMessage: MANUAL_MODE_MESSAGE,
          }
        }
      }

      return {
        aiResponse: response.content,
        isComplete,
      }
    } catch (error) {
      console.error('AI error:', error)
      this.state.isManualMode = true
      this.state.manualModeReason = ManualModeReason.SYSTEM_ERROR
      return {
        shouldSwitchToManual: true,
        localMessage: MANUAL_MODE_MESSAGE,
      }
    }
  }

  /**
   * İlan onayı - JSON çıkar
   */
  async confirmListing(message: string): Promise<{
    listingData: any
    success: boolean
    error?: string
  }> {
    if (message.toLowerCase().includes('evet') || message.toLowerCase().includes('tamam')) {
      // Son konuşmayı özetle
      const summaryPrompt = createSummaryPrompt(this.state.messages)
      try {
        const summaryResponse = await callGroq(
          [{ role: 'user', content: summaryPrompt }],
          SYSTEM_PROMPT
        )

        // JSON parse
        const jsonMatch = summaryResponse.content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const listingData = JSON.parse(jsonMatch[0])
          return {
            listingData,
            success: true,
          }
        } else {
          return {
            listingData: null,
            success: false,
            error: 'İlan bilgileri çıkarılamadı',
          }
        }
      } catch (error) {
        return {
          listingData: null,
          success: false,
          error: 'İlan oluşturulurken hata oluştu',
        }
      }
    }

    return {
      listingData: null,
      success: false,
      error: 'Onay bekleniyor',
    }
  }

  /**
   * State'i al
   */
  getState(): FlowState {
    return { ...this.state }
  }

  /**
   * State'i sıfırla
   */
  reset(): void {
    this.state = {
      userId: this.state.userId,
      messages: [],
      totalTokens: 0,
      questionCount: 0,
      isActive: false,
      isManualMode: false,
      manualModeReason: null,
    }
  }
}

