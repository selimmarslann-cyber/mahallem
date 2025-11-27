'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Book, Video, FileText, MessageSquare, Search, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default function HelpCenterPage() {
  const helpTopics = [
    {
      icon: Book,
      title: 'Başlangıç Kılavuzu',
      description: 'Hizmetgo\'ya yeni başladıysanız buradan başlayın',
      links: [
        { label: 'Nasıl kayıt olunur?', href: '/support/faq' },
        { label: 'İlk siparişimi nasıl veririm?', href: '/support/faq' },
        { label: 'Profilimi nasıl düzenlerim?', href: '/support/faq' },
      ]
    },
    {
      icon: FileText,
      title: 'Sipariş ve Ödeme',
      description: 'Sipariş verme, ödeme ve iptal işlemleri',
      links: [
        { label: 'Sipariş nasıl verilir?', href: '/support/faq' },
        { label: 'Ödeme yöntemleri', href: '/support/faq' },
        { label: 'İptal ve iade işlemleri', href: '/support/faq' },
      ]
    },
    {
      icon: HelpCircle,
      title: 'Referans Programı',
      description: 'Referans programı hakkında her şey',
      links: [
        { label: 'Referans programı nedir?', href: '/support/faq' },
        { label: 'Nasıl kazanç elde ederim?', href: '/support/faq' },
        { label: 'Rank sistemi nasıl çalışır?', href: '/support/faq' },
      ]
    },
    {
      icon: Book,
      title: 'Esnaf Rehberi',
      description: 'Esnaf kaydı ve mağaza yönetimi',
      links: [
        { label: 'Esnaf nasıl kayıt olunur?', href: '/support/faq' },
        { label: 'Mağaza nasıl açılır?', href: '/support/faq' },
        { label: 'Sipariş nasıl yönetilir?', href: '/support/faq' },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Yardım Merkezi</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hizmetgo hakkında bilmeniz gereken her şey. Sorunlarınızı hızlıca çözün.
          </p>
        </div>

        {/* Destek Bot CTA */}
        <Card className="mb-8 border-2 border-[#FF6000] bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#FF6000] flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Canlı Destek Botu</h3>
                  <p className="text-sm text-gray-600">7/24 otomatik destek. Sorunlarınızı anında çözelim.</p>
                </div>
              </div>
              <Link href="/support/chat">
                <Button size="lg" className="bg-[#FF6000] hover:bg-[#FF7000]">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Destek Botu ile Konuş
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Hızlı Erişim */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/support/faq">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <HelpCircle className="w-8 h-8 text-[#FF6000] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">SSS</h3>
                <p className="text-sm text-gray-600">Sık sorulan sorular</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/support/contact">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-[#FF6000] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">İletişim</h3>
                <p className="text-sm text-gray-600">Bizimle iletişime geçin</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/support/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-2 border-[#FF6000]">
              <CardContent className="p-6 text-center">
                <Search className="w-8 h-8 text-[#FF6000] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Canlı Destek</h3>
                <p className="text-sm text-gray-600">Bot ile hızlı çözüm</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/legal/terms">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-[#FF6000] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Yasal Belgeler</h3>
                <p className="text-sm text-gray-600">Şartlar ve politikalar</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Konu Başlıkları */}
        <div className="grid md:grid-cols-2 gap-6">
          {helpTopics.map((topic, index) => {
            const Icon = topic.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#FF6000]" />
                    {topic.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          href={link.href}
                          className="text-sm text-[#FF6000] hover:underline flex items-center gap-2"
                        >
                          <span>•</span>
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

