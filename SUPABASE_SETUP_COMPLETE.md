# ✅ Supabase Otomatik Kurulum Tamamlandı

## 📦 Oluşturulan Dosyalar

### 1. `scripts/applySupabaseSchema.ts`
- **Amaç**: SQL şemasını Supabase veritabanına uygular
- **Kullanım**: `DATABASE_URL` üzerinden PostgreSQL'e bağlanır
- **İşlevler**:
  - `supabase/migrations/03_referral_commissions.sql` dosyasını okur ve çalıştırır
  - Hata durumlarını yönetir (zaten var olan tablolar/fonksiyonlar için)
  - Detaylı log çıktısı verir

### 2. `scripts/initSupabaseBuckets.ts`
- **Amaç**: Supabase Storage bucket'larını oluşturur
- **Kullanım**: `NEXT_PUBLIC_SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` kullanır
- **İşlevler**:
  - Mevcut bucket'ları kontrol eder
  - `posts` bucket'ını oluşturur (public, 5MB limit, image/*)
  - `avatars` bucket'ını oluşturur (public, 2MB limit, image/jpeg|png|webp)
  - Zaten varsa atlar, yoksa oluşturur

### 3. `scripts/initSupabase.ts`
- **Amaç**: Master script - tüm kurulumu tek seferde yapar
- **İşlevler**:
  - Environment değişkenlerini kontrol eder
  - Önce SQL şemasını uygular
  - Sonra bucket'ları oluşturur
  - Detaylı özet rapor verir

### 4. `package.json` (Güncellendi)
- **Eklenen Paketler**:
  - `pg`: PostgreSQL client (dependencies)
  - `@types/pg`: TypeScript tipleri (devDependencies)
  - `tsx`: TypeScript runner (devDependencies)
- **Eklenen Script**:
  - `supabase:init`: Supabase kurulumunu çalıştırır

## 🚀 Kullanım

### Tek Komutla Kurulum

```bash
npm run supabase:init
```

Bu komut şunları yapar:
1. ✅ Environment değişkenlerini kontrol eder
2. ✅ SQL şemasını veritabanına uygular
3. ✅ `posts` bucket'ını oluşturur
4. ✅ `avatars` bucket'ını oluşturur
5. ✅ Detaylı özet rapor verir

### Gereksinimler

`.env.local` dosyasında şu değişkenler olmalı:

```env
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb-secret-XXXX
```

### İlk Kurulum

1. **Paketleri yükle**:
   ```bash
   npm install
   ```

2. **Supabase'i başlat**:
   ```bash
   npm run supabase:init
   ```

3. **RLS Politikalarını ayarla** (Manuel):
   - Supabase Dashboard > Storage > Policies
   - `supabase/README_ENV_SETUP.md` dosyasındaki RLS politikalarını uygula

## 📋 Script Detayları

### `applySupabaseSchema.ts`
- PostgreSQL client (`pg`) kullanır
- SSL bağlantısı yapar (Supabase için gerekli)
- SQL dosyalarını sırayla çalıştırır
- Hata durumlarını yönetir (duplicate/already exists)

### `initSupabaseBuckets.ts`
- Supabase Admin Client kullanır
- Mevcut bucket'ları kontrol eder
- Yeni bucket'ları oluşturur
- Bucket konfigürasyonları:
  - `posts`: Public, 5MB, image/*
  - `avatars`: Public, 2MB, image/jpeg|png|webp

### `initSupabase.ts`
- Master orchestrator
- Sıralı çalıştırma (önce SQL, sonra bucket'lar)
- Kapsamlı hata yönetimi
- Detaylı log çıktısı

## ⚠️ Önemli Notlar

1. **RLS Politikaları**: Bucket'lar oluşturulduktan sonra RLS politikalarını manuel olarak ayarlamanız gerekir. Detaylar için `supabase/README_ENV_SETUP.md` dosyasına bakın.

2. **Prisma Schema**: Bu script'ler Prisma schema'yı değiştirmez. Prisma schema'yı uygulamak için:
   ```bash
   npm run db:push
   ```

3. **Migration Dosyaları**: `supabase/migrations/` klasöründeki SQL dosyaları otomatik olarak uygulanır.

4. **Güvenlik**: `SUPABASE_SERVICE_ROLE_KEY` sadece server-side script'lerde kullanılır, asla client-side'a expose edilmez.

## 🔍 Sorun Giderme

### "DATABASE_URL tanımlı değil" hatası
- `.env.local` dosyasında `DATABASE_URL` değişkenini kontrol edin
- Dosya adının `.env.local` olduğundan emin olun

### "SUPABASE_SERVICE_ROLE_KEY tanımlı değil" hatası
- `.env.local` dosyasında `SUPABASE_SERVICE_ROLE_KEY` değişkenini kontrol edin
- Supabase Dashboard > Settings > API > service_role secret'ı kopyalayın

### "Bucket already exists" uyarısı
- Bu normal bir durumdur, bucket zaten mevcut demektir
- Script devam eder, hata değildir

### "Table already exists" hatası
- SQL migration'ları zaten uygulanmış demektir
- Script devam eder, kritik hata değildir

## 📚 İlgili Dosyalar

- `supabase/README_ENV_SETUP.md` - Detaylı kurulum rehberi
- `supabase/migrations/03_referral_commissions.sql` - SQL migration dosyası
- `SUPABASE_INTEGRATION_SUMMARY.md` - Entegrasyon özeti
- `.env.example` - Environment değişkenleri şablonu

---

**Son Güncelleme**: 2025-01-26  
**Proje**: Mahallem / Hizmetgo  
**Versiyon**: 1.0.0

