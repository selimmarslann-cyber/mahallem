'use client'

import Link from "next/link"
import { HomePopularCategory } from "@/types/home-popular-category"
import { useState, useEffect } from "react"

interface CategoryCardProps {
  category: HomePopularCategory
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false)
  
  // URL zaten version içeriyor (data dosyasından geliyor), direkt kullan
  const imageSrc = category.imageSrc || ''

  // Resim yükleme kontrolü
  useEffect(() => {
    if (!imageSrc) {
      setImageError(true)
      return
    }

    // Resmin yüklenip yüklenmediğini kontrol et
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImageError(false)
    }
    img.onerror = () => {
      setImageError(true)
    }
    img.src = imageSrc
  }, [imageSrc])

  return (
    <Link href={category.href}>
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow">
        <div className="relative h-32 md:h-36 overflow-hidden">
          {!imageError && imageSrc ? (
            <img
              src={imageSrc}
              alt={category.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              loading="lazy"
              onError={() => setImageError(true)}
              key={imageSrc} // Key değişince React resmi yeniden render eder
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-600">
                {category.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-2 left-3">
            <p className="text-[11px] md:text-sm font-semibold text-white drop-shadow-sm">
              {category.title}
            </p>
            <p className="text-[10px] text-white/80">Sık kullanılan</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
