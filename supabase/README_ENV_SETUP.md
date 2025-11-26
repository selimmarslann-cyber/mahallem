# Supabase Kurulum Rehberi

Bu rehber, Mahallem projesi için Supabase'in nasıl yapılandırılacağını adım adım anlatır.

## 📋 İçindekiler

1. [Environment Değişkenleri](#environment-değişkenleri)
2. [Supabase Dashboard Yapılandırması](#supabase-dashboard-yapılandırması)
3. [Storage Bucket'ları Oluşturma](#storage-bucketları-oluşturma)
4. [Veritabanı Schema Kurulumu](#veritabanı-schema-kurulumu)
5. [Auth Redirect URL'leri](#auth-redirect-urlleri)
6. [Güvenlik Notları](#güvenlik-notları)

---

## 🔐 Environment Değişkenleri

### Gerekli ENV Değişkenleri

Proje kök dizininde `.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb-publishable-XXXX
SUPABASE_SERVICE_ROLE_KEY=sb-secret-XXXX

# Database Configuration
DATABASE_URL=postgresql://postgres.PROJECT_REF:DB_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key-change-in-production
MOBILE_JWT_SECRET=your-mobile-secret-key-change-in-production
```

### ENV Değişkenlerinin Açıklamaları

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Ne işe yarar**: Supabase projenizin base URL'i
- **Nereden alınır**: Supabase Dashboard > Settings > API > Project URL
- **Format**: `https://PROJECT_REF.supabase.co`
- **Kullanım**: Hem client hem server tarafında kullanılır

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Ne işe yarar**: Client-side (browser) için güvenli anon/public key
- **Nereden alınır**: Supabase Dashboard > Settings > API > anon public
- **Güvenlik**: Bu key public'tir, client-side'da kullanılabilir
- **Kullanım**: Sadece client-side kodlarda (`lib/supabaseClient.ts`)

#### `SUPABASE_SERVICE_ROLE_KEY`
- **Ne işe yarar**: Server-side için tam yetkili admin key
- **Nereden alınır**: Supabase Dashboard > Settings > API > service_role secret
- **Güvenlik**: ⚠️ **ÇOK GİZLİ!** ASLA client-side'da kullanma!
- **Kullanım**: Sadece server-side kodlarda (`lib/supabaseAdmin.ts`)
- **Yetkiler**: Tüm veritabanı ve storage'a tam erişim

#### `DATABASE_URL`
- **Ne işe yarar**: PostgreSQL veritabanı bağlantı string'i
- **Nereden alınır**: Supabase Dashboard > Settings > Database > Connection string
- **Format**: `postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres`
- **Kullanım**: Prisma ORM ve direkt veritabanı bağlantıları için

#### `NEXT_PUBLIC_APP_URL`
- **Ne işe yarar**: Uygulamanın base URL'i
- **Kullanım**: Referral linkleri, redirect URL'leri, callback URL'leri için
- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`

---

## 🎛️ Supabase Dashboard Yapılandırması

### 1. Proje Oluşturma

1. [Supabase Dashboard](https://app.supabase.com) > New Project
2. Proje adı, database şifresi, region seçin
3. Proje oluşturulduktan sonra **Project Reference**'ı not edin (URL'de görünür)

### 2. API Keys Alma

1. Dashboard > **Settings** > **API**
2. **Project URL**: `NEXT_PUBLIC_SUPABASE_URL` için kullan
3. **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` için kullan
4. **service_role secret**: `SUPABASE_SERVICE_ROLE_KEY` için kullan (⚠️ gizli tut!)

### 3. Database Connection String Alma

1. Dashboard > **Settings** > **Database**
2. **Connection string** bölümüne git
3. **Connection pooling** modunu seç (Transaction mode)
4. Connection string'i kopyala ve `DATABASE_URL` olarak ekle
5. Şifreyi kendi database şifrenizle değiştirin

---

## 📦 Storage Bucket'ları Oluşturma

Proje için 2 adet public bucket oluşturulmalıdır:

### Bucket 1: `posts`

**Oluşturma Adımları:**

1. Supabase Dashboard > **Storage**
2. **New bucket** butonuna tıkla
3. **Bucket name**: `posts`
4. **Public bucket**: ✅ **Açık** (Public olmalı!)
5. **File size limit**: 5 MB (veya ihtiyacınıza göre)
6. **Allowed MIME types**: `image/*` (veya `*/*` tüm dosyalar için)
7. **Create bucket**

**Kullanım Amacı:**
- Blog yazıları, duyurular, içerik görselleri
- Public erişilebilir içerikler

**RLS (Row Level Security) Politikaları:**

Bucket oluşturulduktan sonra, Storage > Policies bölümünden gerekli politikaları ekleyin:

```sql
-- Herkes okuyabilir (public bucket)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts');

-- Authenticated kullanıcılar yazabilir
CREATE POLICY "Authenticated write access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
```

### Bucket 2: `avatars`

**Oluşturma Adımları:**

1. Supabase Dashboard > **Storage**
2. **New bucket** butonuna tıkla
3. **Bucket name**: `avatars`
4. **Public bucket**: ✅ **Açık** (Public olmalı!)
5. **File size limit**: 2 MB (avatar için yeterli)
6. **Allowed MIME types**: `image/jpeg,image/png,image/webp`
7. **Create bucket**

**Kullanım Amacı:**
- Kullanıcı profil fotoğrafları
- İşletme logoları
- Public erişilebilir avatar görselleri

**RLS (Row Level Security) Politikaları:**

```sql
-- Herkes okuyabilir (public bucket)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Sadece kendi avatarını güncelleyebilir
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Authenticated kullanıcılar yeni avatar yükleyebilir
CREATE POLICY "Authenticated upload access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

---

## 🗄️ Veritabanı Schema Kurulumu

### Prisma Schema Kullanımı

Proje **Prisma ORM** kullanıyor. Schema dosyası: `prisma/schema.prisma`

**Kurulum Adımları:**

1. `.env.local` dosyasında `DATABASE_URL`'i ayarlayın
2. Prisma Client'ı generate edin:
   ```bash
   npm run db:generate
   ```
3. Schema'yı veritabanına push edin:
   ```bash
   npm run db:push
   ```
   veya migration kullanarak:
   ```bash
   npm run db:migrate
   ```

### Ek SQL Migration'ları

Projede ek SQL migration dosyaları varsa (`supabase/migrations/` klasöründe), bunları Supabase SQL Editor'da çalıştırın:

1. Supabase Dashboard > **SQL Editor**
2. **New query** oluştur
3. Migration dosyasının içeriğini yapıştır
4. **Run** butonuna tıkla

**Mevcut Migration Dosyaları:**

- `supabase/migrations/03_referral_commissions.sql` - Referral komisyon sistemi için

### Veritabanı Şeması Özeti

Prisma schema dosyası (`prisma/schema.prisma`) şu ana tabloları içerir:

- `users` - Kullanıcılar
- `businesses` - İşletmeler/Esnaflar
- `products` - Ürünler/Hizmetler
- `orders` - Siparişler
- `reviews` - Yorumlar ve puanlar
- `referral_codes` - Referral kodları
- `referral_relations` - Referral zincirleri
- `referral_rewards` - Referral ödülleri
- `wallets` - Cüzdanlar
- `notifications` - Bildirimler
- `jobs` - İşler
- `instant_jobs` - Anlık işler
- ve daha fazlası...

Detaylı şema için `prisma/schema.prisma` dosyasına bakın.

---

## 🔄 Auth Redirect URL'leri

Supabase Auth kullanılıyorsa, redirect URL'lerini yapılandırın:

1. Supabase Dashboard > **Authentication** > **URL Configuration**
2. **Site URL**: `http://localhost:3000` (development) veya production URL
3. **Redirect URLs** bölümüne şunları ekleyin:

```
http://localhost:3000/*
http://localhost:3000/auth/callback
http://localhost:3000/auth/login
http://localhost:3000/auth/register
```

**Production için:**

```
https://yourdomain.com/*
https://yourdomain.com/auth/callback
https://yourdomain.com/auth/login
https://yourdomain.com/auth/register
```

---

## 🔒 Güvenlik Notları

### ⚠️ Service Role Key Güvenliği

- `SUPABASE_SERVICE_ROLE_KEY` **ASLA** client-side kodda kullanılmamalıdır
- Bu key'e sahip client, tüm veritabanı ve storage'a tam yetkiye sahiptir
- Sadece server-side kodlarda (`lib/supabaseAdmin.ts`) kullanın
- `.env.local` dosyasını `.gitignore`'a eklediğinizden emin olun

### ✅ Anon Key Kullanımı

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` client-side'da güvenle kullanılabilir
- RLS (Row Level Security) politikaları ile korunur
- Sadece client-side kodlarda (`lib/supabaseClient.ts`) kullanın

### 📝 Client Kullanım Örnekleri

#### Client Component'te (Browser):

```typescript
'use client'

import { supabase } from '@/lib/supabaseClient'

// ✅ DOĞRU: Anon client kullan
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
```

#### API Route'da (Server):

```typescript
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ✅ DOĞRU: Admin client kullan
const { data, error } = await supabaseAdmin
  .from('users')
  .select('*')
  .eq('id', userId)
```

#### ❌ YANLIŞ Kullanım:

```typescript
'use client'

import { supabaseAdmin } from '@/lib/supabaseAdmin' // ❌ ASLA!

// Service role key client-side'da kullanılamaz!
```

---

## 📚 Ek Kaynaklar

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Prisma Documentation](https://www.prisma.io/docs)

---

## ✅ Kurulum Kontrol Listesi

Kurulumu tamamladıktan sonra şunları kontrol edin:

- [ ] `.env.local` dosyası oluşturuldu ve tüm değişkenler dolduruldu
- [ ] `posts` bucket'ı oluşturuldu ve public yapıldı
- [ ] `avatars` bucket'ı oluşturuldu ve public yapıldı
- [ ] RLS politikaları bucket'lar için ayarlandı
- [ ] Prisma schema veritabanına push edildi (`npm run db:push`)
- [ ] Ek SQL migration'ları çalıştırıldı
- [ ] Auth redirect URL'leri yapılandırıldı
- [ ] `lib/supabaseClient.ts` ve `lib/supabaseAdmin.ts` dosyaları doğru çalışıyor
- [ ] Test: Client component'te `supabase` import edilebiliyor
- [ ] Test: API route'ta `supabaseAdmin` import edilebiliyor

---

**Son Güncelleme**: 2025-01-26  
**Proje**: Mahallem / Hizmetgo  
**Versiyon**: 1.0.0

