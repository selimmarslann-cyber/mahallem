# 📧 E-posta Test Rehberi

## ✅ Yapılan İşlemler

1. **API key'ler kaldırıldı:** Hardcoded API key'ler dosyalardan temizlendi
2. **Email test script eklendi:** `scripts/test-email.js`
3. **GitHub'a push edildi:** Tüm değişiklikler GitHub'a yüklendi

## 🧪 E-posta Test Etme

### Yöntem 1: Test Script Kullanarak

1. **Development server'ı başlatın:**
```bash
npm run dev
```

2. **Başka bir terminal'de test script'ini çalıştırın:**
```bash
node scripts/test-email.js your-email@example.com
```

Bu script:
- ✅ E-posta yapılandırmasını kontrol eder
- ✅ Basit test e-postası gönderir
- ✅ OTP e-postası gönderir

### Yöntem 2: API Endpoint Kullanarak

#### 1. Yapılandırma Kontrolü (GET)

```bash
curl http://localhost:3000/api/test/email
```

veya tarayıcıda:
```
http://localhost:3000/api/test/email
```

#### 2. Basit Test E-postası Gönderme (POST)

```bash
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "testType": "simple"
  }'
```

#### 3. OTP E-postası Gönderme (POST)

```bash
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "testType": "otp"
  }'
```

### Yöntem 3: Connection Test Endpoint

Tüm bağlantıları (Database, Supabase, Email, Groq) test etmek için:

```bash
curl http://localhost:3000/api/test/connections
```

veya tarayıcıda:
```
http://localhost:3000/api/test/connections
```

## ⚙️ Gerekli Environment Variables

`.env` dosyanızda şu değişkenler olmalı:

```env
# Email Configuration
MAIL_HOST=smtp.zoho.com          # veya kullandığınız SMTP sunucusu
MAIL_PORT=587                     # veya 465 (SSL için)
MAIL_SECURE=false                 # 587 için false, 465 için true
MAIL_USER=your-email@example.com  # SMTP kullanıcı adı
MAIL_PASS=your-app-password       # SMTP şifresi (App Password)
MAIL_FROM=your-email@example.com  # Gönderen e-posta (opsiyonel)
```

## 🔧 Sorun Giderme

### 1. "Email configuration is missing" Hatası

**Çözüm:**
- `.env` dosyasında `MAIL_USER` ve `MAIL_PASS` olduğundan emin olun
- Development server'ı yeniden başlatın

### 2. "EAUTH" (Kimlik Doğrulama) Hatası

**Çözüm:**
- `MAIL_USER` ve `MAIL_PASS` doğru mu kontrol edin
- Zoho Mail kullanıyorsanız **App Password** kullanın (normal şifre değil)
- Gmail kullanıyorsanız **App Password** kullanın

### 3. "ECONNECTION" (Bağlantı) Hatası

**Çözüm:**
- `MAIL_HOST` doğru mu kontrol edin
- `MAIL_PORT` doğru mu kontrol edin (587 veya 465)
- Firewall veya antivirüs SMTP bağlantısını engelliyor olabilir

### 4. "ETIMEDOUT" (Zaman Aşımı) Hatası

**Çözüm:**
- İnternet bağlantınızı kontrol edin
- SMTP sunucusu erişilebilir mi kontrol edin
- `MAIL_HOST` ve `MAIL_PORT` doğru mu kontrol edin

## 📋 Test Senaryoları

### Senaryo 1: Basit Test E-postası
```bash
node scripts/test-email.js test@example.com
```

**Beklenen Sonuç:**
- ✅ Yapılandırma kontrolü başarılı
- ✅ Test e-postası gönderildi
- ✅ E-posta kutunuzda "Hizmetgo - Test E-postası" başlıklı e-posta görünür

### Senaryo 2: OTP E-postası
```bash
node scripts/test-email.js test@example.com
```

**Beklenen Sonuç:**
- ✅ OTP e-postası gönderildi
- ✅ E-posta kutunuzda "Mahallem - Doğrulama Kodu" başlıklı e-posta görünür
- ✅ E-postada test kodu (123456) görünür

### Senaryo 3: Connection Test
```bash
curl http://localhost:3000/api/test/connections
```

**Beklenen Sonuç:**
```json
{
  "database": { "status": "success", ... },
  "supabaseClient": { "status": "success", ... },
  "supabaseAdmin": { "status": "success", ... },
  "emailSMTP": { "status": "success", ... },
  "groqAPI": { "status": "success", ... },
  ...
}
```

## ✅ Test Checklist

- [ ] `.env` dosyasında tüm email değişkenleri set edildi
- [ ] Development server çalışıyor (`npm run dev`)
- [ ] Yapılandırma kontrolü başarılı (`GET /api/test/email`)
- [ ] Basit test e-postası gönderildi ve alındı
- [ ] OTP e-postası gönderildi ve alındı
- [ ] Connection test tüm servisleri başarıyla test etti

## 📝 Notlar

- **App Password:** Zoho Mail ve Gmail için normal şifre yerine **App Password** kullanmanız gerekir
- **Port 587 vs 465:** 
  - Port 587: STARTTLS (MAIL_SECURE=false)
  - Port 465: SSL/TLS (MAIL_SECURE=true)
- **Development vs Production:** Production'da environment variables Vercel veya hosting sağlayıcınızın dashboard'undan set edilmelidir

---

**Son Güncelleme:** 2024

