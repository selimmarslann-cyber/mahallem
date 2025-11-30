'use client'

import { useState, useEffect } from 'react'
import { MapPin, Search, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import AIChatModal from '@/components/AIChat/AIChatModal'
import { getKeywordSuggestions } from '@/lib/utils/keywords'

export default function SmartSearchBar() {
  const router = useRouter()
  const [serviceQuery, setServiceQuery] = useState('')
  const [isInstantJob, setIsInstantJob] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Kullanıcı bilgisini al
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (data.user?.id) {
            setUserId(data.user.id)
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [])

  // Debug: userId ve showAIChat değişikliklerini logla
  useEffect(() => {
    console.log('SmartSearchBar state:', { userId, showAIChat, serviceQuery })
  }, [userId, showAIChat, serviceQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Önerileri kapat
    setShowSuggestions(false)
    
    if (isInstantJob) {
      // Anlık işlere yönlendir - anahtar kelime olmadan
      router.push('/earn')
    } else if (serviceQuery.trim()) {
      // Kategori araması - AI chat modal'ını aç
      if (userId) {
        // Kullanıcı giriş yapmış, AI chat modal'ını aç
        console.log('Opening AI chat with category:', serviceQuery.trim())
        setShowAIChat(true)
      } else {
        // Giriş yapılmamış, login sayfasına yönlendir
        // ai=true parametresi ile AI chat'in açılması gerektiğini belirt
        router.push(`/auth/login?redirect=/request?ai=true&q=${encodeURIComponent(serviceQuery.trim())}`)
      }
    } else {
      // Boş arama - genel request sayfasına yönlendir
      router.push('/request')
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        {/* Thumbtack style search bar */}
        <div className="flex items-stretch gap-2 bg-white rounded-2xl border border-slate-200/80 px-4 py-3 md:px-6 md:py-4">
          {/* Sol input - Thumbtack style */}
          <div className="flex-1 relative">
          <input
            type="text"
            placeholder="İhtiyacını yaz: ev temizliği, boya, çilingir..."
            value={serviceQuery}
              onChange={(e) => {
                const value = e.target.value
                setServiceQuery(value)
                
                // Anahtar kelime önerileri (sadece instant job değilse)
                if (!isInstantJob && value.trim().length >= 2) {
                  const keywordSuggestions = getKeywordSuggestions(value, 5)
                  setSuggestions(keywordSuggestions)
                  setShowSuggestions(keywordSuggestions.length > 0)
                } else {
                  setShowSuggestions(false)
                  setSuggestions([])
                }
              }}
              onFocus={() => {
                if (!isInstantJob && serviceQuery.trim().length >= 2 && suggestions.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              onBlur={() => {
                // Kısa bir gecikme ile kapat (tıklama için zaman tanı)
                setTimeout(() => setShowSuggestions(false), 200)
              }}
              className="w-full bg-transparent border-none outline-none text-sm md:text-base text-slate-900 placeholder:text-slate-500 font-normal"
          />
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && !isInstantJob && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] z-50 max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setServiceQuery(suggestion)
                      setShowSuggestions(false)
                      // Form submit et
                      setTimeout(() => {
                        const form = document.querySelector('form')
                        if (form) {
                          form.requestSubmit()
                        }
                      }, 100)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between group text-sm"
                  >
                    <span className="text-slate-900">{suggestion}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Divider */}
          <div className="hidden md:block w-px bg-slate-200 my-2" />
          
          {/* Konum - Thumbtack style */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer text-sm text-slate-600 font-medium">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span>Konumun</span>
          </div>
          
          {/* Divider */}
          <div className="hidden md:block w-px bg-slate-200 my-2" />
          
          {/* Buton - Thumbtack style turuncu */}
          <Button 
            type="submit" 
            className="px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm transition-all"
          >
            <Search className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Ara
          </Button>
        </div>
        
        {/* Checkbox - Anlık işler için */}
        <div className="mt-4">
          <div className="flex items-start justify-center gap-3 mb-3">
            <Checkbox
              id="instant-job"
              checked={isInstantJob}
              onCheckedChange={(checked) => setIsInstantJob(checked === true)}
              className="h-4 w-4 mt-0.5 border-slate-300 data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500"
            />
            <Label
              htmlFor="instant-job"
              className="text-sm text-slate-700 font-medium cursor-pointer hover:text-slate-900 transition-colors leading-relaxed"
            >
              <span className="block">Özel beceri gerektirmeyen anlık işler için ara</span>
              <span className="text-xs text-slate-500 font-normal mt-0.5 block">
                Bu seçenek ile vasıf gerektirmeyen, herkesin yapabileceği kısa süreli işlere yönlendirilirsiniz
              </span>
            </Label>
          </div>
          
          {/* Örnekler */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="text-xs text-slate-500 font-normal">Örnekler:</span>
            {isInstantJob ? (
              // Anlık iş örnekleri
              <>
            <button
              type="button"
              onClick={() => {
                setServiceQuery('Köpeğimi gezdirme istiyorum')
                setIsInstantJob(true)
                setTimeout(() => {
                  const form = document.querySelector('form')
                  if (form) {
                    form.requestSubmit()
                  }
                }, 100)
              }}
              className="text-xs text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-all font-normal"
            >
              Köpeğimi gezdirme istiyorum
            </button>
            <button
              type="button"
              onClick={() => {
                setServiceQuery('1 günlük şoför arıyorum')
                setIsInstantJob(true)
                setTimeout(() => {
                  const form = document.querySelector('form')
                  if (form) {
                    form.requestSubmit()
                  }
                }, 100)
              }}
              className="text-xs text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-all font-normal"
            >
              1 günlük şoför arıyorum
            </button>
            <button
              type="button"
              onClick={() => {
                setServiceQuery('Market alışverişi taşıma')
                setIsInstantJob(true)
                setTimeout(() => {
                  const form = document.querySelector('form')
                  if (form) {
                    form.requestSubmit()
                  }
                }, 100)
              }}
              className="text-xs text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-all font-normal"
            >
              Market alışverişi taşıma
            </button>
            <button
              type="button"
              onClick={() => {
                setServiceQuery('Broşür dağıtımı')
                setIsInstantJob(true)
                setTimeout(() => {
                  const form = document.querySelector('form')
                  if (form) {
                    form.requestSubmit()
                  }
                }, 100)
              }}
              className="text-xs text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-all font-normal"
            >
              Broşür dağıtımı
            </button>
              </>
            ) : (
              // Normal kategori örnekleri
              <>
                <button
                  type="button"
                  onClick={() => {
                    setServiceQuery('elektrik')
                    setIsInstantJob(false)
                    setTimeout(() => {
                      const form = document.querySelector('form')
                      if (form) {
                        form.requestSubmit()
                      }
                    }, 100)
                  }}
                  className="text-xs text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-all font-normal"
                >
                  Elektrik
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setServiceQuery('temizlik')
                    setIsInstantJob(false)
                    setTimeout(() => {
                      const form = document.querySelector('form')
                      if (form) {
                        form.requestSubmit()
                      }
                    }, 100)
                  }}
                  className="text-xs text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-all font-normal"
                >
                  Temizlik
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setServiceQuery('boya')
                    setIsInstantJob(false)
                    setTimeout(() => {
                      const form = document.querySelector('form')
                      if (form) {
                        form.requestSubmit()
                      }
                    }, 100)
                  }}
                  className="text-xs text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-all font-normal"
                >
                  Boya
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setServiceQuery('tesisat')
                    setIsInstantJob(false)
                    setTimeout(() => {
                      const form = document.querySelector('form')
                      if (form) {
                        form.requestSubmit()
                      }
                    }, 100)
                  }}
                  className="text-xs text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-all font-normal"
                >
                  Tesisat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setServiceQuery('çilingir')
                    setIsInstantJob(false)
                    setTimeout(() => {
                      const form = document.querySelector('form')
                      if (form) {
                        form.requestSubmit()
                      }
                    }, 100)
                  }}
                  className="text-xs text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-all font-normal"
                >
                  Çilingir
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      {/* AI Chat Modal */}
      {userId && (
        <AIChatModal
          isOpen={showAIChat}
          onClose={() => setShowAIChat(false)}
          userId={userId}
          initialCategory={serviceQuery.trim() || undefined}
        />
      )}
    </div>
  )
}

