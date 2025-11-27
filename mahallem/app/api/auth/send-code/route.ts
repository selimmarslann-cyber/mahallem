/**
 * Send OTP Code via Email
 * 
 * POST /api/auth/send-code
 * Sends a 6-digit OTP code to the provided email address
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import { sendOtpEmail } from '@/lib/mail'

const sendCodeSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = sendCodeSchema.parse(body)

    // 6-digit OTP code oluştur
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Expiration: 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // Eski OTP'leri temizle (kullanılmamış ve süresi dolmuş)
    await prisma.otp.deleteMany({
      where: {
        email: validated.email,
        OR: [
          { used: true },
          { expiresAt: { lt: new Date() } },
        ],
      },
    })

    // Yeni OTP kaydet
    await prisma.otp.create({
      data: {
        email: validated.email,
        code,
        expiresAt,
        used: false,
      },
    })

    // Email gönder
    try {
      await sendOtpEmail(validated.email, code)
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // OTP'yi sil (email gönderilemediyse)
      await prisma.otp.deleteMany({
        where: {
          email: validated.email,
          code,
        },
      })
      return NextResponse.json(
        { error: 'E-posta gönderilemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Doğrulama kodu e-posta adresinize gönderildi.',
      // Development için kod döndürülüyor, production'da kaldırılmalı
      ...(process.env.NODE_ENV === 'development' && { mockCode: code }),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Send code error:', error)
    return NextResponse.json(
      { error: 'Kod gönderilemedi' },
      { status: 500 }
    )
  }
}

