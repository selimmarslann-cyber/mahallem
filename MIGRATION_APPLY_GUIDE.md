# 📋 SQL Migration Dosyalarını Uygulama Rehberi

## ✅ Oluşturulan Migration Dosyaları

Aşağıdaki migration dosyaları `supabase/migrations/` klasöründe oluşturuldu:

1. ✅ `01_base_schema.sql` - Temel tablolar (users, businesses, products, orders, payments, reviews, messages, business_bans)
2. ✅ `02_jobs_system.sql` - İş sistemi (jobs, job_offers, job_notifications, instant_jobs, instant_job_offers)
3. ✅ `09_wallet_system.sql` - Cüzdan sistemi (wallets, payout_requests)
4. ✅ `10_notifications_system.sql` - Bildirim sistemi (notifications, push_tokens)
5. ✅ `11_support_system.sql` - Destek sistemi (support_tickets, support_messages)
6. ✅ `12_otp_system.sql` - OTP sistemi (otps)
7. ✅ `13_delivery_reminders.sql` - Teslimat hatırlatmaları (delivery_reminders)

## 🚀 Migration'ları Uygulama Yöntemleri

### Yöntem 1: Supabase Dashboard (Önerilen)

1. **Supabase Dashboard'a gidin**: https://app.supabase.com
2. **Projenizi seçin**
3. **SQL Editor** sekmesine gidin
4. Her migration dosyasını sırayla açın ve çalıştırın:
   - `01_base_schema.sql`
   - `02_jobs_system.sql`
   - `03_referral_commissions.sql` (zaten var)
   - `04_ai_listings.sql` (zaten var)
   - `05_lead_system.sql` (zaten var)
   - `06_lead_guarantee_system.sql` (zaten var)
   - `07_vendor_verification.sql` (zaten var)
   - `08_lead_quality_score.sql` (zaten var)
   - `09_wallet_system.sql`
   - `10_notifications_system.sql`
   - `11_support_system.sql`
   - `12_otp_system.sql`
   - `13_delivery_reminders.sql`

### Yöntem 2: Supabase CLI

```bash
# Supabase CLI kurulumu (eğer yoksa)
npm install -g supabase

# Supabase'e login olun
supabase login

# Projenizi link edin
supabase link --project-ref YOUR_PROJECT_REF

# Migration'ları uygulayın
supabase db push
```

### Yöntem 3: PostgreSQL Client (psql)

```bash
# Her migration dosyasını sırayla çalıştırın
psql "YOUR_DATABASE_URL" -f supabase/migrations/01_base_schema.sql
psql "YOUR_DATABASE_URL" -f supabase/migrations/02_jobs_system.sql
# ... diğer dosyalar
```

### Yöntem 4: Node.js Script (DIRECT_URL ile)

Eğer `.env` dosyanızda `DIRECT_URL` varsa (pgbouncer olmadan direkt bağlantı):

```bash
# DIRECT_URL'i kullanarak migration'ları uygula
DIRECT_URL="postgresql://..." npx tsx scripts/applyMigrationsToSupabase.ts
```

## ⚠️ Önemli Notlar

1. **Sıralama**: Migration dosyaları numaralı sırayla çalıştırılmalıdır (01, 02, 03, ...)
2. **Hata Durumu**: Eğer bir tablo zaten varsa, hata alabilirsiniz. Bu normaldir, devam edebilirsiniz.
3. **RLS Policies**: Tüm tablolarda Row Level Security (RLS) etkinleştirilmiştir.
4. **Indexes**: Performans için gerekli index'ler eklenmiştir.
5. **Foreign Keys**: Tablolar arası ilişkiler doğru şekilde tanımlanmıştır.

## 🔍 Kontrol

Migration'ları uyguladıktan sonra, Supabase Dashboard > Table Editor'da tabloların oluşturulduğunu kontrol edin:

- ✅ `users`
- ✅ `businesses`
- ✅ `products`
- ✅ `orders`
- ✅ `order_items`
- ✅ `payments`
- ✅ `reviews`
- ✅ `messages`
- ✅ `business_bans`
- ✅ `jobs`
- ✅ `job_offers`
- ✅ `job_notifications`
- ✅ `instant_jobs`
- ✅ `instant_job_offers`
- ✅ `wallets`
- ✅ `payout_requests`
- ✅ `notifications`
- ✅ `push_tokens`
- ✅ `support_tickets`
- ✅ `support_messages`
- ✅ `otps`
- ✅ `delivery_reminders`

## 📝 Sonraki Adımlar

1. Migration'ları uygulayın (yukarıdaki yöntemlerden birini kullanın)
2. Prisma Client'ı yeniden generate edin: `npx prisma generate`
3. Veritabanı bağlantısını test edin: `http://localhost:3001/api/test/connections`

---

**Son Güncelleme:** 2024

