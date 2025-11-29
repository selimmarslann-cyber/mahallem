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
    <div className="w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-[72px] z-30 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 overflow-x-auto px-4 md:px-6 py-3 md:py-4 no-scrollbar scroll-smooth">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.keyword
            return (
              <button
                key={category.keyword}
                onClick={() => handleCategoryClick(category.keyword)}
                className={cn(
                  "whitespace-nowrap rounded-2xl px-4 py-2 text-sm md:text-base font-medium transition-all duration-200 flex-shrink-0",
                  isActive 
                    ? "bg-brand-500 text-white shadow-sm" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-200"
                )}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
