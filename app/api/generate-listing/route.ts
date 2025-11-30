/**
 * Generate Listing API Route
 * Gemini → Fireworks fallback ile ilan metni üretimi
 */

import { NextRequest, NextResponse } from 'next/server'
import { geminiChat } from '@/lib/ai/geminiClient'
import { fireworksChat } from '@/lib/ai/fireworksClient'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Kısa prompt - token tasarrufu
    const prompt = `60-90 kelime ilan metni yaz. Profesyonel, tek paragraf. Kategori: ${body.category || 'genel'}, Konum: ${body.location || 'belirtilmemiş'}, Tarih: ${body.dateRange || body.urgency || 'esnek'}, Bütçe: ${body.budgetRange || body.budget || 'belirtilmemiş'}, Alan: ${body.area || 'belirtilmemiş'}, Detay: ${body.details || 'belirtilmemiş'}`

    const messages = [{ role: 'user', content: prompt }]

    // 1) Gemini
    const g = await geminiChat(messages)
    if (g.ok) return NextResponse.json({ text: g.text, provider: 'gemini' })

    // 2) Fireworks fallback
    const f = await fireworksChat(messages)
    if (f.ok) return NextResponse.json({ text: f.text, provider: 'fireworks' })

    return NextResponse.json({ error: 'Her iki model hata verdi' }, { status: 500 })
  } catch (e) {
    return NextResponse.json(
      { error: 'İlan oluşturma hatası', detail: e },
      { status: 500 }
    )
  }
}
