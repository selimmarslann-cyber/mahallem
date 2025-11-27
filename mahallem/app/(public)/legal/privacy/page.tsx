import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Gizlilik ve Kişisel Verilerin Korunması Politikası</CardTitle>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Giriş</h2>
                <p className="text-sm leading-relaxed">
                  Hizmetgo olarak, kullanıcılarımızın kişisel verilerinin korunmasına büyük önem veriyoruz. 
                  Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, 
                  kişisel verilerinizin nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklar.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Veri Sorumlusu</h2>
                <p className="text-sm leading-relaxed">
                  Kişisel verilerinizin işlenmesinden sorumlu olan veri sorumlusu Hizmetgo'dir. 
                  İletişim bilgilerimiz:
                  <br />
                  E-posta: destek@hizmetgo.app
                  <br />
                  Telefon: +90 (555) 123 45 67
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Toplanan Kişisel Veriler</h2>
                <p className="text-sm leading-relaxed mb-2">
                  Platform'u kullanırken aşağıdaki kişisel verileriniz toplanabilir:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                  <li>Kimlik bilgileri (ad, soyad, TCKN)</li>
                  <li>İletişim bilgileri (e-posta, telefon, adres)</li>
                  <li>Ödeme bilgileri (kart bilgileri şifrelenmiş olarak saklanır)</li>
                  <li>Kullanım verileri (IP adresi, cihaz bilgileri, tarayıcı bilgileri)</li>
                  <li>Konum verileri (hizmet talebi için gerekli olduğunda)</li>
                  <li>Değerlendirme ve yorumlar</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Kişisel Verilerin İşlenme Amaçları</h2>
                <p className="text-sm leading-relaxed mb-2">
                  Kişisel verileriniz aşağıdaki amaçlarla işlenir:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                  <li>Platform hizmetlerinin sunulması ve yönetilmesi</li>
                  <li>Kullanıcı hesaplarının oluşturulması ve yönetilmesi</li>
                  <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
                  <li>Hizmet kalitesinin iyileştirilmesi</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                  <li>Güvenlik ve dolandırıcılık önleme</li>
                  <li>Müşteri desteği sağlanması</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Kişisel Verilerin Paylaşılması</h2>
                <p className="text-sm leading-relaxed">
                  Kişisel verileriniz, yasal yükümlülüklerimiz ve hizmet sunumu için gerekli olduğu 
                  ölçüde, hizmet sağlayıcılarımız ve iş ortaklarımızla paylaşılabilir. Verileriniz 
                  asla üçüncü taraflara satılmaz veya pazarlama amaçlı kullanılmaz.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Veri Güvenliği</h2>
                <p className="text-sm leading-relaxed">
                  Kişisel verilerinizin güvenliği için teknik ve idari önlemler alınmaktadır. 
                  Verileriniz şifrelenmiş olarak saklanır ve yetkisiz erişime karşı korunur.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">7. KVKK Kapsamındaki Haklarınız</h2>
                <p className="text-sm leading-relaxed mb-2">
                  KVKK kapsamında aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
                  <li>Kişisel verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                  <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                  <li>Eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme</li>
                  <li>KVKK'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
                  <li>İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Çerezler</h2>
                <p className="text-sm leading-relaxed">
                  Platform'da çerezler kullanılmaktadır. Çerez kullanımı hakkında detaylı bilgi için 
                  <a href="/legal/cookies" className="text-primary hover:underline"> Çerez Politikası</a> sayfasını inceleyebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Değişiklikler</h2>
                <p className="text-sm leading-relaxed">
                  Bu politika zaman zaman güncellenebilir. Önemli değişiklikler kullanıcılara 
                  bildirilir. Güncel politika her zaman bu sayfada yayınlanır.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">10. İletişim</h2>
                <p className="text-sm leading-relaxed">
                  Kişisel verilerinizle ilgili sorularınız veya haklarınızı kullanmak istediğinizde 
                  bizimle iletişime geçebilirsiniz:
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

