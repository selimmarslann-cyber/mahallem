import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/auth/auth'
import { getOrCreateReferralCodeForUser } from '@/lib/services/referralService'
import { prisma } from '@/lib/db/prisma'

// Basit admin kontrolü (ileride gerçek auth eklenebilir)
const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(',') || []

export async function POST(request: NextRequest) {
  try {
    // TODO: Gerçek admin kontrolü ekle
    // const userId = await getUserId()
    // if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const { email = 'admin@admin.com', password = 'admin', name = 'admin' } = body

    // Mevcut kullanıcıyı kontrol et
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      // Referral kodu varsa al
      const referralCode = await prisma.referralCode.findUnique({
        where: { userId: existingUser.id },
      })

      return NextResponse.json({
        message: 'Kullanıcı zaten mevcut',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          referralCode: referralCode?.code || null,
        },
      })
    }

    // Kullanıcıyı oluştur
    const user = await createUser({
      email,
      password,
      name,
    })

    // Referral kodu oluştur
    const referralCode = await getOrCreateReferralCodeForUser(user.id)

    // Wallet oluştur
    await prisma.wallet.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        balance: 0,
        pendingBalance: 0,
      },
      update: {},
    })

    return NextResponse.json({
      message: 'Test kullanıcısı oluşturuldu',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        referralCode,
      },
      loginInfo: {
        email,
        password,
      },
    })
  } catch (error: any) {
    console.error('Create test user error:', error)
    return NextResponse.json(
      { error: error.message || 'Kullanıcı oluşturulamadı' },
      { status: 500 }
    )
  }
}

