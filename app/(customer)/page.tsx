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
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Hero Section - Thumbtack Style */}
      <section className="relative mt-8 md:mt-12 mb-16 md:mb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-white px-6 md:px-10 lg:px-12 py-12 md:py-16 lg:py-20">
            {/* Üst: Rotating Headline - Thumbtack Style */}
            <div className="flex flex-col items-center mb-10 md:mb-12">
              <RotatingHeadline />
            </div>
            
            {/* Orta: Büyük Arama Barı - Thumbtack Style */}
            <div className="flex justify-center mb-6">
              <div className="w-full max-w-4xl">
                <SmartSearchBar />
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Hero Altı Geniş Fotoğraf */}
      <HeroAfterImage />

      {/* Search Experience Showcase */}
      <SearchExperienceShowcase />

      {/* Popüler Kategoriler - Thumbtack Style */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <PopularCategoriesTabs />
        </div>
      </section>

      {/* Nasıl Çalışır - Thumbtack Style */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4" style={{ lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Nasıl Çalışır?
            </h2>
            <p className="text-base md:text-lg text-slate-600 font-normal max-w-2xl mx-auto">
              Hizmet almak veya vermek birkaç adımdan oluşur. Süreç her iki taraf için de şeffaftır.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'İhtiyacını belirt',
                description: 'Hangi hizmete ihtiyacın var? Arama yap veya kategorini seç, ihtiyacını detaylıca anlat.',
                icon: Search,
                href: '/request',
              },
              {
                step: '02',
                title: 'Teklifler al',
                description: 'Yakındaki esnaflardan teklifler al, fiyatları karşılaştır, yorumları oku ve en uygun olanı seç.',
                icon: FileText,
                href: '/jobs',
              },
              {
                step: '03',
                title: 'İşini hallettir',
                description: 'Seçtiğin esnafla iletişime geç, işini hallettir ve memnun kalırsan değerlendirme yap.',
                icon: CheckCircle2,
                href: '/jobs',
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 flex flex-col gap-4 hover:border-brand-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-brand-600">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2" style={{ lineHeight: 1.3 }}>
                        {item.title}
                      </h3>
                      <p className="text-base text-slate-600 font-normal leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Neden Hizmetgo? - Thumbtack Style */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4" style={{ lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Neden Hizmetgo?
            </h2>
            <p className="text-base md:text-lg text-slate-600 font-normal max-w-2xl mx-auto">
              Bölgendeki en iyi esnaflarla buluş, güvenli ödeme ve şeffaf değerlendirmelerle işini hallet.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
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
                  className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col gap-3"
                >
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900" style={{ lineHeight: 1.3 }}>
                    {feature.title}
                  </h3>
                  <p className="text-base text-slate-600 font-normal leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* İstatistikler - Thumbtack Style Minimal */}
      <section className="py-16 md:py-20 bg-brand-500 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4 text-center md:text-left">
            {[
              { number: '10,000+', label: 'Kayıtlı Esnaf', icon: Users },
              { number: '350+', label: 'Hizmet Kategorisi', icon: Gift },
              { number: '50,000+', label: 'Mutlu Müşteri', icon: Heart },
              { number: '4.8', label: 'Ortalama Puan', icon: Star }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="flex flex-col gap-2">
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ lineHeight: 1.1 }}>
                    {stat.number}
                  </div>
                  <div className="text-base md:text-lg text-white/90 font-normal">
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
