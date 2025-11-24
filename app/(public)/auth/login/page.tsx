'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // URL'den type ve redirect al
  const type = searchParams.get('type')
  const isBusiness = type === 'business'

  useEffect(() => {
    // Eğer zaten giriş yapılmışsa yönlendir
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const redirect = searchParams.get('redirect') || (isBusiness ? '/business/jobs' : '/account')
        router.push(redirect)
      }
    } catch (err) {
      // Giriş yapılmamış, sayfada kal
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Cookie'leri gönder
      })

      // Response tipini kontrol et
      const contentType = res.headers.get('content-type')
      
      let data
      if (!contentType || !contentType.includes('application/json')) {
        // JSON değilse text olarak oku
        const text = await res.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        
        // Eğer HTML dönüyorsa (muhtemelen error page)
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          setError('Sunucu hatası. Lütfen sayfayı yenileyin ve tekrar deneyin.')
        } else {
          setError(`Sunucu hatası: ${text.substring(0, 100)}`)
        }
        setLoading(false)
        return
      }

      try {
        data = await res.json()
      } catch (jsonError) {
        // JSON parse hatası
        console.error('JSON parse error:', jsonError)
        setError('Sunucu yanıtı beklenmedik formatta. Lütfen tekrar deneyin.')
        setLoading(false)
        return
      }

      if (!res.ok) {
        setError(data.error || 'E-posta veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.')
        setLoading(false)
        return
      }

      // Başarılı - yönlendir
      const redirect = searchParams.get('redirect') || (isBusiness ? '/business/jobs' : '/account')
      router.push(redirect)
      router.refresh() // Server component'leri yenile
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isBusiness ? 'Esnaf Girişi' : 'Giriş Yap'}</CardTitle>
          <CardDescription>
            {isBusiness ? (
              'Esnaf hesabınızla Mahallem iş panelinize giriş yapın.'
            ) : (
              <>
                Hesabınıza giriş yapın veya{' '}
                <Link href="/auth/register" className="text-primary hover:underline">
                  yeni hesap oluşturun
                </Link>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
                <div className="font-semibold mb-1">⚠️ Giriş Başarısız</div>
                <div className="text-red-600">{error}</div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">veya</span>
              </div>
            </div>
            <Link href="/auth/phone-login">
              <Button type="button" variant="outline" className="w-full">
                Telefon ile giriş yap
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

