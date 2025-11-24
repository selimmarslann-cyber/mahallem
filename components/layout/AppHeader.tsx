'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell, ShoppingCart, Menu, X, Home, Map, Briefcase, Wallet, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Logo from './Logo'
import { useState, useEffect } from 'react'
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
    href: '/account/wallet',
  },
  {
    key: 'profile',
    label: 'Profil',
    icon: User,
    href: '/account/profile',
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
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Kullanıcı bilgisini yükle
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (err) {
      setIsAuthenticated(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Logo + Brand - Premium Kurumsal Tasarım */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <Logo className="w-10 h-10" />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              {/* Premium Brand Text */}
              <div className="relative">
                <span
                  className="text-3xl font-black text-white tracking-tight relative z-10"
                  style={{
                    fontFamily: "'Poppins', 'Inter', -apple-system, sans-serif",
                    letterSpacing: '-1.2px',
                    fontWeight: 900,
                    textShadow: '2px 2px 12px rgba(0,0,0,0.4), 0 0 20px rgba(0,0,0,0.2)',
                    lineHeight: '1.1',
                  }}
                >
                  Mahallem
                </span>
                {/* Premium Underline Accent */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-white via-white/80 to-white rounded-full opacity-60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                />
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 blur-xl -z-10 opacity-50" />
              </div>
              {/* Tagline - Küçük ve Kurumsal */}
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-[9px] font-semibold text-white/80 tracking-widest uppercase mt-0.5"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '1.5px',
                  textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
                }}
              >
                Mahalle Platformu
              </motion.p>
            </motion.div>
          </Link>

          {/* Center Nav - Main Tabs - Beyaz Yazı */}
          <nav className="hidden md:flex items-center gap-2 flex-1 justify-center" aria-label="Main navigation">
            {customerTabs.map((tab) => {
              const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href + '/'))
              
              return (
                <Link key={tab.key} href={tab.href} aria-label={tab.label}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className="relative"
                  >
                    <span
                      className={cn(
                        "relative px-5 py-2.5 text-base font-semibold text-white transition-all duration-300 cursor-pointer",
                        "hover:text-white",
                        isActive && "text-white font-bold"
                      )}
                      style={{
                        fontFamily: "'Poppins', 'Inter', sans-serif",
                        letterSpacing: '-0.3px',
                        fontWeight: isActive ? 700 : 600,
                        textShadow: '1px 1px 6px rgba(0,0,0,0.4)',
                      }}
                    >
                      {tab.label}
                      {/* Hover Box Effect - Beyaz Kutu */}
                      <motion.span
                        className="absolute inset-0 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg -z-10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.span
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white to-white/80 rounded-full"
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Giriş yapmış kullanıcı için profil */}
            {isAuthenticated && user ? (
              <div className="hidden lg:flex items-center gap-3">
                <Link href="/account">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Avatar className="w-10 h-10 border-2 border-white/30">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-white/20 text-white">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden xl:block">
                      <p className="text-sm font-semibold text-white" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.4)' }}>
                        {user.name}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ) : (
              /* Desktop CTAs - Beyaz Yazı */
              isPublic && (
                <div className="hidden lg:flex items-center gap-3">
                  {[
                    { label: 'Kullanıcı Girişi', href: '/auth/login?redirect=/account' },
                    { label: 'Hizmet ver', href: '/partner' },
                    { label: 'Sıfır yatırımla ortak ol', href: '/partner' },
                    { label: 'Esnaf girişi', href: '/auth/login?type=business&redirect=/business/jobs' },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      className="relative"
                    >
                      <span
                        onClick={() => router.push(item.href)}
                        className="relative px-4 py-2 text-sm font-semibold text-white cursor-pointer transition-all duration-300 hover:text-white"
                        style={{
                          fontFamily: "'Poppins', 'Inter', sans-serif",
                          letterSpacing: '-0.2px',
                          fontWeight: 600,
                          textShadow: '1px 1px 6px rgba(0,0,0,0.4)',
                        }}
                      >
                        {item.label}
                        <motion.span
                          className="absolute inset-0 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 shadow-md -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      </span>
                    </motion.div>
                  ))}
                </div>
              )
            )}

            {/* Mobile Menu Button - Beyaz */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/20 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>

            {/* Notifications & Cart - Beyaz */}
            {showNotifications && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20 rounded-lg">
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
                  <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20 rounded-lg">
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

        {/* Mobile Menu - Beyaz Yazı */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 bg-white/10 backdrop-blur-md rounded-b-2xl shadow-xl py-4 space-y-2"
          >
            {/* Main Tabs */}
            {customerTabs.map((tab) => {
              const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href + '/'))
              
              return (
                <Link key={tab.key} href={tab.href}>
                  <span
                    className={cn(
                      "block w-full px-4 py-3 text-base font-semibold text-white rounded-lg transition-all duration-200",
                      "hover:bg-white/20 hover:text-white",
                      isActive && "text-white bg-white/20 font-bold"
                    )}
                    style={{
                      fontFamily: "'Poppins', 'Inter', sans-serif",
                      letterSpacing: '-0.3px',
                      fontWeight: isActive ? 700 : 600,
                      textShadow: '1px 1px 6px rgba(0,0,0,0.4)',
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {tab.label}
                  </span>
                </Link>
              )
            })}
            
            {/* Mobile: Giriş yapmış kullanıcı */}
            {isAuthenticated && user ? (
              <div className="pt-4 border-t border-white/20">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:bg-white/20"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="bg-white/20 text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-white/80">Hesabım</p>
                  </div>
                </Link>
              </div>
            ) : (
              /* Public CTAs */
              isPublic && (
                <div className="pt-4 border-t border-white/20 space-y-2">
                  {[
                    { label: 'Kullanıcı Girişi', href: '/auth/login?redirect=/account' },
                    { label: 'Hizmet ver', href: '/partner' },
                    { label: 'Sıfır yatırımla ortak ol', href: '/partner' },
                    { label: 'Esnaf girişi', href: '/auth/login?type=business&redirect=/business/jobs' },
                  ].map((item) => (
                    <span
                      key={item.label}
                      className="block w-full px-4 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:bg-white/20 hover:text-white cursor-pointer"
                      style={{
                        fontFamily: "'Poppins', 'Inter', sans-serif",
                        letterSpacing: '-0.2px',
                        fontWeight: 600,
                        textShadow: '1px 1px 6px rgba(0,0,0,0.4)',
                      }}
                      onClick={() => {
                        router.push(item.href)
                        setMobileMenuOpen(false)
                      }}
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              )
            )}
          </motion.div>
        )}
      </div>
    </header>
  )
}

