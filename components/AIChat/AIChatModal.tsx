'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LocalWarning, { INITIAL_WARNING } from './LocalWarning'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/hooks/useToast'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  isLocal?: boolean
}

interface AIChatModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  initialCategory?: string // Arama barından gelen kategori
}

export default function AIChatModal({
  isOpen,
  onClose,
  userId,
  initialCategory,
}: AIChatModalProps) {
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
  const [hasStarted, setHasStarted] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Kullanıcı bilgisini al (isim için)
  useEffect(() => {
    if (isOpen && userId && !userName) {
      const fetchUser = async () => {
        try {
          const res = await fetch('/api/auth/me', { credentials: 'include' })
          if (res.ok) {
            const data = await res.json()
            if (data.user?.name) {
              setUserName(data.user.name)
            }
          }
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      }
      fetchUser()
    }
  }, [isOpen, userId, userName])

  // Modal açıldığında ve kategori varsa otomatik mesaj göster (Groq API çağrısı yapmadan)
  useEffect(() => {
    if (isOpen && initialCategory && !hasStarted && userName !== null) {
      setHasStarted(true)
      // Kısa bir gecikme ile otomatik mesaj göster
      setTimeout(() => {
        console.log('AIChatModal: Showing initial welcome message:', initialCategory)
        handleInitialCategoryMessage(initialCategory)
      }, 500)
    }
  }, [isOpen, initialCategory, hasStarted, userName])

  // Modal kapandığında state'i sıfırla
  useEffect(() => {
    if (!isOpen) {
      setMessages([])
      setInput('')
      setSessionId(null)
      setShowInitialWarning(true)
      setLocalWarning(null)
      setIsComplete(false)
      setIsManualMode(false)
      setHasStarted(false)
      setUserName(null)
    }
  }, [isOpen])

  // İlk uyarıyı göster
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowInitialWarning(false)
      }, 5000) // 5 saniye sonra kaybolur

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleInitialCategoryMessage = (category: string) => {
    // Kullanıcı mesajını ekle (kategori)
    const categoryMessage = category
    setInput('')
    setLocalWarning(null)

    // Kullanıcı mesajını ekle
    setMessages((prev) => [{ role: 'user', content: categoryMessage }])

    // Otomatik hoş geldin mesajını oluştur (Groq API çağrısı YOK - maliyet tasarrufu)
    const userNameDisplay = userName || 'Değerli'
    const welcomeMessage = `Merhaba ${userNameDisplay} bey, platformumuza hoşgeldiniz! Yapay zeka asistanımız size yardımcı olacak. Unutmayınız ki bu bir sohbet aracı değildir, olabildiğince kısa ve anlaşılır şekilde ilerleyerek ilanınızı birlikte oluşturacağız. ${category} kategorisiyle ilgili ne tür bir hizmete ihtiyacınız var? Lütfen detaylarıyla belirtin.`

    // Otomatik mesajı ekle (assistant rolünde)
    setMessages((prev) => [...prev, { role: 'assistant', content: welcomeMessage }])

    // Session ID oluştur (sonraki mesajlarda Groq kullanılacak)
    const currentSessionId = `${userId}-${Date.now()}`
    setSessionId(currentSessionId)
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLocalWarning(null)

    // Kullanıcı mesajını ekle
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // İlk mesaj kontrolü - otomatik mesajdan sonra gelen ilk kullanıcı mesajı
      // Otomatik mesajlar zaten eklenmiş, bu yüzden messages.length > 0 olabilir
      // Ama sessionId yoksa bu ilk gerçek kullanıcı mesajıdır
      const isFirstUserMessage = !sessionId
      const action = isFirstUserMessage ? 'initial' : isComplete ? 'confirm' : 'message'

      // Fetch with timeout (70 saniye - API timeout'undan biraz fazla)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 70000) // 70 saniye timeout

      let response: Response
      try {
        response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            message: userMessage,
            sessionId,
            action,
            initialCategory: isFirstUserMessage ? initialCategory : undefined, // İlk mesajda kategori bilgisini gönder
          }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.')
        }
        throw fetchError
      }

      const data = await response.json()

      if (response.status === 403) {
        // Ban durumu
        setLocalWarning(
          data.message || 'Bu alan sohbet için değildir. 30 dakika sonra tekrar deneyin.'
        )
        setLoading(false)
        return
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.'
        console.error('API error:', { status: response.status, data })
        throw new Error(errorMessage)
      }

      // Session ID'yi kaydet
      if (data.sessionId) {
        setSessionId(data.sessionId)
      }

      // Local mesaj varsa göster
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
        // Eğer thankYouMessage varsa, onu da ekle (3-5 saniye arası rastgele)
        if (data.thankYouMessage) {
          const delay = Math.random() * 2000 + 3000 // 3000-5000ms arası (3-5 saniye)
          setTimeout(() => {
            setMessages((prev) => [...prev, { role: 'assistant', content: data.thankYouMessage }])
          }, delay)
        }
      }

      // İlan onayı
      if (action === 'confirm' && data.success && data.listingData) {
        // İlanı oluştur ve detay sayfasına yönlendir
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
      // Eğer generate-listing için bilgiler varsa, önce profesyonel ilan metni oluştur
      let finalDescription = listingData.description || listingData.finalDescription || ''
      
      if (listingData.category && listingData.location) {
        try {
          const generateResponse = await fetch('/api/generate-listing', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              category: listingData.category || 'genel',
              location: listingData.location || 'belirtilmemiş',
              area: listingData.area || 'belirtilmemiş',
              budget: listingData.budget || 'belirtilmemiş',
              urgency: listingData.urgency || 'esnek',
              details: listingData.details || listingData.description || 'belirtilmemiş',
            }),
          })

          const generateData = await generateResponse.json()
          if (generateData.success && generateData.listingText) {
            finalDescription = generateData.listingText
          }
        } catch (generateError) {
          console.error('Generate listing error:', generateError)
          // Hata durumunda mevcut description'ı kullan
        }
      }

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: finalDescription,
          title: listingData.title || finalDescription.substring(0, 30), // İlk 30 karakter başlık
          raw_description: listingData.rawDescription || '',
          city: listingData.city || '',
          district: listingData.district || '',
          address: listingData.address || '',
          date: listingData.date || 'esnek',
          priority: listingData.priority || 'normal',
          price_range: listingData.price_range || '',
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'İlan oluşturulamadı')
      }

      // İlan başarıyla oluşturuldu - 5 saniye sonra detay sayfasına yönlendir
      setLocalWarning('İlanınız oluşturuldu! 5 saniye içinde detay sayfasına yönlendiriliyorsunuz...')

      // 5 saniye bekle, sonra ilan detay sayfasına yönlendir
      setTimeout(() => {
        router.push(`/listings/${data.listing.id}?edit=true&created=true`) // edit=true ile düzenleme modu, created=true ile kutlama
        onClose()
      }, 5000) // 5 saniye bekle
    } catch (err: any) {
      console.error('Create listing error:', err)
      showError(err.message || 'İlan oluşturulamadı')
      setLocalWarning('İlan oluşturulamadı. Manuel forma yönlendiriliyorsunuz...')

      // Başarısız olursa manuel forma yönlendir
      setTimeout(() => {
        router.push('/request')
        onClose()
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Modal Container - Animasyonlu büyüme */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        style={{
          animation: 'modalEnter 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-900">
              Hizmet Talebi Oluştur
            </h3>
            <p className="text-sm text-slate-600">AI asistanımız size yardımcı olacak</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* İlk uyarı (local) */}
          {showInitialWarning && <LocalWarning message={INITIAL_WARNING} type="info" />}

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
        <div className="p-4 md:p-6 border-t border-slate-200 bg-slate-50">
          {localWarning?.includes('İlanınız başarıyla oluşturuldu') ? (
            <div className="text-center">
              <p className="text-sm text-slate-600">Yönlendiriliyorsunuz...</p>
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
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

