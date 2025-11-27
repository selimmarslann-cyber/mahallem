'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const CATEGORIES = [
  { name: 'Elektrik', keyword: 'elektrik' },
  { name: 'Temizlik', keyword: 'temizlik' },
  { name: 'Tesisat', keyword: 'tesisat' },
  { name: 'Boya badana', keyword: 'boya badana' },
  { name: 'Nakliyat', keyword: 'nakliyat' },
  { name: 'Beyaz eşya', keyword: 'beyaz eşya' },
  { name: 'Özel ders', keyword: 'özel ders' },
  { name: 'Evcil hayvan', keyword: 'evcil hayvan' },
  { name: 'Bahçıvan', keyword: 'bahçıvan' },
  { name: 'Marangoz', keyword: 'marangoz' },
  { name: 'Klima', keyword: 'klima' },
  { name: 'Cam balkon', keyword: 'cam balkon' },
  { name: 'Asansör', keyword: 'asansör' },
  { name: 'Güvenlik', keyword: 'güvenlik' },
  { name: 'Fotoğrafçı', keyword: 'fotoğrafçı' },
  { name: 'Nakliye', keyword: 'nakliye' },
]

export default function CategoryBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const activeCategory = searchParams?.get('q') || ''

  const handleCategoryClick = (keyword: string) => {
    router.push(`/request?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <div className="w-full border-b border-slate-100 bg-white/95 backdrop-blur sticky top-[72px] z-30">
      <div className="max-w-6xl mx-auto flex items-center gap-4 overflow-x-auto px-4 md:px-6 py-2 md:py-2.5 no-scrollbar">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.keyword
          return (
            <button
              key={category.keyword}
              onClick={() => handleCategoryClick(category.keyword)}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] md:text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sky-50 text-sky-700 border border-sky-400" 
                  : "text-slate-700 hover:bg-slate-50 border border-transparent"
              )}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
