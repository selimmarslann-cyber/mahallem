'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Zap,
  Sparkles,
} from 'lucide-react'
import { SERVICE_CATEGORIES } from '@/lib/data/service-categories'
import { ServiceCategory, SubService } from '@/lib/types/service-categories'
import { useToast } from '@/lib/hooks/useToast'

type UrgencyType = 'acil' | 'simdi' | 'bugun' | 'yarin' | 'hafta' | 'tarih'

type RequestFormData = {
  categoryId: string | null
  subServiceId: string | null
  urgency: UrgencyType | null
  desiredDate: string | null
  description: string
}

type Step = 1 | 2 | 3

const URGENCY_OPTIONS = [
  { id: 'acil' as UrgencyType, label: 'Acil (hemen / 2 saat içinde)', icon: Zap, color: 'bg-red-500' },
  { id: 'simdi' as UrgencyType, label: 'Şimdi', icon: Clock, color: 'bg-orange-500' },
  { id: 'bugun' as UrgencyType, label: 'Bugün içinde', icon: Calendar, color: 'bg-blue-500' },
  { id: 'yarin' as UrgencyType, label: 'Yarın', icon: Calendar, color: 'bg-green-500' },
  { id: 'hafta' as UrgencyType, label: 'Bu hafta içinde', icon: Calendar, color: 'bg-purple-500' },
  { id: 'tarih' as UrgencyType, label: 'Tarih seç', icon: Calendar, color: 'bg-gray-500' },
]

export default function RequestFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { error } = useToast()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null)
  const [formData, setFormData] = useState<RequestFormData>({
    categoryId: null,
    subServiceId: null,
    urgency: null,
    desiredDate: null,
    description: '',
  })

  // URL'den kategori bilgisini al
  useEffect(() => {
    const categoryId = searchParams.get('categoryId')
    const subServiceId = searchParams.get('subServiceId')
    
    if (categoryId) {
      const category = SERVICE_CATEGORIES.find(cat => cat.id === categoryId)
      if (category) {
        setSelectedCategory(category)
        setFormData(prev => ({ ...prev, categoryId: category.id }))
        
        if (subServiceId) {
          const subService = category.subServices.find(sub => sub.id === subServiceId)
          if (subService) {
            setSelectedSubService(subService)
            setFormData(prev => ({ ...prev, subServiceId: subService.id }))
          }
        }
      }
    }
  }, [searchParams])

  const handleUrgencySelect = (urgency: UrgencyType) => {
    setFormData(prev => ({ ...prev, urgency }))
    
    // Tarih seçildiyse, bugünün tarihini default yap
    if (urgency === 'tarih') {
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ ...prev, desiredDate: today }))
    } else {
      setFormData(prev => ({ ...prev, desiredDate: null }))
    }
  }

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, desiredDate: date }))
  }

  const handleNext = () => {
    if (step === 1 && formData.urgency) {
      setStep(2)
    } else if (step === 2 && canProceedStep2()) {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step)
    } else {
      router.push('/')
    }
  }

  const canProceedStep1 = () => {
    if (!formData.urgency) return false
    if (formData.urgency === 'tarih' && !formData.desiredDate) return false
    return true
  }

  const canProceedStep2 = () => {
    return countWords(formData.description) >= 10 && formData.description.trim().length >= 50
  }

  const countWords = (text: string): number => {
    if (!text.trim()) return 0
    // Kelime sayma: boşluklarla ayrılmış kelimeler
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    return words.length
  }

  const handleSubmit = async () => {
    if (!canProceedStep2()) {
      return
    }

    setLoading(true)
    try {
      // Kullanıcı bilgisini al
      const userRes = await fetch('/api/auth/me', { credentials: 'include' })
      if (!userRes.ok) {
        router.push('/auth/login?redirect=/request')
        return
      }
      const userData = await userRes.json()

      // İş kaydı oluştur
      const jobData = {
        mainCategoryId: formData.categoryId,
        subServiceId: formData.subServiceId,
        isOther: selectedSubService?.isOther || false,
        description: formData.description,
        urgency: formData.urgency,
        desiredDate: formData.desiredDate,
      }

      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
        credentials: 'include',
      })

      if (!res.ok) {
        const errorData = await res.json()
        error(errorData.error || 'İş kaydı oluşturulamadı')
        return
      }

      // Başarılı - success sayfasına yönlendir
      router.push('/request/success')
    } catch (err) {
      console.error('İş kaydı hatası:', err)
      error('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              ← Geri
            </Button>
            <h1 className="font-semibold">İş İsteği Oluştur</h1>
            <div className="w-12" />
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Step 1: Tarih & Aciliyet */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Hizmete ne zaman ihtiyacınız var?
              </h2>
              <p className="text-slate-600">
                Esnaflarınız, seçtiğiniz tarihe göre teklif verecek.
              </p>
            </div>

            {selectedCategory && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        {selectedCategory.name}
                        {selectedSubService && ` - ${selectedSubService.name}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {URGENCY_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = formData.urgency === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => handleUrgencySelect(option.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${option.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {formData.urgency === 'tarih' && (
              <div className="mt-4">
                <Label htmlFor="date" className="mb-2 block">
                  Tarih Seçin
                </Label>
                <input
                  id="date"
                  type="date"
                  value={formData.desiredDate || ''}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                />
              </div>
            )}

            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Acil işler için esnaflar daha hızlı yanıt verebilir. Normal işler için daha fazla teklif alabilirsiniz.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Step 2: İş Açıklaması */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                İşinizi detaylı anlatın
              </h2>
              <p className="text-slate-600">
                Ne kadar detay verirseniz, gelen teklifler o kadar sağlıklı olur.
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block">
                İş Detayı
              </Label>
              <Textarea
                id="description"
                placeholder="Örn: Banyonun tavanında su kaçağı var, alt kata su iniyor. Acil bakılması gerekiyor. Lütfen en az 10 kelime ile işinizi açıklayın - ne yapılmasını istediğinizi, sorunun ne olduğunu, özel bir durum varsa belirtin. Esnaflar bu bilgilere göre size en uygun teklifi verecek."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[200px] text-base"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">
                    {countWords(formData.description)} / 10 kelime
                  </p>
                  {countWords(formData.description) < 10 && (
                    <Badge variant="destructive" className="text-xs">
                      En az 10 kelime gerekli
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {formData.description.length} karakter
                </p>
              </div>
              {formData.description.length > 0 && countWords(formData.description) < 10 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Lütfen en az 10 kelime ile detay verin. Örnek: Sorunun ne olduğunu, nerede olduğunu, ne zaman başladığını, özel bir durum varsa belirtin.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            {step === 1 ? 'İptal' : 'Geri'}
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && !canProceedStep1()) ||
              (step === 2 && (!canProceedStep2() || loading))
            }
            className="flex-1"
          >
            {loading ? (
              'Gönderiliyor...'
            ) : step === 2 ? (
              <>
                Başvuruyu Gönder
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Devam Et
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

