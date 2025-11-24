# Cache ve Hot Reload Sorunu Çözümü

## Sorun
UI değişiklikleri görünmüyor - dosyalar düzenleniyor ama browser'da değişiklik yok.

## Çözüm Adımları

### 1. Browser Cache Temizle
- Chrome/Edge: `Ctrl + Shift + R` (Hard Refresh)
- Veya: DevTools aç → Network tab → "Disable cache" işaretle → Sayfayı yenile

### 2. Next.js Cache Temizle
```powershell
# .next klasörünü sil
Remove-Item -Path ".next" -Recurse -Force

# Dev server'ı restart et
npm run dev
```

### 3. Browser'da Hard Refresh
- `Ctrl + Shift + R` veya `Ctrl + F5`

### 4. Dev Server'ı Restart Et
```powershell
# Tüm node process'lerini durdur
Get-Process -Name node | Stop-Process -Force

# Yeniden başlat
npm run dev
```

## Kontrol
Ana sayfa (`/`) route'u: `app/(customer)/page.tsx`
Görsel dosyası: `public/images/hero-family.jpg`

