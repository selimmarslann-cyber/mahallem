'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, SlidersHorizontal, Star, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { calculateDistance, formatDistance } from '@/lib/utils/distance'
import EmptyState from '@/components/ui/empty-state'

const BusinessMap = dynamic(
  () => import('@/components/map/BusinessMap'),
  { ssr: false }
)

export default function CustomerMapPage() {
  const router = useRouter()
  const [allBusinesses, setAllBusinesses] = useState<any[]>([])
  const [visibleBusinesses, setVisibleBusinesses] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'online' | 'nearest' | 'toprated'>('all')
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    loadBusinesses()
    // Mock user location - İstanbul
    setUserLocation({ lat: 41.0082, lng: 28.9784 })
  }, [])

  const loadBusinesses = async () => {
    try {
      const res = await fetch('/api/businesses', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setAllBusinesses(data)
        applyFilters(data, search, filter)
      }
    } catch (err) {
      console.error('İşletmeler yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (
    businesses: any[],
    searchTerm: string,
    filterType: string
  ) => {
    let filtered = [...businesses]

    // Arama filtresi
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(searchLower) ||
          business.category.toLowerCase().includes(searchLower) ||
          business.addressText?.toLowerCase().includes(searchLower)
      )
    }

    // Filtre tipi
    switch (filterType) {
      case 'online':
        filtered = filtered.filter((b) => b.onlineStatus === 'ONLINE')
        break
      case 'nearest':
        // Mesafeye göre sırala
        if (userLocation) {
          filtered = filtered
            .filter((b) => b.onlineStatus === 'ONLINE')
            .map((business) => {
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                business.lat,
                business.lng
              )
              return { ...business, distance }
            })
            .sort((a, b) => a.distance - b.distance)
        }
        break
      case 'toprated':
        filtered = filtered
          .filter((b) => b.avgRating > 0)
          .sort((a, b) => b.avgRating - a.avgRating)
        break
    }

    setVisibleBusinesses(filtered)
  }

  useEffect(() => {
    applyFilters(allBusinesses, search, filter)
  }, [search, filter, allBusinesses, userLocation])

  const handleMapMove = useCallback((bounds: { ne: [number, number]; sw: [number, number] }) => {
    // Viewport filtreleme - şimdilik tüm işletmeleri göster
    // TODO: Backend'den viewport'a göre filtreli fetch
  }, [])

  const hasData = visibleBusinesses.length > 0

  // Mesafe hesaplama ile business listesi
  const businessesWithDistance = visibleBusinesses.map((business) => {
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        business.lat,
        business.lng
      )
      return { ...business, distance, distanceText: formatDistance(distance) }
    }
    return { ...business, distance: 0, distanceText: '-' }
  })

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Üst header */}
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-slate-900 mb-2">
              Mahalle Haritası
            </h1>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors">
              <MapPin className="h-3.5 w-3.5" />
              Konum: <span className="font-semibold">Yakınımdaki Esnaflar</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1.5"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtreler
            </Button>
          </div>
        </div>
      </header>

      {/* Arama alanı */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Mahalle, cadde veya esnaf adı ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-slate-300"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button variant="outline" className="md:hidden" size="sm">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobil Filtre Chips */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="flex-shrink-0 text-xs"
            >
              Tümü
            </Button>
            <Button
              variant={filter === 'online' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('online')}
              className="flex-shrink-0 text-xs"
            >
              Sadece Açık
            </Button>
            <Button
              variant={filter === 'nearest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('nearest')}
              className="flex-shrink-0 text-xs"
            >
              En Yakın
            </Button>
            <Button
              variant={filter === 'toprated' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('toprated')}
              className="flex-shrink-0 text-xs"
            >
              En Yüksek Puan
            </Button>
          </div>
        </div>
      </div>

      {/* MAP + LİSTE layout */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-4 px-4 py-4 overflow-hidden pb-16 lg:pb-4">
        {/* Map */}
        <section className="relative flex-1 min-h-[320px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="text-center text-slate-500">
                <p className="text-sm">Harita yükleniyor...</p>
              </div>
            </div>
          ) : (
            <>
              <BusinessMap
                businesses={visibleBusinesses}
                onBusinessClick={(business) => {
                  // Marker'a tıklandığında yapılacak işlemler
                }}
                onMapMove={handleMapMove}
              />
              {/* Map üzerinde küçük legend */}
              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Açık esnaflar
              </div>
            </>
          )}
        </section>

        {/* Esnaf listesi / Desktop sidebar */}
        <aside className="hidden lg:flex w-[360px] flex-col gap-3 overflow-hidden">
          <Card className="border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Yakındaki Esnaflar
                {hasData && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    ({visibleBusinesses.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 overflow-y-auto flex-1">
              {!hasData ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                    <MapPin className="h-5 w-5 text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    Henüz yakın esnaf bulunamadı
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Haritayı hareket ettirerek veya konumunuzu güncelleyerek daha fazla esnaf keşfedebilirsiniz.
                  </p>
                </div>
              ) : (
                businessesWithDistance.map((business) => (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={`/business/${business.id}`}>
                      <button className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-left hover:border-slate-300 hover:bg-slate-50 transition-all">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {business.name}
                              </p>
                              {business.onlineStatus === 'ONLINE' && (
                                <Badge variant="success" className="text-xs flex-shrink-0">
                                  Aktif
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mb-1">
                              {business.category} • {business.distanceText}
                            </p>
                            {business.avgRating > 0 && (
                              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                                {business.avgRating.toFixed(1)}
                                {business.reviewCount > 0 && (
                                  <span className="text-emerald-600">
                                    {' '}({business.reviewCount})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </Link>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* Mobil Bottom Sheet */}
      {hasData && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-30 max-h-[40vh] flex flex-col border-t border-slate-200">
          {/* Drag Handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="h-1.5 w-12 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900">
                Bu bölgede {visibleBusinesses.length} esnaf bulundu
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {}}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <div className="space-y-2">
              {businessesWithDistance.slice(0, 5).map((business) => (
                <Link key={business.id} href={`/business/${business.id}`}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {business.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {business.category} • {business.distanceText}
                        </p>
                      </div>
                      {business.avgRating > 0 && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 flex-shrink-0">
                          <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                          {business.avgRating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
