'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Wrench,
  Zap,
  Sparkles,
  Truck,
  Paintbrush,
  Scissors,
  Heart,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import BusinessMap from '@/components/map/BusinessMap'

const CATEGORIES = [
  { id: 'TESISAT', name: 'Tesisat', icon: Wrench },
  { id: 'ELEKTRIK', name: 'Elektrik', icon: Zap },
  { id: 'TEMIZLIK', name: 'Temizlik', icon: Sparkles },
  { id: 'NAKLIYE', name: 'Nakliye', icon: Truck },
  { id: 'BOYA', name: 'Boya & Badana', icon: Paintbrush },
  { id: 'KUAFOR', name: 'Kuaför & Güzellik', icon: Scissors },
  { id: 'DIGER', name: 'Pet Hizmetleri', icon: Heart },
]

const TIME_SLOTS = [
  { label: '09:00–12:00', value: '09:00-12:00' },
  { label: '12:00–15:00', value: '12:00-15:00' },
  { label: '15:00–18:00', value: '15:00-18:00' },
  { label: '18:00–21:00', value: '18:00-21:00' },
]

type Step = 1 | 2 | 3 | 4

export default function RequestWizardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [mapDialogOpen, setMapDialogOpen] = useState(false)

  // Form state
  const [category, setCategory] = useState<string>('')
  const [description, setDescription] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [addressText, setAddressText] = useState('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // URL'den kategori al
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setCategory(categoryParam)
    }

    // Bugünün tarihini default olarak set et
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
  }, [searchParams])

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as Step)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step)
    }
  }

  const handleSubmit = async () => {
    if (!category || !description || !addressText) {
      alert('Lütfen tüm alanları doldurun')
      return
    }

    setLoading(true)
    try {
      // Kullanıcı bilgisini al
      const userRes = await fetch('/api/auth/me', { credentials: 'include' })
      if (!userRes.ok) {
        router.push('/auth/login')
        return
      }
      const userData = await userRes.json()

      // TODO: İş isteği oluşturma endpoint'i
      // Şimdilik basit bir order oluşturma mantığı kullan
      // Gerçek implementasyonda "request" tablosu olabilir veya order'ı direkt oluşturabiliriz

      // Başarılı - success sayfasına yönlendir
      router.push('/request/success')
    } catch (err) {
      alert('İş isteği gönderilemedi')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!category
      case 2:
        return description.length >= 10
      case 3:
        return !!selectedDate && !!selectedTimeSlot
      case 4:
        return !!addressText
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              ← Geri
            </Button>
            <h1 className="font-semibold">İş İsteği Oluştur</h1>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full ${
                  s <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Step 1: Kategori */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Hangi kategoride iş yaptırmak istiyorsun?</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                const isSelected = category === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                      {cat.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: İş Detayı */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">İş detayını açıkla</h2>
            <div>
              <Label htmlFor="description">Ne yaptırmak istiyorsun?</Label>
              <Textarea
                id="description"
                placeholder="Örn: Banyonun tavanında su kaçağı var, alt kata su iniyor. Acil bakılması gerekiyor."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/10 karakter (min 10)
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Tarih & Saat */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Ne zaman yapılmasını istiyorsun?</h2>
            
            <div>
              <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Tarih
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" />
                Saat Aralığı
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.value
                  return (
                    <button
                      key={slot.value}
                      onClick={() => setSelectedTimeSlot(slot.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                        {slot.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Adres */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Adres bilgisi</h2>
            
            <div>
              <Label htmlFor="address">Adres Satırı</Label>
              <Input
                id="address"
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                placeholder="Örn: Kadıköy, Moda Caddesi No:123 Daire:5"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="mb-2 block">Konum (Opsiyonel)</Label>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setMapDialogOpen(true)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Haritadan Konum Seç
              </Button>
              {location && (
                <p className="text-xs text-gray-500 mt-2">
                  Konum seçildi: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Geri
            </Button>
          )}
          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1"
            >
              Devam Et
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className="flex-1"
            >
              {loading ? 'Gönderiliyor...' : 'İş İsteğini Gönder'}
            </Button>
          )}
        </div>
      </div>

      {/* Map Dialog */}
      <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
        <DialogContent className="max-w-full h-[80vh] p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>Konum Seç</DialogTitle>
          </DialogHeader>
          <div className="flex-1 relative">
            <BusinessMap
              businesses={[]}
              onBusinessClick={() => {}}
              onMapMove={() => {}}
            />
            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 border-2 border-primary rounded-full">
                <div className="w-full h-full border-2 border-white rounded-full" />
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Button
              className="w-full"
              onClick={() => {
                // Mock: Şimdilik İstanbul merkez
                setLocation({ lat: 41.0082, lng: 28.9784 })
                setMapDialogOpen(false)
              }}
            >
              Bu Konumu Seç
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

