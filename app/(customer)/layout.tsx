'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'
import BottomTabBar from '@/components/layout/BottomTabBar'
import PromotionalBanner from '@/components/layout/PromotionalBanner'
import CategoryBar from '@/components/layout/CategoryBar'
import PartnerIntroDialog from '@/components/partner/PartnerIntroDialog'
import { Home, Map, Briefcase, Wallet, User } from 'lucide-react'

const mobileTabs = [
  {
    key: 'home',
    label: 'Ana',
    icon: <Home className="w-5 h-5" />,
    href: '/',
  },
  {
    key: 'map',
    label: 'Harita',
    icon: <Map className="w-5 h-5" />,
    href: '/map',
  },
  {
    key: 'jobs',
    label: 'İşlerim',
    icon: <Briefcase className="w-5 h-5" />,
    href: '/jobs',
  },
  {
    key: 'wallet',
    label: 'Kazancım',
    icon: <Wallet className="w-5 h-5" />,
    href: '/account/wallet',
  },
  {
    key: 'profile',
    label: 'Profil',
    icon: <User className="w-5 h-5" />,
    href: '/account/profile',
  },
]

export default function CustomerLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  
  // Public sayfalarda bottom nav gösterme
  const showBottomNav = !pathname.startsWith('/auth') && 
                        !pathname.startsWith('/business/register') &&
                        !pathname.startsWith('/partner')

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PartnerIntroDialog />
      <PromotionalBanner />
      <AppHeader isPublic={true} />
      <CategoryBar />
      <main className="flex-1 pb-20 md:pb-0 pt-[170px]">
        {children}
      </main>
      <AppFooter />
      {showBottomNav && (
        <BottomTabBar items={mobileTabs} />
      )}
    </div>
  )
}

