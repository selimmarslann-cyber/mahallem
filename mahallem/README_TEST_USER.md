# Test Kullanıcısı Oluşturma: selimarslan

Test kullanıcısı oluşturmak için 3 yöntem var:

## Yöntem 1: API Endpoint (Önerilen)

Eğer development server çalışıyorsa:

```bash
curl -X POST http://localhost:3000/api/admin/create-test-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "selimarslan@mahallem.test",
    "password": "selimarslan",
    "name": "Selim Arslan"
  }'
```

Veya browser'da Postman/Thunder Client ile:
- URL: `POST http://localhost:3000/api/admin/create-test-user`
- Body (JSON):
```json
{
  "email": "selimarslan@mahallem.test",
  "password": "selimarslan",
  "name": "Selim Arslan"
}
```

## Yöntem 2: Node.js Script

```bash
# Önce Prisma client'ı generate et
npm run db:generate

# Sonra script'i çalıştır
npm run create-test-user
```

## Yöntem 3: SQL Script (Supabase)

1. Supabase Dashboard → SQL Editor'e git
2. `scripts/create-test-user.sql` dosyasını aç
3. **ÖNEMLİ**: Şifre hash'ini güncelle:
   - Online bcrypt generator kullan: https://bcrypt-generator.com/
   - Şifre: `selimarslan`
   - Rounds: `10`
   - Oluşan hash'i SQL script'teki `$2a$10$...` kısmına yapıştır
4. Script'i çalıştır

## Giriş Bilgileri

Oluşturulduktan sonra:

- **Email**: `selimarslan@mahallem.test`
- **Şifre**: `selimarslan`
- **İsim**: `Selim Arslan`

## Giriş Yapma

1. `http://localhost:3000/auth/login` adresine git
2. Email: `selimarslan@mahallem.test`
3. Şifre: `selimarslan`
4. Giriş yap

## Notlar

- Kullanıcı zaten varsa, mevcut bilgileri döndürür
- Referral kodu otomatik oluşturulur
- Wallet otomatik oluşturulur (bakiye: 0)
- Referral rank: 0 (Normal kullanıcı)

