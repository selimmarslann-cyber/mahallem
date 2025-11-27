'use client'

import { useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SmartSearchBar() {
  const router = useRouter()
  const [serviceQuery, setServiceQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (serviceQuery.trim()) {
      router.push(`/request?q=${encodeURIComponent(serviceQuery.trim())}`)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <div className="flex items-stretch gap-3 bg-white rounded-full shadow-2xl border border-slate-200 px-4 py-3 md:px-6 md:py-4">
          {/* Sol input - Büyük */}
          <input
            type="text"
            placeholder="İhtiyacını yaz: ev temizliği, boya, çilingir..."
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm md:text-base lg:text-lg text-slate-800 placeholder:text-slate-400"
          />
          
          {/* Konum */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>Konumun</span>
          </div>
          
          {/* Buton - Büyük */}
          <Button type="submit" variant="default" size="lg" className="px-6 md:px-8 text-sm md:text-base font-semibold">
            <Search className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Ara
          </Button>
        </div>
        <p className="text-xs md:text-sm text-slate-500 text-center">
          Örnek: "Ümraniye ev temizliği", "Ataşehir çilingir"...
        </p>
      </form>
    </div>
  )
}

