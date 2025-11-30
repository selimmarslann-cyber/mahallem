/**
 * Gemini AI Client
 * Google Gemini 1.5 Flash model için API entegrasyonu
 */

export async function geminiChat(messages: { role: string; content: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables')
    return { ok: false, error: 'GEMINI_API_KEY environment variable is not set' }
  }

  try {
    // Gemini model adı: gemini-1.5-flash veya gemini-pro
    // API versiyonu: v1beta yerine v1 kullanabiliriz
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages.map((m) => {
            // System prompt'u user mesajına ekle (Gemini system role desteklemiyor)
            if (m.role === 'system') {
              return {
                role: 'user',
                parts: [{ text: m.content }],
              }
            }
            return {
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            }
          }),
        }),
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('❌ Gemini API error:', {
        status: res.status,
        statusText: res.statusText,
        error: err,
      })
      throw { geminiError: err }
    }

    const data = await res.json()
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join(' ') ||
      ''

    if (!text) {
      console.warn('⚠️ Gemini boş cevap döndü:', data)
    }

    return { text, ok: true }
  } catch (e: any) {
    console.error('❌ Gemini chat error:', {
      name: e.name,
      message: e.message,
      error: e.geminiError || e,
    })
    return { ok: false, error: e.geminiError || e }
  }
}

