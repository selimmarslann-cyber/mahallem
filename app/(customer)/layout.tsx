import { ReactNode } from 'react'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'
import PartnerIntroDialog from '@/components/partner/PartnerIntroDialog'

export default function CustomerLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PartnerIntroDialog />
      <AppHeader isPublic={true} />
      <main className="flex-1">
        {children}
      </main>
      <AppFooter />
    </div>
  )
}

