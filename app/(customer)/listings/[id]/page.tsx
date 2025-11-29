'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, MapPin, Calendar, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.id as string

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      } catch (err: any) {
        setError(err.message || 'İlan yüklenemedi')
      } finally {
        setLoading(false)
      }
    }

    if (listingId) {
      fetchListing()
    }
  }, [listingId])

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
    <div className="min-h-screen bg-[#F5F5F7] py-8">
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">İlan Detayı</h1>
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

