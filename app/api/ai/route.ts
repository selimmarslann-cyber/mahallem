/**
 * AI Chat API Route
 * Gemini → Fireworks fallback ile sohbet asistanı
 * Mevcut FlowEngine yapısı ile uyumlu
 */

import { NextRequest, NextResponse } from 'next/server'
import { geminiChat } from '@/lib/ai/geminiClient'
import { fireworksChat } from '@/lib/ai/fireworksClient'
import { SERVICE_SYSTEM_PROMPT } from '@/lib/ai/servicePrompt'

export const runtime = 'nodejs'
export const maxDuration = 70 // Vercel timeout

// Basit session yönetimi (mesaj geçmişi)
const sessions = new Map<string, Array<{ role: string; content: string }>>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, message, sessionId, action, initialCategory } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    // Session ID oluştur veya kullan
    const currentSessionId = sessionId || `${userId}-${Date.now()}`
    
    // Session mesajlarını al veya oluştur
    let sessionMessages = sessions.get(currentSessionId) || []

    // İlk mesaj kontrolü
    if (action === 'initial' || sessionMessages.length === 0) {
      // System prompt sadece ilk mesajda - token tasarrufu
      const systemMsg = {
        role: 'system',
        content: SERVICE_SYSTEM_PROMPT,
      }

      // İlk mesajı ekle (kategori bilgisi varsa ekle)
      const firstUserMsg = initialCategory 
        ? `${initialCategory} hizmeti için bilgi topla. ${message}`
        : message

      sessionMessages = [systemMsg, { role: 'user', content: firstUserMsg }]
    } else {
      // Normal mesaj - sadece kullanıcı mesajını ekle (system prompt yok - token tasarrufu)
      sessionMessages.push({ role: 'user', content: message })
    }

    // Gemini → Fireworks fallback
    console.log('🔍 Gemini API çağrısı yapılıyor...', {
      messageCount: sessionMessages.length,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasFireworksKey: !!process.env.FIREWORKS_API_KEY,
      messages: sessionMessages.map(m => ({ role: m.role, contentLength: m.content.length })),
    })

    let aiResponse: string
    let provider: string

    try {
      const g = await geminiChat(sessionMessages)
      
      if (g.ok && g.text) {
        aiResponse = g.text
        provider = 'gemini'
        console.log('✅ Gemini başarılı:', { responseLength: aiResponse.length })
      } else {
        console.warn('⚠️ Gemini hata:', g.error)
        // Fireworks fallback
        console.log('🔄 Fireworks fallback deneniyor...')
        const f = await fireworksChat(sessionMessages)
        if (f.ok && f.text) {
          aiResponse = f.text
          provider = 'fireworks'
          console.log('✅ Fireworks başarılı:', { responseLength: aiResponse.length })
        } else {
          console.error('❌ Her iki model hata verdi:', { gemini: g.error, fireworks: f.error })
          return NextResponse.json(
            { 
              error: 'AI servisleri şu anda kullanılamıyor', 
              message: 'Lütfen daha sonra tekrar deneyin.',
              detail: { gemini: g.error, fireworks: f.error } 
            },
            { status: 500 }
          )
        }
      }
    } catch (apiError: any) {
      console.error('❌ API çağrısı hatası:', apiError)
      return NextResponse.json(
        { 
          error: 'AI işlem hatası', 
          message: apiError.message || 'Bir hata oluştu. Lütfen tekrar deneyin.',
          detail: apiError 
        },
        { status: 500 }
      )
    }

    if (!aiResponse || aiResponse.trim().length === 0) {
      console.error('❌ Boş AI cevabı alındı')
      return NextResponse.json(
        { 
          error: 'AI cevap veremedi', 
          message: 'Lütfen tekrar deneyin.' 
        },
        { status: 500 }
      )
    }

    // AI cevabını session'a ekle
    sessionMessages.push({ role: 'assistant', content: aiResponse })
    sessions.set(currentSessionId, sessionMessages)

    // İlan tamamlandı mı kontrolü (basit kontrol)
    const isComplete = aiResponse.toLowerCase().includes('ilanı yayınlayayım') || 
                      aiResponse.toLowerCase().includes('hazır') ||
                      aiResponse.toLowerCase().includes('oluşturalım')

    return NextResponse.json({
      sessionId: currentSessionId,
      aiResponse,
      isComplete,
      provider, // Debug için
    })
  } catch (err: any) {
    console.error('AI API error:', err)
    return NextResponse.json(
      { error: 'AI işlem hatası', detail: err.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai - Session durumu kontrolü
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
  }

  const sessionMessages = sessions.get(sessionId)
  if (!sessionMessages) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  return NextResponse.json({
    messages: sessionMessages,
  })
}
