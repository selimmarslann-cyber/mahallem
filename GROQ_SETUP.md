# 🚀 Groq API Entegrasyonu ve Test Rehberi

## ✅ Yapılan İşlemler

1. **Groq API Key eklendi:** `.env` dosyasına `GROQ_API_KEY` eklendi
2. **Test endpoint oluşturuldu:** `/api/test/groq`
3. **Groq client hazır:** `lib/ai/groq-client.ts`

## 🔑 API Key

API Key'iniz `.env` dosyasına eklenmelidir:
```
GROQ_API_KEY=your_groq_api_key_here
```

**Not:** Gerçek API key'inizi `.env` dosyasına ekleyin. Bu dosya `.gitignore`'da olduğu için GitHub'a yüklenmeyecektir.

## 🧪 Test Etme

### 1. Development Server'ı Başlatın

```bash
npm run dev
```

### 2. API Endpoint'ini Test Edin

#### Basit Test (GET)
Tarayıcıda veya curl ile:
```
http://localhost:3000/api/test/groq
```

#### Kategori Sınıflandırma Testi (POST)
```bash
curl -X POST http://localhost:3000/api/test/groq \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Evde priz bozuldu, kıvılcım çıkıyor",
    "testType": "category"
  }'
```

#### Basit Groq Testi (POST)
```bash
curl -X POST http://localhost:3000/api/test/groq \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Evde priz bozuldu, kıvılcım çıkıyor"
  }'
```

### 3. Postman veya Thunder Client ile Test

**GET Request:**
- URL: `http://localhost:3000/api/test/groq`
- Method: GET

**POST Request (Kategori):**
- URL: `http://localhost:3000/api/test/groq`
- Method: POST
- Body (JSON):
```json
{
  "description": "Evde priz bozuldu, kıvılcım çıkıyor",
  "testType": "category"
}
```

**POST Request (Basit):**
- URL: `http://localhost:3000/api/test/groq`
- Method: POST
- Body (JSON):
```json
{
  "description": "Evde priz bozuldu, kıvılcım çıkıyor"
}
```

## 📋 Beklenen Sonuçlar

### GET /api/test/groq
```json
{
  "success": true,
  "message": "Groq API başarıyla çalışıyor!",
  "test": {
    "input": "Evde priz bozuldu, kıvılcım çıkıyor",
    "output": "...",
    "tokenUsage": {
      "prompt": 20,
      "completion": 15,
      "total": 35
    }
  },
  "timestamp": "2024-..."
}
```

### POST /api/test/groq (category)
```json
{
  "success": true,
  "message": "Kategori sınıflandırma başarılı!",
  "result": {
    "input": "Evde priz bozuldu, kıvılcım çıkıyor",
    "category": {
      "categoryId": "...",
      "slug": "priz-anahtar",
      "name": "Priz / Anahtar Değişimi",
      "level": 1
    },
    "confidence": "high"
  },
  "timestamp": "2024-..."
}
```

## 🔧 Sorun Giderme

### API Key Bulunamadı Hatası
```
Error: GROQ_API_KEY environment variable is not set
```

**Çözüm:**
1. `.env` dosyasını kontrol edin
2. Development server'ı yeniden başlatın
3. `.env` dosyasında `GROQ_API_KEY=gsk_...` olduğundan emin olun

### API Hatası
```
Groq API error: 401 Unauthorized
```

**Çözüm:**
- API key'in doğru olduğundan emin olun
- API key'in expire olmadığını kontrol edin
- Groq dashboard'dan yeni bir key oluşturun

### Timeout Hatası
```
timeout: http://localhost:3000/api/test/groq
```

**Çözüm:**
- Development server'ın çalıştığından emin olun
- Port 3000'in başka bir uygulama tarafından kullanılmadığını kontrol edin

## 📝 Kullanım

### Kategori Sınıflandırma
```typescript
import { classifyServiceCategory } from '@/lib/ai/classifyServiceCategory'

const result = await classifyServiceCategory('Evde priz bozuldu')
console.log(result.category.slug) // "priz-anahtar"
console.log(result.category.level) // 1
```

### Genel Groq Kullanımı
```typescript
import { callGroq } from '@/lib/ai/groq-client'

const response = await callGroq([
  {
    role: 'user',
    content: 'Merhaba!',
  },
])

console.log(response.content)
console.log(response.tokenUsage)
```

## ✅ Test Durumu

- [x] API Key eklendi
- [x] Test endpoint oluşturuldu
- [x] Groq client hazır
- [ ] API test edildi (development server çalıştığında test edin)

---

**Son Güncelleme:** 2024

