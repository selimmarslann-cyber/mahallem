import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '@/lib/auth/auth'
import { signToken } from '@/lib/auth/jwt'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(1, 'Şifre gerekli'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = loginSchema.parse(body)

    const user = await verifyUser(validated.email, validated.password)
    if (!user) {
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı' },
        { status: 401 }
      )
    }

    // JWT token oluştur
    const token = signToken({
      userId: user.id,
      email: user.email,
    })

    // HTTP-only cookie olarak set et
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
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

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Giriş işlemi başarısız' },
      { status: 500 }
    )
  }
}

