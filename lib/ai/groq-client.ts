/**
 * Groq AI Client
 * Llama3.1-8B model için Groq API entegrasyonu
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-8b-instant' // Updated: llama3-8b-8192 was decommissioned - using latest 8B model
const MAX_TOKENS = 64 // Kısa ve net cevaplar için optimize edildi (token tasarrufu)
const MAX_TOKENS_FOR_LISTING = 150 // İlan metni oluştururken daha fazla token (generate-listing için)
const TEMPERATURE = 0.2 // Daha tutarlı cevaplar için

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqResponse {
  content: string
  tokenUsage: {
    prompt: number
    completion: number
    total: number
  }
}

export async function callGroq(
  messages: GroqMessage[],
  systemPrompt?: string,
  maxTokens?: number // Opsiyonel: İlan metni için daha fazla token
): Promise<GroqResponse> {
  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY is not set in environment variables')
    throw new Error('GROQ_API_KEY environment variable is not set')
  }

  // Kullanıcı mesajlarını hazırla - makale yazmasını engelle
  const processedMessages = messages.map((msg) => {
    if (msg.role === 'user') {
      // Kullanıcı mesajına kısa bir direktif ekle (makale yazmasını engelle)
      // Elektrik, tesisat, montaj gibi kategorilerde sadece ilan soruları sor
      const enforcedMessage = `Görev modundasın. Kullanıcı: "${msg.content}". Sadece iş ilanı oluşturmak için gerekli soruyu sor. Makale yazma. Açıklama yapma.`
      return { ...msg, content: enforcedMessage }
    }
    return msg
  })

  // System prompt varsa ekle (kısa ve net - token tasarrufu için)
  const allMessages: GroqMessage[] = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...processedMessages]
    : processedMessages

  // Timeout için AbortController - Groq API için daha uzun timeout (60 saniye)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 saniye timeout (Groq bazen yavaş olabiliyor)

  try {
    console.log('🔍 Groq API çağrısı yapılıyor...', {
      model: MODEL,
      messageCount: allMessages.length,
    })

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: allMessages,
        temperature: TEMPERATURE,
        max_tokens: maxTokens || MAX_TOKENS, // İlan metni için daha fazla token
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Groq API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      throw new Error(`Groq API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    console.log('✅ Groq API başarılı:', {
      content: content.substring(0, 100), // Sadece ilk 100 karakteri logla (token tasarrufu)
      tokenUsage: data.usage,
    })

    return {
      content: content.trim(),
      tokenUsage: {
        prompt: data.usage?.prompt_tokens || 0,
        completion: data.usage?.completion_tokens || 0,
        total: data.usage?.total_tokens || 0,
      },
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    
    if (error.name === 'AbortError') {
      console.error('❌ Groq API timeout (60 saniye)')
      throw new Error('Groq API timeout: İstek 60 saniye içinde tamamlanamadı')
    }

    console.error('❌ Groq API error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    throw error
  }
}

/**
 * Token sayısını tahmin et (yaklaşık)
 */
export function estimateTokens(text: string): number {
  // Türkçe için yaklaşık: 1 token ≈ 4 karakter
  return Math.ceil(text.length / 4)
}

