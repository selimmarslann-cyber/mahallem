'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Store,
  Star,
  MapPin,
  Plus,
  Edit,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

export default function BusinessStorePage() {
  const router = useRouter()
  const [business, setBusiness] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadBusinessData()
  }, [])

  const loadBusinessData = async () => {
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
      if (businessRes.ok) {
        const businessData = await businessRes.json()
        setBusiness(businessData)

        // Ürünleri yükle
        const productsRes = await fetch(`/api/businesses/${businessData.id}/products`, {
          credentials: 'include',
        })
        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setProducts(productsData)
        }
      }
    } catch (err) {
      console.error('İşletme verisi yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleOnline = async (checked: boolean) => {
    if (!business) return

    // Ban kontrolü
    if (business.bannedUntil && new Date(business.bannedUntil) > new Date()) {
      alert('Hesabınız banlı, online olamazsınız')
      return
    }

    setUpdating(true)
    try {
      const newStatus = checked ? 'ONLINE' : 'OFFLINE'
      const res = await fetch(`/api/businesses/${business.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onlineStatus: newStatus }),
        credentials: 'include',
      })

      if (res.ok) {
        setBusiness({ ...business, onlineStatus: newStatus })
      } else {
        const data = await res.json()
        alert(data.error || 'Durum güncellenemedi')
      }
    } catch (err) {
      alert('Bir hata oluştu')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return (
          <Badge variant="success" className="bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Online
          </Badge>
        )
      case 'OFFLINE':
        return (
          <Badge variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            Offline
          </Badge>
        )
      case 'AUTO_OFFLINE':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Otomatik Offline
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Yükleniyor...</div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>İşletme bulunamadı</div>
      </div>
    )
  }

  const isBanned = business.bannedUntil && new Date(business.bannedUntil) > new Date()
  const isOnline = business.onlineStatus === 'ONLINE'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Mağazam</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Ban Uyarısı */}
        {isBanned && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Hesabınız üst üste 3 iptal nedeniyle{' '}
              {new Date(business.bannedUntil).toLocaleDateString('tr-TR')} tarihine kadar
              geçici olarak durdurulmuştur.
            </AlertDescription>
          </Alert>
        )}

        {/* İşletme Bilgisi */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{business.name}</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(business.onlineStatus)}
                  <Badge variant="secondary">{business.category}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{business.avgRating?.toFixed(1) || '0.0'}</span>
                  <span>•</span>
                  <span>{business.reviewCount || 0} değerlendirme</span>
                </div>
              </div>
              <Store className="w-8 h-8 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-700">{business.addressText}</p>
            </div>

            {/* Online/Offline Toggle */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="online-toggle" className="text-base font-medium">
                    Online / Offline
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Online iken yeni sipariş isteği alırsınız. Offline iken yeni iş gelmez.
                  </p>
                </div>
                <Switch
                  id="online-toggle"
                  checked={isOnline}
                  onCheckedChange={handleToggleOnline}
                  disabled={isBanned || updating}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ürün / Hizmet Listesi */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ürünler & Hizmetler</CardTitle>
              <Link href="/business/store/products/new">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Ekle
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">Henüz ürün/hizmet eklenmemiş</p>
                <Link href="/business/store/products/new">
                  <Button variant="outline">İlk Ürünü Ekle</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {product.photoUrl ? (
                          <img
                            src={product.photoUrl}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Store className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-sm">{product.name}</h3>
                            <Badge variant={product.isService ? 'default' : 'secondary'}>
                              {product.isService ? 'Hizmet' : 'Ürün'}
                            </Badge>
                          </div>
                          {product.description && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">{product.price} ₺</span>
                            <Link href={`/business/store/products/${product.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

