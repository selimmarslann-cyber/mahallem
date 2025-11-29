// Bu script register API endpoint'ini kullanarak kullanıcı oluşturur
// Next.js dev server'ının çalışıyor olması gerekir

const http = require('http')

const postData = JSON.stringify({
  email: 'selim@selim.com',
  password: 'selimarslan',
  name: 'Selim Arslan',
  instantJobNotifications: false,
})

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
}

const req = http.request(options, (res) => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    try {
      const response = JSON.parse(data)
      if (res.statusCode === 201) {
        console.log('✅ Kullanıcı başarıyla oluşturuldu!')
        console.log('📧 Giriş Bilgileri:')
        console.log(`E-posta: selim@selim.com`)
        console.log(`Şifre: selimarslan`)
        console.log('\n🌐 Giriş sayfası: http://localhost:3000/auth/login')
      } else if (res.statusCode === 400 && response.error?.includes('zaten kullanılıyor')) {
        console.log('ℹ️ Kullanıcı zaten mevcut!')
        console.log('📧 Giriş Bilgileri:')
        console.log(`E-posta: selim@selim.com`)
        console.log(`Şifre: selimarslan`)
        console.log('\n🌐 Giriş sayfası: http://localhost:3000/auth/login')
      } else {
        console.error('❌ Hata:', response.error || data)
        console.log('Status Code:', res.statusCode)
      }
    } catch (e) {
      console.error('❌ Yanıt parse edilemedi:', data)
    }
  })
})

req.on('error', (e) => {
  console.error('❌ İstek hatası:', e.message)
  console.log('\n💡 Lütfen Next.js dev server\'ının çalıştığından emin olun:')
  console.log('   npm run dev')
})

req.write(postData)
req.end()

