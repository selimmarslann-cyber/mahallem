import { ReactNode } from 'react'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'

export default function PublicLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader isPublic={true} />
      <main className="flex-1">
        {children}
      </main>
      <AppFooter />
    </div>
  )
}

