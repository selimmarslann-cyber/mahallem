# ⚠️ VERCEL'DE EKSİK ENVIRONMENT VARIABLE'LAR

## 🔴 KRİTİK EKSİKLER (Kayıt işlemi için zorunlu)

### 1. JWT_SECRET
**Durum**: ❌ EKSİK  
**Değer**: En az 32 karakter, güçlü random string  
**Örnek**: `super-secret-jwt-key-for-production-min-32-chars-required`  
**Açıklama**: Kayıt işleminde JWT token oluşturmak için kullanılıyor. Bu olmadan kayıt başarısız olur.

---

### 2. NEXT_PUBLIC_APP_URL
**Durum**: ❌ EKSİK  
**Değer**: `https://mahallem-rrz7.vercel.app` (veya production URL'iniz)  
**Açıklama**: Metadata, referral linkleri ve email şablonları için kullanılıyor.

---

## 🟡 MAIL SERVİSİ EKSİKLERİ (Email gönderimi için)

### 3. MAIL_HOST
**Durum**: ❌ EKSİK  
**Değer**: `smtp.zoho.com` (veya kullandığınız SMTP servisi)

### 4. MAIL_PORT
**Durum**: ❌ EKSİK  
**Değer**: `587` (veya `465` SSL için)

### 5. MAIL_SECURE
**Durum**: ❌ EKSİK  
**Değer**: `false` (port 587 için) veya `true` (port 465 için)

### 6. MAIL_USER
**Durum**: ❌ EKSİK  
**Değer**: Email adresiniz (örn: `noreply@mahallem.app`)

**Not**: `MAIL_PASS` ve `MAIL_FROM` zaten mevcut ✅

---

## 📝 VERCEL'E EKLENMESİ GEREKENLER ÖZET

Aşağıdaki environment variable'ları Vercel'e ekleyin:

1. ✅ `JWT_SECRET` (KRİTİK - Kayıt için zorunlu)
2. ✅ `NEXT_PUBLIC_APP_URL` (KRİTİK)
3. ✅ `MAIL_HOST`
4. ✅ `MAIL_PORT`
5. ✅ `MAIL_SECURE`
6. ✅ `MAIL_USER`

---

## 🎯 ŞİMDİ NE YAPMALISINIZ?

### Seçenek 1: Vercel Dashboard'dan Manuel Ekleme

1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**
2. Yukarıdaki her bir variable için:
   - **Add New** butonuna tıklayın
   - Name ve Value girin
   - Environment: **Production**, **Preview**, **Development** seçin
   - **Save** yapın

### Seçenek 2: Vercel CLI ile Ekleme (Hızlı)

```bash
# JWT_SECRET (KRİTİK - Önce bunu ekleyin!)
vercel env add JWT_SECRET production

# Diğerleri
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add MAIL_HOST production
vercel env add MAIL_PORT production
vercel env add MAIL_SECURE production
vercel env add MAIL_USER production
```

---

## ✅ MEVCUT OLANLAR

- ✅ MAIL_PASS
- ✅ MAIL_FROM
- ✅ DATABASE_URL
- ✅ DIRECT_URL
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY

---

## 🔍 SORUN GİDERME

**"Kayıt işlemi başarısız" hatası alıyorsanız:**

1. **JWT_SECRET eksik mi?** → En yaygın sebep bu!
2. Vercel'de değişikliklerin yüklendiğinden emin olun (redeploy gerekebilir)
3. Vercel Function Logs'e bakın - gerçek hata mesajını göreceksiniz

