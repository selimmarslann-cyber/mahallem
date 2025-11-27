'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Gauge, Wrench, MapPin, Search,
  CheckCircle2, Star, Users, Clock, DollarSign, Award, TrendingUp,
  ArrowRight, FileText, Lock, ThumbsUp, Shield, Gift, Heart,
  Sparkles, Zap, Truck, Monitor, GraduationCap, Scissors, TreePine,
  Camera, Utensils, Wind, Square, PenTool, HeartPulse
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SmartSearchBar from '@/components/ui/SmartSearchBar'
import MobileDemo from '@/components/home/MobileDemo'
import PopularCategoriesTabs from '@/components/home/PopularCategoriesTabs'
import { RotatingHeadline } from '@/components/home/RotatingHeadline'

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


export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative mt-4 md:mt-6 mb-8 md:mb-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-borderSoft/70 bg-gradient-to-br from-white via-slate-50 to-brand-50 shadow-[0_20px_60px_rgba(15,23,42,0.15)] px-5 md:px-8 py-6 md:py-8 lg:py-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            {/* Sol Blok */}
            <div className="flex-1 space-y-3 md:space-y-4">
              {/* Rotating Headline */}
              <RotatingHeadline />

              {/* Kısa açıklama */}
              <p className="text-sm md:text-base text-slate-600 max-w-lg">
                Ev temizliği, tadilat, nakliyat, çilingir veya market… Hizmet iste, ek gelir kazan
                ya da çevrendeki esnaflardan sipariş ver. Hepsi tek uygulamada.
              </p>

              {/* Arama barı */}
              <SmartSearchBar />

              {/* Bullet'lar */}
              <ul className="mt-3 space-y-1.5 text-xs md:text-[13px] text-slate-700">
                <li>✅ Güvenilir ustalar & esnaflar</li>
                <li>✅ Anlık işler ile ek gelir fırsatı</li>
                <li>✅ Harita üzerinden sipariş ve takip</li>
              </ul>
            </div>

            {/* Sağ Blok (MobileDemo) */}
            <div className="flex-1 flex justify-end">
              <MobileDemo />
            </div>
          </div>

          {/* Turuncu blob dekoratif background */}
          <div className="pointer-events-none absolute -right-16 -top-10 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-[-40px] h-64 w-64 rounded-full bg-amber-400/25 blur-3xl" />
        </div>
      </section>

      {/* Three Main Feature Cards */}
      <section className="max-w-6xl mx-auto mt-6 md:mt-8 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Hizmet İste */}
          <div className="group relative overflow-hidden rounded-2xl bg-surface border border-borderSoft/80 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all p-4 md:p-5 flex flex-col gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 text-brand-700 text-[11px] px-2.5 py-1">
              <Wrench className="h-3.5 w-3.5" />
              <span>Hizmet iste</span>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-slate-900">Profesyonel hizmet talep et</h3>
            <p className="text-sm text-slate-600 flex-1">
              Kategorini seç, birkaç soruyu cevapla, mahalle ustalarından teklif al.
            </p>
            <div className="flex items-center justify-between mt-2">
              <Button asChild variant="default" size="sm">
                <Link href="/request">Hemen hizmet iste</Link>
              </Button>
              <button className="text-xs text-slate-500 hover:text-brand-600">Nasıl çalışır?</button>
            </div>
          </div>

          {/* Ek Gelir Kazan */}
          <div className="group relative overflow-hidden rounded-2xl bg-surface border border-borderSoft/80 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all p-4 md:p-5 flex flex-col gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-1">
              <Gauge className="h-3.5 w-3.5" />
              <span>Ek gelir</span>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-slate-900">Mahallende ek gelir kazan</h3>
            <p className="text-sm text-slate-600 flex-1">
              10 km çevrendeki kısa süreli işlere başvur, hızlı onay ve ödeme ile kazanmaya başla.
            </p>
            <div className="flex items-center justify-between mt-2">
              <Button asChild variant="default" size="sm">
                <Link href="/earn">Ek gelir kazan</Link>
              </Button>
              <button className="text-xs text-slate-500 hover:text-emerald-600">Nasıl çalışır?</button>
            </div>
          </div>

          {/* Çevrendeki Esnaflar */}
          <div className="group relative overflow-hidden rounded-2xl bg-surface border border-borderSoft/80 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all p-4 md:p-5 flex flex-col gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 text-[11px] px-2.5 py-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>Esnaflar</span>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-slate-900">Çevrendeki esnaflardan sipariş ver</h3>
            <p className="text-sm text-slate-600 flex-1">
              Yemek, market, kırtasiye, eczane… Haritadan seç, siparişini oluştur, kapına gelsin.
            </p>
            <div className="flex items-center justify-between mt-2">
              <Button asChild variant="default" size="sm">
                <Link href="/map">Esnafları gör</Link>
              </Button>
              <button className="text-xs text-slate-500 hover:text-sky-600">Nasıl çalışır?</button>
            </div>
          </div>
        </div>
      </section>


      {/* Popüler Kategoriler */}
      <section className="max-w-6xl mx-auto mt-8 md:mt-10 px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div>
            <h2 className="text-lg md:text-2xl font-semibold text-slate-900">Her proje için hazır kategoriler</h2>
            <p className="text-sm text-slate-600 mt-1">Mahallende en çok talep edilen hizmetleri görsel olarak seç.</p>
          </div>
        </div>
        <PopularCategoriesTabs />
      </section>

      {/* Nasıl Çalışır - 3 Adım */}
      <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hizmet almak veya vermek çok kolay
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
              Neden Biz?
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
              Güvenlik ve kalite önceliğimiz
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
