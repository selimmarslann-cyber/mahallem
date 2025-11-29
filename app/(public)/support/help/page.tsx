'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, ArrowLeft, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/lib/hooks/useToast'

// Sorun kategorileri
const problemCategories = [
  {
    id: 'siparis',
    title: 'Sipariş Sorunu',
    icon: '📦',
    subCategories: [
      { id: 'siparis-gelmedi', title: 'Siparişim gelmedi' },
      { id: 'siparis-yanlis', title: 'Yanlış sipariş geldi' },
      { id: 'siparis-iptal', title: 'Siparişimi iptal etmek istiyorum' },
      { id: 'siparis-odeme', title: 'Ödeme sorunu' },
    ]
  },
  {
    id: 'hizmet',
    title: 'Hizmet Sorunu',
    icon: '🔧',
    subCategories: [
      { id: 'hizmet-kalitesi', title: 'Hizmet kalitesi beklentimi karşılamadı' },
      { id: 'hizmet-gecikme', title: 'Hizmet gecikti' },
      { id: 'hizmet-iptal', title: 'Hizmet iptal edildi' },
      { id: 'hizmet-fiyat', title: 'Fiyat uyuşmazlığı' },
    ]
  },
  {
    id: 'hesap',
    title: 'Hesap Sorunu',
    icon: '👤',
    subCategories: [
      { id: 'hesap-giris', title: 'Giriş yapamıyorum' },
      { id: 'hesap-sifre', title: 'Şifremi unuttum' },
      { id: 'hesap-bilgi', title: 'Hesap bilgilerimi güncellemek istiyorum' },
      { id: 'hesap-silme', title: 'Hesabımı silmek istiyorum' },
    ]
  },
  {
    id: 'odeme',
    title: 'Ödeme Sorunu',
    icon: '💳',
    subCategories: [
      { id: 'odeme-reddedildi', title: 'Ödeme reddedildi' },
      { id: 'odeme-iade', title: 'İade talep ediyorum' },
      { id: 'odeme-fatura', title: 'Fatura sorunu' },
      { id: 'odeme-kart', title: 'Kart bilgileri sorunu' },
    ]
  },
  {
    id: 'diger',
    title: 'Diğer',
    icon: '❓',
    subCategories: []
  }
]

export default function SupportHelpPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [step, setStep] = useState<'category' | 'subcategory' | 'message' | 'success'>('category')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentCategory = problemCategories.find(c => c.id === selectedCategory)

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    if (categoryId === 'diger') {
      setStep('message')
    } else {
      setStep('subcategory')
    }
  }

  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId)
    setStep('message')
  }

  const handleSubmit = async () => {
    if (!message.trim() && !selectedSubCategory) {
      error('Lütfen sorununuzu açıklayın')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          category: selectedCategory,
          subCategory: selectedSubCategory,
          message: message || `${currentCategory?.title} - ${currentCategory?.subCategories.find(s => s.id === selectedSubCategory)?.title}`,
          type: selectedCategory === 'diger' ? 'other' : 'standard'
        })
      })

      if (response.ok) {
        setStep('success')
      } else {
        throw new Error('Mesaj gönderilemedi')
      }
    } catch (err) {
      error('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-white">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Destek Merkezi</h1>
              <p className="text-xs text-slate-500">Size nasıl yardımcı olabiliriz?</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-slate-700 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Kategori Seçimi */}
              {step === 'category' && (
                <motion.div
                  key="category"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Hangi konuda yardıma ihtiyacınız var?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {problemCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-medium text-slate-900 group-hover:text-brand-700">
                            {category.title}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Alt Kategori Seçimi */}
              {step === 'subcategory' && currentCategory && (
                <motion.div
                  key="subcategory"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStep('category')
                        setSelectedCategory(null)
                      }}
                      className="text-slate-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{currentCategory.title}</h2>
                      <p className="text-sm text-slate-500">Sorununuzu seçin</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {currentCategory.subCategories.map((subCat) => (
                      <button
                        key={subCat.id}
                        onClick={() => handleSubCategorySelect(subCat.id)}
                        className="w-full p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-all text-left group"
                      >
                        <span className="font-medium text-slate-900 group-hover:text-brand-700">
                          {subCat.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Mesaj Yazma */}
              {step === 'message' && (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (selectedSubCategory) {
                          setStep('subcategory')
                          setSelectedSubCategory(null)
                        } else {
                          setStep('category')
                          setSelectedCategory(null)
                        }
                      }}
                      className="text-slate-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        {selectedSubCategory 
                          ? currentCategory?.subCategories.find(s => s.id === selectedSubCategory)?.title
                          : 'Sorununuzu açıklayın'
                        }
                      </h2>
                      <p className="text-sm text-slate-500">Detaylı bilgi verin, size daha iyi yardımcı olalım</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Sorununuzu detaylıca açıklayın..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[200px] text-sm"
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || (!message.trim() && !selectedSubCategory)}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>Gönderiliyor...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Gönder
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Başarı */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900">Mesajınız gönderildi!</h2>
                  <p className="text-slate-600 max-w-md">
                    En kısa sürede size dönüş yapacağız. Genellikle 24 saat içinde yanıt veriyoruz.
                  </p>
                  <Button
                    onClick={() => router.back()}
                    className="mt-4"
                  >
                    Kapat
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
