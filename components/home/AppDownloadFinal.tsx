import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function AppDownloadFinal() {
  return (
    <section className="py-12 md:py-16 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Sol: Metin ve Butonlar */}
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Uygulamayı indir, mahallendeki her şeyi cebinden yönet.
            </h2>
            
            <ul className="space-y-3 text-sm md:text-[15px] text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span>Hızlı ve kolay kullanım arayüzü</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span>Güvenli ödeme ve şeffaf fiyatlandırma</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span>Anlık bildirimler ve sipariş takibi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span>7/24 Destek ve müşteri memnuniyeti</span>
              </li>
            </ul>

            {/* App Store Butonları */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image
                  src="/images/app-store-badge.png"
                  alt="App Store'dan İndir"
                  width={135}
                  height={40}
                  className="h-10 w-auto"
                  unoptimized
                />
              </Link>
              <Link 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image
                  src="/images/google-play-badge.png"
                  alt="Google Play'den İndir"
                  width={135}
                  height={40}
                  className="h-10 w-auto"
                  unoptimized
                />
              </Link>
            </div>
          </div>

          {/* Sağ: Statik Telefon Mockup */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-[280px] md:w-[320px] h-[560px] rounded-[36px] bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden">
              {/* iPhone çentiği */}
              <div className="absolute inset-x-20 top-2 h-5 rounded-full bg-black/60 z-10" />
              
              {/* İç ekran */}
              <div className="absolute inset-x-3 inset-y-5 rounded-[28px] bg-slate-50 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-4 pt-3 pb-2 border-b border-slate-200 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">H</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800">hizmetgo</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-slate-50 p-4 space-y-3">
                  {/* Arama barı */}
                  <div className="rounded-full bg-white border border-slate-200 px-3 py-2 text-[10px] text-slate-500">
                    İhtiyacını yaz...
                  </div>
                  
                  {/* Kategoriler */}
                  <div className="grid grid-cols-2 gap-2">
                    {['Ev Temizliği', 'Boya', 'Nakliyat', 'Çilingir'].map((cat, i) => (
                      <div key={i} className="rounded-xl bg-white border border-slate-200 p-2 h-20">
                        <div className="text-[9px] font-medium text-slate-700">{cat}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Esnaflar */}
                  <div className="rounded-xl bg-white border border-slate-200 p-2">
                    <div className="text-[9px] font-medium text-slate-700 mb-1">Yakındaki esnaflar</div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                    </div>
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

