# Supabase SQL Migration Düzeltmesi

## ✅ Yapılan Düzeltmeler

SQL migration dosyası (`supabase/migrations/03_referral_commissions.sql`) Prisma schema'ya uyumlu hale getirildi.

### Sorun

**Hata Mesajı:**
```
ERROR: 42804: foreign key constraint "region_managers_user_id_fkey" cannot be implemented 
DETAIL: Key columns "user_id" and "id" are of incompatible types: uuid and text.
```

**Neden:** 
- Prisma schema'da `User.id` → `String` tipinde (PostgreSQL'de TEXT)
- SQL migration'ında `UUID` tipi kullanılmıştı

### Çözüm

Tüm `UUID` tipleri `TEXT`'e çevrildi:

#### 1. Tablo Tanımlamaları
- ✅ `region_managers.user_id` → `TEXT`
- ✅ `region_managers.id` → `TEXT`
- ✅ `wallets.user_id` → `TEXT`
- ✅ `wallet_transactions.id` → `TEXT`
- ✅ `wallet_transactions.user_id` → `TEXT`
- ✅ `wallet_transactions.order_id` → `TEXT`
- ✅ `referral_payouts.id` → `TEXT`
- ✅ `referral_payouts.order_id` → `TEXT`
- ✅ `referral_payouts.beneficiary_id` → `TEXT`
- ✅ `users.referrer_id` → `TEXT`

#### 2. Fonksiyon Parametreleri
- ✅ `get_referral_chain(start_user_id TEXT, ...)`
- ✅ `apply_order_referral_impact(p_order_id TEXT)`
- ✅ `distribute_order_commissions(p_order_id TEXT)`
- ✅ `get_user_referral_earnings(p_user_id TEXT)`
- ✅ `get_user_region_earnings(p_user_id TEXT)`

#### 3. Fonksiyon Dönüş Tipleri
- ✅ `get_referral_chain` → `RETURNS TABLE (user_id TEXT, ...)`

#### 4. ID Oluşturma
- ✅ `gen_random_uuid()::text` kullanıldı (UUID'yi TEXT'e çevirir)

### Sonraki Adımlar

1. **SQL Migration'ı Tekrar Çalıştırın**
   - Supabase Dashboard > SQL Editor
   - `supabase/migrations/03_referral_commissions.sql` dosyasını yapıştırın
   - RUN butonuna tıklayın

2. **Doğrulama**
   - Tablolar oluşturuldu mu?
   - Foreign key constraint'ler başarılı mı?
   - Fonksiyonlar oluşturuldu mu?

3. **Build Testi**
   ```bash
   npm run build
   ```
   - `wallet_transactions` hatası çözülmüş olmalı

### Notlar

- Prisma schema'da `String` → PostgreSQL'de `TEXT`
- `gen_random_uuid()::text` → UUID'yi TEXT string'e çevirir
- Tüm foreign key constraint'ler artık TEXT → TEXT eşleşmesi yapıyor

---

**Dosya**: `supabase/migrations/03_referral_commissions.sql`  
**Tarih**: 2025-01-26  
**Durum**: ✅ Düzeltildi

