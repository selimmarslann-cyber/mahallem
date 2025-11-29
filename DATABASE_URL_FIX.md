# 🔧 DATABASE_URL Format Hatası Düzeltme

## ❌ Hata

```
error: Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`.
```

## ✅ Çözüm

### 1. `.env` Dosyasını Kontrol Edin

Proje kök dizininde `.env` veya `.env.local` dosyasını açın ve `DATABASE_URL` değişkenini kontrol edin.

### 2. Doğru Format

`DATABASE_URL` şu formatta olmalı:

```env
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
```

### 3. Supabase Kullanıyorsanız

Supabase Dashboard'dan connection string alın:

1. **Supabase Dashboard** > **Settings** > **Database**
2. **Connection string** bölümüne gidin
3. **Connection pooling** modunu seçin (Transaction mode)
4. Connection string'i kopyalayın
5. Şifreyi kendi database şifrenizle değiştirin

**Örnek Format:**
```env
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
```

### 4. Local PostgreSQL Kullanıyorsanız

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mahallem?schema=public
```

### 5. Yanlış Format Örnekleri (Bunları Kullanmayın!)

❌ **YANLIŞ:**
```env
DATABASE_URL=file:./prisma/dev.db
DATABASE_URL=https://xxx.supabase.co
DATABASE_URL=postgres.xxx.supabase.co
DATABASE_URL=xxx.supabase.co
```

✅ **DOĞRU:**
```env
DATABASE_URL=postgresql://postgres:password@xxx.supabase.co:5432/postgres
```

## 🔍 Kontrol

`.env` dosyanızı kontrol etmek için:

```powershell
# PowerShell'de:
Get-Content .env | Select-String -Pattern "DATABASE_URL"
```

## ⚠️ Önemli Notlar

1. **Şifre özel karakterler içeriyorsa URL encode edin:**
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - vb.

2. **Development ve Production için farklı DATABASE_URL kullanın:**
   - Development: `.env.local`
   - Production: Vercel Environment Variables

3. **Dosyayı kaydettikten sonra development server'ı yeniden başlatın:**
   ```bash
   # Ctrl+C ile durdurun
   npm run dev
   ```

## 🚨 Hala Çalışmıyorsa

1. `.env` dosyasının proje kök dizininde olduğundan emin olun
2. Dosya adının tam olarak `.env` veya `.env.local` olduğundan emin olun
3. Development server'ı tamamen durdurup yeniden başlatın
4. `.next` klasörünü temizleyin:
   ```powershell
   Remove-Item -Recurse -Force .next
   ```

---

**Son Güncelleme:** 2024

