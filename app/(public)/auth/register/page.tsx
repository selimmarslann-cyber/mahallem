'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Zap, Info, ArrowRight, UserPlus } from 'lucide-react'
import { useToast } from '@/lib/hooks/useToast'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success, error } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [refCode, setRefCode] = useState<string | null>(null)
  const [instantJobNotifications, setInstantJobNotifications] = useState(false)

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setRefCode(ref)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      const url = refCode 
        ? `/api/auth/register?ref=${refCode}`
        : '/api/auth/register'

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          instantJobNotifications 
        }),
        credentials: 'include',
      })

      const contentType = res.headers.get('content-type')
      let data
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text()
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          setErrorMessage('Kayıt yapılamadı. Lütfen sayfayı yenileyin.')
        } else {
          try {
            const parsed = JSON.parse(text)
            setErrorMessage(parsed.error || 'Kayıt yapılamadı.')
          } catch {
            setErrorMessage('Kayıt yapılamadı.')
          }
        }
        setLoading(false)
        return
      }

      try {
        data = await res.json()
      } catch (jsonError) {
        setErrorMessage('Kayıt yapılamadı.')
        setLoading(false)
        return
      }

      if (!res.ok) {
        // Detaylı hata mesajı göster
        const errorMsg = data.error || data.message || 'Kayıt başarısız.'
        setErrorMessage(errorMsg)
        // Development modunda detayları göster
        if (data.details && process.env.NODE_ENV === 'development') {
          console.error('Register error details:', data.details)
        }
        error(errorMsg) // Toast göster
        setLoading(false)
        return
      }

      success('Kayıt başarılı! Hoş geldiniz!')
      router.push('/account/profile')
      router.refresh()
    } catch (err: any) {
      console.error('Register error:', err)
      setErrorMessage(err.message || 'Kayıt yapılamadı.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-slate-200 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6000] flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Kayıt Ol</CardTitle>
            <CardDescription>
              Hizmetgo'e katılın ve mahallendeki esnaflarla buluşun. Zaten hesabınız var mı?{' '}
              <Link href="/auth/login" className="text-[#FF6000] hover:underline font-semibold">
                Giriş yapın
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border-2 border-red-200">
                  <div className="font-semibold mb-1">⚠️ Kayıt Başarısız</div>
                  <div className="text-red-600">{errorMessage}</div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-900 font-semibold">Ad Soyad</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Adınız Soyadınız"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 border-2 border-slate-200 focus:border-[#FF6000]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-900 font-semibold">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-2 border-slate-200 focus:border-[#FF6000]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-900 font-semibold">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12 border-2 border-slate-200 focus:border-[#FF6000]"
                />
              </div>

              {/* Anlık İşler Bildirimi */}
              <div className="space-y-3 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="instantJobNotifications" className="text-base font-semibold text-slate-900 cursor-pointer">
                        Anlık İşlerden Bildirim Al
                      </Label>
                      <Switch
                        id="instantJobNotifications"
                        checked={instantJobNotifications}
                        onCheckedChange={setInstantJobNotifications}
                      />
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      50 km çevredeki anlık işlerden bildirim al.
                    </p>
                    <div className="bg-white rounded-lg p-2 text-xs text-slate-500">
                      <p className="font-semibold mb-1">Örnekler:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>"Ödevimi yapacak birini arıyorum"</li>
                        <li>"Köpeğimi gezdirecek birini arıyorum"</li>
                      </ul>
                    </div>
                    <div className="mt-2 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Not:</strong> İstediğin zaman ayarlardan kapatabilirsin.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#FF6000] hover:bg-[#FF5500] text-white font-semibold" 
                disabled={loading}
              >
                {loading ? 'Kayıt yapılıyor...' : (
                  <>
                    Kayıt Ol
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Kayıt olarak{' '}
                <Link href="/legal/terms" className="text-[#FF6000] hover:underline">
                  Kullanıcı Sözleşmesi
                </Link>
                {' '}ve{' '}
                <Link href="/legal/privacy" className="text-[#FF6000] hover:underline">
                  Gizlilik Politikası
                </Link>
                'nı kabul etmiş olursunuz.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
