'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  Store, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Power,
  ArrowRight,
  Package,
  Star,
  Building2,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default function BusinessDashboardPage() {
  const router = useRouter()
  const [business, setBusiness] = useState<any>(null)
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
    avgRating: 0,
    totalReviews: 0,
  })
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const userRes = await fetch('/api/auth/me', { credentials: 'include' })
      if (!userRes.ok) {
        router.push('/auth/business-login')
        return
      }
      const userData = await userRes.json()

      const businessRes = await fetch(`/api/businesses/owner/${userData.user.id}`, {
        credentials: 'include',
      })
      if (!businessRes.ok) {
        router.push('/business/not-registered')
        return
      }
      const businessData = await businessRes.json()
      setBusiness(businessData)

      // İstatistikleri yükle
      const ordersRes = await fetch(`/api/orders/business/${businessData.id}`, {
        credentials: 'include',
      })
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        calculateStats(ordersData, businessData)
      }

      // Ürün sayısını yükle
      const productsRes = await fetch(`/api/businesses/${businessData.id}/products`, {
        credentials: 'include',
      })
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setStats(prev => ({ ...prev, totalProducts: productsData.length }))
      }
    } catch (err) {
      console.error('Veri yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (orders: any[], business: any) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayOrders = orders.filter((o: any) => {
      const orderDate = new Date(o.createdAt)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    })

    const todayRevenue = todayOrders
      .filter((o: any) => o.status === 'COMPLETED')
      .reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount || 0), 0)

    const pendingOrders = orders.filter((o: any) => 
      o.status === 'PENDING_CONFIRMATION'
    ).length

    setStats({
      todayOrders: todayOrders.length,
      todayRevenue,
      pendingOrders,
      totalProducts: stats.totalProducts,
      avgRating: business.avgRating || 0,
      totalReviews: business.reviewCount || 0,
    })
  }

  const toggleOnlineStatus = async () => {
    if (!business) return
    setToggling(true)

    try {
      const res = await fetch(`/api/businesses/${business.id}/toggle-online`, {
        method: 'POST',
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setBusiness({ ...business, onlineStatus: data.onlineStatus })
      }
    } catch (err) {
      console.error('Durum değiştirilemedi:', err)
    } finally {
      setToggling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const isOnline = business.onlineStatus === 'ONLINE'

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
              <p className="text-gray-600 mt-1">Yönetim Paneli</p>
            </div>
            <Button
              onClick={toggleOnlineStatus}
              disabled={toggling}
              className={isOnline 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-400 hover:bg-gray-500 text-white'
              }
              size="lg"
            >
              <Power className="w-4 h-4 mr-2" />
              {isOnline ? 'Açık' : 'Kapalı'}
            </Button>
          </div>

          {/* Online Status Badge */}
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? 'default' : 'secondary'} className="text-sm">
              {isOnline ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Şu anda açıksınız
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Şu anda kapalısınız
                </>
              )}
            </Badge>
            {business.avgRating > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{business.avgRating.toFixed(1)}</span>
                <span className="text-gray-500">({business.reviewCount} değerlendirme)</span>
              </div>
            )}
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bugünkü Siparişler</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.todayOrders}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bugünkü Gelir</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.todayRevenue.toFixed(2)} ₺</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bekleyen Siparişler</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Toplam Ürün</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Hızlı Erişim */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/business/jobs">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">Gelen İşler</h3>
                      <p className="text-sm text-gray-600">Yeni siparişleri görüntüle ve yönet</p>
                      {stats.pendingOrders > 0 && (
                        <Badge variant="destructive" className="mt-2">
                          {stats.pendingOrders} yeni
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/business/jobs/available">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">Uygun İşler</h3>
                      <p className="text-sm text-gray-600">Size uygun iş taleplerine teklif verin</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/business/store">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <Store className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">Mağazam</h3>
                      <p className="text-sm text-gray-600">Menü ve ürünlerinizi yönetin</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/business/status">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">Durum & İstatistikler</h3>
                      <p className="text-sm text-gray-600">Performansınızı takip edin</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/business/wallet">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">Cüzdan</h3>
                      <p className="text-sm text-gray-600">Kazançlarınızı görüntüleyin</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/business/working-hours">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">Çalışma Saatleri</h3>
                      <p className="text-sm text-gray-600">Mesai saatlerinizi yönetin</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/business/analytics">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">Analitik & Raporlar</h3>
                      <p className="text-sm text-gray-600">Performansınızı takip edin</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </div>

        {/* Son Siparişler Önizleme */}
        {stats.pendingOrders > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Bekleyen Siparişler</CardTitle>
                  <Link href="/business/jobs">
                    <Button variant="outline" size="sm">
                      Tümünü Gör
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-orange-900">
                        {stats.pendingOrders} yeni sipariş bekliyor
                      </p>
                      <p className="text-sm text-orange-700">
                        Hızlıca yanıt vermeniz gerekiyor
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

