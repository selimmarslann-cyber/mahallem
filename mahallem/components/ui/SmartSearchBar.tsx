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
    <div className="mt-4 md:mt-5 max-w-xl">
      <form onSubmit={handleSearch} className="flex flex-col gap-2">
        <div className="flex items-stretch gap-2 bg-white rounded-full shadow-xl border border-slate-200 px-3 py-2.5 md:py-3">
          {/* Sol input */}
          <input
            type="text"
            placeholder="İhtiyacını yaz: ev temizliği, boya, çilingir..."
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-slate-800 placeholder:text-slate-400"
          />
          
          {/* Konum */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>Konumun</span>
          </div>
          
          {/* Buton */}
          <Button type="submit" variant="default" size="lg" className="px-5 text-xs md:text-sm">
            Ara
          </Button>
        </div>
        <p className="text-[11px] md:text-xs text-slate-500">
          Örnek: "Ümraniye ev temizliği", "Ataşehir çilingir"...
        </p>
      </form>
    </div>
  )
}

