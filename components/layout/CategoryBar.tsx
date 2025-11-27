'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { name: 'Elektrik', keyword: 'elektrik' },
  { name: 'Temizlik', keyword: 'temizlik' },
  { name: 'Tesisat', keyword: 'tesisat' },
  { name: 'Boya Badana', keyword: 'boya badana' },
  { name: 'Nakliyat', keyword: 'nakliyat' },
  { name: 'Beyaz Eşya', keyword: 'beyaz eşya' },
  { name: 'Özel Ders', keyword: 'özel ders' },
  { name: 'Evcil Hayvan', keyword: 'evcil hayvan' },
  { name: 'Bahçıvan', keyword: 'bahçıvan' },
  { name: 'Marangoz', keyword: 'marangoz' },
  { name: 'Klima', keyword: 'klima' },
  { name: 'Cam Balkon', keyword: 'cam balkon' },
  { name: 'Asansör', keyword: 'asansör' },
  { name: 'Güvenlik', keyword: 'güvenlik' },
  { name: 'Fotoğrafçı', keyword: 'fotoğrafçı' },
  { name: 'Nakliye', keyword: 'nakliye' },
  { name: 'Kuaför', keyword: 'kuaför' },
  { name: 'Tamirci', keyword: 'tamirci' },
  { name: 'Yemek', keyword: 'yemek' },
  { name: 'Nakış', keyword: 'nakış' },
]

export default function CategoryBar() {
  const router = useRouter()

  const handleCategoryClick = (keyword: string) => {
    router.push(`/request?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.keyword}
              onClick={() => handleCategoryClick(category.keyword)}
              className="flex-shrink-0 text-sm text-black hover:text-[#FF6000] transition-colors font-medium whitespace-nowrap"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

