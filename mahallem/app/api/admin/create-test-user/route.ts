import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/auth/auth'
import { getOrCreateReferralCodeForUser } from '@/lib/services/referralService'
import { prisma } from '@/lib/db/prisma'

// Basit admin kontrolü (ileride gerçek auth eklenebilir)
const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(',') || []

export async function POST(request: NextRequest) {
  try {
    // Admin kontrolü
    const { getUserId } = await import('@/lib/auth/session')
    const userId = await getUserId(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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
    const newUser = await createUser({
      email,
      password,
      name,
    })

    // Referral kodu oluştur
    const referralCode = await getOrCreateReferralCodeForUser(newUser.id)

    // Wallet oluştur
    await prisma.wallet.upsert({
      where: { userId: newUser.id },
      create: {
        userId: newUser.id,
        balance: 0,
        pendingBalance: 0,
      },
      update: {},
    })

    return NextResponse.json({
      message: 'Test kullanıcısı oluşturuldu',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
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

