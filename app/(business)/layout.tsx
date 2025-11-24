import { ReactNode } from 'react'
import BottomTabBar, { TabItem } from '@/components/layout/BottomTabBar'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'
import { Briefcase, Store, Activity, Wallet, User } from 'lucide-react'

const businessTabs: TabItem[] = [
  {
    key: 'jobs',
    label: 'Gelen İşler',
    icon: <Briefcase className="w-5 h-5" />,
    href: '/business/jobs',
  },
  {
    key: 'store',
    label: 'Mağazam',
    icon: <Store className="w-5 h-5" />,
    href: '/business/store',
  },
  {
    key: 'status',
    label: 'Durum',
    icon: <Activity className="w-5 h-5" />,
    href: '/business/status',
  },
  {
    key: 'wallet',
    label: 'Cüzdan',
    icon: <Wallet className="w-5 h-5" />,
    href: '/business/wallet',
  },
  {
    key: 'profile',
    label: 'Profil',
    icon: <User className="w-5 h-5" />,
    href: '/profile',
  },
]

export default function BusinessLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader showLocation={false} />
      <main className="flex-1 pb-16">
        {children}
      </main>
      <AppFooter />
      <BottomTabBar items={businessTabs} />
    </div>
  )
}

