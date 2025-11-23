import { prisma } from '@/lib/db/prisma'
import { BusinessCategory, OnlineStatus } from '@prisma/client'
import { isWorkingHoursEnded } from '@/lib/utils/working-hours'

/**
 * İşletme oluşturma
 */
export async function createBusiness(data: {
  ownerUserId: string
  name: string
  description?: string
  category: BusinessCategory
  lat: number
  lng: number
  addressText: string
  coverImageUrl?: string
  workingHoursJson?: any
}) {
  return prisma.business.create({
    data: {
      ...data,
      onlineStatus: 'OFFLINE', // Yeni işletme varsayılan olarak offline
    },
  })
}

/**
 * İşletme güncelleme
 */
export async function updateBusiness(
  id: string,
  data: {
    name?: string
    description?: string
    category?: BusinessCategory
    lat?: number
    lng?: number
    addressText?: string
    coverImageUrl?: string
    workingHoursJson?: any
  }
) {
  return prisma.business.update({
    where: { id },
    data,
  })
}

/**
 * Online/Offline durumu güncelleme
 * Ban kontrolü yapar
 */
export async function updateOnlineStatus(
  businessId: string,
  status: OnlineStatus
) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
  })

  if (!business) {
    throw new Error('İşletme bulunamadı')
  }

  // Ban kontrolü
  if (business.bannedUntil && business.bannedUntil > new Date()) {
    throw new Error(
      `Bu işletme ${business.bannedUntil.toLocaleDateString('tr-TR')} tarihine kadar banlı`
    )
  }

  return prisma.business.update({
    where: { id: businessId },
    data: { onlineStatus: status },
  })
}

/**
 * Mesai saati bitince AUTO_OFFLINE yap
 * (Cron job veya scheduled task'ta çağrılacak)
 */
export async function autoOfflineByWorkingHours() {
  const businesses = await prisma.business.findMany({
    where: {
      onlineStatus: 'ONLINE',
      isActive: true,
    },
  })

  const updates: string[] = []

  for (const business of businesses) {
    const workingHours = business.workingHoursJson as any
    if (isWorkingHoursEnded(workingHours)) {
      await prisma.business.update({
        where: { id: business.id },
        data: { onlineStatus: 'AUTO_OFFLINE' },
      })
      updates.push(business.id)
    }
  }

  return { updated: updates.length, businessIds: updates }
}

/**
 * 2 saat cevap verilmeyen siparişler için AUTO_OFFLINE
 */
export async function autoOfflineByUnansweredOrders() {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)

  const unansweredOrders = await prisma.order.findMany({
    where: {
      status: 'PENDING_CONFIRMATION',
      createdAt: {
        lte: twoHoursAgo,
      },
    },
    include: {
      business: true,
    },
  })

  const businessIds = new Set<string>()

  for (const order of unansweredOrders) {
    if (order.business.onlineStatus === 'ONLINE') {
      await prisma.business.update({
        where: { id: order.businessId },
        data: { onlineStatus: 'AUTO_OFFLINE' },
      })
      businessIds.add(order.businessId)
    }
  }

  return { updated: businessIds.size, businessIds: Array.from(businessIds) }
}

/**
 * İşletme detayı getir
 */
export async function getBusinessById(id: string) {
  return prisma.business.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      products: {
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          reviews: true,
          orders: true,
        },
      },
    },
  })
}

/**
 * Harita için işletmeleri getir (online öncelikli)
 */
export async function getBusinessesForMap(params: {
  lat?: number
  lng?: number
  category?: BusinessCategory
  search?: string
  limit?: number
}) {
  const { lat, lng, category, search, limit = 50 } = params

  const where: any = {
    isActive: true,
  }

  if (category) {
    where.category = category
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  const businesses = await prisma.business.findMany({
    where,
    take: limit,
    orderBy: [
      { onlineStatus: 'asc' }, // ONLINE önce (enum sırası: OFFLINE < ONLINE < AUTO_OFFLINE)
      { avgRating: 'desc' },
      { reviewCount: 'desc' },
    ],
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })

  return businesses
}

