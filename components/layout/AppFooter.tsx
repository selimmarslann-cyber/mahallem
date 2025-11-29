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
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          {/* Brand - Thumbtack Style */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-slate-900 font-bold text-xl mb-4" style={{ letterSpacing: '-0.01em' }}>Hizmetgo</h3>
            <p className="text-base text-slate-600 font-normal leading-relaxed max-w-xs">
              Mahallendeki esnaflarla buluş, hizmet al, kazan.
            </p>
          </div>

          {/* Legal - Thumbtack Style */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-6 uppercase tracking-wide">Yasal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-brand-500 transition-colors font-normal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin/login"
                  className="text-sm text-slate-600 hover:text-brand-500 transition-colors font-normal"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Support - Thumbtack Style */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-6 uppercase tracking-wide">Destek</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-brand-500 transition-colors font-normal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - Thumbtack Style */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-6 uppercase tracking-wide">Şirket</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-brand-500 transition-colors font-normal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright - Thumbtack Style */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500 font-normal">
            © {new Date().getFullYear()} Hizmetgo. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
