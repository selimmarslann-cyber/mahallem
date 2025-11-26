'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell, ShoppingCart, Menu, X, Home, Map, Briefcase, Wallet, User, Zap, Bike, Gauge, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
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
    label: 'Kazancım',
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

  const isPartnerPage = pathname === '/partner'
  
  // Beyaz arka planlı sayfalar - header turuncu olacak
  const whiteBackgroundPages = [
    '/auth',
    '/account',
    '/jobs',
    '/map',
    '/profile',
    '/wallet',
    '/business/register',
    '/cart',
  ]
  const hasWhiteBackground = whiteBackgroundPages.some(page => pathname.startsWith(page)) && pathname !== '/partner'
  
  return (
    <header className={`fixed top-[50px] left-0 right-0 z-fixed w-full transition-all ${
      isPartnerPage 
        ? 'bg-slate-400/90 backdrop-blur-md shadow-md' 
        : 'bg-[#FF6000] shadow-lg'
    }`}>
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Logo + Brand - Trendyol Tarzı: hizmetgo (hizmet siyah, go turuncu) */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div 
              className="flex items-center gap-1"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span 
                className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none text-black lowercase"
                style={{ 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
                  letterSpacing: '-0.02em',
                  fontWeight: 700,
                  fontStyle: 'normal'
                }}
                whileHover={{ opacity: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                hizmet
              </motion.span>
              <motion.span 
                className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none lowercase relative"
                style={{ 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
                  letterSpacing: '-0.02em',
                  fontWeight: 700,
                  color: '#FF6000',
                  fontStyle: 'normal',
                  WebkitTextStroke: '2px white',
                  textStroke: '2px white',
                  paintOrder: 'stroke fill'
                }}
                whileHover={{ opacity: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                go
              </motion.span>
            </motion.div>
          </Link>

          {/* Center Nav - Three Main CTAs */}
          <nav className="hidden md:flex items-center gap-3 flex-1 justify-center" aria-label="Main navigation">
            {[
              { label: 'Hizmetgo Go', href: '/map', icon: Bike, key: 'map', position: 'bottom-right' },
              { label: 'Hizmetgo Ek Gelir', href: '/jobs?tab=instant', icon: Gauge, key: 'instant', position: 'bottom-right' },
              { label: 'Hizmetgo Hizmet', href: '/request', icon: Wrench, key: 'service', position: 'bottom-right' },
            ].map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              
              return (
                <Link key={item.key} href={item.href} aria-label={item.label}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className="relative"
                  >
                    <Button
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "relative px-5 py-2.5 text-sm font-bold transition-all duration-200 bg-[#FF6000] text-black hover:bg-[#FF7000] border-0",
                        isActive && "shadow-lg"
                      )}
                    >
                      <span className="relative z-10">{item.label}</span>
                      <Icon className={cn(
                        "absolute w-5 h-5 text-black/60",
                        item.position === 'bottom-right' && "bottom-1 right-1"
                      )} />
                    </Button>
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
                    <Avatar className="w-10 h-10 border-2 border-gray-300">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-gray-200 text-black">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden xl:block">
                      <p className="text-sm font-semibold text-black">
                        {user.name}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ) : (
              /* Desktop CTAs - Beyaz Yazı */
              isPublic && (
                <div className="hidden lg:flex items-center gap-2">
                  {[
                    { label: 'Giriş Yap', href: '/auth/login?redirect=/account' },
                    { label: 'Esnaf Girişi', href: '/auth/business-login' },
                    { label: 'Kayıt Ol', href: '/auth/register' },
                    { label: 'Ortak Ol', href: '/partner', highlight: true },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      className="relative"
                    >
                      {item.highlight ? (
                        <Button
                          onClick={() => router.push(item.href)}
                          size="sm"
                          className="bg-white text-[#FF6000] hover:bg-gray-50 font-bold shadow-lg"
                        >
                          {item.label}
                        </Button>
                      ) : (
                        <span
                          onClick={() => router.push(item.href)}
                          className="relative px-4 py-2 text-sm font-bold text-black cursor-pointer transition-all duration-300 hover:text-gray-700"
                          style={{
                            fontFamily: "'Poppins', 'Inter', sans-serif",
                            letterSpacing: '-0.2px',
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )
            )}

            {/* Mobile Menu Button - Beyaz */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-black hover:bg-gray-100 rounded-lg"
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
                <Button variant="ghost" size="sm" className="relative text-black hover:bg-gray-100 rounded-lg">
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
                  <Button variant="ghost" size="sm" className="relative text-black hover:bg-gray-100 rounded-lg">
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
            className="md:hidden border-t border-white/20 bg-[#FF6000] backdrop-blur-md rounded-b-2xl shadow-xl py-4 space-y-2"
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
                    { label: 'Giriş Yap', href: '/auth/login?redirect=/account' },
                    { label: 'Esnaf Girişi', href: '/auth/business-login' },
                    { label: 'Kayıt Ol', href: '/auth/register' },
                    { label: 'Ortak Ol', href: '/partner', highlight: true },
                  ].map((item) => (
                    item.highlight ? (
                      <Button
                        key={item.label}
                        onClick={() => {
                          router.push(item.href)
                          setMobileMenuOpen(false)
                        }}
                        className="w-full bg-slate-500 text-white hover:bg-slate-600 font-semibold"
                      >
                        {item.label}
                      </Button>
                    ) : (
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
                    )
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

