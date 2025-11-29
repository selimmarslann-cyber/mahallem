'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import Logo from '@/components/layout/Logo'

export default function AppDownloadFinal() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Sol: Metin ve Butonlar */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Uygulamayı indir, bölgendeki her şeyi cebinden yönet.
              </h2>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                Hizmetgo mobil uygulaması ile hizmet iste, ek kazanç sağla ve esnaflardan sipariş ver. 
                Kolay kullanım, hızlı yükleme ve güvenli ödeme ile işlerini tek tıkla hallet.
              </p>
            </div>
            
            <ul className="space-y-3 text-sm md:text-base text-slate-700">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span>Hızlı ve kolay kullanım arayüzü</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span>Güvenli ödeme ve şeffaf fiyatlandırma</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span>Anlık bildirimler ve sipariş takibi</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span>7/24 Destek ve müşteri memnuniyeti</span>
              </li>
            </ul>

            {/* App Store Butonları - Düzgün Badge Tasarımı */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {/* App Store Badge */}
              <Link 
                href="/download"
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
                href="/download"
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

          {/* Sağ: Statik Telefon Mockup - Sadece Logo */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-[290px] md:w-[320px] h-[560px] rounded-[36px] bg-white border-2 border-slate-300 shadow-lg overflow-hidden">
              {/* iPhone çentiği */}
              <div className="absolute inset-x-20 top-2 h-5 rounded-full bg-white border border-slate-300 z-10" />
              
              {/* İç ekran - Sadece logo ortada */}
              <div className="absolute inset-x-3 inset-y-5 rounded-[28px] bg-white overflow-hidden flex items-center justify-center">
                <Logo className="w-20 h-20 md:w-24 md:h-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

