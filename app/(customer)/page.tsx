'use client'

import { useRouter } from 'next/navigation'
import { 
  Wrench, MapPin, Search, Wallet,
  CheckCircle2, Star, Users, Clock, DollarSign, Award, TrendingUp,
  ArrowRight, FileText, Lock, Shield, Gift, Heart
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SmartSearchBar from '@/components/ui/SmartSearchBar'
import PopularCategoriesTabs from '@/components/home/PopularCategoriesTabs'
import { RotatingHeadline } from '@/components/home/RotatingHeadline'
import { SearchExperienceShowcase } from '@/components/home/SearchExperienceShowcase'
import HeroAfterImage from '@/components/home/HeroAfterImage'
import AppDownloadFinal from '@/components/home/AppDownloadFinal'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative mt-6 md:mt-8 mb-10 md:mb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-50 shadow-[0_25px_80px_rgba(15,23,42,0.12)] px-5 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10">
            {/* Üst: Rotating Headline - Merkezi */}
            <div className="flex flex-col items-center mb-8 md:mb-10">
              <RotatingHeadline />
            </div>
            
            {/* Orta: Büyük Arama Barı - Merkezi */}
            <div className="flex justify-center mb-4">
              <div className="w-full max-w-4xl">
                <SmartSearchBar />
              </div>
            </div>
            
            {/* Arama barı açıklaması */}
            <p className="text-xs md:text-sm text-slate-500 text-center mb-10 md:mb-12">
              Örnek: "Ümraniye ev temizliği", "Ataşehir çilingir"...
            </p>

          </div>
        </div>
      </section>

      {/* Hero Altı Geniş Fotoğraf */}
      <HeroAfterImage />

      {/* Search Experience Showcase */}
      <SearchExperienceShowcase />

      {/* Popüler Kategoriler */}
      <section className="py-10 md:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <PopularCategoriesTabs />
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-10 md:py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
              Nasıl Çalışır?
            </h2>
            <p className="text-sm md:text-[15px] text-slate-600 mt-2">
              Hizmet almak veya vermek birkaç adımdan oluşur. Süreç her iki taraf için de şeffaftır.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'İhtiyacını belirt',
                description: 'Hangi hizmete ihtiyacın var? Arama yap veya kategorini seç, ihtiyacını detaylıca anlat.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Teklifler al',
                description: 'Yakındaki esnaflardan teklifler al, fiyatları karşılaştır, yorumları oku ve en uygun olanı seç.',
                icon: FileText,
              },
              {
                step: '03',
                title: 'İşini halledir',
                description: 'Seçtiğin esnafla iletişime geç, işini hallettir ve memnun kalırsan değerlendirme yap.',
                icon: CheckCircle2,
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center relative">
                      <span className="text-xs font-semibold text-brand-500">{item.step}</span>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Neden Hizmetgo? */}
      <section className="py-10 md:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
              Neden Hizmetgo?
            </h2>
            <p className="text-sm md:text-[15px] text-slate-600 mt-2">
              Mahallendeki en iyi esnaflarla buluş, güvenli ödeme ve şeffaf değerlendirmelerle işini hallet.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
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
                icon: Award,
                title: 'Kaliteli Hizmet',
                description: 'Sadece doğrulanmış ve kaliteli esnaflar',
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col gap-2"
                >
                  <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm md:text-[15px] font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-8 md:py-10 bg-brand-500 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-4 text-center md:text-left">
            {[
              { number: '10,000+', label: 'Kayıtlı Esnaf', icon: Users },
              { number: '350+', label: 'Hizmet Kategorisi', icon: Gift },
              { number: '50,000+', label: 'Mutlu Müşteri', icon: Heart },
              { number: '4.8', label: 'Ortalama Puan', icon: Star }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index}>
                  <div className="text-2xl md:text-3xl font-semibold mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/90">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mobil Uygulama İndir */}
      <AppDownloadFinal />
    </div>
  )
}
