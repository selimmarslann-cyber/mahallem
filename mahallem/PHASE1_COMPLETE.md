# Phase 1 Tamamlandı - Üretime Yakın MVP

## Tamamlanan Özellikler

### 1. ✅ Auth Sistemi
- HTTP-only cookie tabanlı JWT authentication
- `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me` endpoints
- Middleware ile protected route kontrolü
- Authenticated layout (`app/(authenticated)/layout.tsx`)
- Login/Register UI'leri Türkçeleştirildi

### 2. ✅ Harita Entegrasyonu
- MapLibre GL + OpenStreetMap entegrasyonu
- ONLINE işletmeler için yeşil marker, diğerleri için gri marker
- Marker popup (işletme adı, kategori, puan, "Detaya Git" butonu)
- Viewport değiştiğinde işletme kartları filtreleme
- Yatay işletme kartları slider (BusinessCardCarousel)

### 3. ✅ Esnaf Paneli UX İyileştirmeleri
- Büyük durum badge'i (ONLINE/OFFLINE/AUTO_OFFLINE)
- Online/Offline toggle butonu ve açıklama metni
- Ban uyarı kartı (sarı/red uyarı)
- Renkli sipariş durumu badge'leri
- PENDING_CONFIRMATION için "2 saat içinde yanıt vermezseniz" uyarısı

### 4. ✅ AUTO_OFFLINE Mantığı
- `lib/services/autoOfflineService.ts` - Helper fonksiyonlar
- `markAutoOfflineIfOutOfWorkingHours()` - Mesai saati kontrolü
- `markAutoOfflineIfOrderUnanswered()` - Cevapsız sipariş kontrolü
- `/api/dev/maintenance` endpoint (POST ile tetiklenir)
- TODO: İleride gerçek cron job ile periyodik çalışacak

### 5. ✅ Review Sistemi
- İşletme detay sayfasında ortalama rating ve toplam yorum sayısı (büyük gösterim)
- Son 3 yorum listesi
- `/business/[id]/reviews` - Tüm yorumlar sayfası
- Review API endpoint (`/api/businesses/[id]/reviews`)

### 6. ✅ Türkçe UI Metinleri
- Tüm buton metinleri Türkçeleştirildi
- Status badge'leri Türkçe ("Beklemede", "Kabul Edildi", "Devam Ediyor", "Tamamlandı", "İptal Edildi")
- Form label'ları Türkçeleştirildi ("E-posta", "Şifre", "Ad Soyad")
- Hata mesajları Türkçeleştirildi

## API Endpoints

### Auth
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş
- `POST /api/auth/logout` - Çıkış
- `GET /api/auth/me` - Mevcut kullanıcı

### Businesses
- `GET /api/businesses` - İşletme listesi
- `GET /api/businesses/[id]` - İşletme detayı
- `GET /api/businesses/[id]/reviews` - İşletme yorumları
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

### Maintenance
- `POST /api/dev/maintenance` - AUTO_OFFLINE kontrollerini çalıştır

## Önemli Notlar

1. **Auth**: Artık HTTP-only cookie kullanılıyor, localStorage kaldırıldı
2. **Harita**: MapLibre GL entegrasyonu tamamlandı, viewport filtreleme çalışıyor
3. **AUTO_OFFLINE**: Maintenance endpoint hazır, cron job entegrasyonu için TODO bırakıldı
4. **Review**: İşletme detay ve tüm yorumlar sayfaları eklendi
5. **Türkçe**: Tüm UI metinleri Türkçeleştirildi

## Sonraki Adımlar (Phase 2)

- [ ] Gerçek ödeme entegrasyonu (iyzico/PayTR)
- [ ] SMS doğrulama
- [ ] Dosya yükleme (görsel yükleme)
- [ ] Chat sistemi
- [ ] Cron job entegrasyonu (AUTO_OFFLINE)
- [ ] Ürün CRUD işlemleri (esnaf panelinde)
- [ ] Çalışma saatleri yönetimi UI

## Kurulum

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

.env dosyasında:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret key
- `NEXT_PUBLIC_MAPLIBRE_STYLE_URL` - MapLibre style URL (opsiyonel, default kullanılır)

