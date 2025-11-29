# 🔧 Sorun Giderme Rehberi

## ChunkLoadError: Loading chunk failed

### Hata Mesajı
```
ChunkLoadError: Loading chunk app/layout failed.
(timeout: http://localhost:3000/_next/static/chunks/app/layout.js)
```

### Çözüm

1. **`.next` klasörünü temizleyin:**
   ```powershell
   # PowerShell'de:
   Remove-Item -Recurse -Force .next
   ```

2. **Node modules cache'i temizleyin:**
   ```powershell
   if (Test-Path node_modules\.cache) { Remove-Item -Recurse -Force node_modules\.cache }
   ```

3. **Development server'ı yeniden başlatın:**
   ```bash
   npm run dev
   ```

4. **Eğer hala sorun varsa:**
   - Tarayıcı cache'ini temizleyin (Ctrl+Shift+Delete)
   - Hard refresh yapın (Ctrl+Shift+R)
   - Farklı bir tarayıcı deneyin

5. **Port sorunu olabilir:**
   - 3000 portu başka bir uygulama tarafından kullanılıyor olabilir
   - Farklı bir port deneyin: `npm run dev -- -p 3001`

---

## DATABASE_URL Hatası

### Hata Mesajı
```
error: Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`.
⚠️  DATABASE_URL is missing protocol. Attempting to fix: postgresql://file:./...
```

### Çözüm

1. **`.env` veya `.env.local` dosyanızı kontrol edin:**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
   ```
   
   **⚠️ YANLIŞ FORMAT ÖRNEKLERİ (Bunları kullanmayın!):**
   ```env
   # ❌ YANLIŞ:
   DATABASE_URL=file:./prisma/dev.db
   DATABASE_URL=https://xxx.supabase.co
   DATABASE_URL=postgres.xxx.supabase.co
   
   # ✅ DOĞRU:
   DATABASE_URL=postgresql://postgres:password@xxx.supabase.co:5432/postgres
   ```

2. **Supabase kullanıyorsanız:**
   - Supabase Dashboard > Settings > Database
   - **Connection string** bölümünden **Connection pooling** modunu seçin
   - Connection string'i kopyalayın
   - Format şöyle olmalı: `postgresql://postgres.PROJECT_REF:PASSWORD@host:5432/postgres`

3. **Yanlış format örnekleri:**
   - ❌ `https://xxx.supabase.co` (Bu API URL, database URL değil!)
   - ❌ `postgres://...` (Bazen çalışır ama `postgresql://` tercih edilir)
   - ✅ `postgresql://postgres.xxx:password@host:5432/postgres`

4. **Doğru format:**
   ```env
   DATABASE_URL=postgresql://postgres.ducxibsyzkwwzvrdzrmp:YOUR_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true
   ```

---

## Response Body Locked Hatası

### Hata Mesajı
```
TypeError: Response body object should not be disturbed or locked
```

### Çözüm

Bu hata genellikle Next.js'in internal caching mekanizması ile ilgilidir. Şunları deneyin:

1. **`.next` klasörünü silin:**
   ```powershell
   Remove-Item -Recurse -Force .next
   ```

2. **Node modules'ü temizleyin:**
   ```bash
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

3. **Development server'ı yeniden başlatın:**
   ```bash
   npm run dev
   ```

---

## EBUSY (Dosya Kilitlenmesi) Hatası

### Hata Mesajı
```
[Error: EBUSY: resource busy or locked, open 'C:\...\.next\server\next-font-manifest.js']
```

### Çözüm

Windows'ta dosya kilitleme sorunu. Şunları deneyin:

1. **Development server'ı durdurun** (Ctrl+C)

2. **`.next` klasörünü silin:**
   ```powershell
   Remove-Item -Recurse -Force .next
   ```

3. **Eğer hala kilitliyse:**
   - Tüm Node.js process'lerini kapatın
   - VS Code veya editörü kapatın
   - `.next` klasörünü manuel olarak silin
   - Yeniden başlatın

4. **Alternatif:**
   - Task Manager'dan tüm Node.js process'lerini sonlandırın
   - Bilgisayarı yeniden başlatın (son çare)

---

## Images.domains Deprecated Uyarısı

### Uyarı Mesajı
```
⚠ The "images.domains" configuration is deprecated. Please use "images.remotePatterns" configuration instead.
```

### Çözüm

✅ **Bu sorun düzeltildi!** `next.config.js` dosyasında `domains` kaldırıldı, sadece `remotePatterns` kullanılıyor.

Eğer hala görüyorsanız:
1. Development server'ı yeniden başlatın
2. `.next` klasörünü temizleyin

---

## Prisma Client Hatası

### Hata Mesajı
```
PrismaClientInitializationError: Invalid `prisma.user.findUnique()` invocation
```

### Çözüm

1. **DATABASE_URL'i kontrol edin** (yukarıdaki bölüme bakın)

2. **Prisma Client'ı yeniden generate edin:**
   ```bash
   npx prisma generate
   ```

3. **Veritabanı bağlantısını test edin:**
   ```bash
   npx prisma db pull
   ```

---

## Genel Sorun Giderme Adımları

### 1. Environment Variables Kontrolü

`.env` dosyanızda şunlar olmalı:
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Bağımlılıkları Güncelleyin

```bash
npm install
```

### 3. Prisma Client'ı Generate Edin

```bash
npx prisma generate
```

### 4. Veritabanı Migration'ları Uygulayın

```bash
npx prisma db push
# veya
npx prisma migrate dev
```

### 5. Development Server'ı Temiz Başlatın

```powershell
# .next klasörünü sil
Remove-Item -Recurse -Force .next

# Cache'i temizle
if (Test-Path node_modules\.cache) { Remove-Item -Recurse -Force node_modules\.cache }

# Server'ı başlat
npm run dev
```

### 6. Tarayıcı Cache'ini Temizleyin

- **Chrome/Edge:** Ctrl+Shift+Delete > Cached images and files
- **Firefox:** Ctrl+Shift+Delete > Cache
- **Hard Refresh:** Ctrl+Shift+R (veya Ctrl+F5)

---

## Hala Sorun mu Var?

1. **Log'ları kontrol edin:** Console'da tam hata mesajını görün
2. **Environment variables'ı kontrol edin:** `.env` dosyası doğru mu?
3. **Node.js versiyonunu kontrol edin:** `node --version` (18+ olmalı)
4. **Port'u kontrol edin:** 3000 portu başka bir uygulama tarafından kullanılıyor olabilir
5. **Firewall/Antivirus:** Windows Defender veya antivirus yazılımı port'u engelliyor olabilir

---

**Son Güncelleme:** 2024
