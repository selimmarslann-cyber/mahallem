'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export default function AppFooter() {
  const footerLinks = {
    legal: [
      { label: 'Kullanıcı Sözleşmesi', href: '/legal/terms' },
      { label: 'Gizlilik Politikası', href: '/legal/privacy' },
      { label: 'KVKK', href: '/legal/kvkk' },
    ],
    support: [
      { label: 'SSS', href: '/support/faq' },
      { label: 'İletişim', href: '/support/contact' },
      { label: 'Yardım Merkezi', href: '/support/help' },
    ],
    company: [
      { label: 'Hakkımızda', href: '/about' },
      { label: 'Basın Kiti', href: '/press' },
      { label: 'Kariyer', href: '/careers' },
    ],
  }

  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-black font-bold text-lg mb-4">Hizmetgo</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Mahallendeki esnaflarla buluş, hizmet al, kazan.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-black font-semibold text-sm mb-4">Yasal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#FF6000] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin/login"
                  className="text-sm text-gray-600 hover:text-[#FF6000] transition-colors"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-black font-semibold text-sm mb-4">Destek</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#FF6000] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-black font-semibold text-sm mb-4">Şirket</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#FF6000] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Hizmetgo. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
