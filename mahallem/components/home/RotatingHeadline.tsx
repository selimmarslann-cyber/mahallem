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
    <div className="mb-3 md:mb-4">
      {/* Üst satır: dönen kısım */}
      <div className="h-8 md:h-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900"
          >
            {current}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Alt satır: sabit "Kolaylaştırıldı." */}
      <div className="mt-1">
        <p className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900">
          Kolaylaştırıldı.
        </p>
      </div>
    </div>
  )
}

