# Next.js App Router Route Yapısı

## Route Mapping

### Ana Sayfa
- **URL:** `/`
- **Dosya:** `app/(customer)/page.tsx`
- **Layout:** `app/(customer)/layout.tsx`

### Diğer Route'lar
- `/map` -> `app/(customer)/map/page.tsx`
- `/auth/login` -> `app/(public)/auth/login/page.tsx`
- `/auth/register` -> `app/(public)/auth/register/page.tsx`
- `/jobs` -> `app/(customer)/jobs/page.tsx`
- `/request` -> `app/(customer)/request/page.tsx`
- `/welcome` -> `app/welcome/page.tsx`

## Önemli Not

Next.js App Router'da `(customer)` ve `(public)` gibi parantez içindeki klasörler **route group'larıdır** ve URL'de görünmezler.

Yani:
- `app/(customer)/page.tsx` -> `/` route
- `app/(public)/auth/login/page.tsx` -> `/auth/login` route

## Sorun

Kullanıcı `/` route'unu görüyor ama değişiklikler görünmüyor. Bu durumda:
1. Browser cache temizlenmeli
2. Next.js dev server restart edilmeli
3. `.next` klasörü silinip yeniden build edilmeli

