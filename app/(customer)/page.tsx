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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative mb-12 md:mb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative px-6 md:px-10 py-8 md:py-12 lg:py-16">
            {/* Üst: Rotating Headline - Merkezi */}
            <div className="flex flex-col items-center mb-8 md:mb-10">
              <RotatingHeadline />
            </div>
            
            {/* Orta: Büyük Arama Barı - Merkezi */}
            <div className="flex justify-center mb-10 md:mb-12">
              <div className="w-full max-w-4xl">
                <SmartSearchBar />
                    </div>
                  </div>

            {/* Alt: Sol Yazılar + Sağ Telefon Animasyonu */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
              {/* Sol: Açıklama Yazıları */}
              <div className="flex-1 space-y-4 max-w-lg">
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                  Ev temizliği, tadilat, nakliyat, çilingir veya market… Hizmet iste, ek gelir kazan
                  ya da çevrendeki esnaflardan sipariş ver. Hepsi tek uygulamada.
                </p>
                
                {/* Bullet'lar */}
                <ul className="space-y-2.5 text-sm md:text-base text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-500">✅</span>
                    <span>Güvenilir ustalar & esnaflar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-500">✅</span>
                    <span>Anlık işler ile ek gelir fırsatı</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-500">✅</span>
                    <span>Harita üzerinden sipariş ve takip</span>
                  </li>
                </ul>
                    </div>

              {/* Sağ: MobileDemo */}
              <div className="flex-1 flex justify-center lg:justify-end">
                <MobileDemo />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Three Main Feature Cards - Thumbtack Style */}
      <section className="max-w-7xl mx-auto mt-16 md:mt-20 px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Hizmet İste */}
          <div className="group relative p-6 md:p-8 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 text-brand-600 mb-2">
              <Wrench className="h-5 w-5" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">Profesyonel hizmet talep et</h3>
            <p className="text-base text-slate-600 flex-1 leading-relaxed">
              Kategorini seç, birkaç soruyu cevapla, mahalle ustalarından teklif al.
            </p>
            <div className="mt-6">
              <Button asChild variant="default" size="lg" className="w-full">
                <Link href="/request">Hemen hizmet iste</Link>
              </Button>
            </div>
                    </div>
                    
          {/* Ek Gelir Kazan */}
          <div className="group relative p-6 md:p-8 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 text-emerald-600 mb-2">
              <Gauge className="h-5 w-5" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">Mahallende ek gelir kazan</h3>
            <p className="text-base text-slate-600 flex-1 leading-relaxed">
              10 km çevrendeki kısa süreli işlere başvur, hızlı onay ve ödeme ile kazanmaya başla.
            </p>
            <div className="mt-6">
              <Button asChild variant="default" size="lg" className="w-full">
                <Link href="/earn">Ek gelir kazan</Link>
              </Button>
            </div>
          </div>

          {/* Çevrendeki Esnaflar */}
          <div className="group relative p-6 md:p-8 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 text-sky-600 mb-2">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">Çevrendeki esnaflardan sipariş ver</h3>
            <p className="text-base text-slate-600 flex-1 leading-relaxed">
              Yemek, market, kırtasiye, eczane… Haritadan seç, siparişini oluştur, kapına gelsin.
            </p>
            <div className="mt-6">
              <Button asChild variant="default" size="lg" className="w-full">
                <Link href="/map">Esnafları gör</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Popüler Kategoriler - Thumbtack Style */}
      <section className="max-w-7xl mx-auto mt-12 md:mt-16 px-4 md:px-6 lg:px-8">
        <PopularCategoriesTabs />
      </section>

      {/* Nasıl Çalışır - 3 Adım */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
              Nasıl Çalışır?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Hizmet almak veya vermek çok kolay
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                step: '01',
                title: 'İhtiyacını Belirt',
                description: 'Hangi hizmete ihtiyacın var? Arama yap veya kategori seç, ihtiyacını detaylıca anlat.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Teklifler Al',
                description: 'Yakındaki esnaflardan teklifler al, fiyatları karşılaştır, yorumları oku ve en uygun olanı seç.',
                icon: FileText,
              },
              {
                step: '03',
                title: 'İşini Halledir',
                description: 'Seçtiğin esnafla iletişime geç, işini hallettir ve memnun kalırsan değerlendirme yap.',
                icon: CheckCircle2,
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="relative"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white font-semibold text-lg">
                        {item.step}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-700" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="w-full py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
              Neden Biz?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Mahallendeki en iyi esnaflarla buluş, güvenle hizmet al
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Yakındaki Esnaflar',
                description: '10 km çevrendeki esnafları gör, en yakınını seç',
              },
              {
                icon: Star,
                title: 'Değerlendirmeler',
                description: 'Gerçek müşteri yorumları ve puanları oku',
              },
              {
                icon: Shield,
                title: 'Güvenli Ödeme',
                description: 'Güvenli ödeme sistemi ile işini güvence altına al',
              },
              {
                icon: Clock,
                title: 'Hızlı Yanıt',
                description: 'Esnaflardan dakikalar içinde teklif al',
              },
              {
                icon: DollarSign,
                title: 'Uygun Fiyatlar',
                description: 'Birden fazla teklif al, en uygun fiyatı seç',
              },
              {
                icon: Users,
                title: 'Binlerce Esnaf',
                description: '350+ kategoride binlerce kayıtlı esnaf',
              },
              {
                icon: Award,
                title: 'Kaliteli Hizmet',
                description: 'Sadece doğrulanmış ve kaliteli esnaflar',
              },
              {
                icon: TrendingUp,
                title: 'Ek Gelir Fırsatı',
                description: 'Vasıfsız işler için anında başvur, ek gelir kazan',
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="w-full py-24 bg-brand-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: '10,000+', label: 'Kayıtlı Esnaf', icon: Users },
              { number: '350+', label: 'Hizmet Kategorisi', icon: Gift },
              { number: '50,000+', label: 'Mutlu Müşteri', icon: Heart },
              { number: '4.8', label: 'Ortalama Puan', icon: Star }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="text-center"
                >
                  <div className="p-6">
                    <Icon className="w-6 h-6 text-white/90 mx-auto mb-4" />
                    <div className="text-4xl md:text-5xl font-semibold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white/80 font-medium text-sm md:text-base">
                      {stat.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Güven Unsurları */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
              Güvenle Kullan
            </h2>
            <p className="text-lg text-slate-600">
              Güvenlik ve kalite önceliğimiz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
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
                <div
                  key={index}
                  className="p-8 text-center"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="w-full py-24 bg-brand-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Hemen Başla!
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Mahallendeki en iyi esnaflarla buluş, hizmet al veya ek gelir kazan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/request')}
              size="lg"
              className="bg-white text-brand-500 hover:bg-gray-50 font-semibold text-base px-8 py-6"
            >
              Hizmet Ara
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => router.push('/partner')}
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-base px-8 py-6"
            >
              Esnaf Ol
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
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
