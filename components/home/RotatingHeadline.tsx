'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const phrases = ['Ev hizmetleri', 'Ek gelir', 'Esnaf bulma']

export function RotatingHeadline() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length)
    }, 3000) // 3 saniye
    return () => clearInterval(t)
  }, [])

  const current = phrases[index]

  return (
    <div className="text-center">
      {/* Üst satır: dönen kısım */}
      <div className="h-10 md:h-12 lg:h-14 overflow-hidden mb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-slate-900"
          >
            {current}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Alt satır: sabit "Kolaylaştırıldı." */}
      <div>
        <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-slate-900">
          Kolaylaştırıldı.
        </p>
      </div>
    </div>
  )
}

