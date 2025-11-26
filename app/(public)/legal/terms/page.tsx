import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Kullanıcı Sözleşmesi</CardTitle>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Genel Hükümler</h2>
                <p className="text-sm leading-relaxed">
                  Bu Kullanıcı Sözleşmesi ("Sözleşme"), Hizmetgo platformunu ("Platform") kullanarak 
                  hizmet alan veya veren tüm kullanıcılar için geçerlidir. Platform'u kullanarak, 
                  bu Sözleşme'nin tüm hükümlerini kabul etmiş sayılırsınız.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Hizmet Tanımı</h2>
                <p className="text-sm leading-relaxed">
                  Hizmetgo, mahalle esnafı ve hizmet sağlayıcıları ile müşterileri buluşturan bir 
                  dijital platformdur. Platform, kullanıcıların hizmet talep etmesine, esnafların 
                  hizmet sunmasına ve bu süreçlerin yönetilmesine olanak sağlar.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Kullanıcı Yükümlülükleri</h2>
                <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                  <li>Doğru ve güncel bilgiler sağlamak</li>
                  <li>Platform'u yasalara uygun şekilde kullanmak</li>
                  <li>Diğer kullanıcılara saygılı davranmak</li>
                  <li>Hizmet kalitesini etkileyecek yanlış bilgi vermemek</li>
                  <li>Platform'un güvenliğini tehlikeye atacak eylemlerde bulunmamak</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Ödeme ve Komisyon</h2>
                <p className="text-sm leading-relaxed">
                  Platform üzerinden gerçekleştirilen işlemlerde, belirlenen komisyon oranları 
                  geçerlidir. Ödeme işlemleri güvenli ödeme sistemleri üzerinden gerçekleştirilir. 
                  Komisyon oranları ve ödeme koşulları hakkında detaylı bilgi için lütfen 
                  ilgili sayfaları inceleyiniz.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Sorumluluk Sınırlaması</h2>
                <p className="text-sm leading-relaxed">
                  Hizmetgo, platform üzerinden sunulan hizmetlerin kalitesi veya sonuçlarından 
                  sorumlu değildir. Hizmet sağlayıcıları ile müşteriler arasındaki ilişkilerden 
                  doğan sorumluluklar ilgili taraflara aittir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Fikri Mülkiyet</h2>
                <p className="text-sm leading-relaxed">
                  Platform'un tüm içeriği, tasarımı ve yazılımı Hizmetgo'e aittir ve telif hakları 
                  ile korunmaktadır. İzinsiz kullanım, kopyalama veya dağıtım yasaktır.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Değişiklikler</h2>
                <p className="text-sm leading-relaxed">
                  Hizmetgo, bu Sözleşme'yi herhangi bir zamanda değiştirme hakkını saklı tutar. 
                  Değişiklikler platform üzerinden duyurulur ve yürürlüğe girdiği tarihten itibaren 
                  geçerlidir.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">8. İletişim</h2>
                <p className="text-sm leading-relaxed">
                  Bu Sözleşme ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:
                  <br />
                  E-posta: destek@hizmetgo.app
                  <br />
                  Telefon: +90 (555) 123 45 67
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

