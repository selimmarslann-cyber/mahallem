'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Share2, TrendingUp, Users, Coins, Link as LinkIcon, MessageCircle, Twitter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import {
  getReferralOverview,
  getReferralRewards,
} from '@/lib/api/referral'
import type { ReferralOverview, ReferralReward, ReferralRewardsResponse } from '@/lib/types/domain'

export default function ReferralPage() {
  const [overview, setOverview] = useState<ReferralOverview | null>(null)
  const [rewards, setRewards] = useState<ReferralReward[]>([])
  const [pagination, setPagination] = useState<ReferralRewardsResponse['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  
  // Filtreler
  const [page, setPage] = useState(1)
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadRewards()
  }, [page, levelFilter, dateFrom, dateTo])

  const loadData = async () => {
    try {
      const data = await getReferralOverview()
      setOverview(data)
    } catch (err) {
      console.error('Referral data yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadRewards = async () => {
    try {
      const data = await getReferralRewards({
        page,
        pageSize: 20,
        level: levelFilter !== 'all' ? parseInt(levelFilter) : undefined,
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(dateTo) : undefined,
      })
      setRewards(data.rewards)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Rewards yüklenemedi:', err)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Kopyalama hatası:', err)
    }
  }

  const shareLink = async () => {
    if (!overview) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hizmetgo\'e katıl, kazan!',
          text: 'Bu link ile kayıt ol ve sipariş ver, ben de kazanayım!',
          url: overview.referralLink,
        })
      } catch (err) {
        // Kullanıcı paylaşımı iptal etti
      }
    } else {
      // Fallback: kopyala
      copyToClipboard(overview.referralLink)
    }
  }

  const shareWhatsApp = () => {
    if (!overview) return
    const text = encodeURIComponent('Hizmetgo\'e katıl, kazan! Bu link ile kayıt ol: ' + overview.referralLink)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareTwitter = () => {
    if (!overview) return
    const text = encodeURIComponent('Hizmetgo\'e katıl, kazan! ' + overview.referralLink)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Yükleniyor...</div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Veri yüklenemedi</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Referans Kazançların</h1>
          <p className="text-gray-600">
            Arkadaşlarını davet et, onlar sipariş verdikçe kazan
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Kazanç</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.totalEarnings.toFixed(2)} ₺
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Çekilebilir bakiye: {overview.currentBalance.toFixed(2)} ₺
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Referans</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.level1Count + overview.level2Count}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                1. Seviye: {overview.level1Count} • 2. Seviye: {overview.level2Count}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bu Ayki Kazanç</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.monthlyEarnings.toFixed(2)} ₺
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Bu takvim ayındaki toplam kazanç
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Davet Et Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Davet Et
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Referans Kodun
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={overview.currentReferralCode}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-gray-50 font-mono font-semibold"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(overview.currentReferralCode)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? 'Kopyalandı!' : 'Kopyala'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Referans Linkin
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={overview.referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(overview.referralLink)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="default"
                  onClick={shareLink}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Paylaş
                </Button>
                <Button
                  variant="outline"
                  onClick={shareWhatsApp}
                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={shareTwitter}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
              </div>

              <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                <p className="font-medium mb-1">💡 Nasıl Çalışır?</p>
                <p>
                  Arkadaşın bu link ile kayıt olup sipariş verdikçe, platform komisyonundan
                  pay kazanırsın. 1. seviye referansların için %20, 2. seviye için %10 pay alırsın.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seviye Özetleri */}
          <Card>
            <CardHeader>
              <CardTitle>Seviye Özetleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Level 1 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">1. Seviye</Badge>
                    <span className="text-sm text-gray-600">
                      {overview.level1Count} kullanıcı
                    </span>
                  </div>
                  <span className="text-lg font-semibold">
                    {overview.level1Earnings.toFixed(2)} ₺
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min((overview.level1Earnings / Math.max(overview.totalEarnings, 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">%20 pay oranı</p>
              </div>

              {/* Level 2 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">2. Seviye</Badge>
                    <span className="text-sm text-gray-600">
                      {overview.level2Count} kullanıcı
                    </span>
                  </div>
                  <span className="text-lg font-semibold">
                    {overview.level2Earnings.toFixed(2)} ₺
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min((overview.level2Earnings / Math.max(overview.totalEarnings, 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">%10 pay oranı</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Toplam</span>
                  <span className="text-xl font-bold">
                    {overview.totalEarnings.toFixed(2)} ₺
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kazanç Geçmişi */}
        <Card>
          <CardHeader>
            <CardTitle>Kazanç Geçmişi</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filtreler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-4 border-b">
              <div>
                <Label htmlFor="level" className="text-sm">Seviye</Label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="1">1. Seviye</SelectItem>
                    <SelectItem value="2">2. Seviye</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateFrom" className="text-sm">Başlangıç Tarihi</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-sm">Bitiş Tarihi</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDateFrom('')
                    setDateTo('')
                    setLevelFilter('all')
                    setPage(1)
                  }}
                  className="w-full"
                >
                  Filtreleri Temizle
                </Button>
              </div>
            </div>
            {rewards.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz kazanç yok. Arkadaşlarını davet etmeye başla!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Tarih
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Sipariş
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Seviye
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                        Komisyon
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                        Pay Oranı
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                        Kazanç
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewards.map((reward: any) => (
                      <tr key={reward.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {new Date(reward.createdAt).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Link
                            href={`/orders/${reward.orderId}`}
                            className="text-blue-600 hover:underline"
                          >
                            #{reward.orderId.substring(0, 8)}
                          </Link>
                          {reward.order?.business?.name && (
                            <span className="text-gray-500 ml-2">
                              - {reward.order.business.name}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={reward.level === 1 ? 'default' : 'secondary'}>
                            {reward.level}. Seviye
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          {reward.grossCommission.toFixed(2)} ₺
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          {(reward.shareRate * 100).toFixed(0)}%
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-green-600">
                          +{reward.amount.toFixed(2)} ₺
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Sayfa {pagination.page} / {pagination.totalPages} 
                  ({pagination.total} toplam kayıt)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                  >
                    Önceki
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

