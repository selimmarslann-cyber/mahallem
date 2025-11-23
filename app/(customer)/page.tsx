'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import GigCard from '@/components/home/GigCard'
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
    image: 'https://images.unsplash.com/photo-1601581875037-8bcaae5b0c19?w=400&h=300&fit=crop',
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

const INSTANT_GIGS = [
  {
    title: 'Bu akşam köpek gezdirme (1 saat)',
    location: 'Kadıköy',
    budget: 'Bütçe: 300 TL',
    tag: 'Evcil Hayvan',
    timeLabel: 'Bugün',
    distance: '0.5 km',
  },
  {
    title: '3 günlük köpek bakıcısı',
    location: 'Beşiktaş',
    budget: 'Bütçe: 3.000 TL',
    tag: 'Evcil Hayvan',
    timeLabel: 'Bu Hafta',
    distance: '1.2 km',
  },
  {
    title: 'Hafta sonu depo sayımı için 2 kişi',
    location: 'Çorlu',
    budget: 'Bütçe: 2.500 TL',
    tag: 'Ofis & Depo',
    timeLabel: 'Hafta Sonu',
    distance: '15 km',
  },
]

const TESTIMONIALS = [
  {
    name: 'Ayşe Yılmaz',
    role: 'Müşteri',
    rating: 4.8,
    quote: 'Evime en yakın temizlikçiyi 10 dakika içinde buldum. Fiyatları karşılaştırıp yorumlara göre seçmek çok rahat. Artık çevreme sormak zorunda kalmıyorum.',
    avatar: '/images/testimonials/ayse.jpg',
  },
  {
    name: 'Mehmet Demir',
    role: 'Esnaf – Tadilat',
    rating: 4.9,
    quote: 'Dükkanım Mahallem\'e kayıt olduğundan beri mahalleden düzenli iş alıyorum. Yapılan her iş sonrası gelen yorumlar yeni müşteriler için büyük güven sağlıyor.',
    avatar: '/images/testimonials/mehmet.jpg',
  },
  {
    name: 'Zeynep Kaya',
    role: 'Kısa süreli iş veren',
    rating: 4.7,
    quote: 'Köpeğime şehir dışına çıktığımda bakıcı bulmak hep stresliydi. Mahallem\'de hem bütçeme uygun hem de daha önce puanlanmış bir bakıcı bulmak birkaç dakika sürdü.',
    avatar: '/images/testimonials/zeynep.jpg',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/map?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Background Image with Content */}
      <section className="relative overflow-hidden pt-24 pb-20 min-h-[650px] md:min-h-[750px] flex items-center">
        {/* Background Image - Gülen Aile PC Başında Çalışırken */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-family-pc.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        >
          {/* Overlay for Text Readability - Gradient from left to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Badge */}
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-1.5 backdrop-blur-sm rounded-full text-sm font-medium">
                Mahallendeki güvenilir esnaf, hizmetler ve işler tek platformda
              </Badge>

              {/* H1 */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white drop-shadow-lg">
                Mahallem'de hizmet de bulursun, iş de
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg text-white/95 leading-relaxed max-w-2xl drop-shadow-md">
                Temizlikten tadilata, köpek bakıcılığından kısa süreli kasiyerliğe kadar; esnaflar, bireysel hizmet verenler ve anlık işler Mahallem'de buluşuyor.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Hangi hizmete veya işe ihtiyacın var?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-6 text-base bg-white/95 backdrop-blur-sm border-0 rounded-full shadow-xl focus-visible:ring-2 focus-visible:ring-orange-500"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-[#FF7A00] hover:bg-[#FF8A00] text-white rounded-full px-8 py-6 font-semibold shadow-xl"
                  >
                    Ara
                  </Button>
                </div>
              </form>

              {/* 3 Flow Pills */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2 max-w-4xl">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm border-0 rounded-full p-4 cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <Map className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm">Haritadan Hizmet Bul</h3>
                        <p className="text-xs text-slate-600 truncate">Canlı haritada gör</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm border-0 rounded-full p-4 cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm">Hizmet İhtiyacını Yaz</h3>
                        <p className="text-xs text-slate-600 truncate">Teklifler gelsin</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm border-0 rounded-full p-4 cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm">Bölgendeki Anlık İşlere Bak</h3>
                        <p className="text-xs text-slate-600 truncate">Kısa süreli işler</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#FFFDF7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Mahallem üç farklı şekilde çalışır
            </h2>
          </div>

          <Tabs defaultValue="harita" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-xl mb-8 shadow-sm">
              <TabsTrigger
                value="harita"
                className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Haritadan Hizmet Bul
              </TabsTrigger>
              <TabsTrigger
                value="talep"
                className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Hizmet İhtiyacını Yaz
              </TabsTrigger>
              <TabsTrigger
                value="anlik"
                className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
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
                  },
                  {
                    step: 2,
                    icon: CheckCircle2,
                    title: 'İşletmeni seç',
                    description: 'Puan, yorum ve mesafeye göre sana en uygun olanı seç.',
                  },
                  {
                    step: 3,
                    icon: MessageSquare,
                    title: 'Talep gönder veya hemen sipariş ver',
                    description: 'İster detaylı talep aç, ister direkt hizmet / ürün seçerek sipariş oluştur.',
                  },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.step * 0.1 }}
                  >
                    <Card className="bg-white border-0 shadow-lg rounded-2xl p-8 h-full hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <item.icon className="w-8 h-8 text-orange-600 mb-2" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
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
                  },
                  {
                    step: 2,
                    icon: Zap,
                    title: 'Anahtar kelimelerle eşleştir',
                    description: 'Aynı işi yapan esnafların ve bireysel hizmet verenlerin profilleriyle otomatik eşleşsin.',
                  },
                  {
                    step: 3,
                    icon: CheckCircle2,
                    title: 'Teklifleri al, karşılaştır ve seç',
                    description: 'Bütçene, yorumlara ve puanlara göre en uygun teklifi seç.',
                  },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.step * 0.1 }}
                  >
                    <Card className="bg-white border-0 shadow-lg rounded-2xl p-8 h-full hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <item.icon className="w-8 h-8 text-orange-600 mb-2" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
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
                  },
                  {
                    step: 2,
                    icon: Users,
                    title: 'Bölgenle eşleşsin',
                    description: 'Yakınındaki uygun profiller ve iş arayanlar anında bildirim alsın.',
                  },
                  {
                    step: 3,
                    icon: MessageSquare,
                    title: 'Hızlıca anlaş',
                    description: 'Mesajlaş, detayları netleştir, işi başlat ve puanla.',
                  },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.step * 0.1 }}
                  >
                    <Card className="bg-white border-0 shadow-lg rounded-2xl p-8 h-full hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <item.icon className="w-8 h-8 text-orange-600 mb-2" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
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

      {/* Categories Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Mahallende en çok aranan kategoriler
            </h2>
            <Link href="/map" className="text-orange-600 hover:text-orange-700 font-medium hover:underline flex items-center gap-1">
              Tüm kategorileri gör <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <Link href={`/request?category=${category.id}`}>
                    <Card className="bg-white border border-slate-200 hover:border-orange-400 rounded-xl overflow-hidden cursor-pointer transition-all shadow-md hover:shadow-xl h-full group hover:-translate-y-1">
                      {/* Category Image */}
                      <div className="relative h-32 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                          style={{ backgroundImage: `url(${category.image})` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                        </div>
                        {/* Icon Overlay */}
                        <div className="absolute top-3 left-3">
                          <div className={`w-11 h-11 rounded-xl ${category.color} flex items-center justify-center shadow-lg border border-white/20`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1.5 line-clamp-2">
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

      {/* Esnaflar Section */}
      <section className="bg-[#F5F7FB] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              Mahallendeki esnafa destek ol
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-6">
              Mahallem, büyük platformlarda kaybolan esnafları mahalle sakinleriyle buluşturur. Dükkanını fotoğraflar, hizmetler ve yorumlarla öne çıkar; mahallenden daha fazla iş al.
            </p>
            <ul className="space-y-3 mb-8">
              {['Ücretsiz işletme profili oluştur', 'Haritada görünür ol', 'Yorum ve puanlarınla güven inşa et'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <Button
                size="lg"
                className="bg-[#FF7A00] hover:bg-[#FF8A00] text-white rounded-full px-8 py-6 text-lg font-semibold w-full sm:w-auto"
                onClick={() => router.push('/business/register')}
              >
                Esnaf Olarak Kayıt Ol
              </Button>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                  onClick={() => router.push('/auth/login?type=business')}
                >
                  Esnaf girişi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Short-term Gigs Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Bölgendeki anlık işler için Mahallem'i kullan
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Bugün veya bu hafta için yardım mı lazım? Angarya gibi görünen tüm işleri Mahallem'de paylaş, sana en uygun kişiyi hızlıca bul.
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mb-8">
            {INSTANT_GIGS.map((gig, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
            <Button
              size="lg"
              className="bg-[#FF7A00] hover:bg-[#FF8A00] text-white rounded-full px-8 py-6 text-lg font-semibold"
              onClick={() => router.push('/jobs')}
            >
              Ben de anlık iş ilanı ver
            </Button>
            <Link href="/jobs">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 rounded-full px-8 py-6 text-lg font-semibold"
              >
                Tüm anlık işlere göz at
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Gerçek mahalle deneyimi, gerçek yorumlar
            </h2>
          </div>

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
                <Card className="bg-white rounded-2xl p-8 shadow-lg h-full hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-200 to-purple-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient if image fails
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
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

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-[#FF8A00] via-[#FFB347] to-[#3B1F5F] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Hazırsan mahalleni Mahallem'de buluşturalım
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Esnaf olarak kayıt ol, müşteri olarak hizmet iste ya da kısa süreli iş ilanı ver. Hepsi aynı hesapla, birkaç dakikada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#FF7A00] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold shadow-xl"
                onClick={() => router.push('/auth/register')}
              >
                Hemen Ücretsiz Üye Ol
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-2 border-white text-white hover:bg-white/20 rounded-full px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                onClick={() => router.push('/jobs')}
              >
                Mahallem'de İş Ara
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
