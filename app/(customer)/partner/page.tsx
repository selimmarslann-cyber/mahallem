'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Users, Share2, TrendingUp, Award, Shield } from 'lucide-react'

export default function PartnerPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      setIsLoggedIn(res.ok)
    } catch (err) {
      setIsLoggedIn(false)
    }
  }

  const handleGoToPanel = () => {
    if (isLoggedIn) {
      router.push('/wallet')
    } else {
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Ortaklık Programı</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Başlık Bloğu */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              0 yatırımla gerçek bir ortaklık ekonomisine hoş geldiniz.
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Bu uygulamada sadece hizmet alıp vermiyorsunuz; mahallenizde dönen her işten,
                kurduğunuz ağ kadar pay alıyorsunuz.
              </p>
              <p>
                Ne şirket kurmanıza gerek var, ne sermaye bağlamanıza. Sadece referans kodunuzla
                davet edin, sipariş geldikçe sistem sizin için çalışsın.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Nasıl Çalışır? */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Nasıl Çalışır?</h3>
          <div className="space-y-4">
            {/* Adım 1 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Referans kodunuzu alın
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Profilinizden veya Cüzdan ekranından size özel referans kodunuzu ve linkinizi
                      görüntüleyin.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adım 2 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Dilediğiniz yerde paylaşın
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      WhatsApp gruplarınızda, sosyal medya hesaplarınızda, kartvizitte, dükkân
                      camında – kurallar dahilinde dilediğiniz yerde tanıtım yapabilirsiniz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adım 3 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Sipariş geldikçe pay alın
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Davet ettiğiniz kullanıcılar veya esnaflar her hizmet aldığında, uygulamanın
                      aldığı hizmet ücretinden (fee) size otomatik pay ayrılır. Onların davet ettikleri
                      kişiler sipariş verdikçe de ek pay kazanırsınız.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Kazanç Mantığı */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Gerçek işlemlerden, gerçek pay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Örneğin, sizin davet ettiğiniz bir kullanıcı üzerinden bir tesisatçı bu uygulama
              üzerinden bir iş aldı ve o işten 3.000 TL kazandı. Uygulama bu işten örnek olarak 300
              TL hizmet ücreti (fee) aldıysa, planladığımız kazanç modeline göre bu fee'nin belirli
              bir oranı size yansır.
            </p>
            <p className="text-sm text-muted-foreground">
              Getirdiğiniz kullanıcıların ve onların getirdiği kullanıcıların işlem hacmi arttıkça,
              sizin payınız da büyür.
            </p>
            <p className="text-xs text-gray-500 italic mt-2">
              Tüm oranlar ve detaylar 'Kazanç Planı' bölümünde şeffaf şekilde yayınlanacaktır.
            </p>
          </CardContent>
        </Card>

        {/* Liderlik ve Kariyer Basamakları */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5" />
              Liderlik seviyeleri ve bölge ortaklığı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Sistemde sadece davet sayınızla değil, ürettiğiniz gerçek iş hacmiyle yükselirsiniz.
              Bronz / Silver / Gold seviyelerinde kurduğunuz ağ sipariş yaptıkça ekstra seviye
              bonusları alırsınız.
            </p>
            <p>
              İlçe Lideri olduğunuzda, sadece getirdiğiniz kişilerden değil, bağlı olduğunuz{' '}
              <strong>ilçedeki tüm işlemlerden belirli bir pay</strong> alırsınız.
            </p>
            <p>
              İl Lideri ve Ülke Lideri seviyelerinde ise, uygulama içinde gerçek anlamda "bölge
              ortağı" konumuna gelirsiniz.
            </p>
            <p>
              Hiç kimse ilk gün girip ülke lideri olamaz; tüm rütbeler belirlenmiş ciro barajı, ağ
              büyüklüğü ve kalite puanı kriterleriyle hak edilerek alınır.
            </p>
          </CardContent>
        </Card>

        {/* Serbest Tanıtım ve Kalite Kuralları */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Serbest tanıtım hakkı, kalite sorumluluğu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Referans kodunuzu ve linkinizi; sosyal medya hesaplarınızda, web sitenizde, WhatsApp
              gruplarında, kartvizit ve afişlerde dilediğiniz gibi paylaşabilirsiniz.
            </p>
            <p>
              Ancak; yalan veya abartılı kazanç vaadi, scam/dolandırıcılık izlenimi veren içerik,
              spam niteliğinde toplu çağrımlar ve platform itibarına zarar veren paylaşımlar
              kesinlikle yasaktır.
            </p>
            <p>
              Bu tür paylaşımlar; hesabınıza eksi puan işlenmesine ve ilçe liderliği gibi üst seviye
              adaylık haklarınızın kısıtlanmasına neden olabilir.
            </p>
            <p className="font-medium text-foreground">
              Bu sistemde sadece çok kazanan değil, <strong>temiz ve güvenilir büyüyen kullanıcılar lider olabilir.</strong>
            </p>
          </CardContent>
        </Card>

        {/* Güven & Şeffaflık */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Güven & Şeffaflık
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>Sisteme giriş ücreti yoktur.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>Zorunlu paket, ürün veya üyelik satışı yoktur.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>
                Tüm kazançlar, uygulama üzerinden gerçekleşen gerçek hizmet siparişlerinden doğar.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>
                Oranlar, barajlar ve liderlik şartları, uygulama içindeki "Kazanç Planı" sayfasında
                şeffaf şekilde yayınlanır.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alt Butonlar */}
        <div className="space-y-3 pt-4">
          <Button onClick={handleGoToPanel} className="w-full" size="lg">
            Hemen ortaklık paneline git
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full"
            size="lg"
          >
            Sonra bakarım
          </Button>
        </div>
      </div>
    </div>
  )
}

