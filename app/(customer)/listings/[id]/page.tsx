'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Loader2, MapPin, Calendar, DollarSign, AlertCircle, CheckCircle2, Upload, Home, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/lib/hooks/useToast'

interface Listing {
  id: string
  description: string
  category: {
    id: string
    name: string
    slug: string
    level: number
  } | null
  level: number
  leadFee: number
  date: string | null
  priority: string
  address: string | null
  priceRange: string | null
  status: string
  createdAt: string
  canViewContact: boolean
  contact: {
    customerName: string
    customerEmail: string
  } | null
  wallet?: {
    balance: number
    required: number
    sufficient: boolean
  }
}

function ListingDetailPageContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const listingId = params.id as string
  const { success, error: showError } = useToast()

  const isEditMode = searchParams?.get('edit') === 'true'
  const isCreated = searchParams?.get('created') === 'true'

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  
  // Edit mode state
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}`, {
          credentials: 'include',
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'İlan yüklenemedi')
        }

        const data = await res.json()
        setListing(data.listing)
        
        // Eğer yeni oluşturulduysa kutlama göster
        if (isCreated) {
          setTimeout(() => {
            setShowCelebration(true)
            setTimeout(() => {
              setShowCelebration(false)
            }, 5000) // 5 saniye göster
          }, 500)
        }
      } catch (err: any) {
        setError(err.message || 'İlan yüklenemedi')
      } finally {
        setLoading(false)
      }
    }

    if (listingId) {
      fetchListing()
    }
  }, [listingId, isCreated])

  const handlePublish = async () => {
    if (!listing) return
    
    setIsPublishing(true)
    try {
      // İlanı yayınla (status: 'open' yap)
      const res = await fetch(`/api/listings/${listingId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          additionalDetails,
          images,
        }),
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'İlan yayınlanamadı')
      }

      success('İlanınız yayında! 🎉')
      setShowCelebration(true)
      setTimeout(() => {
        setShowCelebration(false)
      }, 5000)
      
      // Listing'i güncelle
      const data = await res.json()
      setListing(data.listing)
    } catch (err: any) {
      showError(err.message || 'İlan yayınlanamadı')
    } finally {
      setIsPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">İlan Bulunamadı</h2>
          <p className="text-slate-600 mb-6">{error || 'İlan yüklenemedi'}</p>
          <Button onClick={() => router.push('/jobs')} className="bg-brand-500 hover:bg-brand-600">
            İlanlarıma Dön
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 relative">
      {/* Kutlama Animasyonu */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-xl">
            <div className="mb-4">
              <Sparkles className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">🎉 İlanınız Yayında!</h2>
            <p className="text-slate-600 mb-6">İlanınız başarıyla yayınlandı. Artık hizmet verenler size ulaşabilir.</p>
            <Button
              onClick={() => {
                setShowCelebration(false)
                router.push('/')
              }}
              className="bg-brand-500 hover:bg-brand-600 w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Anasayfaya Dön
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            ← Geri
          </Button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isEditMode ? 'İlanınızı Tamamlayın' : 'İlan Detayı'}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
            </span>
            <span className="px-2 py-1 rounded bg-slate-200 text-slate-700">
              {listing.status === 'open' ? 'Açık' : listing.status}
            </span>
          </div>
        </div>

        {/* İlan Bilgileri */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          {/* Kategori ve Level */}
          {listing.category && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-slate-600">Kategori:</span>
                <span className="text-sm font-semibold text-slate-900">{listing.category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">Level:</span>
                <span className="px-2 py-1 rounded bg-brand-100 text-brand-700 text-sm font-semibold">
                  L{listing.level}
                </span>
                <span className="text-sm text-slate-600">
                  İletişim açma ücreti: {listing.leadFee} TL
                </span>
              </div>
            </div>
          )}

          {/* Açıklama */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Açıklama</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Diğer Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listing.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-600">Adres</p>
                  <p className="text-slate-900">{listing.address}</p>
                </div>
              </div>
            )}

            {listing.date && (
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-600">Tarih</p>
                  <p className="text-slate-900">{listing.date}</p>
                </div>
              </div>
            )}

            {listing.priceRange && (
              <div className="flex items-start gap-2">
                <DollarSign className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-600">Fiyat Aralığı</p>
                  <p className="text-slate-900">{listing.priceRange}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Düzenleme Modu: Resim ve Detay Ekleme */}
        {isEditMode && listing.status !== 'open' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">İlanınızı Tamamlayın</h3>
            
            {/* Ek Detaylar */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ek Detaylar (Opsiyonel)
              </label>
              <Textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="İlanınıza eklemek istediğiniz detayları yazın..."
                rows={4}
                className="w-full"
              />
            </div>

            {/* Resim Yükleme (Basit placeholder - gerçek implementasyon için file upload gerekir) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resimler (Opsiyonel)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Resim yükleme özelliği yakında eklenecek</p>
              </div>
            </div>

            {/* Yayınla Butonu */}
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full bg-brand-500 hover:bg-brand-600"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Yayınlanıyor...
                </>
              ) : (
                'İlanı Yayınla'
              )}
            </Button>
          </div>
        )}

        {/* İletişim Bilgileri veya Ödeme */}
        {listing.canViewContact ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">İletişim Bilgileri</h3>
            </div>
            {listing.contact ? (
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-green-700">Müşteri Adı</p>
                  <p className="text-green-900">{listing.contact.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">E-posta</p>
                  <p className="text-green-900">{listing.contact.customerEmail}</p>
                </div>
              </div>
            ) : (
              <p className="text-green-700">İletişim bilgileri görüntülenebilir.</p>
            )}
          </div>
        ) : listing.wallet ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Bu İlan İçin İletişim Aç
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Cüzdan Bakiyeniz:</span>
                  <span className="text-lg font-semibold text-slate-900">
                    {listing.wallet.balance} TL
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Gerekli Ücret:</span>
                  <span className="text-lg font-semibold text-brand-600">
                    {listing.wallet.required} TL
                  </span>
                </div>
              </div>

              {listing.wallet.sufficient ? (
                <Button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/leads/purchase', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ listingId }),
                        credentials: 'include',
                      })

                      if (!res.ok) {
                        const data = await res.json()
                        throw new Error(data.error || 'Ödeme yapılamadı')
                      }

                      // Sayfayı yenile
                      window.location.reload()
                    } catch (err: any) {
                      alert(err.message || 'Ödeme yapılamadı')
                    }
                  }}
                  className="w-full bg-brand-500 hover:bg-brand-600"
                >
                  Bu İlana Teklif Vermek ve İletişimi Açmak İstiyorum ({listing.leadFee} TL)
                </Button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 mb-2">
                    Bakiyeniz yetersiz. Cüzdanınıza {listing.wallet.required - listing.wallet.balance}{' '}
                    TL daha yüklemeniz gerekiyor.
                  </p>
                  <Button
                    onClick={() => router.push('/account/wallet')}
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Cüzdana Para Yükle
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
            <p className="text-sm text-slate-600">
              İletişim bilgilerini görmek için bu ilan için ödeme yapmanız gerekmektedir.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ListingDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <ListingDetailPageContent />
    </Suspense>
  )
}

