# 📋 Gerekli SQL Migration Dosyaları

## Mevcut Migration Dosyaları

✅ `03_referral_commissions.sql` - Referral sistemi
✅ `04_ai_listings.sql` - AI listing sistemi
✅ `05_lead_system.sql` - Lead sistemi (service_categories, lead_levels, listings, wallet_transactions, lead_purchases)
✅ `06_lead_guarantee_system.sql` - Lead iade sistemi
✅ `07_vendor_verification.sql` - Usta doğrulama sistemi
✅ `08_lead_quality_score.sql` - Lead kalite skorlama

## Eksik Migration Dosyaları

Aşağıdaki migration dosyalarını oluşturmanız gerekiyor:

### 1. `01_base_schema.sql` - Temel Tablolar

Bu dosya şu tabloları içermelidir:
- `users` (kullanıcılar)
- `businesses` (işletmeler)
- `products` (ürünler/hizmetler)
- `orders` (siparişler)
- `order_items` (sipariş kalemleri)
- `payments` (ödeme kayıtları)
- `reviews` (yorumlar)
- `messages` (mesajlar)
- `business_bans` (işletme yasakları)

### 2. `02_jobs_system.sql` - İş Sistemi

Bu dosya şu tabloları içermelidir:
- `jobs` (normal işler)
- `job_offers` (iş teklifleri)
- `job_notifications` (iş bildirimleri)
- `instant_jobs` (anlık işler)
- `instant_job_offers` (anlık iş teklifleri)

### 3. `09_wallet_system.sql` - Cüzdan Sistemi

Bu dosya şu tabloları içermelidir:
- `wallets` (cüzdanlar - eğer 05_lead_system.sql'de yoksa)
- `payout_requests` (çekim talepleri)

### 4. `10_notifications_system.sql` - Bildirim Sistemi

Bu dosya şu tabloları içermelidir:
- `notifications` (bildirimler)
- `push_tokens` (push notification token'ları)

### 5. `11_support_system.sql` - Destek Sistemi

Bu dosya şu tabloları içermelidir:
- `support_tickets` (destek talepleri)
- `support_messages` (destek mesajları)

### 6. `12_otp_system.sql` - OTP Sistemi

Bu dosya şu tabloları içermelidir:
- `otps` (email doğrulama kodları)

### 7. `13_delivery_reminders.sql` - Teslimat Hatırlatmaları

Bu dosya şu tabloları içermelidir:
- `delivery_reminders` (teslimat hatırlatmaları)

## Önemli Notlar

1. **Sıralama**: Migration dosyaları numaralı sırayla çalıştırılmalıdır (01, 02, 03, ...)
2. **Foreign Keys**: Tablolar arası ilişkiler doğru sırayla oluşturulmalıdır
3. **Indexes**: Performans için gerekli index'ler eklenmelidir
4. **RLS Policies**: Supabase Row Level Security politikaları eklenmelidir
5. **Enums**: PostgreSQL enum'ları doğru şekilde tanımlanmalıdır

## Prisma Schema Referansı

Tüm tablo yapıları `prisma/schema.prisma` dosyasında tanımlıdır. Migration dosyalarını oluştururken bu dosyayı referans alın.

---

**Son Güncelleme:** 2024

