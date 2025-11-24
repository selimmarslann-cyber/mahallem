'use client'

import Link from 'next/link'
import { Shield, FileText, Lock, Copyright } from 'lucide-react'

export default function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Mahallem</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Mahalle esnafı ve hizmet sağlayıcıları ile müşterileri buluşturan platform.
              Güvenilir, hızlı ve kolay hizmet alışverişi için yanınızdayız.
            </p>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal/terms"
                  className="text-xs text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Kullanıcı Sözleşmesi
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-xs text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Gizlilik ve Kişisel Verilerin Korunması Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-xs text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Çerez Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">İletişim</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <a
                  href="mailto:destek@mahallem.app"
                  className="hover:text-primary transition-colors"
                >
                  destek@mahallem.app
                </a>
              </li>
              <li>
                <a
                  href="tel:+905551234567"
                  className="hover:text-primary transition-colors"
                >
                  +90 (555) 123 45 67
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Çizgi */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Copyright className="w-3.5 h-3.5" />
              <span>
                {currentYear} Mahallem. Tüm hakları saklıdır.
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Versiyon 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

