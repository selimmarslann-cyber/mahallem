'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bike, Gauge, Wrench, Sparkles, Zap, Truck, Monitor, 
  GraduationCap, Heart, Scissors, TreePine, Camera, Utensils, Wind, 
  Square, Shield, Gift, PenTool, HeartPulse, Search, ChevronRight, Loader2,
  CheckCircle2, Star, Users, MapPin, Clock, DollarSign, Award, TrendingUp,
  ArrowRight, Phone, MessageCircle, FileText, Lock, ThumbsUp
} from 'lucide-react'
import Image from 'next/image'
import CategoryCard from '@/components/home/CategoryCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getKeywordSuggestions } from '@/lib/utils/keywords'
import { SERVICE_CATEGORIES } from '@/lib/data/service-categories'

// Popüler kategorilerin SERVICE_CATEGORIES ID mapping'i
// Eğer mapping yoksa, kategori adından eşleştirme yapılacak
const CATEGORY_ID_MAPPING: Record<string, string> = {
  'temizlik': 'cleaning',
  'elektrik': 'electricity',
  'tesisat': 'plumbing',
  'boya': 'painting',
  'nakliyat': 'moving',
  'beyaz-esya': 'appliance-repair',
  'evcil': 'pet-care-services',
  'marangoz': 'carpentry',
  'klima': 'ac-installation',
  // Diğerleri için isimden eşleştirme yapılacak
}

const BANNERS = [
  {
    title: 'Sipariş',
    description: 'Yemek, market, kırtasiye, eczane vb aradığın tüm esnaflar için tıkla, haritadan seç, siparişini oluştur.',
    ctaText: "Sipariş'e Git",
    href: '/map',
    icon: Bike,
    bgImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80', // Delicious food dishes
    overlay: 'rgba(37, 99, 235, 0.05)', // Blue overlay - minimal
  },
  {
    title: 'Hizmetgo', // Logo gibi gösterilecek: hizmet (siyah) + go (turuncu)
    description: 'Hizmet ihtiyacını yaz, esnaflardan teklif al, en uygun olanı seç. Profesyonel çözümler ile işini halledin!',
    ctaText: "Hizmetgo'ya Git",
    href: '/request',
    icon: Wrench,
    bgImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80', // Person painting wall with roller
    overlay: 'rgba(16, 185, 129, 0.05)', // Green overlay - minimal
  },
  {
    title: 'Ek Gelir',
    description: '10 km çevrendeki kısa süreli işlere başvur, ek gelir kazan. Hızlı onay, hızlı ödeme ile anında kazanmaya başla!',
    ctaText: "Ek Gelir'e Git",
    href: '/jobs?tab=instant',
    icon: Gauge,
    bgImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80', // Person doing homework/study
    overlay: 'rgba(239, 68, 68, 0.05)', // Red overlay - minimal
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [instantJobQuery, setInstantJobQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    const query = searchQuery.trim()
    if (!query) {
      return
    }

    // Arama sayfasına yönlendir
    router.push(`/request?q=${encodeURIComponent(query)}`)
  }

  const handleInstantJobSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    const query = instantJobQuery.trim()
    if (!query) {
      return
    }

    // Anlık işler sayfasına yönlendir
    router.push(`/jobs?tab=instant&q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Three Main Banners - Full Width, Divided into 3 */}
      <section className="w-full">
        <div className="flex flex-col md:flex-row h-[calc(100vh-170px)] md:h-[600px]">
          {BANNERS.map((banner, index) => {
            const Icon = banner.icon
            return (
              <div
                key={banner.href}
                className="relative flex-1 group overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative h-full w-full flex flex-col p-8 md:p-12 transition-all duration-300 group-hover:shadow-2xl overflow-hidden"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={banner.bgImage}
                      alt={banner.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Colored Overlay - Minimal for maximum image visibility */}
                  <div 
                    className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-10"
                    style={{ backgroundColor: banner.overlay }}
                  ></div>

                  {/* Content */}
                  <div className={`relative z-10 flex flex-col items-center justify-start h-full max-w-lg mx-auto pt-8 md:pt-12 ${
                    index === 0 ? 'px-4 md:px-6' : ''
                  }`}>
                    {/* Title - Only show if not empty */}
                    {banner.title && (
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 group-hover:scale-105 transition-transform text-center leading-tight"
                        style={{ 
                          textShadow: '2px 2px 4px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.5)',
                          letterSpacing: '-0.03em',
                          fontFamily: "'Inter', 'Poppins', sans-serif"
                        }}
                      >
                        {banner.title === 'Hizmetgo' ? (
                          <>
                            <span 
                              className="text-black lowercase" 
                              style={{ 
                                letterSpacing: '-0.02em',
                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
                                fontWeight: 700
                              }}
                            >
                              hizmet
                            </span>
                            <span 
                              className="lowercase" 
                              style={{ 
                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
                                letterSpacing: '-0.02em',
                                fontWeight: 700,
                                color: '#FF6000',
                                WebkitTextStroke: '2px white',
                              } as React.CSSProperties}
                            >
                              go
                            </span>
                          </>
                        ) : (
                          <span className="text-black">{banner.title}</span>
                        )}
                      </motion.h2>
                    )}

                    {/* Description - Clean Typography */}
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className={`text-base md:text-lg lg:text-xl font-bold max-w-lg leading-relaxed mb-6 md:mb-8 text-center text-black min-h-[4rem] md:min-h-[5rem] flex items-center ${
                        index === 0 ? 'px-2 md:px-4' : 'px-4'
                      }`}
                      style={{ 
                        textShadow: '1px 1px 3px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.5)',
                        lineHeight: '1.6',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {banner.description}
                    </motion.p>

                    {/* Hizmetgo - Hizmet Arama Barı */}
                    {index === 1 && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                        className="w-full max-w-xl px-4 mt-auto"
                      >
                        <form onSubmit={handleSearch} className="mb-4">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <Input
                              type="text"
                              placeholder="Örn: Elektrik, Temizlik, Boya badana, Tesisat..."
                              value={searchQuery}
                              onChange={(e) => {
                                const value = e.target.value
                                setSearchQuery(value)
                                
                                // Anahtar kelime önerileri
                                if (value.trim().length >= 2) {
                                  const keywordSuggestions = getKeywordSuggestions(value, 8)
                                  setSuggestions(keywordSuggestions)
                                  setShowSuggestions(keywordSuggestions.length > 0)
                                } else {
                                  setShowSuggestions(false)
                                  setSuggestions([])
                                }
                              }}
                              onFocus={() => {
                                if (searchQuery.trim().length >= 2 && suggestions.length > 0) {
                                  setShowSuggestions(true)
                                }
                              }}
                              onBlur={() => {
                                setTimeout(() => setShowSuggestions(false), 200)
                              }}
                              className="pl-12 pr-24 h-12 md:h-14 text-base rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white/95 backdrop-blur-sm"
                            />
                            <Button
                              type="submit"
                              disabled={loading}
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 md:h-10 px-6 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Ara'
                              )}
                            </Button>

                            {/* Autocomplete Suggestions */}
                            {showSuggestions && suggestions.length > 0 && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                                {suggestions.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setSearchQuery(suggestion)
                                      setShowSuggestions(false)
                                      handleSearch()
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                                  >
                                    <span className="text-sm text-gray-900">{suggestion}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {/* Hizmetgo Go - Butonlar */}
                    {index === 0 && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                        className="w-full max-w-2xl px-1 md:px-2 flex flex-col sm:flex-row gap-3 md:gap-4 mt-auto"
                      >
                        <Button
                          onClick={() => router.push('/map?view=list')}
                          className="flex-[1.2] h-12 md:h-14 bg-[#FF6000] hover:bg-[#FF7000] text-white font-black text-xs sm:text-sm md:text-base rounded-xl shadow-lg hover:shadow-xl transition-all px-2 md:px-4"
                        >
                          Yakındaki Esnafları Listele
                        </Button>
                        <Button
                          onClick={() => router.push('/map?view=map')}
                          className="flex-1 h-12 md:h-14 bg-white hover:bg-gray-50 text-[#FF6000] font-black text-xs sm:text-sm md:text-base rounded-xl border-2 border-[#FF6000] shadow-lg hover:shadow-xl transition-all px-2 md:px-4"
                        >
                          Haritadan Seç
                        </Button>
                      </motion.div>
                    )}

                    {/* Ek Gelir - Anlık İşler Arama Barı */}
                    {index === 2 && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                        className="w-full max-w-xl px-4 mt-auto"
                      >
                        <form onSubmit={handleInstantJobSearch} className="mb-4">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <Input
                              type="text"
                              placeholder="Örn: Köpeğimi gezdirecek birini arıyorum, Taşıma için ekstra biri lazım..."
                              value={instantJobQuery}
                              onChange={(e) => {
                                setInstantJobQuery(e.target.value)
                              }}
                              className="pl-12 pr-24 h-12 md:h-14 text-base rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-white/95 backdrop-blur-sm"
                            />
                            <Button
                              type="submit"
                              disabled={loading}
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 md:h-10 px-6 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Ara'
                              )}
                            </Button>
                          </div>
                        </form>

                        {/* Açıklama */}
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.9 }}
                          className="text-center"
                        >
                          <p className="text-xs md:text-sm text-red-600 font-bold mb-2 px-3 py-1.5 border-2 border-black rounded-lg bg-white/90 inline-block mx-auto">
                            Bu arama barı vasıfsız işler içindir.
                          </p>
                          <div className="flex flex-wrap justify-center gap-2 text-xs text-black/60 mt-3">
                            <span className="px-2 py-1 bg-white/80 rounded-full">Köpeğimi gezdirecek birini arıyorum</span>
                            <span className="px-2 py-1 bg-white/80 rounded-full">Taşıma için ekstra biri lazım</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>

                  {/* Subtle Hover Glow */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    index === 0 
                      ? 'bg-gradient-to-br from-orange-100/50 to-transparent' 
                      : index === 1
                      ? 'bg-gradient-to-br from-red-50/50 to-transparent'
                      : 'bg-gradient-to-br from-green-50/50 to-transparent'
                  }`}></div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Popüler Kategoriler - 20 Adet */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              Popüler Kategoriler
            </h2>
            <p className="text-gray-600 text-lg">İhtiyacın olan hizmeti hızlıca bul</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {POPULAR_CATEGORIES.map((category) => {
              // SERVICE_CATEGORIES ID'sine çevir
              let serviceCategoryId: string | undefined = CATEGORY_ID_MAPPING[category.id]
              
              // Mapping yoksa, kategori adından eşleştirme yap
              if (!serviceCategoryId) {
                const matchedCategory = SERVICE_CATEGORIES.find(cat => 
                  cat.name.toLowerCase().includes(category.name.toLowerCase()) ||
                  category.name.toLowerCase().includes(cat.name.toLowerCase())
                )
                if (matchedCategory?.id) {
                  serviceCategoryId = matchedCategory.id
                }
              }
              
              const href = serviceCategoryId 
                ? `/request?categoryId=${serviceCategoryId}`
                : `/request?q=${encodeURIComponent(category.name.toLowerCase())}`
              
              return (
                <CategoryCard 
                  key={category.id} 
                  {...category} 
                  href={href}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır - 3 Adım */}
      <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hizmetgo ile hizmet almak veya vermek çok kolay
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: '01',
                title: 'İhtiyacını Belirt',
                description: 'Hangi hizmete ihtiyacın var? Arama yap veya kategori seç, ihtiyacını detaylıca anlat.',
                icon: Search,
                color: 'bg-[#FF6000]'
              },
              {
                step: '02',
                title: 'Teklifler Al',
                description: 'Yakındaki esnaflardan teklifler al, fiyatları karşılaştır, yorumları oku ve en uygun olanı seç.',
                icon: FileText,
                color: 'bg-green-500'
              },
              {
                step: '03',
                title: 'İşini Halledir',
                description: 'Seçtiğin esnafla iletişime geç, işini hallettir ve memnun kalırsan değerlendirme yap.',
                icon: CheckCircle2,
                color: 'bg-blue-500'
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`${item.color} w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-2xl`}>
                        {item.step}
                      </div>
                      <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Neden Hizmetgo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mahallendeki en iyi esnaflarla buluş, güvenle hizmet al
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Yakındaki Esnaflar',
                description: '10 km çevrendeki esnafları gör, en yakınını seç',
                color: 'text-[#FF6000]',
                bgColor: 'bg-[#FF6000]/10'
              },
              {
                icon: Star,
                title: 'Değerlendirmeler',
                description: 'Gerçek müşteri yorumları ve puanları oku',
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-500/10'
              },
              {
                icon: Shield,
                title: 'Güvenli Ödeme',
                description: 'Güvenli ödeme sistemi ile işini güvence altına al',
                color: 'text-green-500',
                bgColor: 'bg-green-500/10'
              },
              {
                icon: Clock,
                title: 'Hızlı Yanıt',
                description: 'Esnaflardan dakikalar içinde teklif al',
                color: 'text-blue-500',
                bgColor: 'bg-blue-500/10'
              },
              {
                icon: DollarSign,
                title: 'Uygun Fiyatlar',
                description: 'Birden fazla teklif al, en uygun fiyatı seç',
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10'
              },
              {
                icon: Users,
                title: 'Binlerce Esnaf',
                description: '350+ kategoride binlerce kayıtlı esnaf',
                color: 'text-red-500',
                bgColor: 'bg-red-500/10'
              },
              {
                icon: Award,
                title: 'Kaliteli Hizmet',
                description: 'Sadece doğrulanmış ve kaliteli esnaflar',
                color: 'text-indigo-500',
                bgColor: 'bg-indigo-500/10'
              },
              {
                icon: TrendingUp,
                title: 'Ek Gelir Fırsatı',
                description: 'Vasıfsız işler için anında başvur, ek gelir kazan',
                color: 'text-orange-500',
                bgColor: 'bg-orange-500/10'
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#FF6000] hover:shadow-lg transition-all group"
                >
                  <div className={`${feature.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="w-full py-20 bg-gradient-to-br from-[#FF6000] to-[#FF8000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Kayıtlı Esnaf', icon: Users },
              { number: '350+', label: 'Hizmet Kategorisi', icon: Gift },
              { number: '50,000+', label: 'Mutlu Müşteri', icon: Heart },
              { number: '4.8', label: 'Ortalama Puan', icon: Star }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                    <Icon className="w-8 h-8 text-white mx-auto mb-4" />
                    <div className="text-4xl md:text-5xl font-black text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white/90 font-semibold text-sm md:text-base">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Güven Unsurları */}
      <section className="w-full py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Güvenle Kullan
            </h2>
            <p className="text-lg text-gray-600">
              Hizmetgo'de güvenlik ve kalite önceliğimiz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: 'Güvenli Ödeme',
                description: 'Tüm ödemeler SSL şifreleme ile korunur'
              },
              {
                icon: Shield,
                title: 'Doğrulanmış Esnaflar',
                description: 'Tüm esnaflar kimlik ve belge kontrolünden geçer'
              },
              {
                icon: ThumbsUp,
                title: 'Müşteri Memnuniyeti',
                description: '7/24 destek ve memnuniyet garantisi'
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 text-center border-2 border-gray-200 hover:border-[#FF6000] transition-all"
                >
                  <div className="bg-[#FF6000]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#FF6000]" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="w-full py-20 bg-gradient-to-r from-[#FF6000] to-[#FF8000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Hemen Başla!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Mahallendeki en iyi esnaflarla buluş, hizmet al veya ek gelir kazan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/request')}
                size="lg"
                className="bg-white text-[#FF6000] hover:bg-gray-50 font-black text-lg px-8 py-6 rounded-xl shadow-xl"
              >
                Hizmet Ara
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => router.push('/partner')}
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-black text-lg px-8 py-6 rounded-xl"
              >
                Esnaf Ol
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// 20 Popüler Kategori
const POPULAR_CATEGORIES = [
  {
    id: 'temizlik',
    name: 'Temizlik',
    description: 'Ev temizliği, ütü',
    icon: Sparkles,
    color: 'bg-emerald-100 text-emerald-700',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop', // Cleaning
  },
  {
    id: 'elektrik',
    name: 'Elektrik',
    description: 'Elektrik işleri',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-700',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop', // Electrician
  },
  {
    id: 'tesisat',
    name: 'Su Tesisatı',
    description: 'Su tesisatı, kalorifer',
    icon: Wrench,
    color: 'bg-blue-100 text-blue-700',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop', // Water pipes installation
  },
  {
    id: 'boya',
    name: 'Boya / Badana',
    description: 'İç ve dış cephe',
    icon: Wrench,
    color: 'bg-pink-100 text-pink-700',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop', // Person painting wall with roller
  },
  {
    id: 'nakliyat',
    name: 'Nakliyat',
    description: 'Evden eve, parça eşya',
    icon: Truck,
    color: 'bg-purple-100 text-purple-700',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Moving truck with boxes
  },
  {
    id: 'beyaz-esya',
    name: 'Beyaz Eşya',
    description: 'Tamir ve bakım',
    icon: Monitor,
    color: 'bg-cyan-100 text-cyan-700',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Appliance repair
  },
  {
    id: 'egitim',
    name: 'Özel Ders',
    description: 'Matematik, dil, müzik',
    icon: GraduationCap,
    color: 'bg-amber-100 text-amber-700',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop', // Education
  },
  {
    id: 'evcil',
    name: 'Evcil Hayvan',
    description: 'Bakım, yürüyüş',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop', // Pet care
  },
  {
    id: 'marangoz',
    name: 'Marangoz',
    description: 'Mobilya, ahşap işleri',
    icon: Wrench,
    color: 'bg-orange-100 text-orange-700',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop', // Woodworking/carpentry
  },
  {
    id: 'kuaför',
    name: 'Kuaför',
    description: 'Saç kesimi, bakım',
    icon: Scissors,
    color: 'bg-purple-100 text-purple-700',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop', // Hair salon
  },
  {
    id: 'bahçıvan',
    name: 'Bahçıvan',
    description: 'Bahçe bakımı, peyzaj',
    icon: TreePine,
    color: 'bg-green-100 text-green-700',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', // Gardening
  },
  {
    id: 'fotoğrafçı',
    name: 'Fotoğrafçı',
    description: 'Düğün, etkinlik',
    icon: Camera,
    color: 'bg-indigo-100 text-indigo-700',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop', // Photography
  },
  {
    id: 'yemek',
    name: 'Yemek',
    description: 'Catering, yemek servisi',
    icon: Utensils,
    color: 'bg-red-100 text-red-700',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop', // Food
  },
  {
    id: 'klima',
    name: 'Klima',
    description: 'Montaj, bakım, tamir',
    icon: Wind,
    color: 'bg-blue-100 text-blue-700',
    image: 'https://images.unsplash.com/photo-1631540575400-4e0c0c0c0c0c?w=400&h=300&fit=crop', // Person repairing AC
  },
  {
    id: 'cam-balkon',
    name: 'Cam Balkon',
    description: 'Montaj, tamir',
    icon: Square,
    color: 'bg-sky-100 text-sky-700',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop', // Glass balcony/windows
  },
  {
    id: 'güvenlik',
    name: 'Güvenlik',
    description: 'Kamera, alarm sistemi',
    icon: Shield,
    color: 'bg-gray-100 text-gray-700',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop', // Security camera
  },
  {
    id: 'organizasyon',
    name: 'Organizasyon',
    description: 'Düğün, etkinlik',
    icon: Gift,
    color: 'bg-rose-100 text-rose-700',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop', // Event organization
  },
  {
    id: 'tamirci',
    name: 'Tamirci',
    description: 'Genel tamir işleri',
    icon: Wrench,
    color: 'bg-slate-100 text-slate-700',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop', // Car mechanic
  },
  {
    id: 'nakış',
    name: 'Nakış',
    description: 'Dikiş, nakış işleri',
    icon: PenTool,
    color: 'bg-fuchsia-100 text-fuchsia-700',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', // Sewing
  },
  {
    id: 'eczane',
    name: 'Eczane',
    description: 'İlaç, sağlık ürünleri',
    icon: HeartPulse,
    color: 'bg-red-100 text-red-700',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop', // Pharmacy
  },
]
