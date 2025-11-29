/**
 * AI Chat API Route
 * Groq AI ile ilan oluşturma akışı
 */

import { NextRequest, NextResponse } from 'next/server'
import { FlowEngine } from '@/lib/ai/flow-engine'
import { checkUserBlock } from '@/lib/ai/block-handler'

// Flow engine'leri sakla (session bazlı)
const flowEngines = new Map<string, FlowEngine>()

// Session timeout: 30 dakika
const SESSION_TIMEOUT = 30 * 60 * 1000

/**
 * POST /api/ai - AI mesaj işleme
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, message, sessionId, action } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    // Session ID oluştur
    const currentSessionId = sessionId || `${userId}-${Date.now()}`

    // Ban kontrolü
    const blockStatus = await checkUserBlock(userId)
    if (blockStatus.isBlocked) {
      return NextResponse.json(
        {
          error: 'Blocked',
          message: `Bu alan sohbet için değildir. ${blockStatus.remainingMinutes} dakika sonra tekrar deneyin.`,
          blockedUntil: blockStatus.blockedUntil,
        },
        { status: 403 }
      )
    }

    // Flow engine'i al veya oluştur
    let flowEngine = flowEngines.get(currentSessionId)
    if (!flowEngine || action === 'reset') {
      flowEngine = new FlowEngine(userId)
      flowEngines.set(currentSessionId, flowEngine)
    }

    // Eski session'ları temizle
    setTimeout(() => {
      flowEngines.delete(currentSessionId)
    }, SESSION_TIMEOUT)

    // İlk mesaj kontrolü
    if (action === 'initial' || flowEngine.getState().messages.length === 0) {
      const initialCategory = body.initialCategory // Arama barından gelen kategori
      const result = await flowEngine.processInitialMessage(message, initialCategory)

      return NextResponse.json({
        sessionId: currentSessionId,
        shouldProceed: result.shouldProceed,
        localMessage: result.localMessage,
        aiResponse: result.aiResponse,
        state: flowEngine.getState(),
      })
    }

    // Normal mesaj işleme
    if (action === 'confirm') {
      // İlan onayı
      const result = await flowEngine.confirmListing(message)
      if (result.success) {
        // Session'ı temizle
        flowEngines.delete(currentSessionId)
        return NextResponse.json({
          sessionId: currentSessionId,
          success: true,
          listingData: result.listingData,
          state: flowEngine.getState(),
        })
      } else {
        return NextResponse.json({
          sessionId: currentSessionId,
          success: false,
          error: result.error,
          state: flowEngine.getState(),
        })
      }
    }

    // Normal mesaj
    const result = await flowEngine.processMessage(message)

    return NextResponse.json({
      sessionId: currentSessionId,
      aiResponse: result.aiResponse,
      isComplete: result.isComplete,
      listingData: result.listingData,
      shouldSwitchToManual: result.shouldSwitchToManual,
      localMessage: result.localMessage,
      state: flowEngine.getState(),
    })
  } catch (error: any) {
    console.error('AI API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'AI işlenirken hata oluştu',
      },
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

  const flowEngine = flowEngines.get(sessionId)
  if (!flowEngine) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  return NextResponse.json({
    state: flowEngine.getState(),
  })
}

