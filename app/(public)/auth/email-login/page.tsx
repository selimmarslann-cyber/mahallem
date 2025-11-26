'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/lib/hooks/useToast'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'

export default function EmailLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success, error } = useToast()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      error('Lütfen e-posta adresinizi girin')
      return
    }

    setSendingCode(true)
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        error(data.error || 'Kod gönderilemedi')
        return
      }

      success('Doğrulama kodu e-posta adresinize gönderildi')
      setStep('code')
      
      // Development mode'da kodu göster
      if (data.mockCode) {
        console.log('Development OTP Code:', data.mockCode)
      }
    } catch (err) {
      error('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) {
      error('Lütfen 6 haneli kodu girin')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        error(data.error || 'Kod doğrulanamadı')
        return
      }

      success('Giriş başarılı!')
      const redirect = searchParams.get('redirect') || '/account'
      router.push(redirect)
    } catch (err) {
      error('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6000] via-[#FF5500] to-[#FF4500] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-[#FF6000] rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">E-posta ile Giriş</CardTitle>
            <CardDescription>
              {step === 'email' 
                ? 'E-posta adresinize doğrulama kodu göndereceğiz'
                : 'E-posta adresinize gönderilen 6 haneli kodu girin'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'email' ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresi</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={sendingCode}
                    className="h-12"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#FF6000] hover:bg-[#FF5500] text-white h-12"
                  disabled={sendingCode}
                >
                  {sendingCode ? 'Gönderiliyor...' : 'Kodu Gönder'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm text-slate-600 hover:text-[#FF6000] inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Şifre ile giriş yap
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Doğrulama Kodu</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    disabled={loading}
                    className="h-12 text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                  />
                  <p className="text-xs text-slate-500 text-center">
                    {email} adresine gönderilen kodu girin
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#FF6000] hover:bg-[#FF5500] text-white h-12"
                  disabled={loading || code.length !== 6}
                >
                  {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email')
                      setCode('')
                    }}
                    className="text-sm text-slate-600 hover:text-[#FF6000]"
                  >
                    Farklı e-posta kullan
                  </button>
                  <div>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      className="text-sm text-[#FF6000] hover:underline"
                      disabled={sendingCode}
                    >
                      Kodu tekrar gönder
                    </button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

