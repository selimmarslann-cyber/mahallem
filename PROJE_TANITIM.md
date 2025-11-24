# 🏘️ MAHALLEM - Proje Tanıtım Dokümantasyonu

## 📋 İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Proje Özeti](#proje-özeti)
3. [Teknoloji Stack](#teknoloji-stack)
4. [Ana Özellikler](#ana-özellikler)
5. [Kullanıcı Rolleri ve Akışları](#kullanıcı-rolleri-ve-akışları)
6. [Sistem Mimarisi](#sistem-mimarisi)
7. [Veritabanı Yapısı](#veritabanı-yapısı)
8. [API Endpoints](#api-endpoints)
9. [UI/UX Özellikleri](#uiux-özellikleri)
10. [Referral Sistemi](#referral-sistemi)
11. [Güvenlik ve Yasal](#güvenlik-ve-yasal)
12. [Kurulum ve Deployment](#kurulum-ve-deployment)
13. [Gelecek Geliştirmeler](#gelecek-geliştirmeler)

---

## 🎯 Genel Bakış

**Mahallem**, Türkiye pazarı için özel olarak tasarlanmış, mahalle esnafı ve hizmet sağlayıcıları ile müşterileri buluşturan kapsamlı bir dijital platformdur. Platform, Armut benzeri bir hizmet eşleştirme sistemi sunarken, aynı zamanda e-ticaret özellikleri ve çok seviyeli referral (referans) sistemi ile benzersiz bir değer önerisi sunmaktadır.

### Vizyon
Mahalle ekonomisini dijitalleştirerek, yerel esnaf ve hizmet sağlayıcılarının daha geniş bir müşteri kitlesine ulaşmasını sağlamak ve müşterilere güvenilir, hızlı ve kolay hizmet erişimi sunmak.

### Misyon
- Yerel esnafı dijital dünyaya entegre etmek
- Güvenilir hizmet sağlayıcıları ile müşterileri buluşturmak
- Şeffaf fiyatlandırma ve değerlendirme sistemi sunmak
- Sıfır yatırımla ortaklık modeli ile platform büyümesini hızlandırmak

---

## 📊 Proje Özeti

### Platform Türü
- **B2C (Business-to-Consumer)**: Esnaf ve müşteri arasında doğrudan bağlantı
- **Marketplace Modeli**: Çoklu satıcı, çoklu alıcı platformu
- **Service Marketplace**: Hizmet odaklı eşleştirme platformu
- **E-commerce Integration**: Ürün ve hizmet satışı

### Hedef Kitle
1. **Müşteriler**: Hizmet ihtiyacı olan bireyler ve aileler
2. **Esnaf/Hizmet Sağlayıcıları**: Yerel işletmeler, ustalar, profesyoneller
3. **Referans Ortakları**: Platform büyümesine katkı sağlayan kullanıcılar

### Rekabet Avantajları
- ✅ **Yerel Odaklı**: Mahalle bazlı hizmet eşleştirmesi
- ✅ **Çok Yönlü**: Hem hizmet hem ürün satışı
- ✅ **Referral Sistemi**: Sıfır yatırımla ortaklık modeli
- ✅ **Güvenilirlik**: İki taraflı değerlendirme sistemi
- ✅ **Türkçe Odaklı**: Türkiye pazarına özel tasarım

---

## 🛠️ Teknoloji Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI tabanlı)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Maps**: MapLibre GL (OpenStreetMap)

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Authentication**: JWT (HTTP-only cookies)
- **Session Management**: Custom session management

### Database
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cloud Database**: Supabase (uyumlu)
- **Migrations**: Prisma Migrate

### Third-Party Services
- **Maps**: MapLibre GL / Mapbox
- **Image Storage**: (Hazırlık aşamasında - Supabase Storage)
- **SMS/OTP**: (Hazırlık aşamasında)
- **Payment**: (Hazırlık aşamasında - iyzico/PayTR)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

---

## ✨ Ana Özellikler

### 1. 🔐 Kullanıcı Yönetimi
- **Kayıt Sistemi**: E-posta/şifre ile kayıt
- **Telefon Girişi**: OTP (One-Time Password) ile telefon numarası girişi
- **Profil Yönetimi**: Kullanıcı profil sayfası, avatar yükleme, kişisel bilgiler
- **Hesap Paneli**: Dashboard, cüzdan, ayarlar, referral takibi

### 2. 🗺️ Harita ve Konum Tabanlı Hizmet
- **İnteraktif Harita**: MapLibre GL ile gerçek zamanlı harita görünümü
- **İşletme Konumları**: Esnafların harita üzerinde gösterimi
- **Filtreleme**: Online/Offline, mesafe, kategori bazlı filtreleme
- **Yakınlık Sıralaması**: Kullanıcı konumuna göre en yakın esnaflar

### 3. 🏪 Esnaf ve İşletme Yönetimi
- **Esnaf Kayıt**: Detaylı işletme bilgileri, çalışma saatleri, hizmet alanları
- **Mağaza Sistemi**: Ürün ve hizmet listeleme, fiyatlandırma
- **Online/Offline Durumu**: Gerçek zamanlı durum yönetimi
- **AUTO_OFFLINE**: Mesai saatleri dışında otomatik offline
- **Esnaf Paneli**: Sipariş yönetimi, mağaza düzenleme, cüzdan

### 4. 🛒 Sipariş ve Ödeme Sistemi
- **Sepet Sistemi**: Çoklu ürün/hizmet sepeti
- **Sipariş Akışı**: 
  - PENDING_CONFIRMATION → Esnaf onayı bekleniyor
  - ACCEPTED → Esnaf kabul etti
  - IN_PROGRESS → İş devam ediyor
  - COMPLETED → Tamamlandı
  - CANCELLED → İptal edildi
- **Mock Ödeme**: Escrow benzeri ödeme sistemi (gerçek entegrasyon hazırlık aşamasında)
- **Sipariş Takibi**: Müşteri ve esnaf için sipariş durumu takibi

### 5. ⭐ Değerlendirme ve Yorum Sistemi
- **İki Taraflı Değerlendirme**: Hem müşteri hem esnaf birbirini değerlendirebilir
- **Puanlama**: 1-5 yıldız sistemi
- **Yorumlar**: Detaylı yorum yazma ve görüntüleme
- **Ortalama Puan**: İşletme profilinde görünen ortalama puan

### 6. 💼 İş İlanı ve Eşleştirme Sistemi
- **İş İsteği Oluşturma**: Detaylı iş açıklaması, kategori seçimi, tarih/saat
- **Otomatik Eşleştirme**: Anahtar kelime bazlı esnaf eşleştirme
- **Teklif Sistemi**: Esnafların teklif göndermesi
- **Anlık İşler**: Kısa süreli iş ilanları

### 7. 💰 Cüzdan ve Ödeme
- **Dijital Cüzdan**: Kullanıcı cüzdanı, bakiye görüntüleme
- **Para Yükleme**: Cüzdana para yükleme (UI hazır, entegrasyon hazırlık aşamasında)
- **Para Çekme**: IBAN ile para çekme talebi
- **İşlem Geçmişi**: Tüm cüzdan işlemlerinin kaydı

### 8. 🎁 Çok Seviyeli Referral Sistemi
- **5 Seviyeli Referral Zinciri**: L1 (%10) → L2 (%6) → L3 (%5) → L4 (%3) → L5 (%1)
- **Rank Sistemi**: 
  - Level 0: Normal kullanıcı
  - Level 1: Mahalle Lideri (1M+ GMV) - +0.5% bonus
  - Level 2: İlçe Yöneticisi (10M+ GMV) - +1.0% bonus
  - Level 3: İl Yöneticisi (100M+ GMV) - +1.5% bonus
  - Level 4: Ülke Yöneticisi (500M+ GMV) - +2.0% bonus
- **Bölge Yöneticileri**: Mahalle (%3), İlçe (%3), İl (%2), Ülke (%2)
- **Otomatik Dağıtım**: Order tamamlandığında otomatik komisyon dağıtımı
- **Maksimum %45 Dağıtım**: Platform fee'nin %45'i referral + bölge yöneticilerine, %55 platform'da kalır

### 9. 📱 Responsive Tasarım
- **Mobile-First**: Mobil cihazlar için optimize edilmiş
- **Tablet Uyumlu**: Tablet ekranlar için uyumlu tasarım
- **Desktop Optimized**: Büyük ekranlar için gelişmiş görünüm

### 10. 🔒 Güvenlik Özellikleri
- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **HTTP-only Cookies**: XSS saldırılarına karşı koruma
- **Ban Sistemi**: İptal sayacına göre otomatik ban
- **İptal Sayacı**: 3 iptal sonrası uyarı, 5 iptal sonrası ban

---

## 👥 Kullanıcı Rolleri ve Akışları

### Müşteri (Customer) Akışı

1. **Kayıt/Giriş**
   - E-posta/şifre veya telefon/OTP ile giriş
   - Referral kodu ile kayıt (opsiyonel)

2. **Hizmet Arama**
   - Harita üzerinden esnaf bulma
   - Kategori bazlı arama
   - İş isteği oluşturma

3. **Sipariş Verme**
   - Sepete ürün/hizmet ekleme
   - Sipariş oluşturma
   - Ödeme yapma (mock)

4. **Sipariş Takibi**
   - Sipariş durumu görüntüleme
   - Esnaf ile iletişim
   - Sipariş tamamlama

5. **Değerlendirme**
   - Esnafı değerlendirme
   - Yorum yazma

6. **Referral Sistemi**
   - Referral kodunu paylaşma
   - Kazanç takibi
   - Rank ilerlemesi

### Esnaf (Business) Akışı

1. **Kayıt**
   - İşletme bilgileri
   - Hizmet alanları
   - Çalışma saatleri

2. **Mağaza Yönetimi**
   - Ürün/hizmet ekleme
   - Fiyatlandırma
   - Görsel yükleme

3. **Sipariş Yönetimi**
   - Gelen siparişleri görüntüleme
   - Sipariş kabul/red
   - Sipariş durumu güncelleme

4. **Durum Yönetimi**
   - Online/Offline durumu
   - AUTO_OFFLINE ayarları

5. **Kazanç Takibi**
   - Cüzdan bakiyesi
   - İşlem geçmişi
   - Para çekme

### Referral Ortak Akışı

1. **Referral Kodu Alma**
   - Hesap oluşturma
   - Referral kodunu görüntüleme

2. **Paylaşım**
   - Referral linkini paylaşma
   - WhatsApp, sosyal medya paylaşımı

3. **Kazanç Takibi**
   - Toplam kazanç
   - Seviye bazlı kazanç
   - Rank ilerlemesi

4. **Rank Atlama**
   - Network GMV takibi
   - Bir sonraki rank için gereken miktar

---

## 🏗️ Sistem Mimarisi

### Proje Yapısı

```
mahallem/
├── app/                          # Next.js App Router
│   ├── (customer)/              # Müşteri sayfaları
│   │   ├── page.tsx             # Ana sayfa
│   │   ├── map/                 # Harita sayfası
│   │   ├── account/             # Kullanıcı paneli
│   │   ├── partner/             # Referral sayfası
│   │   └── request/             # İş isteği
│   ├── (business)/              # Esnaf sayfaları
│   │   └── business/            # Esnaf paneli
│   ├── (public)/                # Public sayfalar
│   │   ├── auth/                # Giriş/kayıt
│   │   ├── legal/               # Yasal sayfalar
│   │   └── business/[id]        # İşletme detay
│   └── api/                     # API endpoints
│       ├── auth/                # Authentication
│       ├── businesses/          # İşletme API
│       ├── orders/              # Sipariş API
│       └── referral/            # Referral API
├── components/                   # React bileşenleri
│   ├── layout/                  # Layout bileşenleri
│   ├── ui/                      # UI bileşenleri
│   ├── map/                     # Harita bileşenleri
│   └── home/                    # Ana sayfa bileşenleri
├── lib/                         # Utility ve servisler
│   ├── auth/                    # Authentication
│   ├── services/                # Business logic
│   ├── db/                      # Database
│   └── utils/                   # Yardımcı fonksiyonlar
├── prisma/                      # Database schema
│   └── schema.prisma
└── supabase/                    # Supabase migrations
    └── migrations/
```

### Route Yapısı

**Public Routes:**
- `/` - Ana sayfa
- `/map` - Harita
- `/auth/login` - Giriş
- `/auth/register` - Kayıt
- `/auth/phone-login` - Telefon girişi
- `/business/[id]` - İşletme detay
- `/legal/terms` - Kullanıcı sözleşmesi
- `/legal/privacy` - Gizlilik politikası
- `/legal/cookies` - Çerez politikası

**Customer Routes:**
- `/account` - Kullanıcı dashboard
- `/account/profile` - Profil
- `/account/wallet` - Cüzdan
- `/account/referral` - Referral takibi
- `/account/settings` - Ayarlar
- `/request` - İş isteği oluştur
- `/jobs` - İş ilanları
- `/partner` - Sıfır yatırımla ortak ol

**Business Routes:**
- `/business/jobs` - Gelen işler
- `/business/store` - Mağaza yönetimi
- `/business/status` - Durum yönetimi
- `/business/wallet` - Esnaf cüzdanı

---

## 🗄️ Veritabanı Yapısı

### Ana Tablolar

**users** - Kullanıcılar
- id, email, phone, name, password
- referrer_id (referral zinciri)
- referral_rank (0-4)
- network_cumulative_gmv (toplam downline ciro)

**businesses** - İşletmeler
- id, user_id, name, description
- latitude, longitude (konum)
- status (ONLINE, OFFLINE, AUTO_OFFLINE)
- working_hours, categories

**orders** - Siparişler
- id, customer_id, business_id
- status (PENDING_CONFIRMATION, ACCEPTED, etc.)
- total_amount, platform_fee_amount
- region_mahalle, region_ilce, region_il

**products** - Ürünler/Hizmetler
- id, business_id, name, price
- description, category

**wallets** - Cüzdanlar
- user_id, balance

**wallet_transactions** - Cüzdan İşlemleri
- id, user_id, order_id
- source_type (deposit, withdraw, referral, region)
- amount

**referral_payouts** - Referral Ödemeleri
- id, order_id, beneficiary_id
- payout_type (referral, region)
- level, percentage, amount

**region_managers** - Bölge Yöneticileri
- id, user_id, region_type, region_code

**reviews** - Yorumlar
- id, order_id, reviewer_id, reviewee_id
- rating, comment

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş
- `POST /api/auth/logout` - Çıkış
- `GET /api/auth/me` - Mevcut kullanıcı
- `POST /api/auth/send-otp` - OTP gönder
- `POST /api/auth/verify-otp` - OTP doğrula

### Businesses
- `GET /api/businesses` - İşletme listesi
- `GET /api/businesses/[id]` - İşletme detay
- `POST /api/businesses/[id]/online-status` - Durum güncelle
- `GET /api/businesses/[id]/reviews` - Yorumlar

### Orders
- `POST /api/orders` - Sipariş oluştur
- `GET /api/orders` - Sipariş listesi
- `POST /api/orders/[id]/accept` - Sipariş kabul
- `POST /api/orders/[id]/reject` - Sipariş red

### Referral
- `GET /api/referral/overview` - Referral özeti
- `GET /api/referral/invited-users` - Davet edilenler
- `GET /api/referral/my-code` - Referral kodu

### Admin
- `GET /api/admin/referral-stats` - Referral istatistikleri
- `GET /api/admin/users/[id]` - Kullanıcı detay

---

## 🎨 UI/UX Özellikleri

### Tasarım Dili
- **Renk Paleti**: Turuncu (#FF7A00) ana renk, slate tonları
- **Tipografi**: Inter font ailesi
- **İkonlar**: Lucide React icon seti
- **Animasyonlar**: Framer Motion ile smooth animasyonlar

### Bileşenler
- **shadcn/ui**: Modern, erişilebilir UI bileşenleri
- **Responsive Cards**: Tüm ekran boyutları için optimize
- **Loading States**: Skeleton loaders
- **Empty States**: Kullanıcı dostu boş durum mesajları

### Kullanıcı Deneyimi
- **3 Farklı Hizmet Yöntemi**: Harita, Talep, Anlık İşler
- **Wizard Akışları**: Adım adım formlar
- **Real-time Updates**: Canlı durum güncellemeleri
- **Toast Notifications**: Kullanıcı bildirimleri

---

## 🎁 Referral Sistemi Detayları

### Komisyon Modeli

**Base Referral Oranları:**
- L1 (Direkt davet): %10
- L2: %6
- L3: %5
- L4: %3
- L5: %1
- **Toplam Base**: %25

**Rank Bonusları:**
- Rank 0: +0% (Normal kullanıcı)
- Rank 1: +0.5% (1M+ GMV)
- Rank 2: +1.0% (10M+ GMV)
- Rank 3: +1.5% (100M+ GMV)
- Rank 4: +2.0% (500M+ GMV)

**Bölge Yöneticileri:**
- Mahalle: %3
- İlçe: %3
- İl: %2
- Ülke: %2
- **Toplam Bölge**: %10

**Maksimum Dağıtım**: Platform fee'nin %45'i
**Platform Payı**: En az %55

### Otomatik İşlemler
- Order `COMPLETED` olduğunda:
  1. Network GMV güncellemesi (kullanıcı + upline zinciri)
  2. Rank hesaplama (otomatik)
  3. Komisyon dağıtımı (referral + bölge)
  4. Wallet güncellemesi
  5. Transaction kayıtları

---

## 🔒 Güvenlik ve Yasal

### Güvenlik Özellikleri
- JWT token tabanlı authentication
- HTTP-only cookies (XSS koruması)
- Password hashing (bcrypt)
- SQL injection koruması (Prisma ORM)
- CORS yapılandırması

### Yasal Sayfalar
- **Kullanıcı Sözleşmesi** (`/legal/terms`)
- **Gizlilik Politikası** (`/legal/privacy`)
- **Çerez Politikası** (`/legal/cookies`)

### Footer
- Tüm sayfalarda footer
- Yasal sayfalara linkler
- İletişim bilgileri
- Telif hakkı bilgisi

---

## 🚀 Kurulum ve Deployment

### Gereksinimler
- Node.js 18+
- PostgreSQL veritabanı
- npm veya yarn

### Kurulum Adımları

1. **Bağımlılıkları Yükle**
```bash
npm install
```

2. **Ortam Değişkenlerini Ayarla**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mahallem"
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your_token"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your_secret_key"
```

3. **Veritabanını Hazırla**
```bash
npm run db:generate
npm run db:push
```

4. **Development Server'ı Başlat**
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

---

## 🔮 Gelecek Geliştirmeler

### Kısa Vadeli (1-3 Ay)
- [ ] Gerçek ödeme entegrasyonu (iyzico/PayTR)
- [ ] SMS/OTP servisi entegrasyonu
- [ ] Dosya yükleme (Supabase Storage)
- [ ] Chat/mesajlaşma sistemi
- [ ] Push notification

### Orta Vadeli (3-6 Ay)
- [ ] Mobil uygulama (React Native)
- [ ] Gelişmiş analitik dashboard
- [ ] Çoklu dil desteği
- [ ] SEO optimizasyonu
- [ ] Email marketing entegrasyonu

### Uzun Vadeli (6-12 Ay)
- [ ] AI destekli eşleştirme
- [ ] Blockchain tabanlı ödeme
- [ ] Franchise modeli
- [ ] API marketplace
- [ ] White-label çözüm

---

## 📞 İletişim ve Destek

**E-posta**: destek@mahallem.app  
**Telefon**: +90 (555) 123 45 67  
**Website**: https://mahallem.app

---

## 📄 Lisans ve Telif

© 2025 Mahallem. Tüm hakları saklıdır.

Bu proje özel bir yazılım projesidir ve ticari kullanım için lisans gerektirir.

---

**Dokümantasyon Versiyonu**: 1.0.0  
**Son Güncelleme**: 24 Kasım 2025  
**Hazırlayan**: Mahallem Development Team

