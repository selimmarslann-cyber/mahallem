'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Clock, MapPin, User, ChevronRight, Briefcase } from 'lucide-react'

export default function CustomerJobsPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (!res.ok) {
        router.push('/auth/login')
        return
      }
      const data = await res.json()
      
      const ordersRes = await fetch(`/api/orders/customer/${data.user.id}`, {
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

  const activeOrders = orders.filter((o) =>
    ['PENDING_CONFIRMATION', 'ACCEPTED', 'IN_PROGRESS'].includes(o.status)
  )

  const pastOrders = orders.filter((o) =>
    ['COMPLETED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_PROVIDER'].includes(o.status)
  )

  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto shadow-xl">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">İşlerim</h1>
            <p className="text-white/90 text-sm">Aktif ve geçmiş işlerini takip et</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 -mt-6">
        {/* Segmented Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'past')}>
            <TabsList className="grid w-full grid-cols-2 bg-white shadow-md">
              <TabsTrigger value="active" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Aktif
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Geçmiş
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Orders List */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500">Yükleniyor...</p>
          </motion.div>
        ) : displayOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mt-6 border-2 border-dashed border-gray-200">
              <CardContent className="py-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  {activeTab === 'active' 
                    ? 'Aktif işiniz yok'
                    : 'Geçmiş işiniz yok'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {activeTab === 'active'
                    ? 'Yeni iş talebi oluşturmak için ana sayfaya dön'
                    : 'Tamamlanan işleriniz burada görünecek'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4 mt-6">
            {displayOrders.map((order, index) => {
              const statusInfo = getStatusText(order.status)
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Link href={`/jobs/${order.id}`}>
                    <Card className="hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-200">
                      <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
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
                          {order.business && (
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-sm">
                                {order.business.name}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{order.addressText}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {order.scheduledAt
                                ? new Date(order.scheduledAt).toLocaleString('tr-TR')
                                : 'Tarih belirtilmemiş'}
                            </span>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

