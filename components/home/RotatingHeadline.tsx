'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

const phrases = ['Ev hizmetleri', 'Ek kazanç', 'Esnaf bulma']

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
      {/* Logo - Animasyonlu (Sadece Logo) */}
      <Link href="/" className="inline-block mb-6 md:mb-8">
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-500 flex items-center justify-center"
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
            <motion.span
              className="text-white font-bold text-2xl md:text-3xl"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              H
            </motion.span>
          </motion.div>
        </motion.div>
      </Link>

      {/* Üst satır: dönen kısım - Thumbtack style */}
      <div className="h-12 md:h-16 lg:h-20 overflow-hidden mb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900"
            style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            {current}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Alt satır: sabit "Kolaylaştırıldı." */}
      <div>
        <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900" style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Kolaylaştırıldı.
        </p>
      </div>
    </div>
  )
}

