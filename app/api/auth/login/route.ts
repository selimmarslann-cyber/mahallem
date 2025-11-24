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
    // Request body'yi parse et
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Geçersiz istek formatı' },
        { status: 400 }
      )
    }

    const validated = loginSchema.parse(body)

    // Kullanıcıyı bul
    let user
    try {
      user = await verifyUser(validated.email, validated.password)
    } catch (dbError) {
      console.error('Database error during login:', dbError)
      return NextResponse.json(
        { error: 'Veritabanı bağlantı hatası. Lütfen tekrar deneyin.' },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.' },
        { status: 401 }
      )
    }

    // Kullanıcının şifresi yoksa (OTP ile kayıt olmuşsa)
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'Bu hesap telefon numarası ile kayıtlı. Lütfen telefon ile giriş yapın.' },
        { status: 401 }
      )
    }

    // JWT token oluştur
    let token
    try {
      token = signToken({
        userId: user.id,
        email: user.email,
      })
    } catch (tokenError) {
      console.error('Token creation error:', tokenError)
      return NextResponse.json(
        { error: 'Oturum oluşturulamadı. Lütfen tekrar deneyin.' },
        { status: 500 }
      )
    }

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
    
    // Daha detaylı hata mesajı
    const errorMessage = error instanceof Error 
      ? `Giriş işlemi başarısız: ${error.message}`
      : 'Giriş işlemi başarısız. Lütfen tekrar deneyin.'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

