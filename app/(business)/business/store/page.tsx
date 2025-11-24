'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Store,
  Star,
  MapPin,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Upload,
  Save,
  X,
} from 'lucide-react'

type BusinessType = 'restaurant' | 'market' | 'grocery' | 'tailor' | 'other'

type Product = {
  id: string
  name: string
  price: number
  description?: string | null
  category?: string
  photoUrl?: string | null
  active: boolean
  isService: boolean
  deliveryType: string
}

const COMMON_PRODUCT_IMAGES: Record<string, string> = {
  'tavuk döner': '/images/foods/tavuk-doner.jpg',
  'et döner': '/images/foods/et-doner.jpg',
  'iskender': '/images/foods/iskender.jpg',
  'lahmacun': '/images/foods/lahmacun.jpg',
  'pide': '/images/foods/pide.jpg',
  'adana dürüm': '/images/foods/adana-durum.jpg',
  'köfte': '/images/foods/kofte.jpg',
  'pizza': '/images/foods/pizza.jpg',
  'hamburger': '/images/foods/hamburger.jpg',
  'çiğ köfte': '/images/foods/cig-kofte.jpg',
  'ekmek': '/images/grocery/ekmek.jpg',
  'süt': '/images/grocery/sut.jpg',
  'yumurta': '/images/grocery/yumurta.jpg',
  'kola': '/images/grocery/kola.jpg',
  'su': '/images/grocery/su.jpg',
}

const BUSINESS_TYPE_OPTIONS = [
  { value: 'restaurant', label: 'Lokanta / Dönerci' },
  { value: 'market', label: 'Market' },
  { value: 'grocery', label: 'Bakkal / Şarküteri' },
  { value: 'tailor', label: 'Terzi' },
  { value: 'other', label: 'Diğer' },
]

export default function BusinessStorePage() {
  const router = useRouter()
  const [business, setBusiness] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Business info state
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState<BusinessType>('restaurant')
  const [isStoreOpen, setIsStoreOpen] = useState(true)

  // Product form state
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formImageUrl, setFormImageUrl] = useState<string | undefined>(undefined)
  const [formIsService, setFormIsService] = useState(false)
  const [formDeliveryType, setFormDeliveryType] = useState('PICKUP')
  const [formActive, setFormActive] = useState(true)

  useEffect(() => {
    loadBusinessData()
  }, [])

  const loadBusinessData = async () => {
    try {
      const userRes = await fetch('/api/auth/me', { credentials: 'include' })
      if (!userRes.ok) {
        router.push('/auth/login?type=business&redirect=/business/store')
        return
      }
      const userData = await userRes.json()

      const businessRes = await fetch(`/api/businesses/owner/${userData.user.id}`, {
        credentials: 'include',
      })
      if (businessRes.ok) {
        const businessData = await businessRes.json()
        setBusiness(businessData)
        setBusinessName(businessData.name || '')
        setIsStoreOpen(businessData.onlineStatus === 'ONLINE')
        // Business category'den business type'a çevir
        const categoryMap: Record<string, BusinessType> = {
          MARKET: 'market',
          KUAFOR: 'other',
          TESISAT: 'other',
          TEMIZLIK: 'other',
          ELEKTRIK: 'other',
          BOYA: 'other',
          MARANGOZ: 'other',
          NAKLIYE: 'other',
          DIGER: 'other',
        }
        setBusinessType(categoryMap[businessData.category] || 'restaurant')

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

  const handleNameChange = (value: string) => {
    setFormName(value)
    // Otomatik görsel kontrolü
    const key = value.trim().toLowerCase()
    if (COMMON_PRODUCT_IMAGES[key]) {
      setFormImageUrl(COMMON_PRODUCT_IMAGES[key])
    } else {
      // Eğer eşleşme yoksa ve daha önce otomatik görsel atanmışsa, sadece temizle
      // Kullanıcı manuel görsel yüklemişse koru
      if (formImageUrl && Object.values(COMMON_PRODUCT_IMAGES).includes(formImageUrl)) {
        setFormImageUrl(undefined)
      }
    }
  }

  const resetForm = () => {
    setEditingProductId(null)
    setFormName('')
    setFormPrice('')
    setFormCategory('')
    setFormDescription('')
    setFormImageUrl(undefined)
    setFormIsService(false)
    setFormDeliveryType('PICKUP')
    setFormActive(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id)
    setFormName(product.name)
    setFormPrice(product.price.toString())
    setFormCategory('') // Product modelinde category yok, şimdilik boş
    setFormDescription(product.description || '')
    setFormImageUrl(product.photoUrl || undefined)
    setFormIsService(product.isService)
    setFormDeliveryType(product.deliveryType)
    setFormActive(product.active)
  }

  const handleSubmit = async () => {
    if (!business || !formName || !formPrice) {
      alert('Lütfen ürün adı ve fiyat girin')
      return
    }

    const priceNumber = parseFloat(formPrice.replace(',', '.'))
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert('Geçerli bir fiyat girin')
      return
    }

    setSaving(true)
    try {
      const productData = {
        name: formName.trim(),
        price: priceNumber,
        description: formDescription.trim() || undefined,
        photoUrl: formImageUrl || null,
        isService: formIsService,
        deliveryType: formDeliveryType as 'ON_SITE' | 'PICKUP' | 'DELIVERY',
        active: formActive,
      }

      if (editingProductId) {
        // Güncelle
        const res = await fetch(
          `/api/businesses/${business.id}/products/${editingProductId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
            credentials: 'include',
          }
        )

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Ürün güncellenemedi')
          return
        }

        const updatedProduct = await res.json()
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProductId ? updatedProduct : p))
        )
      } else {
        // Yeni ürün ekle
        const res = await fetch(`/api/businesses/${business.id}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
          credentials: 'include',
        })

        if (!res.ok) {
          const error = await res.json()
          alert(error.error || 'Ürün eklenemedi')
          return
        }

        const newProduct = await res.json()
        setProducts((prev) => [newProduct, ...prev])
      }

      resetForm()
    } catch (err) {
      console.error('Ürün kaydetme hatası:', err)
      alert('Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      return
    }

    if (!business) return

    try {
      const res = await fetch(`/api/businesses/${business.id}/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Ürün silinemedi')
        return
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId))
      if (editingProductId === productId) {
        resetForm()
      }
    } catch (err) {
      console.error('Ürün silme hatası:', err)
      alert('Bir hata oluştu')
    }
  }

  const toggleProductActive = async (productId: string, value: boolean) => {
    if (!business) return

    try {
      const res = await fetch(
        `/api/businesses/${business.id}/products/${productId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: value }),
          credentials: 'include',
        }
      )

      if (res.ok) {
        const updatedProduct = await res.json()
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? updatedProduct : p))
        )
      }
    } catch (err) {
      console.error('Ürün durumu güncellenemedi:', err)
    }
  }

  const handleSaveBusiness = async () => {
    if (!business) return

    setSaving(true)
    try {
      // Business name ve online status güncelle
      // Önce online status'u güncelle
      const statusRes = await fetch(`/api/businesses/${business.id}/online-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          onlineStatus: isStoreOpen ? 'ONLINE' : 'OFFLINE',
        }),
        credentials: 'include',
      })

      if (!statusRes.ok) {
        const error = await statusRes.json()
        alert(error.error || 'Durum güncellenemedi')
        return
      }

      // Business name güncelle
      if (businessName !== business.name) {
        const nameRes = await fetch(`/api/businesses/${business.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: businessName }),
          credentials: 'include',
        })

        if (!nameRes.ok) {
          const error = await nameRes.json()
          alert(error.error || 'İsim güncellenemedi')
          return
        }
      }

      const updatedBusiness = await statusRes.json()
      setBusiness({ ...business, ...updatedBusiness, name: businessName })
      alert('Mağaza bilgileri kaydedildi')
    } catch (err) {
      console.error('Mağaza kaydetme hatası:', err)
      alert('Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">İşletme bulunamadı</h2>
            <p className="text-gray-600 mb-4">
              Önce bir işletme kaydı oluşturmanız gerekiyor.
            </p>
            <Button onClick={() => router.push('/business/register')}>
              İşletme Kaydı Oluştur
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isBanned = business.bannedUntil && new Date(business.bannedUntil) > new Date()
  const isOnline = business.onlineStatus === 'ONLINE'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Ürün Yönetimi</h1>
              <p className="text-sm text-slate-600 mt-1">Mağazanızı yönetin ve ürünlerinizi ekleyin</p>
            </div>
            {getStatusBadge(business.onlineStatus)}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Ban Uyarısı */}
        {isBanned && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Hesabınız üst üste 3 iptal nedeniyle{' '}
              {new Date(business.bannedUntil).toLocaleDateString('tr-TR')} tarihine kadar
              geçici olarak durdurulmuştur.
            </AlertDescription>
          </Alert>
        )}

        {/* Üst Bar - Mağaza Bilgileri */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Mağaza Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Dükkan Adı</Label>
                <Input
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Örn: Arslan Döner Salonu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-type">Esnaf Türü</Label>
                <Select
                  value={businessType}
                  onValueChange={(val: BusinessType) => setBusinessType(val)}
                >
                  <SelectTrigger id="business-type">
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mağaza Durumu</Label>
                <div className="flex items-center gap-3 pt-2">
                  <Switch
                    checked={isStoreOpen}
                    onCheckedChange={setIsStoreOpen}
                    disabled={isBanned}
                  />
                  <span className="text-sm text-gray-600">
                    {isStoreOpen ? 'Açık' : 'Kapalı'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSaveBusiness} disabled={saving || isBanned}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ana İçerik: 2 Kolon Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon - Ürün Listesi */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Ürünleriniz ({products.length})</CardTitle>
              <Badge variant="outline" className="text-xs">
                {products.filter((p) => p.active).length} aktif
              </Badge>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Henüz ürün eklemediniz</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Sağ taraftan ilk ürününüzü ekleyin
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className={`hover:shadow-md transition-all ${
                        !product.active ? 'opacity-60' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          {/* Ürün Görseli */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            {product.photoUrl ? (
                              <Image
                                src={product.photoUrl}
                                alt={product.name}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                                unoptimized
                              />
                            ) : (
                              <Store className="w-8 h-8 text-gray-400" />
                            )}
                          </div>

                          {/* Ürün Bilgileri */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-sm text-slate-900 line-clamp-1">
                                {product.name}
                              </h3>
                              {!product.active && (
                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                  Pasif
                                </Badge>
                              )}
                            </div>
                            {product.description && (
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {product.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-slate-900">
                                {parseFloat(product.price.toString()).toFixed(2)} ₺
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={product.active}
                                  onCheckedChange={(val) =>
                                    toggleProductActive(product.id, val)
                                  }
                                  id={`active-${product.id}`}
                                />
                                <Label
                                  htmlFor={`active-${product.id}`}
                                  className="text-xs text-gray-600 cursor-pointer"
                                >
                                  {product.active ? 'Aktif' : 'Pasif'}
                                </Label>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(product)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(product.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
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

          {/* Sağ Kolon - Ürün Formu */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {editingProductId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </CardTitle>
              {editingProductId && (
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ürün Adı */}
              <div className="space-y-2">
                <Label htmlFor="product-name">Ürün Adı *</Label>
                <Input
                  id="product-name"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Örn: Tavuk döner dürüm"
                />
                <p className="text-xs text-gray-500">
                  Yaygın yemekler için görseller otomatik eklenir (tavuk döner, lahmacun,
                  pide, köfte, pizza, kola, su vb.)
                </p>
              </div>

              {/* Fiyat */}
              <div className="space-y-2">
                <Label htmlFor="product-price">Fiyat (₺) *</Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="Örn: 120.00"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-2">
                <Label htmlFor="product-category">Kategori</Label>
                <Input
                  id="product-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder={
                    businessType === 'restaurant'
                      ? 'Örn: Döner, Izgara, İçecek'
                      : businessType === 'market' || businessType === 'grocery'
                      ? 'Örn: İçecek, Atıştırmalık'
                      : 'Örn: Hizmet kategorisi'
                  }
                />
              </div>

              {/* Açıklama */}
              <div className="space-y-2">
                <Label htmlFor="product-description">Açıklama</Label>
                <Textarea
                  id="product-description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ürünün içeriğini, gramajını, önemli notları yazabilirsiniz."
                  rows={3}
                />
              </div>

              {/* Ürün Görseli */}
              <div className="space-y-2">
                <Label>Ürün Görseli</Label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border-2 border-dashed border-gray-300">
                    {formImageUrl ? (
                      <Image
                        src={formImageUrl}
                        alt={formName || 'Ürün görseli'}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <Store className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => alert('Görsel yükleme özelliği yakında eklenecek.')}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Kendi Görselimi Yükle
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Yaygın yemek isimleri için hazır görseller otomatik gelir, diğer
                  ürünlerde kendi görselinizi ekleyebilirsiniz.
                </p>
              </div>

              {/* Ürün Tipi */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formIsService}
                    onCheckedChange={setFormIsService}
                    id="is-service"
                  />
                  <Label htmlFor="is-service" className="cursor-pointer">
                    Bu bir hizmet (ürün değil)
                  </Label>
                </div>
              </div>

              {/* Teslimat Tipi */}
              <div className="space-y-2">
                <Label htmlFor="delivery-type">Teslimat Tipi</Label>
                <Select value={formDeliveryType} onValueChange={setFormDeliveryType}>
                  <SelectTrigger id="delivery-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ON_SITE">Müşteri işletmeye gelir</SelectItem>
                    <SelectItem value="PICKUP">Müşteri alır</SelectItem>
                    <SelectItem value="DELIVERY">Esnaf teslim eder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Aktif/Pasif */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formActive}
                    onCheckedChange={setFormActive}
                    id="form-active"
                  />
                  <Label htmlFor="form-active" className="cursor-pointer">
                    Ürün aktif (listede görünsün)
                  </Label>
                </div>
              </div>

              {/* Submit Butonu */}
              <div className="flex gap-2 pt-2">
                {editingProductId && (
                  <Button variant="outline" onClick={resetForm} className="flex-1">
                    İptal
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={!formName || !formPrice || saving}
                  className={editingProductId ? 'flex-1' : 'w-full'}
                >
                  {saving ? (
                    'Kaydediliyor...'
                  ) : editingProductId ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Ürünü Ekle
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
