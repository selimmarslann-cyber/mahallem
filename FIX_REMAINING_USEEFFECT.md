# Kalan useEffect Warnings Düzeltme Rehberi

## ✅ Düzeltilen Dosyalar (7 dosya)

1. ✅ `app/(customer)/profile/page.tsx` - loadUserData
2. ✅ `app/(customer)/account/profile/page.tsx` - loadUser  
3. ✅ `app/(authenticated)/admin/users/[id]/page.tsx` - loadUserData
4. ✅ `app/(authenticated)/dashboard/business/page.tsx` - loadUserAndBusiness
5. ✅ `app/(authenticated)/orders/page.tsx` - loadUserAndOrders
6. ✅ `app/(authenticated)/referral/page.tsx` - loadData, loadRewards
7. ✅ `app/(business)/business/analytics/page.tsx` - loadAnalytics
8. ✅ `app/(business)/business/jobs/available/page.tsx` - loadAvailableJobs
9. ✅ `app/(business)/business/jobs/page.tsx` - loadOrders

## 🔄 Kalan Dosyalar (yaklaşık 15-20 dosya)

Kalan useEffect warnings'larını düzeltmek için aşağıdaki pattern'i kullanın:

### Pattern: useCallback ile Düzeltme

**Önce:**
```typescript
useEffect(() => {
  loadData()
}, [])

const loadData = async () => {
  // ... kod
}
```

**Sonra:**
```typescript
import { useEffect, useState, useCallback } from 'react'

const loadData = useCallback(async () => {
  // ... kod
}, [/* dependencies */])  // router, error, setState fonksiyonları vs.

useEffect(() => {
  loadData()
}, [loadData])
```

### Kalan Dosyalar

Aşağıdaki dosyalarda benzer düzeltmeler yapılmalı:

1. `app/(business)/business/page.tsx` - loadData
2. `app/(business)/business/status/page.tsx` - loadData
3. `app/(business)/business/store/page.tsx` - loadBusinessData
4. `app/(business)/business/wallet/page.tsx` - loadData, calculateBusinessEarnings
5. `app/(business)/business/working-hours/page.tsx` - loadBusiness
6. `app/(business)/business/jobs/[id]/page.tsx` - loadOrder
7. `app/(authenticated)/orders/[id]/page.tsx` - loadOrder
8. `app/(customer)/account/wallet/page.tsx` - checkAuth
9. `app/(customer)/jobs/page.tsx` - loadUser
10. `app/(customer)/jobs/[id]/page.tsx` - loadOrder
11. `app/(customer)/jobs/job/[id]/page.tsx` - loadJob, loadOffers
12. `app/(customer)/map/page.tsx` - userLocation, applyFilters
13. `app/(customer)/request/page.tsx` - performSearch, searchQuery
14. `app/(customer)/account/page.tsx` - loadUser
15. `app/(public)/auth/*/page.tsx` - checkAuth (login, register, business-login, required)
16. `app/(public)/business/not-registered/page.tsx` - loadUser
17. `app/(public)/business/[id]/page.tsx` - loadBusiness
18. `app/(public)/business/[id]/reviews/page.tsx` - loadBusiness, loadReviews
19. `components/map/BusinessMap.tsx` - onMapMove, updateMarkers

## ⚡ Hızlı Düzeltme Script'i

Bu dosyaları manuel olarak düzeltmek yerine, aşağıdaki pattern'i takip edin:

### Adımlar:

1. **useCallback import et:**
   ```typescript
   import { useEffect, useState, useCallback } from 'react'
   ```

2. **Fonksiyonu useCallback ile sar:**
   ```typescript
   const loadData = useCallback(async () => {
     // ... mevcut kod
   }, [/* dependencies */])
   ```

3. **useEffect'i güncelle:**
   ```typescript
   useEffect(() => {
     loadData()
   }, [loadData])
   ```

### Dependency Array Notları:

- `router` → `useRouter()` hook'undan geliyorsa ekleyin
- `error`, `success` → `useToast()` hook'undan geliyorsa ekleyin
- State setter fonksiyonlar → `setState` fonksiyonları eklenmez (React garantili)
- Props → Component props'ları eklenmelidir

## 📝 Örnek Düzeltme

```typescript
// ÖNCE
useEffect(() => {
  loadData()
}, [])

const loadData = async () => {
  const res = await fetch('/api/data')
  const data = await res.json()
  setData(data)
}

// SONRA
const loadData = useCallback(async () => {
  const res = await fetch('/api/data')
  const data = await res.json()
  setData(data)
}, [])  // setData eklenmez, React garantili

useEffect(() => {
  loadData()
}, [loadData])
```

```typescript
// router kullanıyorsa
const loadData = useCallback(async () => {
  if (!user) {
    router.push('/login')
    return
  }
  // ...
}, [router, user])  // router ve user dependency olarak eklenir
```

---

**Not:** Kalan dosyalar öncelik sırasına göre düzeltilebilir. En çok kullanılan sayfalardan başlayın.

