'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Send, User } from 'lucide-react'
import { useToast } from '@/lib/hooks/useToast'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  sender: {
    id: string
    name: string
    avatarUrl?: string | null
  }
  receiver: {
    id: string
    name: string
    avatarUrl?: string | null
  }
}

export default function OrderChatPage() {
  const params = useParams()
  const router = useRouter()
  const { error } = useToast()
  const orderId = params.id as string
  const [messages, setMessages] = useState<Message[]>([])
  const [order, setOrder] = useState<{ id: string; status: string; createdAt: string; updatedAt: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageContent, setMessageContent] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        credentials: 'include',
      })

      if (!res.ok) {
        if (res.status === 404) {
          error('Sipariş bulunamadı')
          router.push('/jobs')
          return
        }
        if (res.status === 403) {
          error('Bu siparişin mesajlarını görüntüleme yetkiniz yok')
          router.push('/jobs')
          return
        }
        throw new Error('Mesajlar yüklenemedi')
      }

      const data = await res.json()
      setMessages(data.messages || [])
      setOrder(data.order || null)

      // Current user ID'yi al
      const userRes = await fetch('/api/auth/me', { credentials: 'include' })
      if (userRes.ok) {
        const userData = await userRes.json()
        setCurrentUserId(userData.user?.id || null)
      }
    } catch (err) {
      console.error('Mesajlar yüklenemedi:', err)
      error('Mesajlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [orderId, error, router])

  useEffect(() => {
    loadMessages()

    // Her 3 saniyede bir mesajları yenile (basit polling)
    intervalRef.current = setInterval(() => {
      loadMessages()
    }, 3000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [loadMessages])

  // Yeni mesaj geldiğinde scroll et
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!messageContent.trim() || sending) {
      return
    }

    setSending(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent.trim() }),
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Mesaj gönderilemedi')
      }

      const data = await res.json()
      
      // Yeni mesajı listeye ekle
      setMessages((prev) => [...prev, data.message])
      setMessageContent('')
      
      // Mesajları yeniden yükle (en güncel hali için)
      setTimeout(() => {
        loadMessages()
      }, 500)
    } catch (err: any) {
      console.error('Mesaj gönderilemedi:', err)
      error(err.message || 'Mesaj gönderilemedi')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6000]"></div>
          <p className="mt-4 text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const otherUser = messages.length > 0
    ? (messages[0].senderId === currentUserId
        ? messages[0].receiver
        : messages[0].sender)
    : null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {otherUser?.avatarUrl ? (
                <img
                  src={otherUser.avatarUrl}
                  alt={otherUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{otherUser?.name || 'Kullanıcı'}</p>
              <p className="text-xs text-gray-500">Sipariş: #{orderId.slice(0, 8)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* System Message: Order Created */}
          {order && (
            <div className="flex items-center justify-center my-4">
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <p className="text-xs text-blue-700 font-medium">
                  Sipariş oluşturuldu • {new Date(order.createdAt).toLocaleString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-base font-medium">Henüz mesaj yok</p>
              <p className="text-sm mt-2 text-gray-400">İlk mesajı siz gönderin!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isMyMessage = message.senderId === currentUserId
              const prevMessage = index > 0 ? messages[index - 1] : null
              const showDateSeparator = !prevMessage || 
                new Date(message.createdAt).toDateString() !== new Date(prevMessage.createdAt).toDateString()
              
              const messageDate = new Date(message.createdAt)
              const isToday = messageDate.toDateString() === new Date().toDateString()
              
              return (
                <div key={message.id}>
                  {/* Date Separator */}
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-4">
                      <div className="flex items-center gap-2">
                        <div className="h-px bg-gray-200 flex-1 w-16"></div>
                        <span className="text-xs text-gray-500 font-medium">
                          {isToday 
                            ? 'Bugün' 
                            : messageDate.toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                        </span>
                        <div className="h-px bg-gray-200 flex-1 w-16"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Message Bubble */}
                  <div
                    className={`flex items-end gap-2 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMyMessage && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {message.sender.avatarUrl ? (
                          <img
                            src={message.sender.avatarUrl}
                            alt={message.sender.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                        isMyMessage
                          ? 'bg-[#FF6000] text-white rounded-br-md'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                      }`}
                    >
                      {!isMyMessage && (
                        <p className="text-xs font-semibold mb-1 opacity-90">
                          {message.sender.name}
                        </p>
                      )}
                      <p className={`text-sm whitespace-pre-wrap break-words leading-relaxed ${
                        isMyMessage ? 'text-white' : 'text-gray-900'
                      }`}>
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1.5 ${
                          isMyMessage ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {messageDate.toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    
                    {isMyMessage && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1"
            maxLength={1000}
            disabled={sending}
          />
          <Button
            type="submit"
            disabled={!messageContent.trim() || sending}
            className="bg-[#FF6000] hover:bg-[#FF5500] text-white"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
