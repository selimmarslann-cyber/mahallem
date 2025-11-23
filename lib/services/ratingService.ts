import { prisma } from '@/lib/db/prisma'

/**
 * Review oluşturma ve işletme rating güncelleme
 */
export async function createReview(data: {
  orderId: string
  businessId: string
  reviewerId: string
  rating: number
  comment?: string
}) {
  // Sipariş kontrolü
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
  })

  if (!order) {
    throw new Error('Sipariş bulunamadı')
  }

  if (order.status !== 'COMPLETED') {
    throw new Error('Sadece tamamlanmış siparişler değerlendirilebilir')
  }

  if (order.customerId !== data.reviewerId) {
    throw new Error('Sadece sipariş sahibi değerlendirme yapabilir')
  }

  // Daha önce review var mı?
  const existingReview = await prisma.review.findUnique({
    where: { orderId: data.orderId },
  })

  if (existingReview) {
    throw new Error('Bu sipariş için zaten değerlendirme yapılmış')
  }

  // Transaction ile review oluştur ve rating güncelle
  return prisma.$transaction(async (tx) => {
    // Review oluştur
    const review = await tx.review.create({
      data,
    })

    // İşletme rating'ini güncelle
    const business = await tx.business.findUnique({
      where: { id: data.businessId },
      include: {
        reviews: true,
      },
    })

    if (business) {
      const allRatings = business.reviews.map((r) => r.rating)
      const avgRating = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length

      await tx.business.update({
        where: { id: data.businessId },
        data: {
          avgRating,
          reviewCount: allRatings.length,
        },
      })
    }

    return review
  })
}

/**
 * İşletme review'larını getir
 */
export async function getBusinessReviews(businessId: string, limit = 20) {
  return prisma.review.findMany({
    where: { businessId },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      order: {
        select: {
          id: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

/**
 * Başarılı iş tamamlandığında consecutive_cancellations sıfırla
 */
export async function resetCancellationCounter(businessId: string) {
  return prisma.business.update({
    where: { id: businessId },
    data: {
      consecutiveCancellations: 0,
    },
  })
}

