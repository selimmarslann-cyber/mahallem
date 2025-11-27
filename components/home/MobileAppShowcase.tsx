'use client'

import { QrCode, Smartphone, Download, CheckCircle2, Star, Zap, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import MobileDemo from './MobileDemo'

export function MobileAppShowcase() {
  return (
    <section className="py-10 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Sol: Yazılar + QR Kod + App Store Butonları */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-3">
                Mobil uygulamayı indir, daha kolay kullan
              </h2>
              <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed">
                Hizmetgo mobil uygulaması ile hizmet iste, ek gelir kazan ve esnaflardan sipariş ver. 
                Kolay kullanım, hızlı yükleme ve güvenli ödeme ile işlerini tek tıkla hallet.
              </p>
            </div>

            {/* Özellikler */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Zap, text: 'Hızlı ve kolay kullanım' },
                { icon: Shield, text: 'Güvenli ödeme sistemi' },
                { icon: Star, text: 'Anlık bildirimler' },
                { icon: CheckCircle2, text: '7/24 müşteri desteği' }
              ].map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-[#FF6000] flex-shrink-0" />
                    <span className="text-sm text-slate-700">{feature.text}</span>
                  </div>
                )
              })}
            </div>

            {/* QR Kod + App Store Butonları */}
            <div className="flex flex-col sm:flex-row items-start gap-6 pt-4">
              {/* QR Kod */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-32 rounded-2xl bg-white border-2 border-slate-200 p-3 flex items-center justify-center shadow-sm">
                  <QrCode className="h-full w-full text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 text-center">
                  QR kodu okutarak<br />indirebilirsin
                </p>
              </div>

              {/* App Store Butonları */}
              <div className="flex flex-col gap-3">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3 hover:bg-slate-900 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  <div className="text-left">
                    <p className="text-[10px] text-white/80">Download on the</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3 hover:bg-slate-900 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  <div className="text-left">
                    <p className="text-[10px] text-white/80">Get it on</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Sağ: MobileDemo */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <MobileDemo />
          </div>
        </div>
      </div>
    </section>
  )
}

