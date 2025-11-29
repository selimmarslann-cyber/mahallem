# 📧 E-posta Sorun Giderme Rehberi

## 🔍 Sorun Tespiti

E-posta gönderilemiyorsa aşağıdaki adımları takip edin:

### 1. Environment Variables Kontrolü

`.env` dosyanızda şu değişkenler olmalı:

```env
MAIL_HOST=smtp.zoho.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=noreply@yourdomain.com
MAIL_PASS=your-app-password
MAIL_FROM=Hizmetgo <noreply@yourdomain.com>
```

### 2. Test Endpoint'i ile Kontrol

#### Yapılandırmayı Kontrol Et:
```bash
GET http://localhost:3000/api/test/email
```

#### Test E-postası Gönder:
```bash
POST http://localhost:3000/api/test/email
Content-Type: application/json

{
  "to": "your-email@example.com",
  "testType": "simple"
}
```

#### OTP E-postası Test Et:
```bash
POST http://localhost:3000/api/test/email
Content-Type: application/json

{
  "to": "your-email@example.com",
  "testType": "otp"
}
```

## 🐛 Yaygın Hatalar ve Çözümleri

### 1. "Email configuration is missing"

**Hata:**
```
Error: Email configuration is missing. Please set MAIL_USER and MAIL_PASS environment variables.
```

**Çözüm:**
- `.env` dosyasına `MAIL_USER` ve `MAIL_PASS` ekleyin
- Development server'ı yeniden başlatın

### 2. "EAUTH" - Kimlik Doğrulama Hatası

**Hata:**
```
Error: Invalid login: 535 Authentication failed
```

**Çözüm:**
- Zoho Mail kullanıyorsanız, **App Password** kullanmalısınız (normal şifre değil!)
- Zoho Mail > Settings > Security > App Passwords
- Yeni app password oluşturun ve `MAIL_PASS` olarak kullanın
- Normal şifre ile çalışmaz!

### 3. "ECONNECTION" - Bağlantı Hatası

**Hata:**
```
Error: Connection timeout
```

**Çözüm:**
- `MAIL_HOST` doğru mu kontrol edin
- Zoho için: `smtp.zoho.com`
- Gmail için: `smtp.gmail.com`
- Port 587 veya 465 kullanılıyor mu kontrol edin
- Firewall veya antivirus SMTP port'unu engelliyor olabilir

### 4. "ETIMEDOUT" - Zaman Aşımı

**Hata:**
```
Error: Connection timeout
```

**Çözüm:**
- İnternet bağlantınızı kontrol edin
- SMTP sunucusu erişilebilir mi kontrol edin
- Port 587 veya 465 açık mı kontrol edin

### 5. E-posta Gidiyor Ama Gelen Kutusuna Düşmüyor

**Olası Nedenler:**
1. **Spam Kutusu:** E-postalar spam klasörüne düşüyor olabilir
2. **Gönderen Adresi:** `MAIL_FROM` doğru ayarlanmamış olabilir
3. **SPF/DKIM:** E-posta sunucunuzun SPF ve DKIM kayıtları eksik olabilir
4. **Rate Limiting:** Çok fazla e-posta gönderiyorsanız rate limit'e takılmış olabilirsiniz

**Çözüm:**
- Spam klasörünü kontrol edin
- `MAIL_FROM` formatını kontrol edin: `"Hizmetgo <noreply@yourdomain.com>"`
- Domain'iniz için SPF ve DKIM kayıtlarını ekleyin
- E-posta gönderme sıklığını azaltın

## 🔧 Zoho Mail Kurulumu

### 1. Zoho Mail Hesabı Oluşturun

1. [Zoho Mail](https://www.zoho.com/mail/) > Sign Up
2. Ücretsiz plan seçin (5 kullanıcıya kadar ücretsiz)
3. Domain'inizi bağlayın (opsiyonel) veya `@zoho.com` kullanın

### 2. App Password Oluşturun

1. Zoho Mail > Settings > Security
2. **App Passwords** bölümüne gidin
3. **Generate New Password** tıklayın
4. App adı: "Hizmetgo"
5. Oluşturulan şifreyi kopyalayın (bir daha gösterilmez!)

### 3. Environment Variables Ayarlayın

```env
MAIL_HOST=smtp.zoho.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=noreply@yourdomain.zoho.com
MAIL_PASS=xxxx-xxxx-xxxx-xxxx  # App Password
MAIL_FROM=Hizmetgo <noreply@yourdomain.zoho.com>
```

### 4. Test Edin

```bash
# Test endpoint'ini çağır
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com"}'
```

## 🔧 Gmail Kurulumu (Alternatif)

### 1. Gmail App Password Oluşturun

1. Google Account > Security
2. **2-Step Verification** açık olmalı
3. **App passwords** bölümüne gidin
4. App: "Mail"
5. Device: "Other (Custom name)" → "Hizmetgo"
6. Oluşturulan şifreyi kopyalayın

### 2. Environment Variables

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@gmail.com
MAIL_PASS=xxxx xxxx xxxx xxxx  # App Password (boşluklu)
MAIL_FROM=Hizmetgo <your-email@gmail.com>
```

## 📊 Test Sonuçları

### Başarılı Test:
```json
{
  "success": true,
  "message": "Test e-postası başarıyla gönderildi!",
  "test": {
    "to": "your-email@example.com",
    "subject": "Hizmetgo - Test E-postası",
    "messageId": "..."
  }
}
```

### Hata Durumu:
```json
{
  "success": false,
  "error": "E-posta gönderilemedi",
  "details": "EAUTH: Invalid login",
  "config": {
    "host": "smtp.zoho.com",
    "port": "587",
    "user": "SET",
    "pass": "***HIDDEN***"
  }
}
```

## 🚀 Hızlı Test

### PowerShell ile:
```powershell
# Yapılandırmayı kontrol et
Invoke-WebRequest -Uri "http://localhost:3000/api/test/email" -Method GET

# Test e-postası gönder
$body = @{
    to = "your-email@example.com"
    testType = "simple"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/test/email" -Method POST -Body $body -ContentType "application/json"
```

### Browser'da:
```
http://localhost:3000/api/test/email
```

## ✅ Checklist

- [ ] `.env` dosyasında `MAIL_USER` ve `MAIL_PASS` var mı?
- [ ] App Password kullanıyor musunuz? (Normal şifre çalışmaz!)
- [ ] `MAIL_HOST` doğru mu? (Zoho: `smtp.zoho.com`, Gmail: `smtp.gmail.com`)
- [ ] `MAIL_PORT` doğru mu? (587 veya 465)
- [ ] `MAIL_SECURE` doğru mu? (587 için `false`, 465 için `true`)
- [ ] Development server yeniden başlatıldı mı?
- [ ] Test endpoint'i çalışıyor mu?
- [ ] Spam klasörünü kontrol ettiniz mi?

## 📝 Notlar

- **App Password zorunlu:** Zoho ve Gmail normal şifre ile çalışmaz, mutlaka App Password kullanın
- **Rate Limiting:** Çok fazla e-posta gönderirseniz rate limit'e takılabilirsiniz
- **Spam:** İlk e-postalar spam klasörüne düşebilir, domain reputation oluştukça düzelir
- **Development:** Development modunda test kodları console'da görünebilir

---

**Son Güncelleme:** 2024

