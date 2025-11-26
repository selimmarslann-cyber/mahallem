# Hizmetgo - Esnaf/Hizmet Süper Uygulaması

Türkiye pazarı için mahalle esnafı ve hizmet sağlayıcıları ile müşterileri buluşturan platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase uyumlu)
- **ORM**: Prisma
- **UI**: shadcn/ui + Tailwind CSS
- **Maps**: MapLibre GL / Mapbox
- **Auth**: Supabase Auth (şimdilik email/password)

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

3. `.env` dosyasında `DATABASE_URL` ve diğer gerekli değişkenleri doldurun.

4. Veritabanı migration'ını çalıştırın:
```bash
npm run db:push
# veya
npm run db:migrate
```

5. Prisma Client'ı generate edin:
```bash
npm run db:generate
```

6. Development server'ı başlatın:
```bash
npm run dev
```

## Proje Yapısı

```
/app
  /(public)          # Public routes
    /map            # Harita + işletme listesi
    /business/[id]  # Esnaf detay + mağaza
    /auth           # Login/register
    /profile        # Kullanıcı profili
    /orders         # Müşteri sipariş listesi
  /dashboard
    /business       # Esnaf paneli
/components         # UI bileşenleri
/lib
  /db              # Prisma client
  /validations     # Zod şemaları
  /services        # Business logic
  /utils           # Yardımcı fonksiyonlar
/server            # API routes / Server actions
/prisma            # Database schema
```

## Özellikler

- ✅ Esnaf kayıt sistemi
- ✅ Harita üzerinde işletme gösterimi
- ✅ Mağaza (ürün/hizmet listesi)
- ✅ Sepet + sipariş isteği
- ✅ Online/Offline durumu
- ✅ Sipariş kabul/red akışı
- ✅ Mock ödeme sistemi (escrow benzeri)
- ✅ İki taraflı puan & yorum
- ✅ İptal sayacı ve ban sistemi

## Geliştirme Notları

- Gerçek ödeme entegrasyonu (iyzico/PayTR) henüz eklenmedi - mock servis kullanılıyor
- Telefon doğrulama ve SMS özellikleri ileride eklenecek
- Harita için Mapbox token gerekli (veya MapLibre kullanılabilir)

