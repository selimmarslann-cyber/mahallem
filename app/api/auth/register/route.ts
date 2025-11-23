import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/auth/auth'
import { signToken } from '@/lib/auth/jwt'
import { buildReferralChainOnRegister } from '@/lib/services/referralService'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
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

    const user = await createUser(validated)

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

    // JWT token oluştur
    const token = signToken({
      userId: user.id,
      email: user.email,
    })

    // HTTP-only cookie olarak set et
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )

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

