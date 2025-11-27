import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">KVKK Aydınlatma Metni</CardTitle>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Veri Sorumlusu</h2>
                <p className="text-sm leading-relaxed">
                  6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz 
                  Hizmetgo ("Platform") tarafından veri sorumlusu sıfatıyla işlenmektedir.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  <strong>Veri Sorumlusu:</strong> Hizmetgo<br />
                  <strong>Adres:</strong> Türkiye<br />
                  <strong>E-posta:</strong> kvkk@hizmetgo.app
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">2. İşlenen Kişisel Veriler</h2>
                <p className="text-sm leading-relaxed mb-2">
                  Platform'u kullanırken aşağıdaki kişisel verileriniz işlenmektedir:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, doğum tarihi</li>
                  <li><strong>İletişim Bilgileri:</strong> E-posta, telefon numarası, adres</li>
                  <li><strong>Kullanıcı Hesap Bilgileri:</strong> Kullanıcı adı, şifre, profil fotoğrafı</li>
                  <li><strong>Finansal Bilgiler:</strong> IBAN, cüzdan bilgileri, işlem geçmişi</li>
                  <li><strong>Konum Bilgileri:</strong> İl, ilçe, mahalle, GPS koordinatları</li>
                  <li><strong>İşlem Bilgileri:</strong> Sipariş geçmişi, ödeme bilgileri, değerlendirmeler</li>
                  <li><strong>Teknik Bilgiler:</strong> IP adresi, cihaz bilgileri, tarayıcı bilgileri</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Kişisel Verilerin İşlenme Amaçları</h2>
                <p className="text-sm leading-relaxed mb-2">
                  Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Platform hizmetlerinin sunulması ve geliştirilmesi</li>
                  <li>Kullanıcı hesabının yönetimi ve kimlik doğrulama</li>
                  <li>Sipariş ve ödeme işlemlerinin gerçekleştirilmesi</li>
                  <li>Müşteri hizmetleri ve destek faaliyetlerinin yürütülmesi</li>
                  <li>Hukuki yükümlülüklerin yerine getirilmesi</li>
                  <li>Platform güvenliğinin sağlanması</li>
                  <li>Pazarlama ve iletişim faaliyetlerinin yürütülmesi (izin verilmesi halinde)</li>
                  <li>İstatistiksel analiz ve raporlama</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Kişisel Verilerin İşlenme Hukuki Sebepleri</h2>
                <p className="text-sm leading-relaxed">
                  Kişisel verileriniz KVKK'nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayanarak işlenmektedir:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Açık rızanızın bulunması</li>
                  <li>Sözleşmenin kurulması veya ifası ile doğrudan doğruya ilgili olması</li>
                  <li>Hukuki yükümlülüğün yerine getirilmesi</li>
                  <li>Kişisel verilerin kamuya açık hale getirilmesi</li>
                  <li>Hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması</li>
                  <li>Meşru menfaatlerimiz için veri işlenmesinin zorunlu olması</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Kişisel Verilerin Aktarılması</h2>
                <p className="text-sm leading-relaxed">
                  Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi için gerekli olduğu ölçüde, 
                  yurt içinde ve yurt dışında aşağıdaki kişi ve kuruluşlarla paylaşılabilir:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Ödeme hizmet sağlayıcıları</li>
                  <li>Kargo ve teslimat şirketleri</li>
                  <li>Hukuki danışmanlar ve muhasebe hizmet sağlayıcıları</li>
                  <li>Teknik hizmet sağlayıcılar (hosting, bulut servisleri)</li>
                  <li>Yasal yükümlülükler kapsamında kamu kurum ve kuruluşları</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">6. KVKK Kapsamındaki Haklarınız</h2>
                <p className="text-sm leading-relaxed mb-2">
                  KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                  <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                  <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
                  <li>Kişisel verilerin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
                  <li>KVKK'da öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</li>
                  <li>Düzeltme, silme ve yok etme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                  <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                  <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Başvuru Yöntemi</h2>
                <p className="text-sm leading-relaxed">
                  KVKK kapsamındaki haklarınızı kullanmak için <strong>kvkk@hizmetgo.app</strong> e-posta adresine 
                  kimliğinizi teyit edici belgelerle birlikte başvurabilirsiniz. Başvurularınız en geç 30 gün içinde 
                  ücretsiz olarak sonuçlandırılacaktır.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  Ayrıca Kişisel Verileri Koruma Kurulu'na şikayette bulunabilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Veri Güvenliği</h2>
                <p className="text-sm leading-relaxed">
                  Kişisel verilerinizin güvenliği için gerekli teknik ve idari tedbirler alınmaktadır. 
                  Verileriniz SSL şifreleme, güvenli sunucular ve erişim kontrolleri ile korunmaktadır.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Çerez Politikası</h2>
                <p className="text-sm leading-relaxed">
                  Platform, kullanıcı deneyimini iyileştirmek ve hizmetleri geliştirmek için çerezler kullanmaktadır. 
                  Detaylı bilgi için <a href="/legal/cookies" className="text-[#FF6000] hover:underline">Çerez Politikası</a> sayfasını ziyaret edebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Değişiklikler</h2>
                <p className="text-sm leading-relaxed">
                  Bu aydınlatma metni, yasal düzenlemeler ve Platform politikalarındaki değişiklikler nedeniyle güncellenebilir. 
                  Güncel versiyon her zaman bu sayfada yayınlanmaktadır.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

