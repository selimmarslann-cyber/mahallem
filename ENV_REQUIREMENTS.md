# 🔐 Environment Variables (.env) Gereksinimleri

**ÖNEMLİ:** Tüm yapılandırmalar `.env` dosyasından alınır. Default değerler yoktur. `.env` dosyasındaki tüm değişkenler zorunludur.

## 📋 Zorunlu Environment Variables

### Database Configuration
```env
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
```

### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb-publishable-XXXX
SUPABASE_SERVICE_ROLE_KEY=sb-secret-XXXX
```

### JWT Secrets
```env
JWT_SECRET=your-secret-key-min-32-characters
MOBILE_JWT_SECRET=your-mobile-secret-key-min-32-characters
```

### Application Configuration
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_NAME=HizmetGo
NODE_ENV=development
```

### Email Configuration (SMTP)
```env
MAIL_HOST=smtp.zoho.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=noreply@yourdomain.com
MAIL_PASS=your-app-password
MAIL_FROM=Hizmetgo <noreply@yourdomain.com>
```

### Groq AI Configuration
```env
GROQ_API_KEY=your-groq-api-key
```

### Admin Configuration
```env
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
ADMIN_EMAIL=admin@hizmetgo.app
ADMIN_NAME=Admin
ADMIN_USER_IDS=user-id-1,user-id-2  # Opsiyonel, virgülle ayrılmış
```

## ⚠️ Önemli Notlar

1. **Tüm değişkenler zorunludur** - Default değerler yoktur
2. **`.env` dosyası proje kök dizininde olmalıdır**
3. **`.env` dosyası git'e commit edilmemelidir** (`.gitignore`'da olmalı)
4. **Production'da** Vercel Environment Variables kullanın
5. **Şifreler ve secret key'ler** güçlü ve rastgele olmalıdır

## 🔍 Kontrol

`.env` dosyanızı kontrol etmek için:

```powershell
# PowerShell'de:
Get-Content .env | Select-String -Pattern "^[A-Z_]+="
```

## 📝 Örnek .env Dosyası

```env
# Database
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.xxx:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb-publishable-xxxx
SUPABASE_SERVICE_ROLE_KEY=sb-secret-xxxx

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-in-production
MOBILE_JWT_SECRET=your-mobile-secret-key-min-32-characters-change-in-production

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_NAME=HizmetGo
NODE_ENV=development

# Email
MAIL_HOST=smtp.zoho.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=noreply@yourdomain.com
MAIL_PASS=your-app-password
MAIL_FROM=Hizmetgo <noreply@yourdomain.com>

# Groq
GROQ_API_KEY=your-groq-api-key

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
ADMIN_EMAIL=admin@hizmetgo.app
ADMIN_NAME=Admin
```

---

**Son Güncelleme:** 2024

