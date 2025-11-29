'use client'

import { HOME_POPULAR_CATEGORIES } from '@/lib/data/home-popular-categories'
import { CategoryCard } from '@/components/home/CategoryCard'

export function PopularCategoriesSection() {
  return (
    <section className="mt-10">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-1">
        Popüler Kategoriler
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        En çok tercih edilen hizmetleri ve mahalle esnaflarını keşfet.
      </p>

      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {HOME_POPULAR_CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}

// Default export for backward compatibility
export default PopularCategoriesSection
