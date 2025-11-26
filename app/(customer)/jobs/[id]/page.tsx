'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MessageCircle, MapPin, Clock, User } from 'lucide-react'
import { useToast } from '@/lib/hooks/useToast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { success, error } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    loadOrder()
  }, [params.id])

  const loadOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      }
    } catch (err) {
      console.error('Sipariş yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = async () => {
    if (!rating) {
      error('Lütfen puan verin')
      return
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          rating,
          comment: comment || undefined,
        }),
        credentials: 'include',
      })

      if (res.ok) {
        setReviewDialogOpen(false)
        loadOrder()
        success('Değerlendirme gönderildi')
      } else {
        const data = await res.json()
        error(data.error || 'Değerlendirme gönderilemedi')
      }
    } catch (err) {
      error('Bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Yükleniyor...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Sipariş bulunamadı</div>
      </div>
    )
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { text: string; variant: any }> = {
      PENDING_CONFIRMATION: { text: 'Teklif Bekleniyor', variant: 'secondary' },
      ACCEPTED: { text: 'Usta Kabul Etti', variant: 'default' },
      IN_PROGRESS: { text: 'İş Devam Ediyor', variant: 'default' },
      COMPLETED: { text: 'Tamamlandı', variant: 'success' },
      CANCELLED_BY_CUSTOMER: { text: 'İptal Edildi', variant: 'destructive' },
      CANCELLED_BY_PROVIDER: { text: 'İptal Edildi', variant: 'destructive' },
    }
    return statusMap[status] || { text: status, variant: 'outline' }
  }

  const statusInfo = getStatusText(order.status)
  const canReview = order.status === 'COMPLETED' && !order.review

  // Timeline steps
  const steps = [
    { label: 'İstek Oluşturuldu', completed: true },
    { label: 'Esnaf Kabul Etti', completed: ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(order.status) },
    { label: 'İş Başladı', completed: ['IN_PROGRESS', 'COMPLETED'].includes(order.status) },
    { label: 'Tamamlandı', completed: order.status === 'COMPLETED' },
    { label: 'Değerlendirildi', completed: !!order.review },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            ← Geri
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge variant={statusInfo.variant} className="text-base px-4 py-2">
            {statusInfo.text}
          </Badge>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Durum Takibi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.completed ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className={`text-sm ${step.completed ? 'font-medium' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* İş Bilgisi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">İş Bilgisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Kategori</p>
              <p className="font-medium">{order.business?.category || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Adres</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <p>{order.addressText}</p>
              </div>
            </div>
            {order.scheduledAt && (
              <div>
                <p className="text-sm text-gray-500">Tarih & Saat</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p>{new Date(order.scheduledAt).toLocaleString('tr-TR')}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Toplam Tutar</p>
              <p className="text-xl font-bold">{order.totalAmount} ₺</p>
            </div>
          </CardContent>
        </Card>

        {/* Esnaf Kartı */}
        {order.business && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Esnaf</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{order.business.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{order.business.avgRating?.toFixed(1) || '0.0'}</span>
                    <span>•</span>
                    <span>{order.business.reviewCount || 0} değerlendirme</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {order.status !== 'COMPLETED' && order.status !== 'CANCELLED_BY_CUSTOMER' && order.status !== 'CANCELLED_BY_PROVIDER' && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // TODO: Chat sayfasına yönlendir
                info('Chat özelliği yakında eklenecek')
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Mesaj Gönder
            </Button>
          )}

          {canReview && (
            <Button
              className="w-full"
              onClick={() => setReviewDialogOpen(true)}
            >
              Değerlendir
            </Button>
          )}

          {order.review && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-2">Değerlendirmeniz</p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= order.review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {order.review.comment && (
                  <p className="text-sm text-gray-700">{order.review.comment}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Değerlendirme Yap</DialogTitle>
            <DialogDescription>
              Bu işi nasıl değerlendiriyorsun?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">Puan</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-2">Yorum (Opsiyonel)</p>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Deneyiminizi paylaşın..."
              />
            </div>
            <Button
              onClick={handleReviewSubmit}
              disabled={!rating}
              className="w-full"
            >
              Gönder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

