/**
 * Groq API Test Script
 * 
 * Usage: node scripts/test-groq.js
 * 
 * Not: Bu script için GROQ_API_KEY environment variable'ı set edilmiş olmalı
 * veya .env dosyasında olmalı (Next.js otomatik yükler)
 */

// API Key'i environment'tan alın (.env dosyasından)
// NOT: API key'i buraya hardcode etmeyin! .env dosyasına ekleyin.
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama3-8b-8192'

async function testGroq() {
  console.log('🧪 Groq API Test Başlatılıyor...\n')

  // API Key kontrolü
  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY environment variable bulunamadı!')
    console.error('Lütfen .env veya .env.local dosyasına GROQ_API_KEY ekleyin.')
    process.exit(1)
  }

  console.log('✅ GROQ_API_KEY bulundu:', GROQ_API_KEY.substring(0, 10) + '...')
  console.log('📡 API URL:', GROQ_API_URL)
  console.log('🤖 Model:', MODEL)
  console.log('')

  // Test 1: Basit mesaj
  console.log('📝 Test 1: Basit Mesaj')
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: 'Merhaba! Sen bir AI asistanısın. Kısaca kendini tanıt.',
          },
        ],
        temperature: 0.2,
        max_tokens: 100,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    console.log('✅ Başarılı!')
    console.log('📤 Cevap:', content)
    console.log('📊 Token Kullanımı:', {
      prompt: data.usage?.prompt_tokens || 0,
      completion: data.usage?.completion_tokens || 0,
      total: data.usage?.total_tokens || 0,
    })
    console.log('')
  } catch (error) {
    console.error('❌ Hata:', error.message)
    console.error('')
    process.exit(1)
  }

  // Test 2: Kategori sınıflandırma benzeri
  console.log('📝 Test 2: Hizmet Açıklaması Analizi')
  try {
    const testDescription = 'Evde priz bozuldu, kıvılcım çıkıyor. Acil tamir gerekiyor.'

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'Sen bir sınıflandırma motorusun. Verilen hizmet açıklamasını analiz et ve kısaca özetle.',
          },
          {
            role: 'user',
            content: `Hizmet açıklaması: ${testDescription}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 150,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    console.log('✅ Başarılı!')
    console.log('📥 Girdi:', testDescription)
    console.log('📤 Çıktı:', content)
    console.log('📊 Token Kullanımı:', {
      prompt: data.usage?.prompt_tokens || 0,
      completion: data.usage?.completion_tokens || 0,
      total: data.usage?.total_tokens || 0,
    })
    console.log('')
  } catch (error) {
    console.error('❌ Hata:', error.message)
    console.error('')
    process.exit(1)
  }

  // Test 3: JSON formatında cevap
  console.log('📝 Test 3: JSON Formatında Cevap')
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'Sen bir sınıflandırma motorusun. Cevabını her zaman JSON formatında döndür.',
          },
          {
            role: 'user',
            content:
              'Aşağıdaki hizmet açıklaması için kategori slug seç: "Evde priz bozuldu". Cevabını JSON formatında döndür: { "slugs": ["priz-anahtar"] }',
          },
        ],
        temperature: 0.2,
        max_tokens: 100,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    console.log('✅ Başarılı!')
    console.log('📤 Cevap:', content)

    // JSON parse denemesi
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        console.log('✅ JSON Parse Başarılı:', parsed)
      }
    } catch (parseError) {
      console.log('⚠️  JSON Parse hatası (normal olabilir):', parseError.message)
    }

    console.log('📊 Token Kullanımı:', {
      prompt: data.usage?.prompt_tokens || 0,
      completion: data.usage?.completion_tokens || 0,
      total: data.usage?.total_tokens || 0,
    })
    console.log('')
  } catch (error) {
    console.error('❌ Hata:', error.message)
    console.error('')
    process.exit(1)
  }

  console.log('🎉 Tüm testler başarıyla tamamlandı!')
  console.log('✅ Groq API entegrasyonu çalışıyor.')
}

// Script'i çalıştır
testGroq().catch((error) => {
  console.error('❌ Beklenmeyen hata:', error)
  process.exit(1)
})

