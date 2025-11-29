'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LocalWarning, { INITIAL_WARNING } from './LocalWarning'
import { SUCCESS_MESSAGE } from '@/lib/ai/manual-mode'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/hooks/useToast'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  isLocal?: boolean
}

interface AIChatBoxProps {
  userId: string
}

export default function AIChatBox({ userId }: AIChatBoxProps) {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [showInitialWarning, setShowInitialWarning] = useState(true)
  const [localWarning, setLocalWarning] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isManualMode, setIsManualMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // İlk uyarıyı göster
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialWarning(false)
    }, 5000) // 5 saniye sonra kaybolur

    return () => clearTimeout(timer)
  }, [])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLocalWarning(null)

    // Kullanıcı mesajını ekle
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // İlk mesaj kontrolü
      const isFirstMessage = messages.length === 0
      const action = isFirstMessage ? 'initial' : isComplete ? 'confirm' : 'message'

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          message: userMessage,
          sessionId,
          action,
        }),
      })

      const data = await response.json()

      if (response.status === 403) {
        // Ban durumu
        setLocalWarning(data.message || 'Bu alan sohbet için değildir. 30 dakika sonra tekrar deneyin.')
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu')
      }

      // Session ID'yi kaydet
      if (data.sessionId) {
        setSessionId(data.sessionId)
      }

      // Local mesaj varsa göster (token yemez)
      if (data.localMessage) {
        setLocalWarning(data.localMessage)
        if (data.shouldSwitchToManual) {
          setIsManualMode(true)
        }
      }

      // İlk mesajda ilerleme yoksa
      if (data.action === 'initial' && !data.shouldProceed) {
        setLoading(false)
        return
      }

      // AI cevabını ekle
      if (data.aiResponse) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.aiResponse }])
      }

      // Tamamlandı mı?
      if (data.isComplete) {
        setIsComplete(true)
      }

      // İlan onayı
      if (action === 'confirm' && data.success && data.listingData) {
        // İlanı oluştur
        await createListing(data.listingData)
      }
    } catch (err: any) {
      console.error('AI chat error:', err)
      setLocalWarning('Bir hata oluştu. Lütfen tekrar deneyin.')
      showError(err.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const createListing = async (listingData: any) => {
    try {
      const response = await fetch('/api/ai/create-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          listingData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'İlan oluşturulamadı')
      }

      // Başarı mesajı göster (local)
      setLocalWarning(SUCCESS_MESSAGE)
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: SUCCESS_MESSAGE,
          isLocal: true,
        },
      ])

      success('İlan başarıyla oluşturuldu!')

      // "Tamam" bekleniyor
      setIsComplete(false)
      setIsManualMode(false)
    } catch (err: any) {
      console.error('Create listing error:', err)
      showError(err.message || 'İlan oluşturulamadı')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleConfirmRedirect = async () => {
    const message = input.trim().toLowerCase()
    if (message === 'tamam' || message === 'ok' || message === 'tamamdır') {
      router.push('/jobs') // İlanlarım sayfası
    } else if (message) {
      // Normal mesaj olarak gönder
      await handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-900">Hizmet Talebi Oluştur</h3>
        <p className="text-sm text-slate-600">AI asistanımız size yardımcı olacak</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* İlk uyarı (local) */}
        {showInitialWarning && (
          <LocalWarning message={INITIAL_WARNING} type="info" />
        )}

        {/* Local uyarı mesajları */}
        {localWarning && (
          <LocalWarning
            message={localWarning}
            type={isManualMode || localWarning.includes('sohbet') ? 'error' : 'warning'}
          />
        )}

        {/* Mesajlar */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-brand-500 text-white'
                  : msg.role === 'system'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-slate-100 text-slate-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        {localWarning?.includes('İlanınız başarıyla oluşturuldu') ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              "Tamam" yazarak İlanlarım sayfasına gidebilirsiniz.
            </p>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleConfirmRedirect}
                placeholder="Tamam yazın..."
                className="flex-1"
              />
              <Button
                onClick={handleConfirmRedirect}
                disabled={loading || !input.trim()}
                className="bg-brand-500 hover:bg-brand-600"
              >
                {input.trim().toLowerCase() === 'tamam' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isManualMode
                  ? 'İlanınızı yazın...'
                  : isComplete
                    ? 'Evet veya Hayır yazın...'
                    : 'Mesajınızı yazın...'
              }
              disabled={loading || isManualMode}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim() || isManualMode}
              className="bg-brand-500 hover:bg-brand-600"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

