# 🚀 VERCEL'E EKSİK ENVIRONMENT VARIABLE'LARI EKLEME ADIMLARI

## ⚠️ KRİTİK: JWT_SECRET ÖNCE EKLENMELİ!

Kayıt işlemi için **JWT_SECRET** zorunludur. Bu olmadan kayıt kesinlikle çalışmaz.

---

## 📝 ADIM ADIM EKLEME

### 1️⃣ JWT_SECRET (EN ÖNEMLİSİ!)

1. Vercel Dashboard → Projeniz (`mahallem`) → **Settings** → **Environment Variables**
2. **Add New** butonuna tıklayın
3. **Name**: `JWT_SECRET`
4. **Value**: En az 32 karakterlik güçlü bir random string girin
   - Örnek: `mahallem-super-secret-jwt-key-2025-min-32-chars-production`
   - Veya online generator kullanın: https://randomkeygen.com/
5. **Environment**: **Production**, **Preview**, **Development** (hepsini seçin)
6. **Save**

---

### 2️⃣ NEXT_PUBLIC_APP_URL

1. **Add New**
2. **Name**: `NEXT_PUBLIC_APP_URL`
3. **Value**: `https://mahallem-rrz7.vercel.app` (veya gerçek production URL'iniz)
4. **Environment**: **Production**, **Preview**, **Development**
5. **Save**

---

### 3️⃣ MAIL_HOST

1. **Add New**
2. **Name**: `MAIL_HOST`
3. **Value**: `smtp.zoho.com` (veya kullandığınız SMTP servisi)
4. **Environment**: **Production**, **Preview**, **Development**
5. **Save**

---

### 4️⃣ MAIL_PORT

1. **Add New**
2. **Name**: `MAIL_PORT`
3. **Value**: `587` (veya `465` SSL için)
4. **Environment**: **Production**, **Preview**, **Development**
5. **Save**

---

### 5️⃣ MAIL_SECURE

1. **Add New**
2. **Name**: `MAIL_SECURE`
3. **Value**: `false` (port 587 için) veya `true` (port 465 için)
4. **Environment**: **Production**, **Preview**, **Development**
5. **Save**

---

### 6️⃣ MAIL_USER

1. **Add New**
2. **Name**: `MAIL_USER`
3. **Value**: Email adresiniz (örn: `noreply@mahallem.app`)
4. **Environment**: **Production**, **Preview**, **Development**
5. **Save**

---

## ✅ KONTROL LİSTESİ

Ekledikten sonra şunların hepsi olmalı:

- [x] DATABASE_URL ✅ (Mevcut)
- [ ] **JWT_SECRET** ❌ (EKLE!)
- [ ] **NEXT_PUBLIC_APP_URL** ❌ (EKLE!)
- [ ] **MAIL_HOST** ❌ (EKLE!)
- [ ] **MAIL_PORT** ❌ (EKLE!)
- [ ] **MAIL_SECURE** ❌ (EKLE!)
- [ ] **MAIL_USER** ❌ (EKLE!)
- [x] MAIL_PASS ✅ (Mevcut)
- [x] MAIL_FROM ✅ (Mevcut)
- [x] DIRECT_URL ✅ (Mevcut)
- [x] NEXT_PUBLIC_SUPABASE_URL ✅ (Mevcut)
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY ✅ (Mevcut)
- [x] SUPABASE_SERVICE_ROLE_KEY ✅ (Mevcut)

---

## 🔄 REDEPLOY

Tüm environment variable'ları ekledikten sonra:

1. Vercel Dashboard → **Deployments** sekmesi
2. Son deployment'ın yanındaki **"⋯"** menüsüne tıklayın
3. **Redeploy** seçin
4. Veya otomatik deploy olmasını bekleyin (biraz zaman alabilir)

---

## 🎯 ÖNCELİK SIRASI

**Şimdi yapılması gerekenler (sırayla):**

1. ✅ **JWT_SECRET ekle** ← EN ÖNEMLİSİ!
2. ✅ **NEXT_PUBLIC_APP_URL ekle**
3. ✅ Mail ayarlarını ekle (MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER)
4. ✅ Redeploy yap veya bekle

---

## 💡 HIZLI KOMUTLAR (Vercel CLI ile)

Eğer Vercel CLI kullanmak isterseniz:

```bash
# 1. JWT_SECRET (En önemlisi!)
vercel env add JWT_SECRET production
# Value gireceksiniz: örn. mahallem-super-secret-jwt-key-2025-min-32-chars

# 2. App URL
vercel env add NEXT_PUBLIC_APP_URL production
# Value: https://mahallem-rrz7.vercel.app

# 3. Mail ayarları
vercel env add MAIL_HOST production
# Value: smtp.zoho.com

vercel env add MAIL_PORT production
# Value: 587

vercel env add MAIL_SECURE production
# Value: false

vercel env add MAIL_USER production
# Value: noreply@mahallem.app (veya email adresiniz)
```

---

## ⚠️ UYARI

**JWT_SECRET** olmadan kayıt işlemi **KESİNLİKLE** çalışmaz! Önce bunu ekleyin.

