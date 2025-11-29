# 🔍 Bağlantı Test Rehberi

## Test Endpoint'i

Tüm bağlantıları test etmek için aşağıdaki endpoint'i kullanın:

```
GET http://localhost:3001/api/test/connections
```

## Test Edilen Bağlantılar

1. **Database (Prisma)** - PostgreSQL bağlantısı
2. **Supabase Client (Anon Key)** - Client-side Supabase bağlantısı
3. **Supabase Admin (Service Role)** - Server-side Supabase bağlantısı
4. **Email SMTP** - SMTP sunucu bağlantısı
5. **Groq API** - Groq AI API bağlantısı
6. **JWT Secrets** - JWT secret key'lerin varlığı ve uzunluğu
7. **App URL** - NEXT_PUBLIC_APP_URL yapılandırması
8. **Admin Credentials** - Admin kullanıcı bilgileri

## Test Sonuçları Formatı

```json
{
  "success": true,
  "summary": {
    "total": 8,
    "success": 8,
    "errors": 0
  },
  "results": [
    {
      "name": "Database (Prisma)",
      "status": "success",
      "message": "Database connection successful"
    },
    ...
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Hata Durumunda

Eğer bir bağlantı başarısız olursa, `details` alanında daha fazla bilgi bulunur:

```json
{
  "name": "Database (Prisma)",
  "status": "error",
  "message": "Database connection failed",
  "details": {
    "error": "...",
    "hasDatabaseUrl": true,
    "databaseUrlPrefix": "postgresql://postgres..."
  }
}
```

## Tarayıcıdan Test

1. Development server'ın çalıştığından emin olun: `npm run dev`
2. Tarayıcıda şu URL'yi açın: `http://localhost:3001/api/test/connections`
3. JSON sonuçlarını kontrol edin

## Terminal'den Test

```powershell
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3001/api/test/connections" | Select-Object -ExpandProperty Content
```

veya

```bash
# Bash
curl http://localhost:3001/api/test/connections
```

## Önemli Notlar

- ✅ `.env` dosyası değiştirilmez
- ✅ Sadece mevcut yapılandırmalar test edilir
- ✅ Hassas bilgiler (şifreler, key'ler) kısaltılarak gösterilir
- ✅ Tüm testler güvenli şekilde yapılır

---

**Son Güncelleme:** 2024

