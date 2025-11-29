'use client'

import { motion } from 'framer-motion'
import MobileDemo from './MobileDemo'
import Link from 'next/link'

const benefits = [
  {
    title: 'İhtiyacını belirt',
    description: 'Hangi hizmete ihtiyacın var? Arama yap veya kategorini seç, ihtiyacını detaylıca anlat.'
  },
  {
    title: 'Teklifler al',
    description: 'Yakındaki esnaflardan teklifler al, fiyatları karşılaştır, yorumları oku ve en uygun olanı seç.'
  },
  {
    title: 'İşini hallettir',
    description: 'Seçtiğin esnafla iletişime geç, işini hallettir ve memnun kalırsan değerlendirme yap.'
  }
]

export function SearchExperienceShowcase() {
  return (
    <section className="mt-12 md:mt-16 mb-16 md:mb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12 md:mb-16">
          {/* Animasyonlu Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-6"
                  >
            <Link href="/" className="flex items-center gap-1">
              <motion.span 
                className="text-3xl md:text-4xl font-normal leading-none text-slate-900"
                style={{
                  fontFamily: "'Kalam', 'Comic Sans MS', 'Brush Script MT', cursive",
                  fontStyle: 'italic',
                  letterSpacing: '-0.02em',
                }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                hizmet
                <motion.span 
                  className="font-bold text-brand-500"
                  style={{
                    fontWeight: 700,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    color: ['#3B82F6', '#2563EB', '#3B82F6'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  go
                </motion.span>
              </motion.span>
            </Link>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6 text-center" style={{ lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Müşteriler neden Hizmetgo'yu seviyor
          </h2>
          <p className="text-base md:text-lg text-slate-600 text-center max-w-2xl leading-relaxed">
            Her gün onlarca müşteri gibi siz de evinize bakım için Hizmetgo'ya güveniyorsunuz—ve işler planlandığı gibi gitmezse yanınızdayız.
          </p>
                </div>

        {/* Thumbtack Style Layout: Benefits on left, Mobile Demo on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Sol taraf - Benefit boxes */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {benefits.map((benefit, index) => {
              const href = index === 0 ? '/request' : index === 1 ? '/jobs' : '/jobs'
              return (
                <Link
                  key={index}
                  href={href}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 transition-all hover:bg-slate-50 hover:border-brand-300 hover:shadow-sm cursor-pointer"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3" style={{ lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                      {benefit.title}
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                </Link>
              )
            })}
                  </div>

          {/* Sağ taraf - Mobil animasyon */}
          <div className="flex items-center justify-center lg:justify-end w-full">
            <MobileDemo />
          </div>
        </div>
      </div>
    </section>
  )
}


