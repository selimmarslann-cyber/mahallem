# Supabase Entegrasyon Özeti

Bu dokümantasyon, Supabase entegrasyonunda yapılan tüm değişiklikleri özetler.

## 📁 Oluşturulan/Yenilenen Dosyalar

### 1. `lib/supabaseClient.ts` (YENİ)
- **Amaç**: Client-side (browser) için Supabase anon client
- **Kullanım**: Client Components, browser-side kod
- **ENV Değişkenleri**: 
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Güvenlik**: Sadece anon key kullanır, RLS ile korunur

### 2. `lib/supabaseAdmin.ts` (YENİ)
- **Amaç**: Server-side için Supabase admin client
- **Kullanım**: API Routes, Server Components, Server Actions, Backend fonksiyonları
- **ENV Değişkenleri**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- **Güvenlik**: ⚠️ Tam yetkiye sahip, ASLA client-side'da kullanılmamalı

### 3. `.env.example` (YENİ)
- **Amaç**: Proje için gerekli environment değişkenlerinin şablonu
- **İçerik**: Tüm Supabase, database ve uygulama konfigürasyonları
- **Not**: Gerçek değerler yerine placeholder'lar içerir

### 4. `supabase/README_ENV_SETUP.md` (YENİ)
- **Amaç**: Supabase kurulum rehberi
- **İçerik**:
  - Environment değişkenleri açıklamaları
  - Supabase Dashboard yapılandırması
  - Storage bucket oluşturma (posts, avatars)
  - Veritabanı schema kurulumu
  - Auth redirect URL'leri
  - Güvenlik notları
  - Kurulum kontrol listesi

### 5. `.gitignore` (GÜNCELLENDİ)
- **Değişiklik**: `.env.example` dosyasının ignore edilmemesi için kural eklendi
- **Not**: `.env.example` repo'da kalacak (örnek olarak)

## 🔧 Standartlaştırılan ENV Değişkenleri

Tüm projede kullanılan environment değişkenleri şu isimlerle standardize edildi:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase proje URL'i
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Client-side anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side service role key
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - Uygulama base URL'i

## 📖 Kullanım Örnekleri

### Client Component'te (Browser)

```typescript
'use client'

import { supabase } from '@/lib/supabaseClient'

export default function MyComponent() {
  const fetchData = async () => {
    // ✅ DOĞRU: Anon client kullan
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
    
    if (error) {
      console.error('Error:', error)
      return
    }
    
    console.log('Data:', data)
  }
  
  return <button onClick={fetchData}>Fetch Data</button>
}
```

### API Route'ta (Server)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(request: NextRequest) {
  try {
    // ✅ DOĞRU: Admin client kullan
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Server Action'ta

```typescript
'use server'

import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function updateUser(userId: string, data: any) {
  // ✅ DOĞRU: Admin client kullan
  const { error } = await supabaseAdmin
    .from('users')
    .update(data)
    .eq('id', userId)
  
  if (error) {
    throw new Error(error.message)
  }
  
  return { success: true }
}
```

### Storage Kullanımı (Client)

```typescript
'use client'

import { supabase } from '@/lib/supabaseClient'

export async function uploadAvatar(file: File, userId: string) {
  // ✅ DOĞRU: Anon client ile storage'a yükle
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    throw error
  }
  
  // Public URL al
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)
  
  return publicUrl
}
```

### Storage Kullanımı (Server)

```typescript
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function deleteAvatar(fileName: string) {
  // ✅ DOĞRU: Admin client ile storage'dan sil
  const { error } = await supabaseAdmin.storage
    .from('avatars')
    .remove([fileName])
  
  if (error) {
    throw error
  }
  
  return { success: true }
}
```

## ❌ YANLIŞ Kullanımlar

### Client Component'te Service Role Key Kullanımı

```typescript
'use client'

import { supabaseAdmin } from '@/lib/supabaseAdmin' // ❌ ASLA!

// Service role key client-side'da kullanılamaz!
// Bu güvenlik açığı yaratır!
```

### Hard-coded URL/Key Kullanımı

```typescript
// ❌ YANLIŞ
const supabase = createClient(
  'https://xxxxx.supabase.co', // Hard-coded
  'sb-publishable-xxxx' // Hard-coded
)

// ✅ DOĞRU
import { supabase } from '@/lib/supabaseClient'
```

## 🔒 Güvenlik Kuralları

1. **Service Role Key ASLA client-side'da kullanılmamalı**
   - Sadece `lib/supabaseAdmin.ts` server-side kodlarda kullanılır
   - `.env.local` dosyası `.gitignore`'da olmalı

2. **Anon Key client-side'da güvenle kullanılabilir**
   - RLS (Row Level Security) politikaları ile korunur
   - Public key olduğu için client-side'da kullanılabilir

3. **Environment değişkenleri**
   - `NEXT_PUBLIC_*` prefix'li değişkenler client-side'a expose edilir
   - `SUPABASE_SERVICE_ROLE_KEY` gibi gizli değişkenler sadece server-side'da kullanılır

## 📋 Kurulum Adımları

1. **Environment Değişkenlerini Ayarla**
   ```bash
   cp .env.example .env.local
   # .env.local dosyasını düzenle ve gerçek değerleri ekle
   ```

2. **Supabase Dashboard Yapılandırması**
   - Proje oluştur
   - API keys'i al
   - Database connection string'i al
   - Detaylar için: `supabase/README_ENV_SETUP.md`

3. **Storage Bucket'ları Oluştur**
   - `posts` bucket (public)
   - `avatars` bucket (public)
   - Detaylar için: `supabase/README_ENV_SETUP.md`

4. **Veritabanı Schema'sını Kur**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **SQL Migration'ları Çalıştır**
   - Supabase Dashboard > SQL Editor
   - `supabase/migrations/03_referral_commissions.sql` dosyasını çalıştır

6. **Auth Redirect URL'lerini Ayarla**
   - Supabase Dashboard > Authentication > URL Configuration
   - Detaylar için: `supabase/README_ENV_SETUP.md`

## ✅ Kontrol Listesi

Kurulumu tamamladıktan sonra şunları kontrol edin:

- [ ] `.env.local` dosyası oluşturuldu ve tüm değişkenler dolduruldu
- [ ] `lib/supabaseClient.ts` dosyası doğru çalışıyor
- [ ] `lib/supabaseAdmin.ts` dosyası doğru çalışıyor
- [ ] Client component'te `supabase` import edilebiliyor
- [ ] API route'ta `supabaseAdmin` import edilebiliyor
- [ ] `posts` bucket'ı oluşturuldu ve public yapıldı
- [ ] `avatars` bucket'ı oluşturuldu ve public yapıldı
- [ ] Prisma schema veritabanına push edildi
- [ ] SQL migration'ları çalıştırıldı
- [ ] Auth redirect URL'leri yapılandırıldı

## 📚 Ek Kaynaklar

- **Supabase Setup Rehberi**: `supabase/README_ENV_SETUP.md`
- **Supabase Documentation**: https://supabase.com/docs
- **Prisma Documentation**: https://www.prisma.io/docs

---

**Son Güncelleme**: 2025-01-26  
**Proje**: Mahallem / Hizmetgo  
**Versiyon**: 1.0.0

