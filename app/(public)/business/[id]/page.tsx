'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart, MapPin } from 'lucide-react'

export default function BusinessDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [business, setBusiness] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBusiness()
  }, [params.id])

  const loadBusiness = async () => {
    try {
      const res = await fetch(`/api/businesses/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setBusiness(data)
        setProducts(data.products || [])
        loadReviews()
      }
    } catch (err) {
      console.error('İşletme yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = async () => {
    try {
      const res = await fetch(`/api/businesses/${params.id}/reviews?limit=3`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      }
    } catch (err) {
      console.error('Yorumlar yüklenemedi:', err)
    }
  }

  const addToCart = (product: any) => {
    const newCart = [...cart, { ...product, businessId: business.id, quantity: 1 }]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.id !== productId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/map">
            <Button variant="ghost" size="sm">← Geri</Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Sepet ({cart.length})
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Business Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{business.name}</CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary">{business.category}</Badge>
                  <Badge
                    variant={
                      business.onlineStatus === 'ONLINE' ? 'success' : 'secondary'
                    }
                  >
                    {business.onlineStatus === 'ONLINE' ? 'Aktif' : 'Offline'}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {business.avgRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {business.reviewCount} değerlendirme
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {business.description && (
              <p className="text-gray-700 mb-4">{business.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{business.addressText}</span>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ürünler ve Hizmetler</h2>
          {products.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Henüz ürün/hizmet eklenmemiş
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-semibold">
                        {product.price.toFixed(2)} ₺
                      </span>
                      <Button
                        onClick={() => addToCart(product)}
                        size="sm"
                        disabled={business.onlineStatus !== 'ONLINE'}
                      >
                        Sepete Ekle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        {business.reviewCount > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Değerlendirmeler</h2>
              <Link href={`/business/${params.id}/reviews`}>
                <Button variant="outline" size="sm">
                  Tüm Yorumlar
                </Button>
              </Link>
            </div>
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  Yorum yükleniyor...
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.reviewer.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

