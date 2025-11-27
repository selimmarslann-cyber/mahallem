'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, MapPin, Wallet, Store, Clock, CheckCircle2, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type ScenarioId = 'hire' | 'income' | 'merchant'

type Scenario = {
  id: ScenarioId
  label: string
  title: string
  description: string
  badge: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'hire',
    label: 'Profesyonel hizmet iste',
    title: 'İhtiyacını yaz, mahalle ustalarını bul.',
    description:
      'Ev temizliği, boya badana, nakliyat veya çilingir… Arama çubuğuna ihtiyacını yaz, birkaç soruya cevap ver, mahalle ustalarından teklif al.',
    badge: 'Hizmet talebi'
  },
  {
    id: 'income',
    label: 'Ek gelir kazan',
    title: '10 km çevrendeki anlık işlere başvur.',
    description:
      'Vasıf gerektirmeyen kısa süreli işler için başvur, hızlı onay ve ödeme ile kazanmaya başla. Hazır ilanlara tek dokunuşla teklif ver.',
    badge: 'Ek gelir & instant job'
  },
  {
    id: 'merchant',
    label: 'Esnaftan sipariş ver',
    title: 'Mahalle esnafından kapına gelsin.',
    description:
      'Market, fırın, kırtasiye ya da eczane… Haritadan en yakın esnafı seç, siparişini oluştur, anlık durumunu harita üzerinden takip et.',
    badge: 'Esnaf & harita'
  }
]

export function SearchExperienceShowcase() {
  const [activeId, setActiveId] = useState<ScenarioId>('hire')
  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0]

  return (
    <section className="mt-6 md:mt-8 mb-10 md:mb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-5 md:gap-7 items-stretch">
          {/* Sol: 3 seçenek */}
          <div className="md:w-[40%] space-y-3">
            <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-1">
              Hizmetgo deneyimini keşfet
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mb-3">
              Aşağıdaki senaryolardan birini seç; sağdaki mini ekran, uygulamada neler
              göreceğini adım adım gösterir.
            </p>

            <div className="space-y-2">
              {SCENARIOS.map((scenario) => {
                const isActive = scenario.id === active.id
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => setActiveId(scenario.id)}
                    className={cn(
                      'w-full text-left rounded-2xl border px-3.5 py-3 md:px-4 md:py-3.5 transition-all',
                      isActive
                        ? 'border-[#FF6000] bg-[#FF6000]/6 shadow-[0_14px_40px_rgba(15,23,42,0.08)]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p
                          className={cn(
                            'text-[13px] md:text-sm font-medium',
                            isActive ? 'text-slate-900' : 'text-slate-800'
                          )}
                        >
                          {scenario.label}
                        </p>
                        <p className="text-[11px] md:text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {scenario.description}
                        </p>
                      </div>
                      <div
                        className={cn(
                          'hidden md:flex h-8 w-8 rounded-2xl items-center justify-center',
                          isActive
                            ? 'bg-[#FF6000] text-white'
                            : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {scenario.id === 'hire' && <Search className="h-4 w-4" />}
                        {scenario.id === 'income' && <Wallet className="h-4 w-4" />}
                        {scenario.id === 'merchant' && <Store className="h-4 w-4" />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sağ: beyaz çerçeveli animasyon kartı */}
          <div className="md:flex-1">
            <div className="relative rounded-[32px] bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/60 p-[10px] md:p-[12px] shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
              {/* Dış çerçeve */}
              <div className="relative rounded-[24px] bg-white border border-slate-200 overflow-hidden">
                {/* Üst bar (fake mobile / app frame) */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                  <div className="flex items-center gap-1.5">
                    <span className="h-6 w-6 rounded-full bg-[#FF6000] text-white text-[11px] font-semibold flex items-center justify-center shadow-sm">
                      HG
                    </span>
                    <div>
                      <p className="text-[11px] font-medium text-slate-900">
                        Hizmetgo mini akış
                      </p>
                      <p className="text-[10px] text-slate-500">Gerçek ekrandan esinlenilmiştir</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    2–3 dk
                  </span>
                </div>

                {/* İç animasyon alanı */}
                <div className="relative px-4 pt-3 pb-4 md:px-5 md:pt-4 md:pb-5 bg-white">
                  {/* Arama bar mock */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                      <Search className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[11px] md:text-xs text-slate-400">
                        İhtiyacını yaz: ev temizliği, boya, çilingir…
                      </span>
                    </div>
                  </div>

                  {/* İçerik animasyonlu kısmı */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="space-y-3"
                    >
                      {active.id === 'hire' && <HireFlow />}
                      {active.id === 'income' && <IncomeFlow />}
                      {active.id === 'merchant' && <MerchantFlow />}
                    </motion.div>
                  </AnimatePresence>

                  {/* Alt satır */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <p className="text-[10px] text-slate-500">
                      Senaryolar örnek amaçlıdır, gerçek zamanlı veriler uygulama içinde gösterilir.
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-[10px] px-2 py-1 text-slate-600">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span>{active.badge}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HireFlow() {
  return (
    <div className="space-y-2.5">
      <div className="text-[11px] md:text-xs text-slate-600">
        <p className="font-semibold text-slate-900 mb-0.5">1. Adım – İhtiyacını belirt</p>
        <p>
          Kısa bir cümleyle neye ihtiyaç duyduğunu yaz, ardından birkaç basit soruyu cevapla.
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-2">
          <p className="text-[10px] font-medium text-slate-700 mb-1">
            Örnek proje açıklaması
          </p>
          <p className="text-[10px] text-slate-500">
            "3+1 ev için detaylı temizlik, hafta sonu uygunluk gerekiyor. Ev eşyalı."
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 flex flex-col justify-between">
          <p className="text-[10px] font-medium text-slate-700 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-500" />
            Ümraniye, 4 km
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            Yakındaki 8 usta bu talebi görebilir.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 flex items-center justify-between gap-2">
        <div className="text-[10px] text-slate-600">
          <p className="font-medium text-slate-900 mb-0.5">Teklif bekleniyor</p>
          <p>İlk yanıtlar genelde dakikalar içinde gelir.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
            <CheckCircle2 className="h-3 w-3" />
            Güvenli ödeme
          </span>
          <span className="text-[9px] text-slate-400">3 usta görüntüledi</span>
        </div>
      </div>
    </div>
  )
}

function IncomeFlow() {
  return (
    <div className="space-y-2.5">
      <div className="text-[11px] md:text-xs text-slate-600">
        <p className="font-semibold text-slate-900 mb-0.5">Anlık iş akışı</p>
        <p>Yakındaki iş ilanlarını gör, tek dokunuşla başvur.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 space-y-1.5">
        {[
          { title: 'Market ürün taşıma', detail: '1 saatlik iş • 2 km', price: '350 TL' },
          { title: 'Evcil hayvan gezdirme', detail: '45 dk • akşam', price: '250 TL' },
          { title: 'Broşür dağıtımı', detail: '3 saat • hafta sonu', price: '750 TL' }
        ].map((job, i) => (
          <div
            key={job.title}
            className="flex items-center justify-between gap-2 rounded-xl bg-white px-2.5 py-1.5 border border-slate-100"
          >
            <div className="text-[10px] text-slate-600">
              <p className="font-medium text-slate-900">{job.title}</p>
              <p className="text-[9px] text-slate-500">{job.detail}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-emerald-600">{job.price}</p>
              <p className="text-[9px] text-slate-400">Hızlı onay</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 flex items-center justify-between gap-2">
        <div className="text-[10px] text-slate-600">
          <p className="font-medium text-slate-900 mb-0.5">Günlük kazanç özeti</p>
          <p>Bugün 3 iş tamamladın. Bekleyen ödeme yok.</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold text-slate-900">1.350 TL</p>
          <p className="text-[9px] text-slate-400">Toplam kazanç</p>
        </div>
      </div>
    </div>
  )
}

function MerchantFlow() {
  return (
    <div className="space-y-2.5">
      <div className="text-[11px] md:text-xs text-slate-600">
        <p className="font-semibold text-slate-900 mb-0.5">Haritadan esnaf seç</p>
        <p>Mahalle marketi, fırın veya eczaneyi tek ekranda gör.</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] gap-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2">
          <p className="text-[10px] font-medium text-slate-700 mb-1 flex items-center gap-1">
            <Store className="h-3 w-3 text-slate-500" />
            Yakındaki esnaflar
          </p>
          <ul className="space-y-1.5 text-[10px] text-slate-600">
            <li>• Mahalle Market — 0.4 km</li>
            <li>• Köşe Fırın — 0.6 km</li>
            <li>• Güneş Eczanesi — 0.9 km</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 flex flex-col justify-between">
          <div className="text-[10px] text-slate-600">
            <p className="font-medium text-slate-900 mb-0.5">Sipariş özetin</p>
            <p>2x ekmek, 1x süt, 1x yumurta</p>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[9px] text-slate-500">Tahmini süre: 25 dk</span>
            <span className="text-[10px] font-semibold text-slate-900">185 TL</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 flex items-center justify-between gap-2">
        <div className="text-[10px] text-slate-600 flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
            <MessageSquare className="h-3 w-3 text-slate-500" />
          </span>
          <div>
            <p className="font-medium text-slate-900 mb-0.5">Esnaf ile sohbet</p>
            <p>Ürün ekleme / çıkarma için anlık mesajlaş.</p>
          </div>
        </div>
        <span className="text-[9px] text-slate-400">Son güncelleme: 3 dk önce</span>
      </div>
    </div>
  )
}

