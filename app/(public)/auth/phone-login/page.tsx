'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function PhoneLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [countdown, setCountdown] = useState(0)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Telefon numarası validasyonu
    const cleanedPhone = phoneNumber.replace(/\D/g, '')
    if (cleanedPhone.length < 10) {
      setError('Lütfen geçerli bir telefon numarası girin')
      return
    }

    setIsSending(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanedPhone }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Kod gönderilemedi')
        return
      }

      setSuccess('Kod gönderildi! SMS\'inizi kontrol edin.')
      setStep('code')
      setCountdown(60) // 60 saniye geri sayım
      
      // Geri sayım
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setIsSending(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (verificationCode.length !== 6) {
      setError('Lütfen 6 haneli kodu girin')
      return
    }

    setIsVerifying(true)
    try {
      const cleanedPhone = phoneNumber.replace(/\D/g, '')
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: cleanedPhone, 
          code: verificationCode 
        }),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Kod doğrulanamadı')
        return
      }

      // Başarılı - yönlendir
      const redirect = searchParams.get('redirect') || '/account'
      router.push(redirect)
      router.refresh()
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return
    
    setError('')
    setSuccess('')
    const cleanedPhone = phoneNumber.replace(/\D/g, '')
    
    setIsSending(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanedPhone }),
      })

      if (res.ok) {
        setSuccess('Kod tekrar gönderildi!')
        setCountdown(60)
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        const data = await res.json()
        setError(data.error || 'Kod gönderilemedi')
      }
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <CardTitle className="flex-1">Telefon ile Giriş</CardTitle>
          </div>
          <CardDescription>
            {step === 'phone' 
              ? 'Telefon numaranızı girin, size tek kullanımlık giriş kodu gönderelim.'
              : 'SMS ile gönderilen 6 haneli kodu girin.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon Numarası</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+90 5XX XXX XX XX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Numaranıza tek kullanımlık giriş kodu göndereceğiz.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isSending}>
                {isSending ? 'Kod gönderiliyor...' : 'Kod Gönder'}
              </Button>
              <div className="text-center text-sm text-gray-600">
                <Link href="/auth/login" className="text-primary hover:underline">
                  E-posta ile giriş yap
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {success}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="code">Doğrulama Kodu</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setVerificationCode(value)
                  }}
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 text-center">
                  {phoneNumber} numarasına gönderilen kodu girin
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? 'Doğrulanıyor...' : 'Kodu Doğrula ve Giriş Yap'}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                  className="text-sm text-primary hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0 
                    ? `Kodu tekrar gönder (${countdown}s)`
                    : 'Kodu tekrar gönder'}
                </button>
              </div>
              <div className="text-center text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone')
                    setVerificationCode('')
                    setError('')
                    setSuccess('')
                  }}
                  className="text-primary hover:underline"
                >
                  Telefon numarasını değiştir
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

