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
                  "flex items-center gap-2 px-4 py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap relative",
                  "border-b-2 border-transparent",
                  activeGroup === group.id
                    ? "text-brand-600 border-brand-600"
                    : "text-slate-600 hover:text-slate-900"
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {currentGroup?.categories.map(cat => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all duration-200 flex flex-col"
          >
            {/* Görsel */}
            <div className="relative h-40 md:h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200">
              <Image
                src={cat.imageSrc}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
            
            {/* Başlık - Sadece */}
            <div className="p-4">
              <h3 className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                {cat.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
