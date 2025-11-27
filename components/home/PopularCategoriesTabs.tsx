'use client'

import { useState } from 'react'
import { Wrench } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import * as LucideIcons from 'lucide-react'

const categoryGroups = [
  {
    id: 'temizlik',
    icon: 'Sparkles',
    label: 'Temizlik',
    categories: [
      {
        id: 'ev-temizligi',
        title: 'Ev Temizliği',
        description: 'Genel ev temizliği hizmetleri',
        imageSrc: '/images/categories/ev-temizligi.jpg',
        href: '/request?categoryId=cleaning',
      },
      {
        id: 'hali-temizligi',
        title: 'Halı Temizliği',
        description: 'Profesyonel halı yıkama',
        imageSrc: '/images/categories/hali-temizligi.jpg',
        href: '/request?categoryId=cleaning',
      },
      {
        id: 'ofis-temizligi',
        title: 'Ofis Temizliği',
        description: 'İş yeri temizlik hizmetleri',
        imageSrc: '/images/categories/ofis-temizligi.jpg',
        href: '/request?categoryId=cleaning',
      },
      {
        id: 'duzen-toplama',
        title: 'Düzen & Toplama',
        description: 'Ev düzenleme hizmetleri',
        imageSrc: '/images/categories/duzen-toplama.jpg',
        href: '/request?categoryId=cleaning',
      },
    ],
  },
  {
    id: 'tamir',
    icon: 'Wrench',
    label: 'Tamir & Onarım',
    categories: [
      {
        id: 'boya-tadilat',
        title: 'Boya & Tadilat',
        description: 'İç ve dış cephe boyama',
        imageSrc: '/images/categories/boya-tadilat.jpg',
        href: '/request?categoryId=painting',
      },
      {
        id: 'beyaz-esya',
        title: 'Beyaz Eşya',
        description: 'Tamir ve bakım hizmetleri',
        imageSrc: '/images/categories/beyaz-esya.jpg',
        href: '/request?categoryId=appliance-repair',
      },
      {
        id: 'tesisat',
        title: 'Su Tesisatı',
        description: 'Tesisat tamir ve montaj',
        imageSrc: '/images/categories/tesisat.jpg',
        href: '/request?categoryId=plumbing',
      },
      {
        id: 'elektrik',
        title: 'Elektrik',
        description: 'Elektrik işleri ve tamir',
        imageSrc: '/images/categories/elektrik.jpg',
        href: '/request?categoryId=electricity',
      },
      {
        id: 'klima',
        title: 'Klima',
        description: 'Montaj, bakım, tamir',
        imageSrc: '/images/categories/klima.jpg',
        href: '/request?categoryId=ac-installation',
      },
    ],
  },
  {
    id: 'tasima',
    icon: 'Truck',
    label: 'Taşıma & Nakliyat',
    categories: [
      {
        id: 'nakliyat',
        title: 'Evden Eve',
        description: 'Tam ev taşıma hizmetleri',
        imageSrc: '/images/categories/nakliyat.jpg',
        href: '/request?categoryId=moving',
      },
      {
        id: 'parca-esya',
        title: 'Parça Eşya',
        description: 'Küçük eşya taşıma',
        imageSrc: '/images/categories/parca-esya.jpg',
        href: '/request?categoryId=moving',
      },
      {
        id: 'mobilya',
        title: 'Mobilya Montaj',
        description: 'Mobilya kurulum hizmetleri',
        imageSrc: '/images/categories/mobilya.jpg',
        href: '/request?categoryId=carpentry',
      },
      {
        id: 'hurda',
        title: 'Hurda Toplama',
        description: 'Hurda ve atık toplama',
        imageSrc: '/images/categories/hurda.jpg',
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
        description: 'Market siparişleri',
        imageSrc: '/images/categories/market.jpg',
        href: '/map?category=market',
      },
      {
        id: 'kasap',
        title: 'Kasap',
        description: 'Et ve et ürünleri',
        imageSrc: '/images/categories/kasap.jpg',
        href: '/map?category=butcher',
      },
      {
        id: 'yemek',
        title: 'Yemek',
        description: 'Restoran ve yemek servisi',
        imageSrc: '/images/categories/yemek.jpg',
        href: '/map?category=restaurant',
      },
      {
        id: 'pastane',
        title: 'Pastane',
        description: 'Tatlı ve pastane ürünleri',
        imageSrc: '/images/categories/pastane.jpg',
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
      {/* Tab Bar */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {categoryGroups.map(group => {
            const IconComponent = (LucideIcons as any)[group.icon] || Wrench
            return (
              <button
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs md:text-sm transition-all whitespace-nowrap",
                  activeGroup === group.id
                    ? "bg-brand-50 border-brand-300 text-brand-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                <IconComponent className="h-4 w-4" />
                <span>{group.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {currentGroup?.categories.map(cat => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
          >
            <div className="relative h-32 md:h-36">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[10px] text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Mahallende mevcut</span>
              </div>
            </div>
            <div className="p-3 md:p-3.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm md:text-[15px] font-semibold text-slate-800">
                  {cat.title}
                </h3>
                <span className="inline-flex items-center rounded-full bg-brand-50 text-brand-700 text-[10px] px-2 py-0.5">
                  Hemen seç
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-slate-600 line-clamp-2">
                {cat.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

