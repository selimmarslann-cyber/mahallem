# AI Chat System Setup

Bu dokümantasyon, Groq tabanlı AI müşteri ilan oluşturma sisteminin kurulumunu açıklar.

## 📋 Gereksinimler

### 1. Environment Variables

`.env` dosyasına aşağıdaki değişkeni ekleyin:

```env
GROQ_API_KEY=your-groq-api-key-here
```

Groq API key'i almak için:
1. https://console.groq.com adresine gidin
2. Hesap oluşturun veya giriş yapın
3. API Keys bölümünden yeni bir key oluşturun
4. Key'i kopyalayıp `.env` dosyasına ekleyin

### 2. Supabase Migration

AI sistemi için gerekli tabloları oluşturun:

```bash
# Supabase CLI ile migration çalıştırın
supabase db push

# Veya Supabase Dashboard'dan SQL Editor'ü kullanın
# supabase/migrations/04_ai_listings.sql dosyasını çalıştırın
```

**Oluşturulan Tablolar:**
- `ai_blocks` - Kullanıcı ban sistemi
- `listings` - Müşteri ilanları

### 3. RLS (Row Level Security) Policies

Migration dosyası RLS politikalarını otomatik oluşturur. Eğer manuel kontrol etmek isterseniz:

```sql
-- AI Blocks Policies
SELECT * FROM pg_policies WHERE tablename = 'ai_blocks';

-- Listings Policies
SELECT * FROM pg_policies WHERE tablename = 'listings';
```

## 🚀 Kullanım

### Müşteri Tarafı

1. **AI Chat Sayfası**: `/ai-chat`
   - Kullanıcılar bu sayfaya giderek AI ile ilan oluşturabilir
   - Request sayfasında "AI ile İlan Oluştur" butonu var

2. **İlan Oluşturma Akışı**:
   - Kullanıcı ilk mesajını yazar (hizmet kelimesi içermeli)
   - AI gerekli bilgileri sorar (max 3 soru)
   - Token limiti: 450 token
   - İlan başarıyla oluşturulduğunda `/jobs` sayfasına yönlendirilir

### Güvenlik Özellikleri

1. **Intent Detection**:
   - Hizmet kelimeleri kontrol edilir
   - Gereksiz sohbet tespit edilir
   - 30 dakika ban sistemi

2. **Token Limiti**:
   - Max 450 token
   - Limit dolunca manuel mode'a geçilir

3. **Ban Sistemi**:
   - Gereksiz sohbet → 30 dakika ban
   - Ban durumu Supabase'de saklanır

## 📁 Dosya Yapısı

```
/lib/ai/
  ├── groq-client.ts          # Groq API entegrasyonu
  ├── intent-detector.ts      # Intent algılama
  ├── prompt-system.ts        # AI system prompts
  ├── block-handler.ts        # Ban yönetimi
  ├── manual-mode.ts          # Manuel mod
  └── flow-engine.ts          # Ana akış motoru

/app/api/ai/
  ├── route.ts                # AI chat API
  └── create-listing/
      └── route.ts            # İlan oluşturma API

/components/AIChat/
  ├── AIChatBox.tsx           # Ana chat bileşeni
  └── LocalWarning.tsx        # Local uyarı mesajları

/app/(customer)/ai-chat/
  └── page.tsx                # AI Chat sayfası
```

## 🔧 Yapılandırma

### Token Limitini Değiştirme

`lib/ai/flow-engine.ts` dosyasında:

```typescript
const MAX_TOKENS = 450 // Bu değeri değiştirin
```

### Maksimum Soru Sayısını Değiştirme

`lib/ai/flow-engine.ts` dosyasında:

```typescript
const MAX_QUESTIONS = 3 // Bu değeri değiştirin
```

### Hizmet Kelimelerini Güncelleme

`lib/ai/intent-detector.ts` dosyasında:

```typescript
const SERVICE_KEYWORDS = [
  'elektrik',
  'tesisat',
  // Yeni kelimeler ekleyin
]
```

## 🧪 Test

1. **Test Kullanıcısı Oluşturun**:
   - Normal bir kullanıcı hesabı oluşturun
   - Login yapın

2. **AI Chat'i Test Edin**:
   - `/ai-chat` sayfasına gidin
   - İlk mesaj: "Elektrik tamiri"
   - AI'nin sorularını cevaplayın
   - İlanın oluşturulduğunu kontrol edin

3. **Ban Sistemini Test Edin**:
   - Gereksiz sohbet kelimeleri içeren mesaj gönderin
   - 30 dakika ban alındığını kontrol edin

## ⚠️ Önemli Notlar

1. **AI sadece müşteri tarafında çalışır**
   - Usta/esnaf/admin tarafında AI kapalı
   - Sadece `/ai-chat` sayfasında aktif

2. **Token Kullanımı**:
   - Her AI cevabında token kullanılır
   - Token limiti dolunca manuel mode'a geçilir
   - Local mesajlar token kullanmaz

3. **Ban Sistemi**:
   - Gereksiz sohbet → 30 dakika ban
   - Ban durumu Supabase'de saklanır
   - Ban süresi dolunca otomatik temizlenir

## 🐛 Sorun Giderme

### Groq API Hatası

```
Error: GROQ_API_KEY environment variable is not set
```

**Çözüm**: `.env` dosyasına `GROQ_API_KEY` ekleyin

### Supabase Bağlantı Hatası

```
Error: Failed to create listing
```

**Çözüm**: 
1. Migration'ın çalıştırıldığını kontrol edin
2. RLS politikalarının aktif olduğunu kontrol edin
3. Service role key'in doğru olduğunu kontrol edin

### Token Limit Hatası

Token limiti dolduğunda otomatik olarak manuel mode'a geçilir. Bu normal bir durumdur.

## 📚 API Dokümantasyonu

### POST /api/ai

AI mesaj işleme endpoint'i.

**Request Body:**
```json
{
  "userId": "user-id",
  "message": "Elektrik tamiri",
  "sessionId": "session-id", // Optional
  "action": "initial" // "initial" | "message" | "confirm" | "reset"
}
```

**Response:**
```json
{
  "sessionId": "session-id",
  "shouldProceed": true,
  "aiResponse": "Hangi hizmete ihtiyacınız var?",
  "state": { ... }
}
```

### POST /api/ai/create-listing

İlan oluşturma endpoint'i.

**Request Body:**
```json
{
  "userId": "user-id",
  "listingData": {
    "category": "elektrik",
    "description": "...",
    "date": "2024-01-15",
    "priority": "normal",
    "address": "...",
    "price_range": "500-1000 TL"
  }
}
```

## 🔐 Güvenlik

1. **RLS Policies**: Tüm tablolarda aktif
2. **Ban System**: Gereksiz sohbet engellenir
3. **Token Limits**: Token kullanımı sınırlandırılır
4. **Intent Detection**: Sadece hizmet talepleri kabul edilir

## 📞 Destek

Sorularınız için:
- Issue açın
- Dokümantasyonu kontrol edin
- Migration dosyalarını kontrol edin

