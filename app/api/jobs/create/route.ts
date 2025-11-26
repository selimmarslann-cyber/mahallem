import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { requireCustomer } from '@/lib/auth/roleCheck'
import { prisma } from '@/lib/db/prisma'
import { createNotification } from '@/lib/notifications/createNotification'
import { getBestMatchingVendors } from '@/lib/services/smartMatchingService'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    // FAZ 3: Sadece customer iş talebi oluşturabilir
    await requireCustomer(userId)

    const body = await request.json()
    const {
      mainCategoryId,
      subServiceId,
      isOther,
      description,
      urgency,
      desiredDate,
    } = body

    // Validasyon
    if (!mainCategoryId || !description) {
      return NextResponse.json(
        { error: 'Kategori ve açıklama zorunludur' },
        { status: 400 }
      )
    }

    if (description.trim().length < 100) {
      return NextResponse.json(
        { error: 'Açıklama en az 100 karakter olmalıdır' },
        { status: 400 }
      )
    }

    // Tarih hesaplama
    let scheduledAt: Date | null = null
    if (urgency && desiredDate) {
      scheduledAt = new Date(desiredDate)
    } else if (urgency === 'acil' || urgency === 'simdi') {
      // Acil veya şimdi için bugün
      scheduledAt = new Date()
      scheduledAt.setHours(14, 0, 0, 0) // Bugün 14:00
    } else if (urgency === 'bugun') {
      // Bugün için bugün
      scheduledAt = new Date()
      scheduledAt.setHours(18, 0, 0, 0) // Bugün 18:00
    } else if (urgency === 'yarin') {
      // Yarın için yarın
      scheduledAt = new Date()
      scheduledAt.setDate(scheduledAt.getDate() + 1)
      scheduledAt.setHours(14, 0, 0, 0) // Yarın 14:00
    } else if (urgency === 'hafta') {
      // Bu hafta için 3 gün sonra
      scheduledAt = new Date()
      scheduledAt.setDate(scheduledAt.getDate() + 3)
      scheduledAt.setHours(14, 0, 0, 0)
    }

    // Şehir ve ilçe bilgisi - şimdilik default
    // TODO: Kullanıcı profilinden veya konumdan alınabilir
    const city = 'İstanbul'
    const district = 'Kadıköy'

    // Job oluştur
    const job = await prisma.job.create({
      data: {
        customerId: userId,
        mainCategoryId,
        subServiceId: subServiceId || null,
        isOther: isOther || false,
        description: description.trim(),
        city,
        district,
        scheduledAt,
        status: 'PENDING',
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    })

    // FAZ 4: Akıllı eşleştirme ile vendor'lara bildirim gönder
    // Eşleşme mantığı: mainCategoryId ve (isOther veya subServiceId) eşleşen işletmeler
    const allMatchingBusinesses = await prisma.business.findMany({
      where: {
        isActive: true,
        OR: [
          // "Diğer" seçeneği için: sadece ana kategori eşleşmesi yeterli
          isOther
            ? {
                mainCategories: { has: mainCategoryId },
              }
            : {
                // Özel alt hizmet için: hem ana kategori hem alt hizmet eşleşmeli
                mainCategories: { has: mainCategoryId },
                subServices: subServiceId ? { has: subServiceId } : undefined,
              },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        orders: {
          where: {
            status: { in: ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'] },
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    })

    // Convert to VendorProfile format for smart matching
    const vendorProfiles = allMatchingBusinesses.map((business) => {
      // Calculate completion rate
      const completedOrders = business.orders.filter((o) => o.status === 'COMPLETED').length
      const totalOrders = business.orders.length
      const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : null

      // Calculate avg response time (simplified: time from order creation to acceptance)
      // TODO: Implement proper response time calculation
      const avgResponseTime = null

      return {
        id: business.ownerUserId,
        businessId: business.id,
        avgRating: business.avgRating,
        reviewCount: business.reviewCount,
        location: business.lat && business.lng ? { lat: business.lat, lng: business.lng } : null,
        city: business.addressText?.includes('İstanbul') ? 'İstanbul' : null,
        avgResponseTime,
        completionRate,
        onlineStatus: business.onlineStatus,
      }
    })

    // Smart matching: Get best vendors
    const jobContext = {
      jobLocation: job.locationLat && job.locationLng
        ? { lat: job.locationLat, lng: job.locationLng }
        : { lat: 0, lng: 0 }, // Fallback
      jobCity: city,
      maxDistance: 10, // 10km radius
    }

    const bestVendors = getBestMatchingVendors(vendorProfiles, jobContext, 20) // Top 20

    // Send notifications to best matching vendors
    const notificationPromises = bestVendors.map((vendorScore) => {
      const business = allMatchingBusinesses.find((b) => b.ownerUserId === vendorScore.vendorId)
      if (!business) return null

      return createNotification({
        userId: business.ownerUserId,
        type: 'JOB_CREATED',
        title: 'Yeni İş Talebi',
        body: `${job.customer.name} size uygun bir iş talebi oluşturdu. Teklif vermek için tıklayın.`,
        data: { jobId: job.id, mainCategoryId, city, matchScore: vendorScore.score },
      })
    })

    await Promise.all(notificationPromises.filter(Boolean))

    return NextResponse.json(
      {
        job,
        notificationCount: allMatchingBusinesses.length,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: error.message || 'İş kaydı oluşturulamadı' },
      { status: 400 }
    )
  }
}

