/**
 * Email Test Script
 * 
 * Usage: node scripts/test-email.js <email_address>
 * 
 * Tests email sending functionality using the /api/test/email endpoint
 */

const email = process.argv[2]

if (!email) {
  console.error('❌ E-posta adresi gerekli!')
  console.error('Kullanım: node scripts/test-email.js <email_address>')
  process.exit(1)
}

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testEmail() {
  console.log('🧪 E-posta Test Başlatılıyor...\n')
  console.log(`📧 Test E-postası: ${email}`)
  console.log(`🌐 API URL: ${API_URL}\n`)

  try {
    // 1. Config kontrolü
    console.log('1️⃣  E-posta yapılandırmasını kontrol ediliyor...')
    const configResponse = await fetch(`${API_URL}/api/test/email`)
    const configData = await configResponse.json()
    
    console.log('📋 Yapılandırma Durumu:')
    console.log(JSON.stringify(configData, null, 2))
    console.log('')

    if (!configData.configured) {
      console.error('❌ E-posta yapılandırması eksik!')
      console.error('Lütfen .env dosyasına şu değişkenleri ekleyin:')
      console.error('  - MAIL_HOST')
      console.error('  - MAIL_PORT')
      console.error('  - MAIL_USER')
      console.error('  - MAIL_PASS')
      console.error('  - MAIL_SECURE (opsiyonel, true/false)')
      console.error('  - MAIL_FROM (opsiyonel)')
      process.exit(1)
    }

    // 2. Basit e-posta testi
    console.log('2️⃣  Basit test e-postası gönderiliyor...')
    const testResponse = await fetch(`${API_URL}/api/test/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        testType: 'simple',
      }),
    })

    const testData = await testResponse.json()
    
    if (testData.success) {
      console.log('✅ Test e-postası başarıyla gönderildi!')
      console.log(`📧 Alıcı: ${testData.test.to}`)
      console.log(`📬 Message ID: ${testData.test.messageId}`)
      console.log(`⏰ Zaman: ${testData.timestamp}`)
    } else {
      console.error('❌ E-posta gönderilemedi!')
      console.error('Hata:', testData.error)
      console.error('Detaylar:', testData.details)
      process.exit(1)
    }

    console.log('')

    // 3. OTP e-posta testi
    console.log('3️⃣  OTP e-postası gönderiliyor...')
    const otpResponse = await fetch(`${API_URL}/api/test/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        testType: 'otp',
      }),
    })

    const otpData = await otpResponse.json()
    
    if (otpData.success) {
      console.log('✅ OTP e-postası başarıyla gönderildi!')
      console.log(`📧 Alıcı: ${otpData.test.to}`)
      console.log(`🔐 Test Kodu: ${otpData.test.code}`)
      console.log(`⏰ Zaman: ${otpData.timestamp}`)
    } else {
      console.error('❌ OTP e-postası gönderilemedi!')
      console.error('Hata:', otpData.error)
      console.error('Detaylar:', otpData.details)
      process.exit(1)
    }

    console.log('')
    console.log('🎉 Tüm e-posta testleri başarıyla tamamlandı!')
    console.log('✅ E-posta sistemi çalışıyor.')
    console.log(`📬 ${email} adresine 2 test e-postası gönderildi.`)
    console.log('📧 Lütfen e-posta kutunuzu kontrol edin.')

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message)
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
      console.error('')
      console.error('💡 Development server çalışmıyor olabilir.')
      console.error('   Şu komutu çalıştırın: npm run dev')
    }
    process.exit(1)
  }
}

testEmail()

