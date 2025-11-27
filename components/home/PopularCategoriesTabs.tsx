'use client'

import { useState } from 'react'
import { Wrench, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import * as LucideIcons from 'lucide-react'

// Profesyonel stok görselleri - Unsplash
const categoryGroups = [
  {
    id: 'temizlik',
    icon: 'Sparkles',
    label: 'Temizlikçiler',
    categories: [
      {
        id: 'ev-temizligi',
        title: 'Ev Temizliği',
        imageSrc: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
        href: '/request?categoryId=cleaning',
      },
      {
        id: 'hali-temizligi',
        title: 'Halı Temizliği',
        imageSrc: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=600&fit=crop',
        href: '/request?categoryId=cleaning',
      },
      {
        id: 'ofis-temizligi',
        title: 'Ofis Temizliği',
        imageSrc: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        href: '/request?categoryId=cleaning',
      },
      {
        id: 'duzen-toplama',
        title: 'Düzen & Toplama',
        imageSrc: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        href: '/request?categoryId=cleaning',
      },
    ],
  },
  {
    id: 'tamir',
    icon: 'Wrench',
    label: 'Tamirciler',
    categories: [
      {
        id: 'boya-tadilat',
        title: 'Boya & Tadilat',
        imageSrc: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop',
        href: '/request?categoryId=painting',
      },
      {
        id: 'beyaz-esya',
        title: 'Beyaz Eşya',
        imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        href: '/request?categoryId=appliance-repair',
      },
      {
        id: 'tesisat',
        title: 'Su Tesisatı',
        imageSrc: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
        href: '/request?categoryId=plumbing',
      },
      {
        id: 'elektrik',
        title: 'Elektrik',
        imageSrc: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop',
        href: '/request?categoryId=electricity',
      },
      {
        id: 'klima',
        title: 'Klima',
        imageSrc: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
        href: '/request?categoryId=ac-installation',
      },
    ],
  },
  {
    id: 'tasima',
    icon: 'Truck',
    label: 'Taşıyıcılar',
    categories: [
      {
        id: 'nakliyat',
        title: 'Evden Eve',
        imageSrc: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
        href: '/request?categoryId=moving',
      },
      {
        id: 'parca-esya',
        title: 'Parça Eşya',
        imageSrc: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
        href: '/request?categoryId=moving',
      },
      {
        id: 'mobilya',
        title: 'Mobilya Montaj',
        imageSrc: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        href: '/request?categoryId=carpentry',
      },
      {
        id: 'hurda',
        title: 'Hurda Toplama',
        imageSrc: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=600&fit=crop',
        href: '/request?categoryId=moving',
      },
    ],
  },
  {
    id: 'esnaf',
    icon: 'Utensils',
    label: 'Esnaf & Market',
    categories: [
      {
        id: 'market',
        title: 'Market',
        imageSrc: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop',
        href: '/map?category=market',
      },
      {
        id: 'kasap',
        title: 'Kasap',
        imageSrc: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&h=600&fit=crop',
        href: '/map?category=butcher',
      },
      {
        id: 'yemek',
        title: 'Yemek',
        imageSrc: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        href: '/map?category=restaurant',
      },
      {
        id: 'pastane',
        title: 'Pastane',
        imageSrc: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop',
        href: '/map?category=bakery',
      },
    ],
  },
]

export default function PopularCategoriesTabs() {
  const [activeGroup, setActiveGroup] = useState('temizlik')

  const currentGroup = categoryGroups.find(g => g.id === activeGroup)

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between mb-4 md:mb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Popüler kategoriler
          </h2>
          <p className="text-sm md:text-[15px] text-slate-600 mt-1">
            En çok tercih edilen hizmetleri ve mahalle esnaflarını keşfet.
          </p>
        </div>
      </header>

      {/* Tab Bar - Thumbtack Style */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categoryGroups.map(group => {
            const IconComponent = (LucideIcons as any)[group.icon] || Wrench
            return (
              <button
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className={cn(
                  "inline-flex items-center gap-1 px-3.5 py-2 rounded-full border text-[13px] md:text-sm transition-all whitespace-nowrap",
                  activeGroup === group.id
                    ? "bg-[#FF6000]/10 border-[#FF6000] text-[#FF6000]"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                <IconComponent className="h-5 w-5" />
                <span>{group.label}</span>
              </button>
            )
          })}
          {/* Sağ ok ikonu */}
          <div className="flex items-center text-slate-400 ml-2">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Category Grid - Thumbtack Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {currentGroup?.categories.map(cat => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] transition-shadow"
          >
            {/* Görsel */}
            <div className="relative h-32 md:h-36 overflow-hidden">
              <Image
                src={cat.imageSrc}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-sm font-semibold text-white drop-shadow-sm">
                  {cat.title}
                </p>
                <p className="text-[11px] text-white/80">Sık kullanılan</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
