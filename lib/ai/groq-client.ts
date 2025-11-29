/**
 * Groq AI Client
 * Llama3.1-8B model için Groq API entegrasyonu
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama3-8b-8192'
const MAX_TOKENS = 200 // Kısa cevaplar için
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
  systemPrompt?: string
): Promise<GroqResponse> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is not set')
  }

  const allMessages: GroqMessage[] = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages

  try {
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
        max_tokens: MAX_TOKENS,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Groq API error: ${error}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    return {
      content: content.trim(),
      tokenUsage: {
        prompt: data.usage?.prompt_tokens || 0,
        completion: data.usage?.completion_tokens || 0,
        total: data.usage?.total_tokens || 0,
      },
    }
  } catch (error) {
    console.error('Groq API error:', error)
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

