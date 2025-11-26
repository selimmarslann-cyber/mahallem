import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/auth/auth'
import { signToken } from '@/lib/auth/jwt'
import { createMobileToken } from '@/lib/auth/mobileTokens'
import { buildReferralChainOnRegister } from '@/lib/services/referralService'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  instantJobNotifications: z.boolean().optional().default(false), // Anlık işlerden bildirim almak ister mi?
  ref: z.string().optional(), // Referral kodu (query param)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = registerSchema.parse(body)
    
    // Referral kodu query param'dan al
    const searchParams = request.nextUrl.searchParams
    const refCode = searchParams.get('ref') || validated.ref

    // E-posta kontrolü
    const existingUser = await getUserByEmail(validated.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      )
    }

    const user = await createUser({
      email: validated.email,
      password: validated.password,
      name: validated.name,
      instantJobNotifications: validated.instantJobNotifications || false,
    })

    // Referral chain oluştur (eğer ref kodu varsa)
    if (refCode) {
      try {
        await buildReferralChainOnRegister(user.id, refCode)
      } catch (refError) {
        // Referral hatası kayıt işlemini engellemez, sadece logla
        console.error('Referral chain oluşturma hatası:', refError)
      }
    } else {
      // Referral kodu yoksa sadece kendi kodunu oluştur
      try {
        const { getOrCreateReferralCodeForUser } = await import('@/lib/services/referralService')
        await getOrCreateReferralCodeForUser(user.id)
      } catch (refError) {
        console.error('Referral kodu oluşturma hatası:', refError)
      }
    }

    // Wallet oluştur
    try {
      await prisma.$executeRaw`
        INSERT INTO wallets (user_id, balance, updated_at)
        VALUES (${user.id}::uuid, 0, now())
        ON CONFLICT (user_id) DO NOTHING
      `
    } catch (walletError) {
      console.error('Wallet oluşturma hatası:', walletError)
      // Wallet hatası kayıt işlemini engellemez
    }

    // JWT token oluştur (web cookie için)
    const token = signToken({
      userId: user.id,
      email: user.email,
    })

    // Mobile token oluştur (Bearer token için)
    let mobileToken: string | undefined
    try {
      mobileToken = createMobileToken(user.id, user.email)
    } catch (mobileTokenError) {
      console.error('Mobile token creation error:', mobileTokenError)
      // Mobile token hatası kritik değil, web cookie ile devam edebilir
    }

    // Response oluştur
    const responseData: {
      user: {
        id: string
        email: string
        name: string
      }
      sessionToken?: string
    } = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }

    // Mobile token varsa response'a ekle
    if (mobileToken) {
      responseData.sessionToken = mobileToken
    }

    const response = NextResponse.json(responseData, { status: 201 })

    // HTTP-only cookie olarak set et (web için)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/',
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Kayıt işlemi başarısız' },
      { status: 500 }
    )
  }
}

