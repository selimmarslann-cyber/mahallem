'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, MapPin, User, ChevronRight, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export default function BusinessJobsPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'new' | 'active' | 'past'>('new')
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const userRes = await fetch('/api/auth/me', { credentials: 'include' })
      if (!userRes.ok) {
        router.push('/auth/login')
        return
      }
      const userData = await userRes.json()

      const businessRes = await fetch(`/api/businesses/owner/${userData.user.id}`, {
        credentials: 'include',
      })
      if (!businessRes.ok) {
        return
      }
      const businessData = await businessRes.json()

      const ordersRes = await fetch(`/api/orders/business/${businessData.id}`, {
        credentials: 'include',
      })
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }
    } catch (err) {
      console.error('Siparişler yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!selectedOrder) return

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/accept`, {
        method: 'POST',
        credentials: 'include',
      })

      if (res.ok) {
        setAcceptDialogOpen(false)
        setSelectedOrder(null)
        loadOrders()
      } else {
        const data = await res.json()
        alert(data.error || 'Sipariş kabul edilemedi')
      }
    } catch (err) {
      alert('Bir hata oluştu')
    }
  }

  const handleReject = async (orderId: string) => {
    if (!confirm('Bu işi reddetmek istediğine emin misin?')) {
      return
    }

    try {
      const res = await fetch(`/api/orders/${orderId}/reject`, {
        method: 'POST',
        credentials: 'include',
      })

      if (res.ok) {
        loadOrders()
      } else {
        const data = await res.json()
        alert(data.error || 'Sipariş reddedilemedi')
      }
    } catch (err) {
      alert('Bir hata oluştu')
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { text: string; variant: any }> = {
      PENDING_CONFIRMATION: { text: 'Yeni İstek', variant: 'secondary' },
      ACCEPTED: { text: 'Kabul Edildi', variant: 'default' },
      IN_PROGRESS: { text: 'Devam Ediyor', variant: 'default' },
      COMPLETED: { text: 'Tamamlandı', variant: 'success' },
      CANCELLED_BY_CUSTOMER: { text: 'Müşteri İptal Etti', variant: 'destructive' },
      CANCELLED_BY_PROVIDER: { text: 'İptal Edildi', variant: 'destructive' },
    }
    return statusMap[status] || { text: status, variant: 'outline' }
  }

  const newOrders = orders.filter((o) => o.status === 'PENDING_CONFIRMATION')
  const activeOrders = orders.filter((o) =>
    ['ACCEPTED', 'IN_PROGRESS'].includes(o.status)
  )
  const pastOrders = orders.filter((o) =>
    ['COMPLETED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_PROVIDER'].includes(o.status)
  )

  const displayOrders =
    activeTab === 'new'
      ? newOrders
      : activeTab === 'active'
      ? activeOrders
      : pastOrders

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Gelen İşler</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Segmented Control */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new">Yeni İstekler</TabsTrigger>
            <TabsTrigger value="active">Aktif</TabsTrigger>
            <TabsTrigger value="past">Geçmiş</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Uyarı - Yeni İstekler */}
        {activeTab === 'new' && newOrders.length > 0 && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              2 saat içinde cevap vermezsen, hesabın otomatik offline'a alınır.
            </AlertDescription>
          </Alert>
        )}

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
        ) : displayOrders.length === 0 ? (
          <Card className="mt-6">
            <CardContent className="py-12 text-center text-gray-500">
              {activeTab === 'new'
                ? 'Yeni iş isteği yok'
                : activeTab === 'active'
                ? 'Aktif işiniz yok'
                : 'Geçmiş işiniz yok'}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 mt-6">
            {displayOrders.map((order) => {
              const statusInfo = getStatusText(order.status)
              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.text}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-sm">
                            {order.customer?.name || 'Müşteri'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">{order.addressText}</span>
                        </div>
                        {order.scheduledAt && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(order.scheduledAt).toLocaleString('tr-TR')}
                            </span>
                          </div>
                        )}
                        {order.totalAmount && (
                          <div className="mt-2">
                            <span className="text-sm font-semibold">
                              {order.totalAmount} ₺
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link href={`/business/jobs/${order.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          Detayı Gör
                        </Button>
                      </Link>
                      {order.status === 'PENDING_CONFIRMATION' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedOrder(order)
                              setAcceptDialogOpen(true)
                            }}
                          >
                            Kabul Et
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleReject(order.id)}
                          >
                            Reddet
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Accept Dialog */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bu işi kabul etmek istediğine emin misin?</DialogTitle>
            <DialogDescription>
              Bu işi kabul edip mesaj attığında, müşteriden ödeme çekilir ve iş sana atanır.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAccept}>Onayla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

