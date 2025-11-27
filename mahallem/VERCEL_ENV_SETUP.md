# Vercel Environment Variables Kurulum Rehberi

Bu dosya, Vercel'e eklemeniz gereken tüm environment variable'ları ve açıklamalarını içerir.

## 🚨 KRİTİK (Mutlaka Gerekli)

### 1. Veritabanı Bağlantısı
```
DATABASE_URL
```
**Değer Örneği**: `postgresql://user:password@host:5432/database?schema=public`  
**Açıklama**: PostgreSQL veritabanı bağlantı URL'i. Supabase kullanıyorsanız, Supabase proje ayarlarından "Connection String" alabilirsiniz.  
**Kullanım**: Prisma ORM veritabanı bağlantısı için.

---

### 2. JWT Secret Key
```
JWT_SECRET
```
**Değer Örneği**: `super-secret-key-change-this-in-production-min-32-characters`  
**Açıklama**: JWT token imzalama için kullanılan secret key. En az 32 karakter olmalı ve güçlü bir random string kullanın.  
**Kullanım**: Kullanıcı oturumları ve authentication için.

---

### 3. Uygulama URL'i (Public)
```
NEXT_PUBLIC_APP_URL
```
**Değer Örneği**: `https://mahallem-rrz7.vercel.app`  
**Açıklama**: Production ortamındaki uygulamanın tam URL'i. Referral linkler, email şablonları ve callback URL'leri için kullanılır.  
**Kullanım**: Email şablonları, referral linkleri, PayTR callback URL'leri.

---

## ⚠️ ÖNEMLİ (Özellikler için gerekli)

### 4. Email Servisi (Zoho Mail örneği)
```
MAIL_HOST
```
**Değer Örneği**: `smtp.zoho.com`  
**Açıklama**: SMTP sunucu adresi. Zoho, Gmail, SendGrid vb. kullanabilirsiniz.

```
MAIL_PORT
```
**Değer Örneği**: `587` (veya `465` SSL için)  
**Açıklama**: SMTP port numarası.

```
MAIL_SECURE
```
**Değer Örneği**: `false` (587 için) veya `true` (465 için)  
**Açıklama**: SSL/TLS kullanımı. Port 465 için `true`, 587 için `false`.

```
MAIL_USER
```
**Değer Örneği**: `noreply@mahallem.app`  
**Açıklama**: SMTP kullanıcı adı (email adresi).

```
MAIL_PASS
```
**Değer Örneği**: `your-smtp-password`  
**Açıklama**: SMTP şifresi veya uygulama şifresi.

```
MAIL_FROM
```
**Değer Örneği**: `Hizmetgo <noreply@mahallem.app>`  
**Açıklama**: Gönderen email adresi ve ismi. Yoksa MAIL_USER kullanılır.

---

### 5. PayTR Ödeme Entegrasyonu
```
PAYTR_MERCHANT_ID
```
**Değer Örneği**: `1234567`  
**Açıklama**: PayTR merchant ID'niz.

```
PAYTR_MERCHANT_SALT
```
**Değer Örneği**: `your-merchant-salt-key`  
**Açıklama**: PayTR merchant salt key.

```
PAYTR_MERCHANT_KEY
```
**Değer Örneği**: `your-merchant-key`  
**Açıklama**: PayTR merchant key.

---

### 6. Cron Job Güvenliği
```
CRON_SECRET
```
**Değer Örneği**: `cron-secret-key-for-authenticating-cron-jobs`  
**Açıklama**: Cron job endpoint'lerini korumak için kullanılan secret key. Vercel Cron Jobs'tan gelen istekleri doğrulamak için.  
**Kullanım**: `/api/jobs/process-delivery-reminders` endpoint'i için.

---

### 7. Supabase Entegrasyonu (Eğer kullanıyorsanız)
```
NEXT_PUBLIC_SUPABASE_URL
```
**Değer Örneği**: `https://xxxxx.supabase.co`  
**Açıklama**: Supabase proje URL'iniz.

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Değer Örneği**: `eyJhbGc...` (uzun bir JWT token)  
**Açıklama**: Supabase anonymous/public key.

```
SUPABASE_SERVICE_ROLE_KEY
```
**Değer Örneği**: `eyJhbGc...` (uzun bir JWT token)  
**Açıklama**: Supabase service role key (admin işlemleri için). **ASLA client-side'da kullanmayın!**

---

### 8. Harita (MapLibre/Mapbox)
```
NEXT_PUBLIC_MAPLIBRE_STYLE_URL
```
**Değer Örneği**: `https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY`  
**Açıklama**: MapLibre GL JS harita stil URL'i. MapTiler veya Mapbox kullanabilirsiniz.

---

### 9. Admin Kullanıcıları (Opsiyonel)
```
ADMIN_USER_IDS
```
**Değer Örneği**: `uuid1,uuid2,uuid3` (virgülle ayrılmış)  
**Açıklama**: Admin yetkisine sahip kullanıcı ID'leri. Admin paneli ve istatistik sayfalarına erişim için.

---

## 🔧 OPSİYONEL (Varsayılan değerleri var)

### 10. Mobil JWT Secret
```
MOBILE_JWT_SECRET
```
**Değer Örneği**: `mobile-secret-key-different-from-web`  
**Açıklama**: Mobil uygulama için ayrı JWT secret. Yoksa JWT_SECRET kullanılır.

---

### 11. Prisma Direct URL (Migration için)
```
DIRECT_URL
```
**Değer Örneği**: `postgresql://user:password@host:5432/database`  
**Açıklama**: Prisma migration işlemleri için doğrudan veritabanı bağlantısı. Connection pooling olmadan. Çoğu durumda DATABASE_URL ile aynı olabilir.

---

## 📋 Vercel'de Ekleme Adımları

1. Vercel Dashboard'a gidin
2. Projenizi seçin
3. **Settings** > **Environment Variables** bölümüne gidin
4. Her bir variable için:
   - **Name**: Yukarıdaki isim (örn: `DATABASE_URL`)
   - **Value**: Değerinizi girin
   - **Environment**: **Production**, **Preview**, ve **Development** seçeneklerinden uygun olanları işaretleyin
   - **Add** butonuna tıklayın

---

## ✅ Kontrol Listesi

- [ ] DATABASE_URL (Production veritabanı URL'i)
- [ ] JWT_SECRET (Güçlü bir random string, min 32 karakter)
- [ ] NEXT_PUBLIC_APP_URL (Production URL'iniz)
- [ ] MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM (Email gönderimi için)
- [ ] PAYTR_MERCHANT_ID, PAYTR_MERCHANT_SALT, PAYTR_MERCHANT_KEY (Ödeme için - eğer aktifse)
- [ ] CRON_SECRET (Teslimat hatırlatıcıları için)
- [ ] NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (Eğer Supabase kullanıyorsanız)
- [ ] SUPABASE_SERVICE_ROLE_KEY (Eğer Supabase admin işlemleri yapıyorsanız)
- [ ] NEXT_PUBLIC_MAPLIBRE_STYLE_URL (Harita için)
- [ ] ADMIN_USER_IDS (Admin paneli için - opsiyonel)

---

## 🔒 Güvenlik Notları

1. **ASLA** `SUPABASE_SERVICE_ROLE_KEY`'i client-side kodda kullanmayın
2. **JWT_SECRET** çok güçlü olmalı - production'da random string generator kullanın
3. Tüm secret'ları `.env` dosyasında saklamayın - Vercel Environment Variables kullanın
4. Her environment (Production, Preview, Development) için farklı değerler kullanabilirsiniz

---

## 🆘 Sorun Giderme

### "Database connection failed" hatası alıyorsanız:
- `DATABASE_URL` doğru formatta mı kontrol edin
- Supabase kullanıyorsanız, connection pooling için `?pgbouncer=true` ekleyin

### "JWT verification failed" hatası:
- `JWT_SECRET`'in production'da aynı olduğundan emin olun
- Secret key en az 32 karakter olmalı

### Email gönderim sorunları:
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE` değerlerini SMTP sağlayıcınıza göre ayarlayın
- Zoho için: `smtp.zoho.com`, port `587`, secure `false`
- Gmail için: `smtp.gmail.com`, port `587`, secure `false` (veya App Password kullanın)

### Cron job çalışmıyor:
- Vercel'de **Cron Jobs** bölümünden job'ı tanımlayın
- `Authorization: Bearer CRON_SECRET` header'ını ekleyin

