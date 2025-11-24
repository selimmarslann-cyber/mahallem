'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import GigCard from '@/components/home/GigCard'
import { searchServiceCategories } from '@/lib/services/serviceSearchService'
import { ServiceCategory, SubService } from '@/lib/types/service-categories'
import {
  Search,
  Sparkles,
  Wrench,
  Truck,
  Heart,
  GraduationCap,
  ShoppingCart,
  Briefcase,
  Monitor,
  MapPin,
  Star,
  CheckCircle2,
  ArrowRight,
  User,
  MessageSquare,
  Users,
  BriefcaseIcon,
  Map,
  FileText,
  Zap,
  Clock,
  ChevronRight,
} from 'lucide-react'

const CATEGORIES = [
  {
    id: 'TEMIZLIK',
    name: 'Temizlik & Ev Yardımı',
    description: 'Ev temizliği, boş ev temizliği, ütü ve daha fazlası.',
    icon: Sparkles,
    color: 'bg-emerald-100 text-emerald-700',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
  },
  {
    id: 'TADILAT',
    name: 'Tadilat & Usta',
    description: 'Boyacı, tesisatçı, elektrikçi ve tadilat işleri.',
    icon: Wrench,
    color: 'bg-blue-100 text-blue-700',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
  },
  {
    id: 'NAKLIYAT',
    name: 'Nakliyat & Taşıma',
    description: 'Evden eve nakliyat, parça eşya, mini taşıma.',
    icon: Truck,
    color: 'bg-purple-100 text-purple-700',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
  },
  {
    id: 'EVCIL',
    name: 'Evcil Hayvan Bakımı',
    description: 'Günlük yürüyüş, kısa süreli bakıcı, pansiyon.',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
  },
  {
    id: 'EGITIM',
    name: 'Özel Ders & Eğitim',
    description: 'Matematik, dil, müzik ve sınav hazırlık.',
    icon: GraduationCap,
    color: 'bg-amber-100 text-amber-700',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
  },
  {
    id: 'KASIYER',
    name: 'Kısa Süreli Kasiyer / Garson',
    description: 'Günlük vardiya, hafta sonu işler.',
    icon: ShoppingCart,
    color: 'bg-orange-100 text-orange-700',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  },
  {
    id: 'OFIS',
    name: 'Ofis & Depo Yardımı',
    description: 'Sayım, arşiv düzenleme, taşıma desteği.',
    icon: Briefcase,
    color: 'bg-indigo-100 text-indigo-700',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
  },
  {
    id: 'DIJITAL',
    name: 'Dijital Hizmetler',
    description: 'Sosyal medya, tasarım, basit web işleri.',
    icon: Monitor,
    color: 'bg-cyan-100 text-cyan-700',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  },
  {
    id: 'TESISAT',
    name: 'Tesisat & Su Tesisatı',
    description: 'Su tesisatı, kalorifer, kombi tamiri ve bakımı.',
    icon: Wrench,
    color: 'bg-blue-100 text-blue-700',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
  },
  {
    id: 'ELEKTRIK',
    name: 'Elektrik İşleri',
    description: 'Elektrik tesisatı, aydınlatma, priz montajı.',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-700',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  },
  {
    id: 'BOYA',
    name: 'Boya & Badana',
    description: 'İç ve dış cephe boyama, duvar kağıdı.',
    icon: Wrench,
    color: 'bg-pink-100 text-pink-700',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
  },
  {
    id: 'MARANGOZ',
    name: 'Marangoz & Mobilya',
    description: 'Mobilya yapımı, tamiri, kapı pencere.',
    icon: Wrench,
    color: 'bg-amber-100 text-amber-700',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
  },
  {
    id: 'KUAFOR',
    name: 'Kuaför & Güzellik',
    description: 'Saç kesimi, boyama, makyaj, güzellik.',
    icon: Sparkles,
    color: 'bg-rose-100 text-rose-700',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
  },
  {
    id: 'YEMEK',
    name: 'Yemek & Catering',
    description: 'Catering, özel yemek, pasta yapımı.',
    icon: ShoppingCart,
    color: 'bg-red-100 text-red-700',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop',
  },
  {
    id: 'GIYIM',
    name: 'Giyim & Dikiş',
    description: 'Dikiş, tamir, özel dikim, ütü.',
    icon: Sparkles,
    color: 'bg-indigo-100 text-indigo-700',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  },
  {
    id: 'SPOR',
    name: 'Spor & Fitness',
    description: 'Kişisel antrenör, spor ekipmanı, fitness.',
    icon: Zap,
    color: 'bg-green-100 text-green-700',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
  },
  {
    id: 'FOTO',
    name: 'Fotoğraf & Video',
    description: 'Fotoğrafçı, video çekimi, düğün fotoğrafçısı.',
    icon: Monitor,
    color: 'bg-slate-100 text-slate-700',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop',
  },
  {
    id: 'BAHCE',
    name: 'Bahçe & Peyzaj',
    description: 'Bahçıvan, peyzaj, ağaç budama.',
    icon: Sparkles,
    color: 'bg-lime-100 text-lime-700',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
  },
  {
    id: 'BEBEK',
    name: 'Bebek & Çocuk Bakımı',
    description: 'Bebek bakıcısı, çocuk bakımı, oyun ablası.',
    icon: Heart,
    color: 'bg-cyan-100 text-cyan-700',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
  },
  {
    id: 'MUZIK',
    name: 'Müzik & Enstrüman',
    description: 'Müzik dersi, enstrüman tamiri, DJ.',
    icon: Zap,
    color: 'bg-violet-100 text-violet-700',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
  },
]

// Search suggestion type
type SearchSuggestion = {
  type: 'category' | 'subService'
  category: ServiceCategory
  subService?: SubService
  displayName: string
  matchedKeywords: string[]
}

const INSTANT_GIGS = [
  {
    title: 'Bu akşam köpek gezdirme (1 saat)',
    location: 'Kadıköy',
    budget: 'Ücret: 300 TL',
    tag: 'Evcil Hayvan',
    timeLabel: 'Bugün',
    distance: '0.5 km',
  },
  {
    title: '3 günlük köpek bakıcısı',
    location: 'Beşiktaş',
    budget: 'Ücret: 3.000 TL',
    tag: 'Evcil Hayvan',
    timeLabel: 'Bu Hafta',
    distance: '1.2 km',
  },
  {
    title: 'Hafta sonu depo sayımı için 2 kişi',
    location: 'Çorlu',
    budget: 'Ücret: 2.500 TL',
    tag: 'Ofis & Depo',
    timeLabel: 'Hafta Sonu',
    distance: '15 km',
  },
  {
    title: 'Yarın ev temizliği yardımcısı aranıyor',
    location: 'Şişli',
    budget: 'Ücret: 1.500 TL',
    tag: 'Temizlik',
    timeLabel: 'Yarın',
    distance: '2.3 km',
  },
]

// Animated Counter Component
function AnimatedCounter({ end }: { end: number }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = end / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [end])
  
  return <span>{count.toLocaleString('tr-TR')}+</span>
}

const TESTIMONIALS = [
  {
    name: 'Ayşe Yılmaz',
    role: 'Müşteri',
    rating: 4.8,
    quote: 'Evime en yakın temizlikçiyi 10 dakika içinde buldum. Fiyatları karşılaştırıp yorumlara göre seçmek çok rahat. Artık çevreme sormak zorunda kalmıyorum.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
  },
  {
    name: 'Mehmet Demir',
    role: 'Esnaf – Tadilat',
    rating: 4.9,
    quote: 'Dükkanım Mahallem\'e kayıt olduğundan beri mahalleden düzenli iş alıyorum. Yapılan her iş sonrası gelen yorumlar yeni müşteriler için büyük güven sağlıyor.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
  },
  {
    name: 'Zeynep Kaya',
    role: 'Kısa süreli iş veren',
    rating: 4.7,
    quote: 'Köpeğime şehir dışına çıktığımda bakıcı bulmak hep stresliydi. Mahallem\'de hem bütçeme uygun hem de daha önce puanlanmış bir bakıcı bulmak birkaç dakika sürdü.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [selectedSuggestion, setSelectedSuggestion] = useState<SearchSuggestion | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Arama önerilerini filtrele - SERVICE_CATEGORIES kullanarak
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = searchServiceCategories(searchQuery, 20) // 20 sonuç al
      const suggestionList: SearchSuggestion[] = []
      
      // Her kategori için kategori ve alt hizmet önerileri oluştur
      results.forEach((result) => {
        // Kategori önerisi
        suggestionList.push({
          type: 'category',
          category: result.category,
          displayName: result.category.name,
          matchedKeywords: result.matchedKeywords,
        })
        
        // En iyi eşleşen alt hizmetleri de ekle (ilk 3)
        result.category.subServices.slice(0, 3).forEach((subService) => {
          const hasMatch = subService.keywords.some(kw => 
            kw.toLowerCase().includes(searchQuery.toLowerCase())
          )
          if (hasMatch) {
            suggestionList.push({
              type: 'subService',
              category: result.category,
              subService,
              displayName: `${result.category.name} - ${subService.name}`,
              matchedKeywords: subService.keywords.filter(kw => 
                kw.toLowerCase().includes(searchQuery.toLowerCase())
              ),
            })
          }
        })
      })
      
      setSuggestions(suggestionList.slice(0, 10)) // En fazla 10 öneri göster
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedSuggestion(null)
    }
  }, [searchQuery])

  // Klavye navigasyonu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedSuggestion) {
      e.preventDefault()
      handleSuggestionSelect(selectedSuggestion)
    } else if (e.key === 'Enter' && selectedIndex >= 0 && suggestions[selectedIndex]) {
      e.preventDefault()
      handleSuggestionSelect(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSelectedSuggestion(suggestion)
    setSearchQuery(suggestion.displayName)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    
    // Request sayfasına yönlendir
    const params = new URLSearchParams({
      categoryId: suggestion.category.id,
    })
    if (suggestion.subService) {
      params.set('subServiceId', suggestion.subService.id)
    }
    router.push(`/request?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSuggestion) {
      handleSuggestionSelect(selectedSuggestion)
    } else if (searchQuery.trim()) {
      // Eğer seçim yapılmadıysa, en iyi eşleşmeyi bul
      const results = searchServiceCategories(searchQuery, 1)
      if (results.length > 0) {
        const bestMatch: SearchSuggestion = {
          type: 'category',
          category: results[0].category,
          displayName: results[0].category.name,
          matchedKeywords: results[0].matchedKeywords,
        }
        handleSuggestionSelect(bestMatch)
      } else {
        alert('Lütfen önce bir hizmet veya anahtar kelime seçin.')
      }
    } else {
      alert('Lütfen önce bir hizmet veya anahtar kelime seçin.')
    }
  }

  // Dışarı tıklandığında önerileri kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white">
      {/* Hero Section - Full Background Image with Overlay - En Üstte */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-0">
        {/* Background Image - Laptop Başında Çalışan Mutlu Aile - Net ve Efektsiz */}
        <div 
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-family.jpg')`,
            backgroundSize: '130%',
            backgroundPosition: 'center 20%',
            imageRendering: 'crisp-edges',
          }}
        />

        {/* Content Container - Resmin Üstünde */}
        <div className="relative z-20 max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 w-full py-32 pt-32">
          <div className="max-w-4xl">
            {/* Premium Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-8 lg:space-y-10"
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
              >
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-6 py-2.5 rounded-full text-sm font-bold shadow-xl hover:bg-white/30 transition-all inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Mahallendeki güvenilir esnaf, hizmetler ve işler tek platformda</span>
                </Badge>
              </motion.div>

              {/* Premium H1 - Net ve Okunabilir */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-white display-font"
                style={{
                  textShadow: '2px 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)',
                }}
              >
                <span className="block">
                  Mahallem'de{' '}
                  <span className="relative inline-block">
                    <span 
                      className="text-[#FF9500] font-black"
                      style={{
                        textShadow: '0 2px 6px rgba(0,0,0,0.4)',
                      }}
                    >
                      hizmet
                    </span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7A00] to-[#FFB347] rounded-full"
                    />
                  </span>{' '}
                  de bulursun,
                </span>
                <span className="block mt-2">
                  <span className="relative inline-block">
                    <span 
                      className="text-[#FF9500] font-black"
                      style={{
                        textShadow: '0 2px 6px rgba(0,0,0,0.4)',
                      }}
                    >
                      iş
                    </span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7A00] to-[#FFB347] rounded-full"
                    />
                  </span>{' '}
                  de
                </span>
              </motion.h1>

              {/* Premium Subtitle - Net ve Okunabilir */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl md:text-2xl lg:text-3xl text-white leading-relaxed max-w-3xl font-medium"
                style={{
                  textShadow: '1px 1px 6px rgba(0,0,0,0.6), 0 0 15px rgba(0,0,0,0.4)',
                }}
              >
                Temizlikten tadilata, köpek bakıcılığından kısa süreli kasiyerliğe kadar; esnaflar, bireysel hizmet verenler ve anlık işler Mahallem'de buluşuyor.
              </motion.p>

              {/* Premium Search Bar with Autocomplete */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                onSubmit={handleSearch}
                className="relative max-w-3xl"
              >
                <div ref={searchContainerRef} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF7A00] to-[#FFB347] rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                  <div className="relative flex gap-3 bg-white/95 backdrop-blur-xl rounded-3xl p-2 shadow-2xl border border-white/20">
                    <div className="flex-1 relative">
                      <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6 z-10" />
                      <Input
                        type="text"
                        placeholder="Hangi hizmete veya işe ihtiyacın var?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                          if (searchQuery.trim().length > 0 && suggestions.length > 0) {
                            setShowSuggestions(true)
                          }
                        }}
                        className="pl-14 pr-5 py-8 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 font-medium"
                        aria-label="Hizmet veya iş ara"
                        autoComplete="off"
                      />
                      
                      {/* Autocomplete Dropdown */}
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
                        >
                          {suggestions.map((suggestion, index) => (
                            <motion.div
                              key={`${suggestion.category.id}-${suggestion.subService?.id || 'cat'}-${index}`}
                              onClick={() => handleSuggestionSelect(suggestion)}
                              onMouseEnter={() => {
                                setSelectedIndex(index)
                                setSelectedSuggestion(suggestion)
                              }}
                              className={`
                                px-6 py-4 cursor-pointer transition-all duration-200
                                ${
                                  selectedIndex === index
                                    ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500'
                                    : 'hover:bg-slate-50'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-slate-900 text-base">
                                      {suggestion.displayName}
                                    </p>
                                    <Badge variant="outline" className="text-xs">
                                      {suggestion.type === 'category' ? 'Kategori' : 'Alt Hizmet'}
                                    </Badge>
                                  </div>
                                  {suggestion.matchedKeywords.length > 0 && (
                                    <p className="text-sm text-slate-500 mt-1">
                                      {suggestion.matchedKeywords.slice(0, 3).join(', ')}
                                      {suggestion.matchedKeywords.length > 3 && '...'}
                                    </p>
                                  )}
                                </div>
                                <ChevronRight
                                  className={`w-5 h-5 text-slate-400 transition-transform ${
                                    selectedIndex === index ? 'translate-x-1 text-orange-500' : ''
                                  }`}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-gradient-to-r from-[#FF7A00] to-[#FF8A00] hover:from-[#FF8A00] hover:to-[#FF9A00] text-white rounded-2xl px-10 py-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-all whitespace-nowrap relative overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Search className="w-5 h-5" />
                          Ara
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#FF9A00] to-[#FFAA00] opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={false}
                        />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.form>

              {/* Premium 3 Flow Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="grid sm:grid-cols-3 gap-4 pt-4"
              >
                {[
                  {
                    icon: Map,
                    title: 'Haritadan Esnaf Bul',
                    subtitle: 'Canlı haritada gör',
                    gradient: 'from-orange-500 to-orange-600',
                    hoverGradient: 'from-orange-400 to-orange-500',
                    href: '/map',
                  },
                  {
                    icon: FileText,
                    title: 'Hizmet İhtiyacını Yaz',
                    subtitle: 'Teklifler gelsin',
                    gradient: 'from-purple-500 to-purple-600',
                    hoverGradient: 'from-purple-400 to-purple-500',
                    href: '/request',
                  },
                  {
                    icon: Zap,
                    title: 'Bölgendeki Anlık İşlere Bak',
                    subtitle: 'Kısa süreli işler',
                    gradient: 'from-emerald-500 to-emerald-600',
                    hoverGradient: 'from-emerald-400 to-emerald-500',
                    href: '/jobs',
                  },
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                      onClick={() => router.push(item.href)}
                    >
                      <Card className="bg-white/95 backdrop-blur-md border-2 border-white/30 hover:border-white/50 rounded-2xl p-6 cursor-pointer hover:shadow-2xl transition-all group relative overflow-hidden">
                        {/* Gradient glow on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        <div className="relative flex items-center gap-4">
                          <motion.div
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-xl group-hover:shadow-2xl transition-all`}
                          >
                            <Icon className="w-7 h-7 text-white" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-orange-600 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-slate-600 font-medium">{item.subtitle}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Floating Stats - Bottom of Hero */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="flex flex-wrap gap-4 pt-8"
              >

                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/30 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Star className="w-7 h-7 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-slate-900">4.8</p>
                    <p className="text-sm font-semibold text-slate-600">Ortalama Puan</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/30 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-slate-900">500+</p>
                    <p className="text-sm font-semibold text-slate-600">Aktif Esnaf</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced */}
      <section className="bg-gradient-to-b from-[#FFFDF7] to-white py-24">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-6 px-4 py-1.5 rounded-full text-sm font-semibold">
              Nasıl Çalışır?
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Mahallem{' '}
              <span className="bg-gradient-to-r from-[#FF7A00] to-[#FFB347] bg-clip-text text-transparent">
                üç farklı şekilde
              </span>{' '}
              çalışır
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              İhtiyacına en uygun yöntemi seç ve mahallendeki hizmetleri keşfet
            </p>
          </motion.div>

          <Tabs defaultValue="harita" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl mb-12 shadow-xl border-2 border-slate-200">
              <TabsTrigger
                value="harita"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all py-3"
              >
                <Map className="w-4 h-4 mr-2 inline" />
                Haritadan Esnaf Bul
              </TabsTrigger>
              <TabsTrigger
                value="talep"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all py-3"
              >
                <FileText className="w-4 h-4 mr-2 inline" />
                Hizmet İhtiyacını Yaz
              </TabsTrigger>
              <TabsTrigger
                value="anlik"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all py-3"
              >
                <Zap className="w-4 h-4 mr-2 inline" />
                Anlık İşler
              </TabsTrigger>
            </TabsList>

            {/* Harita Tab */}
            <TabsContent value="harita" className="mt-8">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: 1,
                    icon: Map,
                    title: 'Haritayı aç',
                    description: 'Mahallende hangi esnaflar ve hizmet verenler var, haritadan gör.',
                    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop', // Harita görseli
                  },
                  {
                    step: 2,
                    icon: CheckCircle2,
                    title: 'İşletmeni seç',
                    description: 'Puan, yorum ve mesafeye göre sana en uygun olanı seç.',
                    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', // Esnaf/işletme görseli
                  },
                  {
                    step: 3,
                    icon: MessageSquare,
                    title: 'Talep gönder veya hemen sipariş ver',
                    description: 'İster detaylı talep aç, ister direkt hizmet / ürün seçerek sipariş oluştur.',
                    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', // Sipariş/chat görseli
                  },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.step * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="bg-white border-2 border-slate-100 shadow-lg rounded-2xl overflow-hidden h-full hover:shadow-2xl hover:border-orange-200 transition-all duration-300 group cursor-pointer">
                      {/* Image */}
                      <div 
                        className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url('${item.image}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-xl z-10 border-2 border-white/20">
                          {item.step}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Talep Tab */}
            <TabsContent value="talep" className="mt-8">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: 1,
                    icon: FileText,
                    title: 'İhtiyacını birkaç soruda anlat',
                    description: "Armut'taki gibi; neye ihtiyacın olduğunu detaylı yaz.",
                    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop', // Yazma/form doldurma görseli
                  },
                  {
                    step: 2,
                    icon: Zap,
                    title: 'Anahtar kelimelerle eşleştir',
                    description: 'Aynı işi yapan esnafların ve bireysel hizmet verenlerin profilleriyle otomatik eşleşsin.',
                    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', // Algoritma/eşleştirme görseli
                  },
                  {
                    step: 3,
                    icon: CheckCircle2,
                    title: 'Teklifleri al, karşılaştır ve seç',
                    description: 'Ücretine, yorumlara ve puanlara göre en uygun teklifi seç.',
                    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop', // Karşılaştırma/teklif görseli
                  },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.step * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="bg-white border-2 border-slate-100 shadow-lg rounded-2xl overflow-hidden h-full hover:shadow-2xl hover:border-purple-200 transition-all duration-300 group cursor-pointer">
                      {/* Image */}
                      <div 
                        className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url('${item.image}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-xl z-10 border-2 border-white/20">
                          {item.step}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">{item.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Anlık İşler Tab */}
            <TabsContent value="anlik" className="mt-8">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: 1,
                    icon: BriefcaseIcon,
                    title: 'Kısa süreli iş ilanı ver veya listeye göz at',
                    description: "'Köpeğimi bu akşam gezdirecek birini arıyorum' gibi ilanları dakikalar içinde oluştur.",
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', // İş ilanı/notepad görseli
                  },
                  {
                    step: 2,
                    icon: Users,
                    title: 'Bölgenle eşleşsin',
                    description: 'Yakınındaki uygun profiller ve iş arayanlar anında bildirim alsın.',
                    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', // Konum/eşleştirme görseli
                  },
                  {
                    step: 3,
                    icon: MessageSquare,
                    title: 'Hızlıca anlaş',
                    description: 'Mesajlaş, detayları netleştir, işi başlat ve puanla.',
                    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=300&fit=crop', // Mesajlaşma/iletişim görseli
                  },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.step * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="bg-white border-2 border-slate-100 shadow-lg rounded-2xl overflow-hidden h-full hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 group cursor-pointer">
                      {/* Image */}
                      <div 
                        className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url('${item.image}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-xl z-10 border-2 border-white/20">
                          {item.step}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      <section className="bg-white py-24">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-3">
                Mahallende en çok aranan{' '}
                <span className="bg-gradient-to-r from-[#FF7A00] to-[#FFB347] bg-clip-text text-transparent">
                  kategoriler
                </span>
              </h2>
              <p className="text-slate-600 text-lg">İhtiyacın olan hizmeti hızlıca bul</p>
            </div>
            <Link
              href="/map"
              className="text-orange-600 hover:text-orange-700 font-semibold hover:underline flex items-center gap-2 group whitespace-nowrap"
            >
              Tüm kategorileri gör
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {CATEGORIES.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <Link href={`/request?category=${category.id}`}>
                    <Card className="bg-white border-2 border-slate-200 hover:border-orange-400 rounded-2xl overflow-hidden cursor-pointer transition-all shadow-lg hover:shadow-2xl h-full group">
                      {/* Category Image */}
                      <div className="relative h-36 md:h-40 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                          style={{ backgroundImage: `url(${category.image})` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                        </div>
                        {/* Icon Overlay */}
                        <div className="absolute top-4 left-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center shadow-xl border-2 border-white/30 backdrop-blur-sm`}
                          >
                            <Icon className="w-6 h-6" />
                          </motion.div>
                        </div>
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-5 bg-white">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{category.description}</p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Esnaflar Section - Premium with Background Image */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image - Güler Yüzlü Berber */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1920&h=1080&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />
        {/* Light Overlay for Readability */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        
        <div className="relative z-10 max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-6 px-4 py-1.5 rounded-full text-sm font-semibold">
                Esnaflar İçin
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                Mahallendeki{' '}
                <span className="bg-gradient-to-r from-[#FF7A00] to-[#FFB347] bg-clip-text text-transparent">
                  esnafa destek ol
                </span>
              </h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8">
                Mahallem, büyük platformlarda kaybolan esnafları mahalle sakinleriyle buluşturur. Dükkanını fotoğraflar, hizmetler ve yorumlarla öne çıkar; mahallenden daha fazla iş al.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  { text: 'Ücretsiz işletme profili oluştur', icon: CheckCircle2 },
                  { text: 'Haritada görünür ol', icon: Map },
                  { text: 'Yorum ve puanlarınla güven inşa et', icon: Star },
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="flex items-center gap-4 text-slate-700 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-base md:text-lg font-medium">{item.text}</span>
                    </motion.li>
                  )
                })}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="premium"
                  size="xl"
                  className="w-full sm:w-auto"
                  onClick={() => router.push('/partner')}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Esnaf Ol
                  </span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto"
                  onClick={() => router.push('/auth/login?type=business&redirect=/business/jobs')}
                >
                  Esnaf Girişi
                </Button>
              </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Animated Walking Scene */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div 
                className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500"
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                  }} />
                </div>

                {/* Main Animation Container - Fits Perfectly */}
                <div className="absolute inset-0" style={{ zIndex: 1 }}>
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 400 300" 
                    preserveAspectRatio="xMidYMid meet"
                    style={{ display: 'block', pointerEvents: 'none' }}
                  >
                    {/* Sky/Background */}
                    <rect x="0" y="0" width="400" height="300" fill="url(#skyGradientEsnaf)" />
                    
                    {/* Road - Bottom */}
                    <rect x="0" y="220" width="400" height="80" fill="#8B4513" opacity="0.7" />
                    <line
                      x1="0"
                      y1="260"
                      x2="400"
                      y2="260"
                      stroke="#FFD700"
                      strokeWidth="4"
                      strokeDasharray="15 10"
                      opacity="0.9"
                    />
                    
                    {/* Shop Signs - Sequential Appearance */}
                    {[
                      { x: 80, name: 'Kasap Recep', delay: 0.8, color: '#FF6B35' },
                      { x: 200, name: 'Köz Restoran', delay: 2.0, color: '#F7931E' },
                      { x: 320, name: 'Bakkal Ali', delay: 3.2, color: '#FFB347' },
                    ].map((shop, i) => (
                      <g key={i}>
                        {/* Shop Building */}
                        <motion.rect
                          x={shop.x - 50}
                          y="80"
                          width="100"
                          height="140"
                          fill="#FFFFFF"
                          rx="10"
                          initial={{ opacity: 0, scale: 0.3, y: 100 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: shop.delay, duration: 0.8, type: "spring", stiffness: 100 }}
                        />
                        {/* Shop Sign */}
                        <motion.rect
                          x={shop.x - 45}
                          y="90"
                          width="90"
                          height="50"
                          fill={shop.color}
                          rx="8"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: shop.delay + 0.3, duration: 0.6 }}
                        />
                        {/* Shop Name */}
                        <motion.text
                          x={shop.x}
                          y="125"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="16"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: shop.delay + 0.5, duration: 0.4 }}
                        >
                          {shop.name}
                        </motion.text>
                        {/* Shop Door */}
                        <rect x={shop.x - 20} y="150" width="40" height="70" fill="#8B4513" rx="3" />
                      </g>
                    ))}
                    
                    {/* Walking Stick Figure - Slow Smooth Animation */}
                    <motion.g
                      initial={{ x: -40 }}
                      animate={{ x: 440 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 1.2
                      }}
                    >
                      {/* Head - Bigger */}
                      <circle cx="0" cy="180" r="12" fill="#FFFFFF" stroke="#FF7A00" strokeWidth="3" />
                      <circle cx="-3" cy="177" r="2" fill="#000" />
                      <circle cx="3" cy="177" r="2" fill="#000" />
                      
                      {/* Body - Thicker */}
                      <line x1="0" y1="192" x2="0" y2="220" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
                      
                      {/* Arms - Animated Walking */}
                      <motion.line
                        x1="0"
                        y1="200"
                        x2="-15"
                        y2="208"
                        stroke="#FFFFFF"
                        strokeWidth="6"
                        strokeLinecap="round"
                        animate={{
                          y2: [208, 215, 208],
                          x2: [-15, -16, -15],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.line
                        x1="0"
                        y1="200"
                        x2="15"
                        y2="215"
                        stroke="#FFFFFF"
                        strokeWidth="6"
                        strokeLinecap="round"
                        animate={{
                          y2: [215, 208, 215],
                          x2: [15, 16, 15],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Legs - Animated Walking */}
                      <motion.line
                        x1="0"
                        y1="220"
                        x2="-12"
                        y2="245"
                        stroke="#FFFFFF"
                        strokeWidth="8"
                        strokeLinecap="round"
                        animate={{
                          x2: [-12, -14, -12],
                          y2: [245, 250, 245],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.line
                        x1="0"
                        y1="220"
                        x2="12"
                        y2="250"
                        stroke="#FFFFFF"
                        strokeWidth="8"
                        strokeLinecap="round"
                        animate={{
                          x2: [12, 14, 12],
                          y2: [250, 245, 250],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.g>
                    
                    <defs>
                      <linearGradient id="skyGradientEsnaf" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFE5CC" />
                        <stop offset="100%" stopColor="#FFB347" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                
                {/* Stats Badge - Bottom Left */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="absolute bottom-6 left-6 z-30 flex items-center gap-3 bg-white/25 backdrop-blur-md rounded-xl px-4 py-3 border-2 border-white/40 shadow-xl"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center border-2 border-white/60 flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-white drop-shadow-lg leading-none">10K+</p>
                    <p className="text-xs font-bold text-white/95 drop-shadow-md leading-tight">Aktif Kullanıcı</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Short-term Gigs Section - Enhanced */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-24">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-6 px-4 py-1.5 rounded-full text-sm font-semibold">
              Anlık İşler
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Bölgendeki{' '}
              <span className="bg-gradient-to-r from-[#FF7A00] to-[#FFB347] bg-clip-text text-transparent">
                anlık işler
              </span>{' '}
              için Mahallem'i kullan
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Bugün veya bu hafta için yardım mı lazım? Angarya gibi görünen tüm işleri Mahallem'de paylaş, sana en uygun kişiyi hızlıca bul.
            </p>
          </motion.div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mb-8">
            {INSTANT_GIGS.map((gig, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <GigCard
                  title={gig.title}
                  location={gig.location}
                  budget={gig.budget}
                  tag={gig.tag}
                  timeLabel={gig.timeLabel}
                  distance={gig.distance}
                  onApply={() => router.push('/jobs')}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="premium"
                size="xl"
                onClick={() => router.push('/jobs')}
                className="w-full sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Anlık iş ilanı ver
                </span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/jobs">
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  <span className="flex items-center gap-2">
                    Tüm anlık işlere göz at
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Enhanced */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-6 px-4 py-1.5 rounded-full text-sm font-semibold">
              Müşteri Yorumları
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Gerçek{' '}
              <span className="bg-gradient-to-r from-[#FF7A00] to-[#FFB347] bg-clip-text text-transparent">
                mahalle deneyimi
              </span>
              , gerçek yorumlar
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Mahallem kullanıcılarının gerçek deneyimlerini okuyun
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="bg-white rounded-2xl p-8 shadow-lg h-full hover:shadow-xl transition-shadow border border-slate-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-orange-100 shadow-lg bg-gradient-to-br from-orange-200 to-purple-200">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to gradient
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                      {/* Verified badge */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">{testimonial.name}</h4>
                      <p className="text-sm text-slate-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(testimonial.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-slate-700">
                      {testimonial.rating}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">"{testimonial.quote}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Ultra Premium */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FF7A00] via-[#FF8A00] to-[#FFB347] py-24 md:py-32">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-6 py-2.5 rounded-full text-sm font-bold shadow-xl mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Hemen Başla
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.2] display-font"
              style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              Hazırsan mahalleni{' '}
              <span className="relative inline-block align-middle">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/30 text-4xl md:text-5xl lg:text-6xl font-black text-white">
                  Mahallem
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/50 rounded-full"
                />
              </span>
              {' '}de buluşturalım
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              Esnaf olarak kayıt ol, müşteri olarak hizmet iste ya da kısa süreli iş ilanı ver. Hepsi aynı hesapla, birkaç dakikada.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="xl"
                  className="bg-white hover:bg-white/95 rounded-2xl px-10 py-8 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all w-full sm:w-auto group relative overflow-hidden border-2 border-orange-200"
                  onClick={() => router.push('/auth/register')}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#FF7A00]" />
                    <span className="text-[#FF7A00] font-bold">Hemen Ücretsiz Üye Ol</span>
                    <ArrowRight className="w-5 h-5 text-[#FF7A00] group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="xl"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/20 hover:border-white rounded-2xl px-10 py-8 text-lg font-bold shadow-xl w-full sm:w-auto group"
                  onClick={() => router.push('/request')}
                >
                  <span className="flex items-center gap-2">
                    <BriefcaseIcon className="w-6 h-6" />
                    Hemen Hizmet Bul
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

