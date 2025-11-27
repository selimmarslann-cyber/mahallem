import Image from 'next/image'

export default function HeroAfterImage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 mt-6 md:mt-8">
      <div className="relative overflow-hidden rounded-3xl bg-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800"
          alt="Mahallede ev ve site görüntüsü"
          width={1800}
          height={360}
          className="w-full h-[220px] md:h-[360px] object-cover"
          unoptimized
        />
        <div className="absolute bottom-4 left-5 md:bottom-6 md:left-7 text-white drop-shadow-sm">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-1">
            Mahallendeki tüm hizmetler tek uygulamada.
          </h2>
          <p className="text-sm md:text-base text-white/90">
            Güvenilir ustalar, esnaflar ve ek gelir fırsatları.
          </p>
        </div>
      </div>
    </div>
  )
}

