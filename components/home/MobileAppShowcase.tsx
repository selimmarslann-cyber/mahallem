'use client'

import { QrCode, CheckCircle2, Star, Zap, Shield } from 'lucide-react'
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
                Hizmetgo mobil uygulaması ile hizmet iste, ek kazanç sağla ve esnaflardan sipariş ver. 
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
                    <Icon className="h-5 w-5 text-brand-500 flex-shrink-0" />
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

              {/* App Store Butonları - Düzgün Badge Tasarımı */}
              <div className="flex flex-col gap-3">
                {/* App Store Badge */}
                <Link
                  href="https://apps.apple.com/app/hizmetgo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-black text-white px-5 py-3 rounded-2xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-white/70 leading-tight">Download on the</p>
                    <p className="text-base font-semibold leading-tight">App Store</p>
                  </div>
                </Link>
                
                {/* Google Play Badge */}
                <Link
                  href="https://play.google.com/store/apps/details?id=com.hizmetgo.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-black text-white px-5 py-3 rounded-2xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-white/70 leading-tight">GET IT ON</p>
                    <p className="text-base font-semibold leading-tight">Google Play</p>
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

