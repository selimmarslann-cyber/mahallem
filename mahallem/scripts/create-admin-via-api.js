/**
 * Admin kullanıcısı oluştur: admin@admin.com (API endpoint kullanarak)
 * 
 * Kullanım:
 * node scripts/create-admin-via-api.js
 */

const fetch = require('node-fetch')

async function createAdminUser() {
  try {
    const email = 'admin@admin.com'
    const password = 'admin'
    const name = 'admin'

    console.log('🔄 Admin kullanıcısı oluşturuluyor...')
    console.log('  Email:', email)
    console.log('  Şifre:', password)
    console.log('  İsim:', name)

    // API endpoint'ini çağır
    const response = await fetch('http://localhost:3000/api/admin/create-test-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Hata:', data.error || 'Bilinmeyen hata')
      process.exit(1)
    }

    console.log('\n✅ Admin kullanıcısı oluşturuldu!')
    console.log('  ID:', data.user.id)
    console.log('  Email:', data.user.email)
    console.log('  İsim:', data.user.name)
    if (data.user.referralCode) {
      console.log('  Referral Kodu:', data.user.referralCode)
    }
    console.log('\n🎉 Giriş bilgileri:')
    console.log('  Email:', email)
    console.log('  Şifre:', password)

    return data
  } catch (error) {
    console.error('❌ Hata:', error.message)
    console.error('\n💡 İpucu: Uygulama çalışıyor olmalı (npm run dev)')
    process.exit(1)
  }
}

// Script doğrudan çalıştırılıyorsa
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('\n✅ Tamamlandı!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Hata:', error)
      process.exit(1)
    })
}

module.exports = { createAdminUser }

