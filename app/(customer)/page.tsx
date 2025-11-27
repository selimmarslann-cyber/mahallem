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
import { MobileAppShowcase } from '@/components/home/MobileAppShowcase'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative mt-6 md:mt-8 mb-10 md:mb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/40 shadow-[0_25px_80px_rgba(15,23,42,0.12)] px-5 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10">
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

      {/* Search Experience Showcase */}
      <SearchExperienceShowcase />

      {/* Mobile App Showcase */}
      <MobileAppShowcase />

      {/* Three Main Feature Cards */}
      <section className="py-8 md:py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Hizmet İste */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] flex flex-col justify-between gap-4">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-brand-500 flex items-center justify-center shadow-sm mb-4">
                  <Wrench className="h-5 w-5" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                  Profesyonel hizmet talep et
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Kategorini seç, birkaç soruyu cevapla, mahalle ustalarından teklif al.
                </p>
              </div>
              <Button asChild variant="default" size="sm" className="inline-flex items-center justify-center rounded-full bg-brand-500 text-white text-sm font-semibold px-4 py-2 mt-1 hover:bg-brand-600 transition-colors w-full">
                <Link href="/request">Hemen hizmet iste</Link>
              </Button>
            </div>

            {/* Ek Gelir Kazan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] flex flex-col justify-between gap-4">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-brand-500 flex items-center justify-center shadow-sm mb-4">
                  <Wallet className="h-5 w-5" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                  Mahallende ek gelir kazan
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  10 km çevrendeki kısa süreli işlere başvur, hızlı onay ve ödeme ile kazanmaya başla.
                </p>
              </div>
              <Button asChild variant="default" size="sm" className="inline-flex items-center justify-center rounded-full bg-brand-500 text-white text-sm font-semibold px-4 py-2 mt-1 hover:bg-brand-600 transition-colors w-full">
                <Link href="/earn">Ek gelir kazan</Link>
              </Button>
            </div>

            {/* Çevrendeki Esnaflar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] flex flex-col justify-between gap-4">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-brand-500 flex items-center justify-center shadow-sm mb-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                  Çevrendeki esnaflardan sipariş ver
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Yemek, market, kırtasiye, eczane… Haritadan seç, siparişini oluştur, kapına gelsin.
                </p>
              </div>
              <Button asChild variant="default" size="sm" className="inline-flex items-center justify-center rounded-full bg-brand-500 text-white text-sm font-semibold px-4 py-2 mt-1 hover:bg-brand-600 transition-colors w-full">
                <Link href="/map">Esnafları gör</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popüler Kategoriler */}
      <section className="py-8 md:py-10 bg-white">
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

      {/* CTA */}
      <section className="py-8 md:py-10 bg-brand-500 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
            Hemen Başla!
          </h2>
          <p className="text-sm md:text-[15px] text-white/90 mt-2 mb-8 max-w-2xl mx-auto">
            Mahallendeki en iyi esnaflarla buluş, hizmet al veya ek gelir kazan.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
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
