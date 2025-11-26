'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  MapPin, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X,
  Store,
  Phone,
  ArrowRight,
  Zap,
  List,
  Map as MapIcon,
  Filter,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MapFilters from '@/components/map/MapFilters'
import BusinessCard from '@/components/home/BusinessCard'

const LeafletMap = dynamic(
  () => import('@/components/map/LeafletMapBusinesses'),
  { ssr: false }
)

interface Business {
  id: string
  name: string
  description?: string
  category: string
  lat: number
  lng: number
  addressText?: string
  coverImageUrl?: string
  onlineStatus: 'ONLINE' | 'OFFLINE' | 'AUTO_OFFLINE'
  avgRating: number
  reviewCount: number
  products?: Product[]
  distance?: number
  priceRange?: string
}

interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  active: boolean
}

interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl?: string
}

const CATEGORIES = [
  'Temizlik',
  'Elektrik',
  'Tesisat',
  'Boya / Badana',
  'Nakliyat',
  'Beyaz Eşya',
  'Özel Ders',
  'Evcil Hayvan',
]

export default function MapPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [userLocation, setUserLocation] = useState<[number, number]>([41.0082, 28.9784])
  const [loading, setLoading] = useState(true)
  
  // Search
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [maxDistance, setMaxDistance] = useState(10)
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance')
  
  // Mobile view toggle
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [showFilters, setShowFilters] = useState(false)

  const loadBusinesses = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/businesses/map?lat=${lat}&lng=${lng}&limit=50`)
      if (res.ok) {
        const data = await res.json()
        setBusinesses(data)
      }
    } catch (err) {
      console.error('İşletmeler yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const applyFilters = useCallback(() => {
    let filtered = [...businesses]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((b) => selectedCategories.includes(b.category))
    }

    // Distance filter (mock - would need actual distance calculation)
    // For now, we'll just use the businesses as-is

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.avgRating - a.avgRating
      } else if (sortBy === 'price') {
        // Mock price comparison
        return 0
      } else {
        // Distance (mock)
        return 0
      }
    })

    setFilteredBusinesses(filtered)
  }, [businesses, selectedCategories, maxDistance, sortBy, searchQuery])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ]
          setUserLocation(loc)
          loadBusinesses(loc[0], loc[1])
        },
        () => {
          loadBusinesses(userLocation[0], userLocation[1])
        }
      )
    } else {
      loadBusinesses(userLocation[0], userLocation[1])
    }
  }, [userLocation, loadBusinesses])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business)
    if (!business.products) {
      loadBusinessProducts(business.id)
    }
  }

  const loadBusinessProducts = async (businessId: string) => {
    try {
      const res = await fetch(`/api/businesses/${businessId}/products`)
      if (res.ok) {
        const products = await res.json()
        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === businessId ? { ...b, products } : b
          )
        )
        setSelectedBusiness((prev) =>
          prev?.id === businessId ? { ...prev, products } : prev
        )
      }
    } catch (err) {
      console.error('Ürünler yüklenemedi:', err)
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id)
    
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ])
    }
  }

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.productId === productId)
    if (item && item.quantity > 1) {
      setCart(
        cart.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
      )
    } else {
      setCart(cart.filter((i) => i.productId !== productId))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setMaxDistance(10)
    setSortBy('distance')
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Search Bar - Sol Üst */}
      <div className="sticky top-16 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Esnaf veya kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 border-2 border-gray-200 focus:border-[#FF6000]"
              />
            </div>
            <div className="md:hidden flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'map' | 'list')}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Liste
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4" />
                    Harita
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Panel */}
      {showFilters && (
        <div className="md:hidden bg-white border-b shadow-sm">
          <MapFilters
            categories={CATEGORIES}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            maxDistance={maxDistance}
            onDistanceChange={setMaxDistance}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={resetFilters}
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
        {/* Desktop: Left Filters Panel */}
        <div className="hidden md:block w-80 border-r bg-white overflow-y-auto">
          <MapFilters
            categories={CATEGORIES}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            maxDistance={maxDistance}
            onDistanceChange={setMaxDistance}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={resetFilters}
          />
        </div>

        {/* Mobile: List View */}
        {viewMode === 'list' && (
          <div className="md:hidden flex-1 overflow-y-auto bg-white p-4">
            <div className="space-y-4">
              {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    id={business.id}
                    name={business.name}
                    category={business.category}
                    rating={business.avgRating}
                    reviewCount={business.reviewCount}
                    distance={business.distance}
                    priceRange={business.priceRange}
                    isOnline={business.onlineStatus === 'ONLINE'}
                    href={`/business/${business.id}`}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Store className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Esnaf bulunamadı</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map View */}
        <div className={`flex-1 relative ${viewMode === 'list' ? 'hidden md:block' : ''}`}>
          {!loading && (
            <LeafletMap
              businesses={filteredBusinesses}
              center={userLocation}
              zoom={13}
              onBusinessClick={handleBusinessClick}
            />
          )}
        </div>

        {/* Right: Business Details / Products */}
        {selectedBusiness && (
          <div className="w-full md:w-96 bg-white border-t md:border-l shadow-lg flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col h-full"
            >
              {/* Business Header */}
              <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base md:text-xl font-bold text-slate-900">
                        {selectedBusiness.name}
                      </h2>
                      <Badge
                        variant={selectedBusiness.onlineStatus === 'ONLINE' ? 'default' : 'secondary'}
                        className={selectedBusiness.onlineStatus === 'ONLINE' ? 'bg-green-500 text-white' : ''}
                      >
                        {selectedBusiness.onlineStatus === 'ONLINE' ? 'Açık' : 'Kapalı'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {selectedBusiness.avgRating.toFixed(1)}
                        </span>
                        <span className="text-slate-400">
                          ({selectedBusiness.reviewCount})
                        </span>
                      </div>
                      {selectedBusiness.addressText && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs">
                            {selectedBusiness.addressText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBusiness(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Products List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {selectedBusiness.products && selectedBusiness.products.length > 0 ? (
                    selectedBusiness.products
                      .filter((p) => p.active)
                      .map((product) => {
                        const cartItem = cart.find((item) => item.productId === product.id)
                        const quantity = cartItem?.quantity || 0

                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 mb-1">
                                {product.name}
                              </h3>
                              {product.description && (
                                <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-[#FF6000]">
                                  {product.price.toFixed(2)} ₺
                                </span>
                                <div className="flex items-center gap-2">
                                  {quantity > 0 && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeFromCart(product.id)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </Button>
                                      <span className="w-8 text-center font-semibold">
                                        {quantity}
                                      </span>
                                    </>
                                  )}
                                  <Button
                                    size="sm"
                                    onClick={() => addToCart(product)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Store className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Henüz ürün eklenmemiş</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="border-t bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Sepet Toplamı:</span>
                    <span className="text-lg font-bold text-[#FF6000]">
                      {getCartTotal().toFixed(2)} ₺
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => router.push('/cart')}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Sipariş Ver ({getCartItemCount()})
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
