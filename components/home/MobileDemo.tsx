'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import Logo from '@/components/layout/Logo'
import { Search } from 'lucide-react'

// Tanıtım yazıları
const transitionMessages = [
  'Bölgendeki en iyi ustaları bulun',
  'Hızlı ve güvenilir hizmet alın',
  'Puan ve yorumlarla en iyisini seçin'
]

// Hareketli yazılar
const rotatingPhrases = ['Ev hizmetleri', 'Ek kazanç', 'Esnaf bulma']

// 3 ekranı tek tek tanımlıyoruz
const steps = [
  {
    id: 'step-1',
    pill: '1. Adım',
    title: 'Arama',
    subtitle: 'İhtiyacını yaz, bölgedeki ustaları bul.',
    transitionMessage: transitionMessages[0],
    screen: null // Dinamik olarak oluşturulacak (arama ekranı)
  },
  {
    id: 'step-2',
    pill: '2. Adım',
    title: 'Popüler kategoriden seç',
    subtitle: 'Temizlik, boya, çilingir gibi kategorilerden hızlı seçim yap.',
    transitionMessage: transitionMessages[1],
    screen: (
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-medium text-slate-700">Popüler kategoriler</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">İstanbul</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* 6 mini kategori kartı - güncel görseller */}
          {[
            { title: 'Ev Temizliği', img: 'https://images.pexels.com/photos/4108716/pexels-photo-4108716.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            { title: 'Boya Badana', img: 'https://images.pexels.com/photos/7509752/pexels-photo-7509752.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            { title: 'Nakliyat', img: 'https://images.pexels.com/photos/4569338/pexels-photo-4569338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            { title: 'Çilingir', img: 'https://images.pexels.com/photos/115642/pexels-photo-115642.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            { title: 'Elektrik', img: 'https://images.pexels.com/photos/27928762/pexels-photo-27928762.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            { title: 'Su Tesisatı', img: 'https://images.pexels.com/photos/8793484/pexels-photo-8793484.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' }
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
    transitionMessage: transitionMessages[0], // Döngü için ilk mesaja dön
    screen: (
      <div className="p-4 flex flex-col gap-2 overflow-y-auto">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="font-medium text-slate-700">Ev Temizliği • Ümraniye</span>
          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 text-[10px] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Uygun bulundu
          </span>
        </div>

        {/* Teklif kartları - hepsi 5 yıldızlı, farklı avatarlar */}
        {[
          {
            name: 'Mehmet A.',
            info: '5.0 • 245 yorum • 5 dk cevap',
            price: '1.500 ₺',
            avatar: 'https://images.pexels.com/photos/34967833/pexels-photo-34967833.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
          },
          {
            name: 'Ali B.',
            info: '5.0 • 189 yorum • 8 dk cevap',
            price: '2.000 ₺',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
          },
          {
            name: 'Hasan C.',
            info: '5.0 • 312 yorum • 3 dk cevap',
            price: '1.800 ₺',
            avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
          },
          {
            name: 'Fatih D.',
            info: '5.0 • 156 yorum • 7 dk cevap',
            price: '2.200 ₺',
            avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
          },
          {
            name: 'Mustafa E.',
            info: '5.0 • 278 yorum • 4 dk cevap',
            price: '1.600 ₺',
            avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
          },
          {
            name: 'Emre F.',
            info: '5.0 • 201 yorum • 6 dk cevap',
            price: '1.900 ₺',
            avatar: 'https://images.pexels.com/photos/1043476/pexels-photo-1043476.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
          }
        ].map((u, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2 shadow-sm"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-full overflow-hidden relative bg-slate-200 flex-shrink-0">
                <Image 
                  src={u.avatar} 
                  alt={u.name} 
                  fill 
                  className="object-cover" 
                  unoptimized
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-slate-800">{u.name}</span>
                <span className="text-[10px] text-slate-500">{u.info}</span>
                <span className="text-[11px] font-bold text-brand-600 mt-0.5">{u.price}</span>
              </div>
            </div>
            <button 
              className="rounded-full bg-brand-500 text-[10px] text-white px-3 py-1 shadow-sm flex-shrink-0 pointer-events-none"
              disabled
            >
              Teklif
            </button>
          </div>
        ))}
      </div>
    )
  }
]

export default function MobileDemo() {
  const [index, setIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showTransitionMessage, setShowTransitionMessage] = useState(false)
  const [transitionMessage, setTransitionMessage] = useState('')
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [typingText, setTypingText] = useState('')
  const [hasShownInitialFlow, setHasShownInitialFlow] = useState(false)
  const [rotatingPhraseIndex, setRotatingPhraseIndex] = useState(0)
  const [serviceQuery, setServiceQuery] = useState('')

  // İlk ekran: "Usta arıyorum" yazma animasyonu → loading → step-1 (arama ekranı)
  useEffect(() => {
    if (isInitialLoading && !hasShownInitialFlow) {
      const text = 'Usta arıyorum'
      let currentIndex = 0
      
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setTypingText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          // 3 saniye loading
          setTimeout(() => {
            setIsInitialLoading(false)
            // Direkt step-1'e (arama ekranı) geç - index 0
            setIndex(0)
            setHasShownInitialFlow(true)
          }, 3000)
        }
      }, 100) // Her harf 100ms'de yazılsın
      
      return () => clearInterval(typingInterval)
    }
  }, [isInitialLoading, hasShownInitialFlow])

  // Hareketli yazı rotasyonu (step-1'de)
  useEffect(() => {
    if (hasShownInitialFlow && index === 0) {
      const t = setInterval(() => {
        setRotatingPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length)
      }, 3000)
      return () => clearInterval(t)
    }
  }, [hasShownInitialFlow, index])

  // Normal döngü: step-1, step-2, step-3 arasında geçiş
  useEffect(() => {
    if (hasShownInitialFlow && !isInitialLoading && index >= 0 && index < steps.length) {
      const t = setInterval(() => {
        // step-1 (index 0), step-2 (index 1), step-3 (index 2) arasında döngü
        const nextIndex = (index + 1) % steps.length // 0, 1, 2 arasında döngü
        const nextStep = steps[nextIndex]
        
        // Güvenlik kontrolü
        if (!nextStep || !nextStep.transitionMessage) {
          return
        }
        
        setIsTransitioning(true)
        setShowTransitionMessage(true)
        setTransitionMessage(nextStep.transitionMessage)
        
        // 2 saniye sonra ekranı değiştir
        setTimeout(() => {
          setIndex(nextIndex)
          setShowTransitionMessage(false)
          
          // 0.5 saniye sonra transition'ı kapat
          setTimeout(() => {
            setIsTransitioning(false)
          }, 500)
        }, 2000)
      }, 3500)
      return () => clearInterval(t)
    }
  }, [index, hasShownInitialFlow, isInitialLoading])

  const current = steps[index] || steps[0] // Fallback to first step if index is invalid

  return (
    <div className="flex items-center justify-center w-full pointer-events-none">
      <div className="relative w-full max-w-[290px] md:w-[290px] lg:w-[320px] h-[560px] rounded-[36px] bg-white border-2 border-slate-300 shadow-lg overflow-hidden pointer-events-none">

        {/* iPhone çentiği */}
        <div className="absolute inset-x-20 top-2 h-5 rounded-full bg-white border border-slate-300" />

        {/* İç ekran */}
        <div className="absolute inset-x-3 inset-y-5 rounded-[28px] bg-white overflow-hidden flex flex-col">

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
          <div className="flex-1 bg-white relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isInitialLoading ? (
                // İlk yükleme: "Usta arıyorum" yazma animasyonu + loading
                <motion.div
                  key="initial"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6"
                >
                  {/* Yazma animasyonu */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {typingText}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-0.5 h-6 bg-slate-900 ml-1"
                      />
                    </h2>
                  </motion.div>
                  
                  {/* Loading animasyonu (3 saniye) */}
                  {typingText === 'Usta arıyorum' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <motion.div
                        className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <motion.span
                          className="text-white font-bold text-2xl"
                          animate={{
                            scale: [1, 1.15, 1],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          H
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              ) : isTransitioning && showTransitionMessage ? (
                // Loading ve tanıtım mesajı ekranı
                <motion.div
                  key="transition"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6"
                >
                  {/* Animasyonlu Mavi Yuvarlak H Harfi - RotatingHeadline tarzı */}
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.span
                        className="text-white font-bold text-2xl"
                        animate={{
                          scale: [1, 1.15, 1],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        H
                      </motion.span>
                    </motion.div>
                  </motion.div>
                  
                  {/* Tanıtım mesajı */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-sm font-medium text-slate-700 text-center px-4"
                  >
                    {transitionMessage}
                  </motion.p>
                </motion.div>
              ) : (
                // Normal ekran içeriği
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  {current.id === 'step-1' ? (
                    // Step-1: Arama ekranı
                    <div className="absolute inset-0 overflow-y-auto p-5 flex flex-col items-center justify-start pt-8">
                      {/* Logo */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center mb-4"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Logo className="w-14 h-14" />
                        </motion.div>
                      </motion.div>

                      {/* Hareketli yazı */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-6"
                      >
                        <div className="h-7 overflow-hidden mb-1">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={rotatingPhrases[rotatingPhraseIndex]}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.4 }}
                              className="text-2xl font-bold text-slate-900"
                              style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
                            >
                              {rotatingPhrases[rotatingPhraseIndex]}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <p 
                          className="text-2xl font-bold text-slate-900"
                          style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
                        >
                          Kolaylaştırıldı.
                        </p>
                      </motion.div>

                             {/* Arama çubuğu - Sadece arama butonu */}
                             <motion.div
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: 0.4 }}
                               className="w-full max-w-[260px] pointer-events-none"
                             >
                               <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                                 <div className="flex items-stretch gap-1.5 bg-white rounded-2xl border border-slate-200/80 px-3 py-2.5">
                                   <input
                                     type="text"
                                     placeholder="İhtiyacını yaz..."
                                     value={serviceQuery}
                                     onChange={(e) => setServiceQuery(e.target.value)}
                                     className="flex-1 bg-transparent border-none outline-none text-[11px] text-slate-900 placeholder:text-slate-500 font-normal pointer-events-none"
                                     disabled
                                   />
                                   <button
                                     type="button"
                                     disabled
                                     className="px-3 py-1.5 text-[11px] font-semibold bg-brand-500 text-white rounded-xl flex items-center justify-center pointer-events-none cursor-default"
                                   >
                                     <Search className="h-3.5 w-3.5" />
                                   </button>
                                 </div>
                               </form>
                             </motion.div>
                    </div>
                  ) : (
                    current.screen
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
