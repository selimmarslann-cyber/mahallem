# Vercel Deployment Rehberi

Bu dosya, Mahallem projesini Vercel'e deploy etmek için gerekli tüm adımları içerir.

## 📋 Vercel Environment Variables

Vercel Dashboard > Settings > Environment Variables bölümüne aşağıdaki değişkenleri ekleyin:

### 🔐 Zorunlu Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres.ducxibsyzkwwzvrdzrmp:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ducxibsyzkwwzvrdzrmp:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ducxibsyzkwwzvrdzrmp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_jboZ73C2xlgRKGGQAKja3w_OI5Jn5mc
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_jboZ73C2xlgRKGGQAKja3w_OI5Jn5mc
SUPABASE_SERVICE_ROLE_KEY=sb_secret_ldAXDkexmR4F-Og3anyM1Q_ISa56JVN

# JWT Secrets
JWT_SECRET=mahallem-super-secret-jwt-key-2026-change-in-production
MOBILE_JWT_SECRET=mahallem-mobile-secret-key-2026-change-in-production

# App URL (Production için Vercel URL'inizi kullanın)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Environment
NODE_ENV=production
```

### 📝 Environment Variables Açıklamaları

| Variable | Açıklama | Örnek |
|----------|----------|-------|
| `DATABASE_URL` | PostgreSQL connection string (pgbouncer ile) | `postgresql://...` |
| `DIRECT_URL` | Direct PostgreSQL connection (migration için) | `postgresql://...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | `sb_publishable_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) | `sb_secret_...` |
| `JWT_SECRET` | JWT token signing secret | Güçlü bir string |
| `MOBILE_JWT_SECRET` | Mobile app JWT secret | Güçlü bir string |
| `NEXT_PUBLIC_APP_URL` | Production app URL | `https://your-app.vercel.app` |
| `NODE_ENV` | Environment mode | `production` |

## 🚀 Deployment Adımları

### 1. Vercel Projesi Oluşturma

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "Add New Project" butonuna tıklayın
3. GitHub repository'nizi seçin: `selimmarslann-cyber/mahallem`
4. "Import" butonuna tıklayın

### 2. Build Settings

Vercel otomatik olarak Next.js projelerini algılar, ancak şunları kontrol edin:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build` (otomatik)
- **Output Directory**: `.next` (otomatik)
- **Install Command**: `npm install` (otomatik)

### 3. Environment Variables Ekleme

1. Project Settings > Environment Variables bölümüne gidin
2. Yukarıdaki tüm environment variable'ları ekleyin
3. **Önemli**: Her variable için environment seçin:
   - `Production` ✅
   - `Preview` ✅ (opsiyonel)
   - `Development` ✅ (opsiyonel)

### 4. Next.js Config Ayarları

`next.config.js` dosyası zaten hazır, ancak production için image domain'lerini güncelleyin:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'ducxibsyzkwwzvrdzrmp.supabase.co', // Supabase storage
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
```

### 5. Build & Deploy

1. "Deploy" butonuna tıklayın
2. Vercel otomatik olarak build edecek
3. Build başarılı olursa, proje canlıya alınır

## 🔧 Post-Deployment Ayarları

### 1. Database Migration

Vercel'de build sırasında Prisma migration çalışmaz. İlk deployment'tan sonra:

```bash
# Local'den migration çalıştırın
npm run db:push
# veya
npm run supabase:init
```

### 2. Supabase Storage Buckets

Supabase Storage bucket'ları oluşturulmalı:

```bash
npm run supabase:init
```

Bu komut:
- SQL migration'ları uygular
- `posts` bucket'ını oluşturur
- `avatars` bucket'ını oluşturur

### 3. Custom Domain (Opsiyonel)

1. Vercel Dashboard > Settings > Domains
2. Domain'inizi ekleyin
3. DNS ayarlarını yapın

## ⚠️ Önemli Notlar

### Security

1. **JWT_SECRET**: Production'da mutlaka güçlü bir secret kullanın
2. **SUPABASE_SERVICE_ROLE_KEY**: Bu key'e sadece server-side erişim olmalı
3. **DATABASE_URL**: `.env.local` dosyasını asla commit etmeyin

### Performance

1. **Database Connection Pooling**: `DATABASE_URL` pgbouncer kullanıyor (iyi)
2. **Edge Functions**: API route'ları otomatik olarak edge'de çalışır
3. **Image Optimization**: Next.js Image component kullanın

### Monitoring

1. Vercel Analytics'i aktif edin
2. Error tracking için Sentry ekleyebilirsiniz
3. Database monitoring için Supabase Dashboard'u kullanın

## 🐛 Troubleshooting

### Build Hataları

**Problem**: `DATABASE_URL` bulunamadı
**Çözüm**: Environment variables'ı kontrol edin, tüm environment'lar için eklediğinizden emin olun

**Problem**: Prisma client generate edilemedi
**Çözüm**: Build command'e `prisma generate` ekleyin:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### Runtime Hataları

**Problem**: Database connection hatası
**Çözüm**: 
- `DATABASE_URL` formatını kontrol edin
- Supabase connection pooling'in aktif olduğundan emin olun
- Firewall ayarlarını kontrol edin

**Problem**: Supabase storage erişim hatası
**Çözüm**:
- `SUPABASE_SERVICE_ROLE_KEY` doğru mu kontrol edin
- Storage bucket'larının oluşturulduğundan emin olun
- RLS (Row Level Security) politikalarını kontrol edin

## 📚 Ek Kaynaklar

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

## ✅ Deployment Checklist

- [ ] Tüm environment variables eklendi
- [ ] `next.config.js` image domain'leri güncellendi
- [ ] Database migration çalıştırıldı
- [ ] Supabase storage bucket'ları oluşturuldu
- [ ] Build başarılı
- [ ] Production URL çalışıyor
- [ ] Authentication test edildi
- [ ] Database connection test edildi
- [ ] Image upload test edildi (eğer varsa)

---

**Son Güncelleme**: 2025-01-XX
**Hazırlayan**: Mahallem Development Team

