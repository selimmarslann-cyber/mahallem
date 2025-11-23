import { ReactNode } from 'react'
import AppHeader from '@/components/layout/AppHeader'
import PartnerIntroDialog from '@/components/partner/PartnerIntroDialog'

export default function CustomerLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PartnerIntroDialog />
      <AppHeader isPublic={true} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

