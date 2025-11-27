'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

// 3 ekranı tek tek tanımlıyoruz
const steps = [
  {
    id: 'step-1',
    pill: '1. Adım',
    title: 'Hizmet iste',
    subtitle: 'İhtiyacını bir cümleyle yaz, mahalledeki ustaları bulalım.',
    screen: (
      <div className="flex flex-col gap-3 p-4">
        {/* Üst mini arama bar */}
        <div className="rounded-full bg-slate-100 px-3 py-2 text-[11px] text-slate-500 flex items-center gap-2">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-500/10 text-[10px] text-brand-600">T</span>
          <span>"Ev temizliği gerekiyor..."</span>
        </div>

        {/* 3 buton */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="rounded-2xl bg-brand-500 text-[11px] text-white px-2.5 py-2 flex flex-col gap-1 shadow-md">
            <span className="font-semibold">Hizmet iste</span>
            <span className="text-[9px] text-white/80">Usta bulun</span>
          </div>
          <div className="rounded-2xl bg-slate-900 text-[11px] text-white px-2.5 py-2 flex flex-col gap-1">
            <span className="font-semibold">Ek gelir</span>
            <span className="text-[9px] text-slate-300">Anlık işler</span>
          </div>
          <div className="rounded-2xl bg-white text-[11px] text-slate-800 px-2.5 py-2 flex flex-col gap-1 border border-slate-200">
            <span className="font-semibold">Esnaflar</span>
            <span className="text-[9px] text-slate-500">Harita</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'step-2',
    pill: '2. Adım',
    title: 'Popüler kategoriden seç',
    subtitle: 'Temizlik, boya, çilingir gibi kategorilerden hızlı seçim yap.',
    screen: (
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-medium text-slate-700">Popüler kategoriler</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">İstanbul</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* 4 mini kategori kartı */}
          {[
            { title: 'Ev Temizliği', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop' },
            { title: 'Boya & Tadilat', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop' },
            { title: 'Nakliyat', img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop' },
            { title: 'Çilingir', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop' }
          ].map((cat, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
              <Image
                src={cat.img}
                alt={cat.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative p-2.5 flex flex-col justify-end h-24">
                <span className="text-[10px] text-white font-semibold">{cat.title}</span>
                <span className="text-[9px] text-white/80">Sık kullanılan</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'step-3',
    pill: '3. Adım',
    title: 'Ustaları karşılaştır',
    subtitle: 'Puan, yorum ve yanıt süresine göre en iyisini seç.',
    screen: (
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="font-medium text-slate-700">Ev Temizliği • Ümraniye</span>
          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 text-[10px] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Uygun bulundu
          </span>
        </div>

        {/* 2 usta kartı */}
        {[
          {
            name: 'Ayşe Temizlik',
            info: '4.9 • 132 yorum • 10 dk cevap',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
          },
          {
            name: 'Temiz İş Ekibi',
            info: '4.8 • 98 yorum • 6 dk cevap',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          }
        ].map((u, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden relative bg-slate-200">
                <Image 
                  src={u.avatar} 
                  alt={u.name} 
                  fill 
                  className="object-cover" 
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-800">{u.name}</span>
                <span className="text-[10px] text-slate-500">{u.info}</span>
              </div>
            </div>
            <button className="rounded-full bg-brand-500 text-[10px] text-white px-3 py-1 shadow-sm">
              Teklifleri gör
            </button>
          </div>
        ))}
      </div>
    )
  }
]

export default function MobileDemo() {
  const [index, setIndex] = useState(0)

  // 3.5 saniyede bir ekran değişsin
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length)
    }, 3500)
    return () => clearInterval(t)
  }, [])

  const current = steps[index]

  return (
    <div className="hidden md:flex items-center justify-end">
      <div className="relative w-[290px] lg:w-[320px] h-[560px] rounded-[36px] bg-slate-900/95 border border-slate-700 shadow-[0_25px_80px_rgba(15,23,42,0.75)] overflow-hidden">

        {/* iPhone çentiği */}
        <div className="absolute inset-x-20 top-2 h-5 rounded-full bg-black/60" />

        {/* İç ekran */}
        <div className="absolute inset-x-3 inset-y-5 rounded-[28px] bg-slate-50 overflow-hidden flex flex-col">

          {/* Header */}
          <div className="px-4 pt-3 pb-2 border-b border-slate-200 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="inline-flex items-center text-[10px] rounded-full bg-brand-50 text-brand-700 px-2 py-0.5">
                {current.pill}
              </span>
              <span className="text-[12px] font-semibold text-slate-800">{current.title}</span>
              <span className="text-[10px] text-slate-500">{current.subtitle}</span>
            </div>

            {/* step indicator */}
            <div className="flex items-center gap-1.5">
              {steps.map((s, i) => (
                <span
                  key={s.id}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-4 bg-brand-500" : "w-1.5 bg-slate-300"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Animasyonlu ekran */}
          <div className="flex-1 bg-slate-50 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                {current.screen}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
