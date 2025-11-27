# Kullanıcı Giriş Bilgileri

## Test Kullanıcısı

**E-posta:** selim@selim.com  
**Şifre:** selimarslan

## Kullanıcı Oluşturma

Kullanıcıyı oluşturmak için:

1. Next.js dev server'ının çalıştığından emin olun: `npm run dev`
2. Register API endpoint'ini kullanarak kullanıcı oluşturun:

```bash
# PowerShell
Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -ContentType 'application/json' -Body '{\"email\":\"selim@selim.com\",\"password\":\"selimarslan\",\"name\":\"Selim Arslan\"}'
```

Veya doğrudan register sayfasından kayıt olun: http://localhost:3000/auth/register

## Giriş Sayfası

http://localhost:3000/auth/login

## Not

Eğer kullanıcı zaten mevcutsa, yukarıdaki bilgilerle giriş yapabilirsiniz.

