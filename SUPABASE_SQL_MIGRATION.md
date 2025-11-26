# Supabase SQL Migration Rehberi

## 🔴 ÖNEMLİ: Supabase'e SQL Migration Uygulanması Gerekiyor

Projede `supabase/migrations/03_referral_commissions.sql` dosyası var ama bu SQL **henüz Supabase veritabanına uygulanmamış**.

### Sorun

Build sırasında şu hata alınıyor:
```
relation "wallet_transactions" does not exist
```

Bu tablo ve diğer referral sistemi tabloları (`wallets`, `referral_payouts`, `region_managers`) Supabase'de mevcut değil.

### Çözüm: SQL Migration'ı Supabase'e Uygulama

1. **Supabase Dashboard'a Git**
   - [Supabase Dashboard](https://app.supabase.com) > Projenizi seçin

2. **SQL Editor'ı Aç**
   - Sol menüden **SQL Editor** > **New query**

3. **Migration Dosyasını Çalıştır**
   - `supabase/migrations/03_referral_commissions.sql` dosyasının içeriğini kopyalayın
   - SQL Editor'a yapıştırın
   - **RUN** butonuna tıklayın

### Oluşturulan Tablolar ve Fonksiyonlar

SQL migration'ı şunları oluşturur:

#### Tablolar:
- ✅ `wallets` - Kullanıcı cüzdanları
- ✅ `wallet_transactions` - Cüzdan işlem geçmişi
- ✅ `referral_payouts` - Referral payout kayıtları
- ✅ `region_managers` - Bölge yöneticileri

#### Kullanıcı Tablosuna Eklenen Kolonlar:
- ✅ `referrer_id` - Referrer kullanıcı ID'si
- ✅ `referral_rank` - Referral rank seviyesi (0-4)
- ✅ `network_cumulative_gmv` - Network toplam ciro

#### Orders Tablosuna Eklenen Kolonlar:
- ✅ `region_mahalle` - Mahalle bilgisi
- ✅ `region_ilce` - İlçe bilgisi
- ✅ `region_il` - İl bilgisi
- ✅ `region_country` - Ülke bilgisi (varsayılan: 'TR')
- ✅ `completed_at` - Tamamlanma zamanı
- ✅ `platform_fee_amount` - Platform ücreti

#### PostgreSQL Fonksiyonları:
- ✅ `calculate_referral_rank()` - Referral rank hesaplama
- ✅ `get_rank_bonus_percentage()` - Rank bonus yüzdesi
- ✅ `get_referral_chain()` - Referral zinciri bulma (L1-L5)
- ✅ `apply_order_referral_impact()` - Order referral etkisi uygulama
- ✅ `distribute_order_commissions()` - Komisyon dağıtımı
- ✅ `on_order_completed()` - Order completed trigger fonksiyonu
- ✅ `get_user_referral_earnings()` - Kullanıcı referral kazancı
- ✅ `get_user_region_earnings()` - Kullanıcı bölge kazancı

#### Trigger:
- ✅ `trigger_order_completed` - Order status COMPLETED olduğunda otomatik komisyon dağıtımı

### Not: Prisma Schema ile Uyumsuzluk

⚠️ **DİKKAT**: Bu SQL migration'ı bazı tabloları ve kolonları oluşturuyor ki bunlar Prisma schema'da YOK. Bu bilinçli bir tasarım kararı:

- Prisma schema temel tabloları yönetir (`users`, `orders`, `jobs`, vb.)
- Supabase SQL migration'ları ek özellikleri ekler (referral komisyon sistemi, trigger'lar, fonksiyonlar)

Bu yaklaşım şu avantajları sağlar:
- ✅ Prisma schema daha temiz kalır
- ✅ Kompleks SQL fonksiyonları ve trigger'lar Supabase'de çalışır
- ✅ Referral komisyon sistemi tamamen veritabanı tarafında yönetilir

### Doğrulama

SQL migration'ı çalıştırdıktan sonra:

1. Supabase Dashboard > **Table Editor**
2. Şu tabloların oluşturulduğunu kontrol edin:
   - `wallets`
   - `wallet_transactions`
   - `referral_payouts`
   - `region_managers`

3. `users` tablosunda şu kolonların olduğunu kontrol edin:
   - `referrer_id`
   - `referral_rank`
   - `network_cumulative_gmv`

4. Build'i tekrar çalıştırın:
   ```bash
   npm run build
   ```

### Sonraki Adımlar

SQL migration'ı uyguladıktan sonra:
- ✅ Build hatası düzelecek
- ✅ Referral sistemi çalışmaya başlayacak
- ✅ Order completed olduğunda otomatik komisyon dağıtımı aktif olacak

---

**Dosya**: `supabase/migrations/03_referral_commissions.sql`  
**Uygulama**: Supabase Dashboard > SQL Editor  
**Tarih**: 2025-01-26

