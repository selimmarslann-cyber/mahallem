'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell, ShoppingCart, Menu, X, Home, Map, Briefcase, Wallet, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Logo from './Logo'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface AppHeaderProps {
  showNotifications?: boolean
  showCart?: boolean
  cartCount?: number
  isPublic?: boolean
}

const customerTabs = [
  {
    key: 'home',
    label: 'Ana',
    icon: Home,
    href: '/',
  },
  {
    key: 'map',
    label: 'Harita',
    icon: Map,
    href: '/map',
  },
  {
    key: 'jobs',
    label: 'İşlerim',
    icon: Briefcase,
    href: '/jobs',
  },
  {
    key: 'wallet',
    label: 'Cüzdan',
    icon: Wallet,
    href: '/wallet',
  },
  {
    key: 'profile',
    label: 'Profil',
    icon: User,
    href: '/profile',
  },
]

export default function AppHeader({
  showNotifications = false,
  showCart = false,
  cartCount = 0,
  isPublic = false,
}: AppHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#FF7A00] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <Logo className="w-9 h-9" />
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold text-white tracking-tight"
              style={{
                fontFamily: "'Inter', 'Poppins', -apple-system, sans-serif",
                letterSpacing: '-0.5px',
                fontWeight: 700,
              }}
            >
              Mahallem
            </motion.span>
          </Link>

          {/* Center Nav - Main Tabs */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {customerTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href + '/'))
              
              return (
                <Link key={tab.key} href={tab.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-white hover:text-white hover:bg-white/20 rounded-full",
                      isActive && "text-white bg-white/20"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop CTAs - All same style */}
            {isPublic && (
              <div className="hidden lg:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/20 rounded-full"
                  onClick={() => router.push('/auth/login')}
                >
                  Giriş yap
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/20 rounded-full"
                  onClick={() => router.push('/business/register')}
                >
                  Hizmet ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/20 rounded-full"
                  onClick={() => router.push('/partner')}
                >
                  Sıfır yatırımla ortak ol
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/20 rounded-full"
                  onClick={() => router.push('/auth/login?type=business')}
                >
                  Esnaf girişi
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>

            {/* Notifications & Cart */}
            {showNotifications && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20">
                  <Bell className="w-5 h-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </motion.div>
            )}

            {showCart && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 py-4 space-y-2"
          >
            {/* Main Tabs */}
            {customerTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href + '/'))
              
              return (
                <Link key={tab.key} href={tab.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-white",
                      isActive && "text-white bg-white/20"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </Button>
                </Link>
              )
            })}
            
            {/* Public CTAs */}
            {isPublic && (
              <div className="pt-4 border-t border-white/20 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:bg-white/20"
                  onClick={() => {
                    router.push('/auth/login')
                    setMobileMenuOpen(false)
                  }}
                >
                  Giriş yap
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:bg-white/20"
                  onClick={() => {
                    router.push('/business/register')
                    setMobileMenuOpen(false)
                  }}
                >
                  Hizmet ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:bg-white/20"
                  onClick={() => {
                    router.push('/partner')
                    setMobileMenuOpen(false)
                  }}
                >
                  Sıfır yatırımla ortak ol
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white hover:bg-white/20"
                  onClick={() => {
                    router.push('/auth/login?type=business')
                    setMobileMenuOpen(false)
                  }}
                >
                  Esnaf girişi
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </header>
  )
}

