# Mahallem - Kurulum ve Başlangıç Rehberi

## Gereksinimler

- Node.js 18+ 
- PostgreSQL veritabanı (veya Supabase)
- npm veya yarn

## Kurulum Adımları

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env` dosyası oluşturun:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mahallem?schema=public"
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your_mapbox_token_here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Veritabanını Hazırlayın

```bash
# Prisma Client'ı generate edin
npm run db:generate

# Veritabanı şemasını oluşturun
npm run db:push

# veya migration kullanarak:
npm run db:migrate
```

### 4. Development Server'ı Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## Özellikler ve Durum

### ✅ Tamamlanan Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi (email/password)
- ✅ İşletme kayıt sistemi
- ✅ Harita sayfası (MapLibre entegrasyonu placeholder)
- ✅ İşletme detay sayfası
- ✅ Ürün/hizmet listesi
- ✅ Sepet sistemi
- ✅ Sipariş oluşturma (PENDING_CONFIRMATION)
- ✅ Esnaf paneli
- ✅ Online/Offline durumu
- ✅ Sipariş kabul/red akışı
- ✅ Mock ödeme sistemi (escrow benzeri)
- ✅ Review ve rating sistemi
- ✅ İptal sayacı ve ban mantığı
- ✅ COMPLETED durumunda iptal sayacı sıfırlama

### 🚧 Yapılacaklar (TODO)

- [ ] Gerçek MapLibre GL harita entegrasyonu
- [ ] JWT/Session yönetimi (şu an localStorage kullanılıyor)
- [ ] Supabase Auth entegrasyonu
- [ ] Telefon doğrulama ve SMS
- [ ] Gerçek ödeme entegrasyonu (iyzico/PayTR)
- [ ] Dosya yükleme (görsel yükleme)
- [ ] Chat sistemi
- [ ] AUTO_OFFLINE cron job'ları
- [ ] Ürün CRUD işlemleri (esnaf panelinde)
- [ ] Çalışma saatleri yönetimi

## Veritabanı Yapısı

Proje Prisma ORM kullanıyor. Şema dosyası: `prisma/schema.prisma`

Ana tablolar:
- `users` - Kullanıcılar
- `businesses` - İşletmeler
- `products` - Ürünler/Hizmetler
- `orders` - Siparişler
- `order_items` - Sipariş kalemleri
- `payments` - Ödemeler (mock)
- `reviews` - Değerlendirmeler
- `messages` - Mesajlaşma
- `business_bans` - Ban logları

## API Endpoints

### Auth
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş

### Businesses
- `GET /api/businesses` - İşletme listesi
- `GET /api/businesses/[id]` - İşletme detayı
- `POST /api/businesses` - İşletme oluştur
- `GET /api/businesses/owner/[userId]` - Kullanıcının işletmesi
- `PATCH /api/businesses/[id]/online-status` - Online durumu güncelle

### Orders
- `POST /api/orders` - Sipariş oluştur
- `GET /api/orders/[id]` - Sipariş detayı
- `GET /api/orders/customer/[customerId]` - Müşteri siparişleri
- `GET /api/orders/business/[businessId]` - İşletme siparişleri
- `POST /api/orders/[id]/accept` - Sipariş kabul
- `POST /api/orders/[id]/reject` - Sipariş red

### Reviews
- `POST /api/reviews` - Değerlendirme oluştur

## Önemli Notlar

1. **Auth Sistemi**: Şu an basit email/password kullanılıyor. İleride Supabase Auth'a geçilecek.

2. **Ödeme Sistemi**: Mock servis kullanılıyor. Gerçek entegrasyon için `lib/services/paymentService.ts` oluşturulacak.

3. **Harita**: MapLibre GL entegrasyonu placeholder. Gerçek entegrasyon için `app/(public)/map/page.tsx` güncellenecek.

4. **AUTO_OFFLINE**: Mesai saati ve cevapsız sipariş kontrolü için cron job'lar eklenecek.

5. **Ban Mantığı**: 3 kez üst üste iptal eden işletme 7 gün banlanır. COMPLETED siparişlerde sayac sıfırlanır.

## Geliştirme

```bash
# Prisma Studio (veritabanı görüntüleme)
npm run db:studio

# Lint
npm run lint

# Build
npm run build
```

## Lisans

Bu proje özel bir projedir.

