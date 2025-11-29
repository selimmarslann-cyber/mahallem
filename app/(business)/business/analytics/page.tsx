/**
 * Business Analytics Dashboard
 * 
 * Grafikler, trend analizi, en çok satan ürünler
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Star,
  Users,
  Calendar,
  BarChart3,
  ShoppingBag,
} from 'lucide-react'
import { useToast } from '@/lib/hooks/useToast'

interface AnalyticsData {
  revenue: {
    today: number
    thisWeek: number
    thisMonth: number
    lastMonth: number
    trend: number // percentage
  }
  orders: {
    today: number
    thisWeek: number
    thisMonth: number
    trend: number
  }
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  ratings: {
    average: number
    count: number
    trend: number
  }
  weeklyData: Array<{
    date: string
    orders: number
    revenue: number
  }>
}

export default function BusinessAnalyticsPage() {
  const { error } = useToast()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const loadAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/business/analytics', {
        credentials: 'include',
      })
      if (res.ok) {
        const analyticsData = await res.json()
        setData(analyticsData)
      } else {
        error('Analitik veriler yüklenemedi')
      }
    } catch (err) {
      console.error('Analytics load error:', err)
      error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Veri bulunamadı</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analitik & Raporlar</h1>
          <p className="text-gray-600 mt-2">İşletmenizin performansını takip edin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Today's Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Bugünkü Gelir
              </CardTitle>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.revenue.today.toFixed(2)} ₺</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                {data.revenue.trend > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">+{data.revenue.trend.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3 text-red-500" />
                    <span className="text-red-500">{data.revenue.trend.toFixed(1)}%</span>
                  </>
                )}
                <span>geçen aya göre</span>
              </div>
            </CardContent>
          </Card>

          {/* This Month Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Bu Ay Gelir
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.revenue.thisMonth.toFixed(2)} ₺</div>
              <div className="text-xs text-gray-500 mt-1">
                Geçen ay: {data.revenue.lastMonth.toFixed(2)} ₺
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Bu Ay Sipariş
              </CardTitle>
              <ShoppingBag className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.orders.thisMonth}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                {data.orders.trend > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">+{data.orders.trend.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3 text-red-500" />
                    <span className="text-red-500">{data.orders.trend.toFixed(1)}%</span>
                  </>
                )}
                <span>geçen aya göre</span>
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ortalama Puan
              </CardTitle>
              <Star className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.ratings.average.toFixed(1)}</div>
              <div className="text-xs text-gray-500 mt-1">
                {data.ratings.count} değerlendirme
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Details */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="products">En Çok Satan Ürünler</TabsTrigger>
            <TabsTrigger value="trends">Trend Analizi</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Weekly Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Haftalık Performans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.weeklyData.map((day, index) => {
                    const maxRevenue = Math.max(...data.weeklyData.map((d) => d.revenue))
                    const barHeight = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0

                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-20 text-sm text-gray-600">
                          {new Date(day.date).toLocaleDateString('tr-TR', {
                            weekday: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="bg-primary h-6 rounded flex items-center justify-end pr-2"
                              style={{ width: `${barHeight}%` }}
                            >
                              {day.revenue > 0 && (
                                <span className="text-xs text-white font-medium">
                                  {day.revenue.toFixed(0)} ₺
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {day.orders} sipariş
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">En Çok Satan Ürünler</CardTitle>
              </CardHeader>
              <CardContent>
                {data.topProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Henüz satış verisi yok</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.topProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              {product.sales} satış
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">
                            {product.revenue.toFixed(2)} ₺
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gelir Trendi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bu Hafta</span>
                      <span className="font-semibold">{data.revenue.thisWeek.toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bu Ay</span>
                      <span className="font-semibold">{data.revenue.thisMonth.toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Geçen Ay</span>
                      <span className="font-semibold">{data.revenue.lastMonth.toFixed(2)} ₺</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sipariş Trendi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bugün</span>
                      <span className="font-semibold">{data.orders.today} sipariş</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bu Hafta</span>
                      <span className="font-semibold">{data.orders.thisWeek} sipariş</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bu Ay</span>
                      <span className="font-semibold">{data.orders.thisMonth} sipariş</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

