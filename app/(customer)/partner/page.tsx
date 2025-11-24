'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  Users, 
  Share2, 
  TrendingUp, 
  Award, 
  Shield,
  Gift,
  Target,
  MapPin,
  Building2,
  Globe,
  ArrowRight,
  Percent,
  Zap,
  Crown,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function PartnerPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      setIsLoggedIn(res.ok)
    } catch (err) {
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGoToPanel = () => {
    if (isLoggedIn) {
      router.push('/business/jobs')
    } else {
      router.push('/auth/login?type=business&redirect=/business/jobs')
    }
  }

  const handleGoToReferral = () => {
    if (isLoggedIn) {
      router.push('/account/referral')
    } else {
      router.push('/auth/login?redirect=/account/referral')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Sıfır Yatırımla Ortak Ol
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Mahallem'de her işlemden pay kazanın, ömür boyu kazanç sağlayın
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-white shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center shadow-lg">
                  <Gift className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  0 Yatırımla Gerçek Ortaklık Ekonomisi
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed">
                <p className="text-lg font-semibold text-gray-900">
                  Mahallem'de sadece hizmet alıp vermiyorsunuz; mahallenizde dönen her işten, 
                  kurduğunuz ağ kadar pay alıyorsunuz.
                </p>
                <p className="text-gray-700">
                  Ne şirket kurmanıza gerek var, ne sermaye bağlamanıza. Sadece referans kodunuzla 
                  davet edin, sipariş geldikçe sistem sizin için çalışsın. <strong className="text-primary font-semibold">Ömür boyu kazanç garantisi.</strong>
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge variant="secondary" className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                    Üyelik ücreti yok
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                    Zorunlu satış yok
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                    Ömür boyu kazanç
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                    Otomatik ödeme
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Nasıl Çalışır? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900 tracking-tight">
              <Zap className="w-7 h-7 text-primary" />
              Nasıl Çalışır?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Adım 1 */}
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg text-gray-900">
                        <Users className="w-5 h-5 text-primary" />
                        Referans Kodunuzu Alın
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Hesabınızı oluşturun, size özel referans kodunuzu ve linkinizi alın. 
                        Profil sayfanızdan veya Referans bölümünden erişebilirsiniz.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Adım 2 */}
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg text-gray-900">
                        <Share2 className="w-5 h-5 text-primary" />
                        Paylaşın ve Ağ Kurun
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        WhatsApp, sosyal medya, kartvizit, dükkân camı - kurallar dahilinde 
                        dilediğiniz yerde paylaşın. Her davet edilen kişi ağınıza eklenir.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Adım 3 */}
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg text-gray-900">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Otomatik Kazanç
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Ağınızdaki herkes sipariş verdikçe, otomatik olarak cüzdanınıza pay düşer. 
                        5 seviyeye kadar kazanç, ömür boyu devam eder.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Detaylı Kazanç Sistemi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                <Percent className="w-7 h-7 text-primary" />
                Detaylı Kazanç Sistemi
              </CardTitle>
              <CardDescription className="text-base text-gray-600 leading-relaxed mt-2">
                Platform fee'sinin maksimum %45'i referral zinciri ve bölge yöneticilerine dağıtılır. 
                Kalan %55+ platform'a kalır.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 5-Level Referral Zinciri */}
              <div>
                <h4 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-900">
                  <Users className="w-5 h-5 text-primary" />
                  5 Seviyeli Referral Zinciri
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {[
                      { level: 1, base: 10, label: 'L1 - Direkt Davet' },
                      { level: 2, base: 6, label: 'L2 - İkinci Seviye' },
                      { level: 3, base: 5, label: 'L3 - Üçüncü Seviye' },
                      { level: 4, base: 3, label: 'L4 - Dördüncü Seviye' },
                      { level: 5, base: 1, label: 'L5 - Beşinci Seviye' },
                    ].map((item) => (
                      <Card key={item.level} className="bg-gradient-to-br from-primary/5 via-primary/3 to-white border border-primary/20 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-primary mb-2">
                            {item.base}%
                          </div>
                          <div className="text-xs font-medium text-gray-600">
                            {item.label}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 pt-2 leading-relaxed">
                    <strong className="text-gray-900">Toplam Base Referral:</strong> %25 (fee üzerinden). Her seviye için base yüzde sabittir.
                  </p>
                </div>
              </div>

              {/* Rank Bonusları */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-900">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  Rank Bonusları (Network GMV'ye Göre)
                </h4>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    Ağınızın toplam ciro (GMV) büyüdükçe rank atlarsınız ve base yüzdelerinize bonus eklenir.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {[
                      { rank: 0, name: 'Normal Kullanıcı', gmv: '< 1M TL', bonus: 0, color: 'gray' },
                      { rank: 1, name: 'Mahalle Lideri', gmv: '≥ 1M TL', bonus: 0.5, color: 'blue' },
                      { rank: 2, name: 'İlçe Yöneticisi', gmv: '≥ 10M TL', bonus: 1.0, color: 'green' },
                      { rank: 3, name: 'İl Yöneticisi', gmv: '≥ 100M TL', bonus: 1.5, color: 'purple' },
                      { rank: 4, name: 'Ülke Yöneticisi', gmv: '≥ 500M TL', bonus: 2.0, color: 'yellow' },
                    ].map((item) => (
                      <Card key={item.rank} className={`border-2 ${item.rank === 0 ? 'border-gray-200' : 'border-primary/30'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {item.rank > 0 && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            <div className="font-semibold text-sm">{item.name}</div>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            GMV: {item.gmv}
                          </div>
                          <div className="text-lg font-bold text-primary">
                            +{item.bonus}% Bonus
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Her seviyeye eklenir
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 shadow-sm">
                    <p className="text-sm text-blue-900 leading-relaxed">
                      <strong>Örnek:</strong> İl Yöneticisi (Rank 3) olduğunuzda, L1 seviyesindeki payınız 
                      %10 (base) + %1.5 (bonus) = <strong className="text-blue-950">%11.5</strong> olur.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bölge Yöneticileri */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-900">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Bölge Yöneticileri
                </h4>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    Belirli bölgelerde yönetici olarak atanırsanız, o bölgedeki tüm işlemlerden pay alırsınız.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { type: 'Mahalle', pct: 3, icon: Building2 },
                      { type: 'İlçe', pct: 3, icon: Building2 },
                      { type: 'İl', pct: 2, icon: Globe },
                      { type: 'Ülke', pct: 2, icon: Globe },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <Card key={item.type} className="bg-gradient-to-br from-green-50 to-green-100">
                          <CardContent className="p-4 text-center">
                            <Icon className="w-6 h-6 mx-auto mb-2 text-green-600" />
                            <div className="text-xl font-bold text-green-700 mb-1">
                              {item.pct}%
                            </div>
                            <div className="text-xs font-medium text-green-800">
                              {item.type} Yöneticisi
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                  <p className="text-sm text-gray-700 pt-2 leading-relaxed">
                    <strong className="text-gray-900">Toplam Bölge Payı:</strong> %10 (fee üzerinden)
                  </p>
                </div>
              </div>

              {/* Toplam Dağıtım */}
              <div className="border-t pt-6">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Toplam Dağıtım Özeti</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">%25</div>
                      <div className="text-sm text-muted-foreground">Base Referral</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">+%10</div>
                      <div className="text-sm text-muted-foreground">Rank Bonusları (Max)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">%10</div>
                      <div className="text-sm text-muted-foreground">Bölge Yöneticileri</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Toplam Maksimum Dağıtım:</span>
                      <span className="text-2xl font-bold text-primary">%45</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Platform'a Kalan:</span>
                      <span className="text-lg font-semibold text-green-600">≥ %55</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detaylı Matematiksel Açıklamalar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Detaylı Matematiksel Hesaplamalar
              </CardTitle>
              <CardDescription className="text-base">
                Sistemin nasıl çalıştığını matematiksel formüller ve gerçek örneklerle anlayın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Temel Formül */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Percent className="w-5 h-5" />
                  Temel Hesaplama Formülü
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white rounded-lg p-4 font-mono text-xs">
                    <div className="mb-2"><strong>Platform Fee (F) = Sipariş Tutarı (T) × Platform Fee Oranı (f)</strong></div>
                    <div className="mb-2"><strong>Örnek:</strong> T = 1.000 TL, f = %10 → F = 1.000 × 0.10 = 100 TL</div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="mb-1"><strong>Referral Payı = F × (Base Yüzde + Rank Bonusu) / 100</strong></div>
                      <div className="mb-1"><strong>Bölge Payı = F × Bölge Yüzdesi / 100</strong></div>
                      <div><strong>Toplam Dağıtım ≤ F × 0.45 (Maksimum %45)</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Senaryo 1: Basit Referral */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Senaryo 1: Basit 3 Seviyeli Referral</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-4">
                  <div className="text-sm">
                    <p className="font-semibold mb-2">Durum:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Sipariş Tutarı: <strong className="text-foreground">1.000 TL</strong></li>
                      <li>Platform Fee: <strong className="text-foreground">100 TL</strong> (%10)</li>
                      <li>L1 Referral: Rank 0 (Normal kullanıcı)</li>
                      <li>L2 Referral: Rank 0 (Normal kullanıcı)</li>
                      <li>L3 Referral: Rank 0 (Normal kullanıcı)</li>
                      <li>Bölge yöneticisi yok</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono mb-3 pb-3 border-b">
                      <div className="font-semibold">Seviye</div>
                      <div className="font-semibold">Hesaplama</div>
                      <div className="font-semibold text-right">Pay</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>L1 (Base %10)</div>
                      <div className="font-mono">100 × 10% =</div>
                      <div className="text-right font-semibold">10.00 TL</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>L2 (Base %6)</div>
                      <div className="font-mono">100 × 6% =</div>
                      <div className="text-right font-semibold">6.00 TL</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>L3 (Base %5)</div>
                      <div className="font-mono">100 × 5% =</div>
                      <div className="text-right font-semibold">5.00 TL</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t font-semibold">
                      <div>Toplam Referral</div>
                      <div></div>
                      <div className="text-right text-primary">21.00 TL (%21)</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                      <div className="text-muted-foreground">Platform'a Kalan</div>
                      <div className="font-mono text-muted-foreground">100 - 21 =</div>
                      <div className="text-right font-semibold text-green-600">79.00 TL (%79)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Senaryo 2: Rank Bonuslu */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Senaryo 2: Rank Bonusları ile Artırılmış Kazanç</h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-5 space-y-4">
                  <div className="text-sm">
                    <p className="font-semibold mb-2">Durum:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Sipariş Tutarı: <strong className="text-foreground">5.000 TL</strong></li>
                      <li>Platform Fee: <strong className="text-foreground">500 TL</strong> (%10)</li>
                      <li>L1 Referral: Rank 3 (İl Yöneticisi) → Base %10 + Bonus %1.5 = %11.5</li>
                      <li>L2 Referral: Rank 2 (İlçe Yöneticisi) → Base %6 + Bonus %1.0 = %7.0</li>
                      <li>L3 Referral: Rank 1 (Mahalle Lideri) → Base %5 + Bonus %0.5 = %5.5</li>
                      <li>L4 Referral: Rank 0 (Normal) → Base %3</li>
                      <li>L5 Referral: Rank 0 (Normal) → Base %1</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono mb-3 pb-3 border-b">
                      <div className="font-semibold">Seviye</div>
                      <div className="font-semibold">Hesaplama</div>
                      <div className="font-semibold text-right">Pay</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>L1 (10% + 1.5%)</div>
                      <div className="font-mono">500 × 11.5% =</div>
                      <div className="text-right font-semibold">57.50 TL</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>L2 (6% + 1.0%)</div>
                      <div className="font-mono">500 × 7.0% =</div>
                      <div className="text-right font-semibold">35.00 TL</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>L3 (5% + 0.5%)</div>
                      <div className="font-mono">500 × 5.5% =</div>
                      <div className="text-right font-semibold">27.50 TL</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>L4 (Base %3)</div>
                      <div className="font-mono">500 × 3% =</div>
                      <div className="text-right font-semibold">15.00 TL</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>L5 (Base %1)</div>
                      <div className="font-mono">500 × 1% =</div>
                      <div className="text-right font-semibold">5.00 TL</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t font-semibold">
                      <div>Toplam Referral</div>
                      <div></div>
                      <div className="text-right text-primary">141.00 TL (%28.2)</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                      <div className="text-muted-foreground">Platform'a Kalan</div>
                      <div className="font-mono text-muted-foreground">500 - 141 =</div>
                      <div className="text-right font-semibold text-green-600">359.00 TL (%71.8)</div>
                    </div>
                    <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                      <strong className="text-foreground">Not:</strong> Rank bonusları sayesinde base %25 yerine %28.2 kazanç elde edildi. 
                      Bu, rank sisteminin ne kadar önemli olduğunu gösterir.
                    </div>
                  </div>
                </div>
              </div>

              {/* Senaryo 3: Bölge Yöneticisi Dahil */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Senaryo 3: Bölge Yöneticileri ile Maksimum Dağıtım</h4>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 space-y-4">
                  <div className="text-sm">
                    <p className="font-semibold mb-2">Durum:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Sipariş Tutarı: <strong className="text-foreground">10.000 TL</strong></li>
                      <li>Platform Fee: <strong className="text-foreground">1.000 TL</strong> (%10)</li>
                      <li>5 seviyeli referral zinciri (tümü Rank 4 - Ülke Yöneticisi)</li>
                      <li>Mahalle Yöneticisi: %3</li>
                      <li>İlçe Yöneticisi: %3</li>
                      <li>İl Yöneticisi: %2</li>
                      <li>Ülke Yöneticisi: %2</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-3 text-sm">
                    <div>
                      <div className="font-semibold mb-2 text-xs">REFERRAL ZİNCİRİ (Tüm Rank 4 - +2% bonus):</div>
                      <div className="space-y-1 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div>L1: 10% + 2% = 12%</div>
                          <div className="font-mono">1.000 × 12% =</div>
                          <div className="text-right font-semibold">120.00 TL</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>L2: 6% + 2% = 8%</div>
                          <div className="font-mono">1.000 × 8% =</div>
                          <div className="text-right font-semibold">80.00 TL</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>L3: 5% + 2% = 7%</div>
                          <div className="font-mono">1.000 × 7% =</div>
                          <div className="text-right font-semibold">70.00 TL</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>L4: 3% + 2% = 5%</div>
                          <div className="font-mono">1.000 × 5% =</div>
                          <div className="text-right font-semibold">50.00 TL</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>L5: 1% + 2% = 3%</div>
                          <div className="font-mono">1.000 × 3% =</div>
                          <div className="text-right font-semibold">30.00 TL</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t font-semibold">
                          <div>Toplam Referral</div>
                          <div></div>
                          <div className="text-right text-primary">350.00 TL (%35)</div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="font-semibold mb-2 text-xs">BÖLGE YÖNETİCİLERİ:</div>
                      <div className="space-y-1 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div>Mahalle: %3</div>
                          <div className="font-mono">1.000 × 3% =</div>
                          <div className="text-right font-semibold">30.00 TL</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>İlçe: %3</div>
                          <div className="font-mono">1.000 × 3% =</div>
                          <div className="text-right font-semibold">30.00 TL</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>İl: %2</div>
                          <div className="font-mono">1.000 × 2% =</div>
                          <div className="text-right font-semibold">20.00 TL</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>Ülke: %2</div>
                          <div className="font-mono">1.000 × 2% =</div>
                          <div className="text-right font-semibold">20.00 TL</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t font-semibold">
                          <div>Toplam Bölge</div>
                          <div></div>
                          <div className="text-right text-primary">100.00 TL (%10)</div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t-2">
                      <div className="grid grid-cols-3 gap-2 text-sm font-bold">
                        <div>TOPLAM DAĞITIM</div>
                        <div className="font-mono">350 + 100 =</div>
                        <div className="text-right text-primary text-lg">450.00 TL (%45)</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs pt-1 text-muted-foreground">
                        <div>Platform'a Kalan</div>
                        <div className="font-mono">1.000 - 450 =</div>
                        <div className="text-right font-semibold text-green-600">550.00 TL (%55)</div>
                      </div>
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <strong className="text-yellow-900">⚠️ Maksimum Dağıtım:</strong> Bu senaryo, sistemin maksimum %45 dağıtım limitine ulaştığı durumdur. 
                        Daha fazla pay dağıtılamaz, platform en az %55 alır.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Senaryo 4: Esnaf + Kullanıcı Kayıt Senaryosu */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Senaryo 4: Esnaf + Kullanıcı Kayıt - 1 Yıllık Emek Senaryosu</h4>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-5 space-y-4">
                  <div className="text-sm">
                    <p className="font-semibold mb-3 text-gray-900">Durum: 1 Yıl Aktif Çalışma Sonrası</p>
                    <p className="text-xs text-gray-600 mb-4">
                      Bu senaryo, 1 yıl boyunca aktif olarak esnaf ve kullanıcı kayıt ettiren bir kişinin ulaşabileceği rakamları gösterir. 
                      L1 seviyesinde %12 pay alıyorsunuz (Base %10 + Rank Bonusu %2.0).
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-4 text-sm shadow-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-3 font-semibold text-gray-900">Kayıt Türü</th>
                            <th className="text-center py-3 px-3 font-semibold text-gray-900">Adet</th>
                            <th className="text-center py-3 px-3 font-semibold text-gray-900">Sipariş/Adet</th>
                            <th className="text-center py-3 px-3 font-semibold text-gray-900">Ort. Tutar</th>
                            <th className="text-center py-3 px-3 font-semibold text-gray-900">Aylık Ciro</th>
                            <th className="text-center py-3 px-3 font-semibold text-gray-900">Platform Fee</th>
                            <th className="text-center py-3 px-3 font-semibold text-primary">Senin Payın*</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { type: 'Restoran', count: 10, ordersPer: 300, avg: 450, ciro: 1350000, fee: 135000, pay: 16200 },
                            { type: 'Market', count: 5, ordersPer: 300, avg: 500, ciro: 750000, fee: 75000, pay: 9000 },
                            { type: 'Kafe', count: 5, ordersPer: 150, avg: 400, ciro: 300000, fee: 30000, pay: 3600 },
                            { type: 'Terzi', count: 2, ordersPer: 30, avg: 500, ciro: 30000, fee: 3000, pay: 360 },
                            { type: 'Berber', count: 3, ordersPer: 100, avg: 500, ciro: 150000, fee: 15000, pay: 1800 },
                            { type: 'Temizlik', count: 3, ordersPer: 50, avg: 1000, ciro: 150000, fee: 15000, pay: 1800 },
                            { type: 'Aktif Kullanıcı', count: 200, ordersPer: 1, avg: 2000, ciro: 400000, fee: 40000, pay: 4800 },
                          ].map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-3 font-medium text-gray-900">{item.type}</td>
                              <td className="py-3 px-3 text-center text-gray-700">{item.count} adet</td>
                              <td className="py-3 px-3 text-center text-gray-700">{item.ordersPer} sipariş</td>
                              <td className="py-3 px-3 text-center text-gray-700">{item.avg} TL</td>
                              <td className="py-3 px-3 text-center text-gray-700 font-mono">{item.ciro.toLocaleString('tr-TR')} TL</td>
                              <td className="py-3 px-3 text-center text-gray-700 font-mono">{item.fee.toLocaleString('tr-TR')} TL</td>
                              <td className="py-3 px-3 text-center font-semibold text-primary font-mono">{item.pay.toLocaleString('tr-TR')} TL</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gradient-to-r from-primary/10 to-primary/5 border-t-2 border-primary/20">
                          <tr>
                            <td colSpan={6} className="py-4 px-3 font-bold text-gray-900 text-right">TOPLAM AYLIK KAZANÇ:</td>
                            <td className="py-4 px-3 text-center font-bold text-primary text-lg">
                              {[
                                { pay: 16200 },
                                { pay: 9000 },
                                { pay: 3600 },
                                { pay: 360 },
                                { pay: 1800 },
                                { pay: 1800 },
                                { pay: 4800 },
                              ].reduce((sum, item) => sum + item.pay, 0).toLocaleString('tr-TR')} TL/ay
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={6} className="py-2 px-3 text-xs text-gray-600 text-right">Yıllık kazanç (tahmini):</td>
                            <td className="py-2 px-3 text-center text-xs font-semibold text-primary">
                              ~{([
                                { pay: 16200 },
                                { pay: 9000 },
                                { pay: 3600 },
                                { pay: 360 },
                                { pay: 1800 },
                                { pay: 1800 },
                                { pay: 4800 },
                              ].reduce((sum, item) => sum + item.pay, 0) * 12).toLocaleString('tr-TR')} TL/yıl
                            </td>
                          </tr>
                          <tr className="bg-gradient-to-r from-emerald-100 to-teal-100">
                            <td colSpan={6} className="py-3 px-3 text-xs font-bold text-gray-900 text-right">Toplam Aylık Ciro:</td>
                            <td className="py-3 px-3 text-center text-xs font-bold text-emerald-700">
                              {[
                                { ciro: 1350000 },
                                { ciro: 750000 },
                                { ciro: 300000 },
                                { ciro: 30000 },
                                { ciro: 150000 },
                                { ciro: 150000 },
                                { ciro: 400000 },
                              ].reduce((sum, item) => sum + item.ciro, 0).toLocaleString('tr-TR')} TL
                            </td>
                          </tr>
                          <tr className="bg-gradient-to-r from-emerald-100 to-teal-100">
                            <td colSpan={6} className="py-2 px-3 text-xs font-bold text-gray-900 text-right">Toplam Platform Fee:</td>
                            <td className="py-2 px-3 text-center text-xs font-bold text-emerald-700">
                              {[
                                { fee: 135000 },
                                { fee: 75000 },
                                { fee: 30000 },
                                { fee: 3000 },
                                { fee: 15000 },
                                { fee: 15000 },
                                { fee: 40000 },
                              ].reduce((sum, item) => sum + item.fee, 0).toLocaleString('tr-TR')} TL
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                      <p className="text-xs text-gray-700 mb-2">
                        <strong className="text-gray-900">*Hesaplama:</strong> L1 seviyesinde %12 pay alıyorsunuz (Base %10 + Rank Bonusu %2.0).
                      </p>
                      <p className="text-xs text-gray-700 mb-2">
                        <strong className="text-gray-900">📊 Detay:</strong>
                      </p>
                      <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside ml-2">
                        <li>10 Restoran × 300 sipariş × 450 TL = 1.350.000 TL ciro → 16.200 TL kazanç (Fee: 135.000 × %12)</li>
                        <li>5 Market × 300 sipariş × 500 TL = 750.000 TL ciro → 9.000 TL kazanç (Fee: 75.000 × %12)</li>
                        <li>5 Kafe × 150 sipariş × 400 TL = 300.000 TL ciro → 3.600 TL kazanç (Fee: 30.000 × %12)</li>
                        <li>2 Terzi × 30 sipariş × 500 TL = 30.000 TL ciro → 360 TL kazanç (Fee: 3.000 × %12)</li>
                        <li>3 Berber × 100 sipariş × 500 TL = 150.000 TL ciro → 1.800 TL kazanç (Fee: 15.000 × %12)</li>
                        <li>3 Temizlik × 50 sipariş × 1.000 TL = 150.000 TL ciro → 1.800 TL kazanç (Fee: 15.000 × %12)</li>
                        <li>200 Aktif Kullanıcı × 2.000 TL = 400.000 TL ciro → 4.800 TL kazanç (Fee: 40.000 × %12)</li>
                      </ul>
                      <div className="mt-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-xs text-primary font-semibold mb-2">
                          🎯 1 Yıllık Emek Sonucu:
                        </p>
                        <p className="text-xs text-gray-700">
                          Bu rakamlara ulaşmak için 1 yıl boyunca aktif olarak çalışmanız yeterli. 
                          Toplam <strong className="text-primary">37.560 TL/ay</strong> kazanç, yıllık <strong className="text-primary">~450.720 TL/yıl</strong> demektir. 
                          L2, L3 network'ünüzü büyüterek veya daha fazla esnaf/kullanıcı ekleyerek bu rakamı katlayabilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rank Atlama Hesaplaması */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Rank Atlama ve Bonus Artışı Hesaplaması</h4>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 space-y-4">
                  <div className="text-sm space-y-3">
                    <p>
                      <strong>Örnek:</strong> Network GMV'niz 950.000 TL. Rank 0'dasınız (bonus %0). 
                      L1 seviyesinde 100 TL fee'den kazanıyorsunuz.
                    </p>
                    <div className="bg-white rounded-lg p-4 space-y-2 text-xs">
                      <div className="grid grid-cols-4 gap-2 font-mono border-b pb-2">
                        <div className="font-semibold">Durum</div>
                        <div className="font-semibold">GMV</div>
                        <div className="font-semibold">L1 Payı</div>
                        <div className="font-semibold">Fark</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 font-mono">
                        <div>Rank 0</div>
                        <div>950.000 TL</div>
                        <div>100 × 10% = 10 TL</div>
                        <div>-</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 font-mono text-primary">
                        <div>Rank 1 (1M+)</div>
                        <div>1.000.000 TL</div>
                        <div>100 × 10.5% = 10.5 TL</div>
                        <div className="text-green-600">+0.5 TL (+5%)</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 font-mono text-primary">
                        <div>Rank 2 (10M+)</div>
                        <div>10.000.000 TL</div>
                        <div>100 × 11% = 11 TL</div>
                        <div className="text-green-600">+1 TL (+10%)</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 font-mono text-primary">
                        <div>Rank 3 (100M+)</div>
                        <div>100.000.000 TL</div>
                        <div>100 × 11.5% = 11.5 TL</div>
                        <div className="text-green-600">+1.5 TL (+15%)</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 font-mono text-yellow-600 font-bold">
                        <div>Rank 4 (500M+)</div>
                        <div>500.000.000 TL</div>
                        <div>100 × 12% = 12 TL</div>
                        <div className="text-green-600">+2 TL (+20%)</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground pt-2">
                      <strong>Sonuç:</strong> Rank 0'dan Rank 4'e çıktığınızda, aynı fee'den %20 daha fazla kazanırsınız. 
                      Bu, aylık 1.000 TL kazanıyorsanız, rank atladığınızda 1.200 TL kazanacağınız anlamına gelir.
                    </p>
                  </div>
                </div>
              </div>

              {/* Maksimum Kazanç Senaryosu */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Teorik Maksimum Kazanç Senaryosu</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-5 space-y-4">
                  <div className="text-sm">
                    <p className="font-semibold mb-2">En İyi Durum Senaryosu (Rank Ciro Bazlı):</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-xs">
                      <li>Sen: Rank 4 (Ülke Yöneticisi - 500M+ GMV) + Ülke Yöneticisi ataması</li>
                      <li>L1: Rank 4 (500M+ GMV) → Bonus %2.0</li>
                      <li>L2: Rank 3 (100M+ GMV) → Bonus %1.5</li>
                      <li>L3: Rank 2 (10M+ GMV) → Bonus %1.0</li>
                      <li>L4: Rank 1 (1M+ GMV) → Bonus %0.5</li>
                      <li>L5: Rank 0 (&lt; 1M GMV) → Bonus %0</li>
                      <li>Mahalle, İlçe, İl, Ülke yöneticisi olarak atanmışsın</li>
                      <li>Tek bir sipariş: 100.000 TL (Platform fee: 10.000 TL)</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-3 text-xs">
                    <div>
                      <div className="font-semibold mb-2 text-gray-900">REFERRAL KAZANÇLARI (Rank Bazlı Bonuslu):</div>
                      <div className="space-y-1 font-mono pl-4 text-gray-700">
                        <div>L1 (Rank 4 - 500M+ GMV): 10.000 × (10% + 2.0%) = 10.000 × 12% = <strong className="text-primary">1.200 TL</strong></div>
                        <div>L2 (Rank 3 - 100M+ GMV): 10.000 × (6% + 1.5%) = 10.000 × 7.5% = <strong className="text-primary">750 TL</strong></div>
                        <div>L3 (Rank 2 - 10M+ GMV): 10.000 × (5% + 1.0%) = 10.000 × 6% = <strong className="text-primary">600 TL</strong></div>
                        <div>L4 (Rank 1 - 1M+ GMV): 10.000 × (3% + 0.5%) = 10.000 × 3.5% = <strong className="text-primary">350 TL</strong></div>
                        <div>L5 (Rank 0 - &lt; 1M GMV): 10.000 × (1% + 0%) = 10.000 × 1% = <strong className="text-primary">100 TL</strong></div>
                        <div className="pt-2 border-t font-semibold text-gray-900">Toplam Referral: <span className="text-primary">3.000 TL</span></div>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="font-semibold mb-2 text-gray-900">BÖLGE YÖNETİCİLİĞİ KAZANÇLARI:</div>
                      <div className="space-y-1 font-mono pl-4 text-gray-700">
                        <div>Mahalle: 10.000 × 3% = <strong className="text-primary">300 TL</strong></div>
                        <div>İlçe: 10.000 × 3% = <strong className="text-primary">300 TL</strong></div>
                        <div>İl: 10.000 × 2% = <strong className="text-primary">200 TL</strong></div>
                        <div>Ülke: 10.000 × 2% = <strong className="text-primary">200 TL</strong></div>
                        <div className="pt-2 border-t font-semibold text-gray-900">Toplam Bölge: <span className="text-primary">1.000 TL</span></div>
                      </div>
                    </div>
                    <div className="pt-3 border-t-2">
                      <div className="grid grid-cols-2 gap-2 font-bold text-sm">
                        <div className="text-gray-900">TEK SİPARİŞTEN TOPLAM KAZANÇ</div>
                        <div className="text-right text-primary text-lg">4.000 TL</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-gray-600">
                        <div>Platform'a Kalan</div>
                        <div className="text-right font-semibold text-green-600">6.000 TL (%60)</div>
                      </div>
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-900 mb-2 font-semibold">📊 Rank Ciro Gereksinimleri:</p>
                        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                          <li>L1 Rank 4 için: Network GMV ≥ 500.000.000 TL</li>
                          <li>L2 Rank 3 için: Network GMV ≥ 100.000.000 TL</li>
                          <li>L3 Rank 2 için: Network GMV ≥ 10.000.000 TL</li>
                          <li>L4 Rank 1 için: Network GMV ≥ 1.000.000 TL</li>
                          <li>L5 Rank 0 için: Network GMV &lt; 1.000.000 TL</li>
                        </ul>
                      </div>
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <strong className="text-yellow-900">⚠️ Gerçekçi Not:</strong> Bu senaryo teorik maksimumdur. 
                        Pratikte her seviyenin farklı rank'larda olması ve 4 farklı bölge yöneticiliğine sahip olmak çok nadirdir. 
                        Ancak sistemin potansiyelini ve rank sisteminin önemini gösterir. Rank atladıkça kazanç artar.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Büyüme Örneği */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Network Büyüme ve Bileşik Kazanç Örneği</h4>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-5 space-y-4">
                  <div className="text-sm">
                    <p className="font-semibold mb-3">6 Aylık Network Büyüme Senaryosu (Aktif Büyüme):</p>
                    <div className="mb-3 p-3 bg-white rounded-lg text-xs">
                      <p className="font-semibold mb-1">Varsayımlar:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Sen: Rank 2 (İlçe Yöneticisi) - L1'de %11, L2'de %7 kazanç</li>
                        <li>L1'deki her kişi ayda ortalama 10.000 TL harcama yapıyor</li>
                        <li>L2'deki kişiler ayda ortalama 7.500 TL harcama yapıyor</li>
                        <li>Platform fee: %10</li>
                        <li>Network hızla büyüyor, her ay yeni kişiler ekleniyor</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-6 gap-2 font-mono border-b pb-2 text-[10px]">
                        <div className="font-semibold">Ay</div>
                        <div className="font-semibold">L1 Kişi</div>
                        <div className="font-semibold">Aylık Fee</div>
                        <div className="font-semibold">L1 Kazanç</div>
                        <div className="font-semibold">L2 Kazanç</div>
                        <div className="font-semibold">Toplam</div>
                      </div>
                      {[
                        { month: 1, l1: 25, fee: 50000, l1Earnings: 5500, l2Earnings: 0 },
                        { month: 2, l1: 50, fee: 100000, l1Earnings: 11000, l2Earnings: 2100 },
                        { month: 3, l1: 100, fee: 200000, l1Earnings: 22000, l2Earnings: 5250 },
                        { month: 4, l1: 200, fee: 400000, l1Earnings: 44000, l2Earnings: 14000 },
                        { month: 5, l1: 350, fee: 700000, l1Earnings: 77000, l2Earnings: 31500 },
                        { month: 6, l1: 500, fee: 1000000, l1Earnings: 110000, l2Earnings: 52500 },
                      ].map((item, idx) => {
                        const cumulativeData = [
                          { l1Earnings: 5500, l2Earnings: 0 },
                          { l1Earnings: 11000, l2Earnings: 2100 },
                          { l1Earnings: 22000, l2Earnings: 5250 },
                          { l1Earnings: 44000, l2Earnings: 14000 },
                          { l1Earnings: 77000, l2Earnings: 31500 },
                          { l1Earnings: 110000, l2Earnings: 52500 },
                        ]
                        const cumulativeTotal = cumulativeData.slice(0, idx + 1).reduce((sum, data) => sum + data.l1Earnings + data.l2Earnings, 0)
                        return (
                          <div key={item.month} className="grid grid-cols-6 gap-2 font-mono text-[10px]">
                            <div className="font-semibold">{item.month}. Ay</div>
                            <div>{item.l1} kişi</div>
                            <div>{item.fee.toLocaleString('tr-TR')} TL</div>
                            <div className="text-primary">{item.l1Earnings.toLocaleString('tr-TR')} TL</div>
                            <div className="text-blue-600">{item.l2Earnings > 0 ? `${item.l2Earnings.toLocaleString('tr-TR')} TL` : '-'}</div>
                            <div className="text-green-600 font-semibold">{cumulativeTotal.toLocaleString('tr-TR')} TL</div>
                          </div>
                        )
                      })}
                      <div className="pt-3 border-t-2 mt-3">
                        <div className="grid grid-cols-2 gap-2 text-sm font-bold">
                          <div>6 Aylık Toplam Kazanç</div>
                          <div className="text-right text-primary text-lg">362.350 TL</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="text-muted-foreground">Ortalama aylık kazanç</div>
                          <div className="text-right font-semibold">60.392 TL/ay</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="text-muted-foreground">6. ayda aylık kazanç</div>
                          <div className="text-right font-semibold text-primary">162.500 TL/ay</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="text-muted-foreground">Yıllık tahmini kazanç (6. ay bazlı)</div>
                          <div className="text-right font-semibold text-green-600">~1.950.000 TL/yıl</div>
                        </div>
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg">
                          <div className="text-xs space-y-2">
                            <div className="font-bold text-green-900 mb-2">📈 Büyüme Analizi:</div>
                            <ul className="space-y-1 text-green-800">
                              <li>• 1. aydan 6. aya kadar <strong>29.5 kat</strong> büyüme (5.500 TL → 162.500 TL)</li>
                              <li>• 6. ayda aylık fee toplamı <strong>1.000.000 TL</strong> seviyesine ulaştı</li>
                              <li>• L2 network'ü büyüdükçe kazanç exponansiyel olarak artıyor</li>
                              <li>• L3, L4, L5 ve bölge yöneticiliği eklenirse bu rakamlar <strong>2-3 katına</strong> çıkabilir</li>
                              <li>• Rank atladıkça (Rank 3, Rank 4) bonuslar ile kazanç daha da artar</li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                          <strong className="text-yellow-900">💡 Not:</strong> Bu senaryo aktif network büyümesi varsayımına dayanır. 
                          Gerçek kazançlar, network büyüme hızınıza, davet ettiğiniz kişilerin aktivite seviyesine ve rank seviyenize bağlıdır.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ömür Boyu Kazanç */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Ömür Boyu Kazanç Garantisi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Lifetime Earnings:</strong> Davet ettiğiniz kullanıcılar 
                ve onların davet ettikleri kişiler, ağınızdan çıkmadığı sürece <strong>ömür boyu</strong> size 
                kazanç sağlar.
              </p>
              <p>
                Her yeni sipariş, her yeni işlem - ağınızdaki herkesin yaptığı her işlemden otomatik olarak 
                payınızı alırsınız. Sistem 7/24 çalışır, siz uyurken bile kazanç devam eder.
              </p>
              <div className="bg-primary/5 rounded-lg p-4 mt-4">
                <p className="font-semibold text-foreground mb-2">Kazanç Özellikleri:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Otomatik cüzdana yansıma (her sipariş tamamlandığında)</li>
                  <li>5 seviyeye kadar kazanç (L1-L5)</li>
                  <li>Rank bonusları ile artan kazanç</li>
                  <li>Bölge yöneticiliği ile ekstra gelir</li>
                  <li>Şeffaf ve takip edilebilir tüm işlemler</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* İpucu: Restoran/Market Kayıt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                💡 Maksimum Kazanç İpucu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white rounded-lg p-5 border border-yellow-200">
                <p className="text-base font-semibold text-foreground mb-3">
                  Aktif bir restoran veya market kayıt ettirirseniz, her komisyondan ödeme alacağınız için 
                  <strong className="text-primary"> 1 referanstan maksimum gelire daha kolay ulaşabilirsiniz.</strong>
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Sürekli Sipariş Akışı</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Restoran ve marketler günlük onlarca sipariş alır. Her siparişten komisyon kazanırsınız.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Yüksek İşlem Hacmi</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Bir restoran ayda binlerce sipariş alabilir. Bu, sürekli ve yüksek kazanç demektir.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Pasif Gelir Kaynağı</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Restoran çalıştığı sürece, siz de otomatik olarak kazanmaya devam edersiniz.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-2">Örnek Senaryo:</p>
                  <div className="text-xs space-y-1 font-mono text-muted-foreground">
                    <div>• Bir restoran kayıt ettirdiniz (L1 seviyesinde)</div>
                    <div>• Restoran ayda 500 sipariş alıyor, ortalama 200 TL/sipariş</div>
                    <div>• Aylık ciro: 500 × 200 = 100.000 TL</div>
                    <div>• Platform fee: 100.000 × 10% = 10.000 TL</div>
                    <div>• Senin payın (L1, Rank 2): 10.000 × 11% = <strong className="text-primary text-sm">1.100 TL/ay</strong></div>
                    <div className="pt-2 border-t mt-2">
                      <div className="text-foreground font-semibold">
                        Yıllık kazanç: <span className="text-primary">~13.200 TL/yıl</span> (sadece 1 restorandan!)
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <p>
                    <strong className="text-foreground">Strateji:</strong> Birkaç aktif restoran/market kayıt ettirerek 
                    aylık kazancınızı binlerce TL'ye çıkarabilirsiniz. Bu, normal kullanıcı kayıt etmekten çok daha verimlidir.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Liderlik ve Kariyer Basamakları */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Liderlik Seviyeleri ve Bölge Ortaklığı
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Sistemde sadece davet sayınızla değil, <strong className="text-foreground">ürettiğiniz gerçek iş hacmiyle</strong> yükselirsiniz. 
                Network GMV (toplam ciro) büyüdükçe rank atlarsınız ve bonus kazanırsınız.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Mahalle Lideri (1M+ GMV)
                  </h5>
                  <p className="text-xs">
                    Ağınızın toplam cirosu 1 milyon TL'yi geçtiğinde +0.5% bonus kazanırsınız.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    İlçe Yöneticisi (10M+ GMV)
                  </h5>
                  <p className="text-xs">
                    10 milyon TL'yi geçtiğinizde +1.0% bonus ve ilçe yöneticiliği adaylığı.
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    İl Yöneticisi (100M+ GMV)
                  </h5>
                  <p className="text-xs">
                    100 milyon TL'yi geçtiğinizde +1.5% bonus ve il yöneticiliği adaylığı.
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Ülke Yöneticisi (500M+ GMV)
                  </h5>
                  <p className="text-xs">
                    500 milyon TL'yi geçtiğinizde +2.0% bonus ve ülke yöneticiliği adaylığı.
                  </p>
                </div>
              </div>
              <p className="pt-2">
                <strong className="text-foreground">Önemli:</strong> Hiç kimse ilk gün girip ülke lideri olamaz; 
                tüm rütbeler belirlenmiş ciro barajı, ağ büyüklüğü ve kalite puanı kriterleriyle hak edilerek alınır.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Medya Kuruluşları Notu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-900 leading-relaxed">
                    Medya kuruluşlarına vereceğimiz payı, <span className="text-indigo-600 font-bold">sizler için ayırdık.</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    Reklam bütçelerini referral sistemine aktararak, gerçek kullanıcılarımıza daha fazla değer sağlıyoruz.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Güven & Şeffaflık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Güven & Şeffaflık
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Sisteme giriş ücreti yoktur</p>
                  <p className="text-muted-foreground text-xs mt-1">Tamamen ücretsiz başlayın</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Zorunlu paket, ürün veya üyelik satışı yoktur</p>
                  <p className="text-muted-foreground text-xs mt-1">Sadece gerçek işlemlerden kazanç</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Tüm kazançlar gerçek hizmet siparişlerinden doğar</p>
                  <p className="text-muted-foreground text-xs mt-1">Platform fee'sinden pay alırsınız</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Şeffaf oranlar ve barajlar</p>
                  <p className="text-muted-foreground text-xs mt-1">Tüm detaylar hesabınızda görüntülenebilir</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Otomatik ödeme sistemi</p>
                  <p className="text-muted-foreground text-xs mt-1">Her sipariş tamamlandığında cüzdanınıza otomatik yansır</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Serbest Tanıtım ve Kalite Kuralları */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Serbest Tanıtım Hakkı, Kalite Sorumluluğu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Referans kodunuzu ve linkinizi; sosyal medya hesaplarınızda, web sitenizde, WhatsApp 
                gruplarında, kartvizit ve afişlerde dilediğiniz gibi paylaşabilirsiniz.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-900 mb-2">Yasak Olanlar:</p>
                <ul className="space-y-1 list-disc list-inside text-red-800 text-xs">
                  <li>Yalan veya abartılı kazanç vaadi</li>
                  <li>Scam/dolandırıcılık izlenimi veren içerik</li>
                  <li>Spam niteliğinde toplu çağrımlar</li>
                  <li>Platform itibarına zarar veren paylaşımlar</li>
                </ul>
              </div>
              <p className="font-medium text-foreground pt-2">
                Bu sistemde sadece çok kazanan değil, <strong>temiz ve güvenilir büyüyen kullanıcılar lider olabilir.</strong>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-4 pt-4"
        >
          <Button
            onClick={handleGoToReferral}
            className="w-full"
            size="lg"
            variant="default"
          >
            <Gift className="w-5 h-5 mr-2" />
            Referans Sistemime Git
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => router.push('/business/register')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Esnaf Kaydı Yap
            </Button>
            <Button
              onClick={handleGoToPanel}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Esnaf Paneline Git
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
