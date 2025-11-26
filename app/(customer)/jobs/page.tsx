'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, MapPin, ChevronRight, Briefcase, Zap, Calendar, Filter, Send } from 'lucide-react'
import { useHizmetgoStore } from '@/lib/store/useHizmetgoStore'
import { getMatchingVendors, haversineDistanceKm } from '@/lib/utils/matching'
import type { Job } from '@/lib/types/mahallem'
import EmptyState from '@/components/ui/empty-state'
import { useToast } from '@/lib/hooks/useToast'

export default function CustomerJobsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentUser, jobs, users } = useHizmetgoStore()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('my-jobs')
  const [user, setUser] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'instant') {
      setActiveTab('nearby')
    }
    loadUser()
    getUserLocation()
  }, [searchParams])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          // Default to Istanbul if geolocation fails
          setUserLocation({ lat: 41.0082, lng: 28.9784 })
        }
      )
    } else {
      setUserLocation({ lat: 41.0082, lng: 28.9784 })
    }
  }

  const loadUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (!res.ok) {
        router.push(`/auth/required?page=İşlerim&redirect=${encodeURIComponent('/jobs')}`)
        return
      }
      const data = await res.json()
      setUser(data.user)
      
      if (!currentUser && data.user) {
        useHizmetgoStore.getState().setCurrentUser({
          id: data.user.id,
          name: data.user.name,
          phone: data.user.phone || '',
          email: data.user.email,
          city: data.user.city,
          role: data.user.role === 'vendor' ? 'vendor' : 'customer',
          skills: data.user.skills || [],
          avatarUrl: data.user.avatarUrl,
        })
      }
    } catch (err) {
      console.error('Kullanıcı verisi yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  const isVendor = currentUser?.role === 'vendor' || user?.role === 'vendor'
  const isCustomer = currentUser?.role === 'customer' || !isVendor

  // Customer jobs
  const customerJobs: (Job & { distanceKm?: number })[] = jobs.filter(j => j.customerId === (currentUser?.id || user?.id))
  
  // Nearby jobs (10 km radius with skill matching)
  const userSkills = currentUser?.skills || user?.skills || []
  const userSkillIds = userSkills.map((s: any) => s.id || s)
  
  const nearbyJobs = jobs
    .filter(job => {
      // Only open instant jobs
      if (job.status !== 'open' || job.type !== 'instant') return false
      
      // Skill matching: job keywords must match user skills
      if (userSkillIds.length > 0 && job.keywords) {
        const jobKeywordIds = job.keywords.map((k: any) => k.id || k)
        const hasSkillMatch = userSkillIds.some((skillId: string) => 
          jobKeywordIds.includes(skillId)
        )
        if (!hasSkillMatch) return false
      }
      
      // Distance filter (10 km)
      if (userLocation && job.location) {
        const distance = haversineDistanceKm(userLocation, job.location)
        if (distance > 10) return false
      }
      
      return true
    })
    .map(job => {
      // Calculate distance for display
      if (userLocation && job.location) {
        return {
          ...job,
          distanceKm: haversineDistanceKm(userLocation, job.location),
        } as Job & { distanceKm: number }
      }
      return job as Job & { distanceKm?: number }
    })
    .sort((a, b) => {
      // Sort by distance if available
      const aDist = (a as any).distanceKm
      const bDist = (b as any).distanceKm
      if (aDist && bDist) {
        return aDist - bDist
      }
      return 0
    }) as (Job & { distanceKm?: number })[]

  // Apply filters
  const getFilteredJobs = (jobList: (Job & { distanceKm?: number })[]) => {
    let filtered = [...jobList]
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(j => j.status === statusFilter)
    }
    
    if (dateFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter(j => {
        const jobDate = new Date(j.createdAt)
        if (dateFilter === 'today') {
          return jobDate.toDateString() === now.toDateString()
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return jobDate >= weekAgo
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return jobDate >= monthAgo
        }
        return true
      })
    }
    
    return filtered
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      open: { text: 'Yeni', className: 'bg-blue-100 text-blue-700' },
      assigned: { text: 'Teklif aşamasında', className: 'bg-yellow-100 text-yellow-700' },
      completed: { text: 'Tamamlandı', className: 'bg-green-100 text-green-700' },
      cancelled: { text: 'İptal', className: 'bg-red-100 text-red-700' },
    }
    return statusMap[status] || { text: status, className: 'bg-slate-100 text-slate-700' }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleApplyToJob = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      
      if (res.ok) {
        success('Başvurunuz gönderildi!')
        // Refresh jobs
        loadUser()
      } else {
        const data = await res.json()
        error(data.message || 'Başvuru gönderilemedi')
      }
    } catch (err) {
      error('Başvuru gönderilemedi')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6000]"></div>
          <p className="mt-4 text-slate-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (isVendor) {
    // Vendor view - simplified for now
    return (
      <div className="min-h-screen bg-[#F5F5F7] pt-24 pb-24 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">İşlerim</h1>
          <p className="text-slate-600">Sana uygun işleri görüntüle</p>
        </div>
      </div>
    )
  }

  const filteredMyJobs = getFilteredJobs(customerJobs)
  const filteredNearbyJobs = getFilteredJobs(nearbyJobs)

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-24 pb-24 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">İşlerim</h1>
          <p className="text-slate-600">Verdiğin işleri takip et ve yakınındaki işlere göz at</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="my-jobs" className="data-[state=active]:bg-[#FF6000] data-[state=active]:text-white font-bold">
              Verdiğim İşler
            </TabsTrigger>
            <TabsTrigger value="nearby" className="data-[state=active]:bg-[#FF6000] data-[state=active]:text-white font-bold">
              Yakınımdaki İşler
            </TabsTrigger>
          </TabsList>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Filter className="w-4 h-4" />
              Filtrele:
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="open">Yeni</SelectItem>
                <SelectItem value="assigned">Teklif Aşamasında</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="cancelled">İptal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tarih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Tarihler</SelectItem>
                <SelectItem value="today">Bugün</SelectItem>
                <SelectItem value="week">Bu Hafta</SelectItem>
                <SelectItem value="month">Bu Ay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Verdiğim İşler Tab */}
          <TabsContent value="my-jobs" className="space-y-4">
            {filteredMyJobs.length === 0 ? (
              <EmptyState
                icon={<Briefcase className="w-12 h-12" />}
                title="Henüz işin yok"
                description="Hemen bir hizmet talebi oluştur."
                ctaText="İş Talebi Oluştur"
                ctaAction={() => router.push('/request')}
              />
            ) : (
              filteredMyJobs.map((job) => {
                const statusInfo = getStatusBadge(job.status)
                return (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <Card className="border-2 border-gray-200 hover:border-[#FF6000]/30 hover:shadow-lg transition-all cursor-pointer bg-white">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className={statusInfo.className}>
                                  {statusInfo.text}
                                </Badge>
                                {job.type === 'instant' && (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Anlık
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                                {job.title || 'İş Talebi'}
                              </h3>
                              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                {job.description}
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{formatDate(job.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{formatTime(job.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{job.city || 'Belirtilmemiş'}</span>
                                </div>
                                {job.priceOffered && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-bold text-[#FF6000]">
                                      {job.priceOffered} ₺
                                    </span>
                                  </div>
                                )}
                              </div>
                              {job.keywords && job.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {job.keywords.slice(0, 3).map((kw: any) => (
                                    <Badge key={kw.id || kw} variant="outline" className="text-xs">
                                      {kw.label || kw}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                )
              })
            )}
          </TabsContent>

          {/* Yakınımdaki İşler Tab */}
          <TabsContent value="nearby" className="space-y-4">
            {filteredNearbyJobs.length === 0 ? (
              <EmptyState
                icon={<Zap className="w-12 h-12" />}
                title="Yakınında iş yok"
                description="10 km çevrende anlık iş talebi bulunmuyor."
              />
            ) : (
              filteredNearbyJobs.map((job) => {
                const statusInfo = getStatusBadge(job.status)
                return (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <Card className="border-2 border-yellow-200 hover:border-[#FF6000]/30 hover:shadow-lg transition-all cursor-pointer bg-white">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Anlık İş
                                </Badge>
                                <Badge className={statusInfo.className}>
                                  {statusInfo.text}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                                {job.title || 'İş Talebi'}
                              </h3>
                              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                {job.description}
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{formatDate(job.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{formatTime(job.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>
                                    {(job as any).distanceKm
                                      ? `${(job as any).distanceKm.toFixed(1)} km`
                                      : job.city || 'Belirtilmemiş'}
                                  </span>
                                </div>
                                {job.priceOffered && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-bold text-[#FF6000]">
                                      {job.priceOffered} ₺
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                              <Button
                                size="sm"
                                onClick={(e) => handleApplyToJob(job.id, e)}
                                className="bg-[#FF6000] hover:bg-[#FF5500] text-white font-bold"
                              >
                                <Send className="w-3.5 h-3.5 mr-1" />
                                Başvur
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
