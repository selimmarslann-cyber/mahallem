const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSelimUser() {
  try {
    const email = 'selim@selim.com'
    const password = 'selimarslan'
    const name = 'Selim Arslan'

    // Mevcut kullanıcıyı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('✅ Kullanıcı zaten mevcut:')
      console.log({
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      })
      console.log('\n📧 Giriş Bilgileri:')
      console.log(`E-posta: ${email}`)
      console.log(`Şifre: ${password}`)
      return
    }

    // Şifreyi hashle
    const passwordHash = await bcrypt.hash(password, 10)

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        instantJobNotifications: false,
      },
    })

    console.log('✅ Kullanıcı başarıyla oluşturuldu:')
    console.log({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    // Referral kodu oluştur
    try {
      const referralCode = await prisma.referralCode.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          code: `MAH${user.id.slice(-8).toUpperCase()}`,
        },
      })
      console.log(`✅ Referral kodu: ${referralCode.code}`)
    } catch (refError) {
      console.log('⚠️ Referral kodu oluşturulamadı:', refError.message)
    }

    // Wallet oluştur
    try {
      await prisma.$executeRaw`
        INSERT INTO wallets (user_id, balance, updated_at)
        VALUES (${user.id}::uuid, 0, now())
        ON CONFLICT (user_id) DO NOTHING
      `
      console.log('✅ Wallet oluşturuldu')
    } catch (walletError) {
      console.log('⚠️ Wallet oluşturulamadı:', walletError.message)
    }

    console.log('\n📧 Giriş Bilgileri:')
    console.log(`E-posta: ${email}`)
    console.log(`Şifre: ${password}`)
    console.log('\n🌐 Giriş sayfası: http://localhost:3000/auth/login')
  } catch (error) {
    console.error('❌ Hata:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createSelimUser()

