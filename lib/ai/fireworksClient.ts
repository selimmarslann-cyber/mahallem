/**
 * Fireworks AI Client
 * Fireworks AI fallback model için API entegrasyonu
 */

export async function fireworksChat(messages: { role: string; content: string }[]) {
  const apiKey = process.env.FIREWORKS_API_KEY
  
  if (!apiKey) {
    console.error('❌ FIREWORKS_API_KEY is not set in environment variables')
    return { ok: false, error: 'FIREWORKS_API_KEY environment variable is not set' }
  }

  try {
    const res = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.1-8B-Instruct', // Fireworks model adı
        messages: messages.filter((m) => m.role !== 'system'), // System prompt'u atla - token tasarrufu
        max_tokens: 150, // Token tasarrufu için azaltıldı
        temperature: 0.6,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('❌ Fireworks API error:', {
        status: res.status,
        statusText: res.statusText,
        error: err,
      })
      throw { fwError: err }
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content || ''

    if (!text) {
      console.warn('⚠️ Fireworks boş cevap döndü:', data)
    }

    return { ok: true, text }
  } catch (e: any) {
    console.error('❌ Fireworks chat error:', {
      name: e.name,
      message: e.message,
      error: e.fwError || e,
    })
    return { ok: false, error: e.fwError || e }
  }
}

