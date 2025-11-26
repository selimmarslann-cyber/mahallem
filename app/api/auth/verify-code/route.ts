/**
 * Verify OTP Code
 * 
 * POST /api/auth/verify-code
 * Verifies the OTP code and logs in or creates the user
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { signToken } from '@/lib/auth/jwt'
import { prisma } from '@/lib/db/prisma'
import { getOrCreateReferralCodeForUser } from '@/lib/services/referralService'

const verifyCodeSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  code: z.string().length(6, 'Kod 6 haneli olmalı'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = verifyCodeSchema.parse(body)

    // OTP'yi bul
    const otp = await prisma.otp.findFirst({
      where: {
        email: validated.email,
        code: validated.code,
        used: false,
        expiresAt: {
          gt: new Date(), // Süresi dolmamış
        },
      },
      orderBy: {
        createdAt: 'desc', // En son oluşturulan
      },
    })

    if (!otp) {
      return NextResponse.json(
        { error: 'Geçersiz kod veya kod süresi dolmuş' },
        { status: 400 }
      )
    }

    // OTP'yi kullanıldı olarak işaretle
    await prisma.otp.update({
      where: { id: otp.id },
      data: { used: true },
    })

    // Kullanıcıyı bul veya oluştur
    let user = await prisma.user.findUnique({
      where: {
        email: validated.email,
      },
    })

    if (!user) {
      // Yeni kullanıcı oluştur
      user = await prisma.user.create({
        data: {
          email: validated.email,
          name: validated.email.split('@')[0], // Email'in @ öncesi kısmı
          passwordHash: null, // OTP ile giriş, şifre yok
        },
      })

      // Referral kodu oluştur
      try {
        await getOrCreateReferralCodeForUser(user.id)
      } catch (refError) {
        console.error('Referral kodu oluşturma hatası:', refError)
      }
    }

    // JWT token oluştur
    const token = signToken({
      userId: user.id,
      email: user.email || '',
    })

    // HTTP-only cookie olarak set et
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    })

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

    console.error('Verify code error:', error)
    return NextResponse.json(
      { error: 'Kod doğrulanamadı' },
      { status: 500 }
    )
  }
}

