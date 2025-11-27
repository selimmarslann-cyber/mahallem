'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'
import PromotionalBanner from '@/components/layout/PromotionalBanner'
import CategoryBar from '@/components/layout/CategoryBar'
import PartnerIntroDialog from '@/components/partner/PartnerIntroDialog'
import CustomerBottomNav from '@/components/layout/CustomerBottomNav'

export default function CustomerLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  
  // Account sayfalarında header ve category bar gösterme
  const isAccountPage = pathname.startsWith('/account')
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isAccountPage && (
        <>
          <PartnerIntroDialog />
          <PromotionalBanner />
          <AppHeader isPublic={true} />
          <CategoryBar />
        </>
      )}
      <main className={`flex-1 ${!isAccountPage ? 'pt-[170px] pb-16 md:pb-0' : ''}`}>
        {children}
      </main>
      {!isAccountPage && <AppFooter />}
      {!isAccountPage && <CustomerBottomNav />}
    </div>
  )
}

