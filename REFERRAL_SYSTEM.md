# Referral Fee Sharing Sistemi

Binance/Borsa tarzı profesyonel referral fee sharing sistemi.

## Özellikler

### 1. Referral Kodu Sistemi
- Her kullanıcıya benzersiz referral kodu otomatik oluşturulur
- Kod formatı: Kullanıcı adından türetilmiş + unique identifier
- Örnek: "SELIM5823"

### 2. İki Seviyeli Referral Zinciri
- **1. Seviye**: Direkt davet edilen kullanıcılar
- **2. Seviye**: 1. seviye kullanıcının davet ettiği kullanıcılar

Örnek:
- A, B'yi davet eder → (A, B, level=1)
- B, C'yi davet eder → (B, C, level=1) ve (A, C, level=2)

### 3. Fee Sharing Modeli
- Her siparişte platform %10 komisyon alır
- Komisyon üzerinden:
  - **1. Seviye**: %20 pay (komisyonun %20'si)
  - **2. Seviye**: %10 pay (komisyonun %10'si)
  - **Platform**: Kalan %70

Örnek:
- Sipariş: 1000 ₺
- Platform komisyonu: 100 ₺ (%10)
- 1. seviye referer: 20 ₺ (%20)
- 2. seviye referer: 10 ₺ (%10)
- Platform: 70 ₺ (%70)

### 4. Otomatik Dağıtım
- Sipariş COMPLETED olduğunda otomatik olarak referral ödülleri dağıtılır
- Her sipariş için ayrı ayrı ödül kaydı oluşturulur
- Kullanıcının `referral_balance` alanı otomatik güncellenir

## Veritabanı Yapısı

### Tablolar

1. **referral_codes**
   - Her kullanıcı için benzersiz kod
   - `user_id` (unique)
   - `code` (unique)

2. **referral_relations**
   - Referral zinciri ilişkileri
   - `referrer_user_id` → Davet eden
   - `referred_user_id` → Davet edilen
   - `level` → 1 veya 2

3. **referral_rewards**
   - Her sipariş için ödül kayıtları
   - `user_id` → Ödülü alan
   - `order_id` → İlgili sipariş
   - `level` → 1 veya 2
   - `gross_commission` → Toplam komisyon
   - `share_rate` → Pay oranı (0.20 veya 0.10)
   - `amount` → Ödül tutarı

4. **users.referral_balance**
   - Kullanıcının çekilebilir referral bakiyesi

5. **orders.commission_fee**
   - Siparişteki platform komisyonu

## API Endpoints

### `/api/referral/overview`
Kullanıcının referral özet bilgileri:
- Toplam kazanç
- Bu ayki kazanç
- 1. ve 2. seviye sayıları ve kazançları
- Referral kodu ve linki

### `/api/referral/rewards`
Kazanç geçmişi (pagination destekli):
- Query params: `page`, `pageSize`, `level`, `dateFrom`, `dateTo`

### `/api/referral/my-code`
Kullanıcının referral kodu ve linki

### `/api/admin/referrals`
Admin için sistem geneli istatistikler:
- Toplam dağıtılan kazanç
- Top 20 referrer listesi

## UI Sayfaları

### `/referral` - Referral Dashboard
- 3 KPI kartı (Toplam Kazanç, Toplam Referans, Bu Ayki Kazanç)
- Davet Et bölümü (kod, link, paylaş butonları)
- Seviye özetleri (1. ve 2. seviye kazançları)
- Kazanç geçmişi tablosu

### `/admin/referrals` - Admin Panel
- Sistem geneli istatistikler
- Top 20 referrer listesi

## Kullanım Senaryoları

### Senaryo 1: Basit Referral
1. A kullanıcısı kayıt olur → Kod: "ALI123"
2. B kullanıcısı `?ref=ALI123` ile kayıt olur
3. B sipariş verir (1000 ₺, komisyon 100 ₺)
4. Sipariş tamamlanınca:
   - A'ya 20 ₺ ödül (1. seviye, %20)
   - A'nın `referral_balance` = 20 ₺

### Senaryo 2: İki Seviyeli Referral
1. A kullanıcısı kayıt olur → Kod: "ALI123"
2. B kullanıcısı `?ref=ALI123` ile kayıt olur
3. C kullanıcısı `?ref=B123` ile kayıt olur (B'nin kodu)
4. C sipariş verir (1000 ₺, komisyon 100 ₺)
5. Sipariş tamamlanınca:
   - B'ye 20 ₺ ödül (1. seviye, %20)
   - A'ya 10 ₺ ödül (2. seviye, %10)

### Senaryo 3: Tekrar Siparişler
- Aynı kullanıcı her sipariş verdiğinde, referral zinciri aynen çalışır
- Her sipariş için ayrı ödül kaydı oluşturulur

## Güvenlik ve Kurallar

1. **Kendi kendini refer edemez**: Kullanıcı kendi referral kodunu kullanamaz
2. **Tek seviye 1 referrer**: Bir kullanıcının sadece 1 adet level=1 referrer'ı olabilir
3. **Transaction güvenliği**: Tüm ödül dağıtımları transaction içinde yapılır
4. **Hata toleransı**: Referral reward dağıtımı başarısız olsa bile sipariş tamamlanmış sayılır

## Gelecek Geliştirmeler

- [ ] Withdrawal sistemi (bakiye çekme)
- [ ] Tarih bazlı expiry (referral ilişkisinin süresi)
- [ ] Lifetime limit (kullanıcı başına maksimum kazanç)
- [ ] Admin withdrawal onay sistemi
- [ ] Referral istatistik grafikleri
- [ ] Email/SMS bildirimleri (ödül kazanıldığında)

