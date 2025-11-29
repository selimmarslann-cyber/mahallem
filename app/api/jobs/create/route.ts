import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { requireCustomer } from '@/lib/auth/roleCheck'
import { prisma } from '@/lib/db/prisma'
import { createNotification } from '@/lib/notifications/createNotification'
import { getBestMatchingVendors } from '@/lib/services/smartMatchingService'
import { haversineDistanceKm } from '@/lib/utils/matching'
import { sendMail } from '@/lib/mail'
import { buildNearbyJobEmail } from '@/lib/mailTemplates'

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
      locationLat,
      locationLng,
      addressText,
      city,
      district,
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

    // Şehir ve ilçe bilgisi body'den alınmalı, default değer yok
    if (!city) {
      return NextResponse.json(
        { error: 'Şehir bilgisi gereklidir' },
        { status: 400 }
      )
    }
    if (!district) {
      return NextResponse.json(
        { error: 'İlçe bilgisi gereklidir' },
        { status: 400 }
      )
    }
    const jobCity = city
    const jobDistrict = district

    // Job oluştur
    const job = await prisma.job.create({
      data: {
        customerId: userId,
        mainCategoryId,
        subServiceId: subServiceId || null,
        isOther: isOther || false,
        description: description.trim(),
        city: jobCity,
        district: jobDistrict,
        locationLat: locationLat || null,
        locationLng: locationLng || null,
        addressText: addressText || null,
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
            updatedAt: true,
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

      // Calculate avg response time (time from order creation to acceptance in hours)
      let avgResponseTime: number | null = null
      const acceptedOrders = business.orders.filter((o) => 
        o.status === 'ACCEPTED' || o.status === 'IN_PROGRESS' || o.status === 'COMPLETED'
      )
      
      if (acceptedOrders.length > 0) {
        const responseTimes: number[] = []
        for (const order of acceptedOrders) {
          // Order created -> status changed to ACCEPTED zamanını bul
          // updatedAt kullanıyoruz çünkü ACCEPTED olduğunda updatedAt güncellenir
          const createdTime = new Date(order.createdAt).getTime()
          const acceptedTime = new Date(order.updatedAt).getTime()
          const diffMs = acceptedTime - createdTime
          const diffHours = diffMs / (1000 * 60 * 60) // milliseconds to hours
          
          // Makul bir süre (0-48 saat arası)
          if (diffHours >= 0 && diffHours <= 48) {
            responseTimes.push(diffHours)
          }
        }
        
        if (responseTimes.length > 0) {
          avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        }
      }

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
      jobCity: jobCity,
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
                data: { jobId: job.id, mainCategoryId, city: jobCity, matchScore: vendorScore.score },
      })
    })

    await Promise.all(notificationPromises.filter(Boolean))

    // Yakın provider'lara email gönder (10 km içindeki)
    if (job.locationLat && job.locationLng) {
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mahallem.app'
      const jobLocation = { lat: job.locationLat, lng: job.locationLng }
      
      // Kategori adını almak için basit mapping (gerçek uygulamada serviceSearchService kullanılabilir)
      const categoryNames: Record<string, string> = {
        electricity: 'Elektrik',
        plumbing: 'Tesisat',
        cleaning: 'Temizlik',
        painting: 'Boya',
        carpentry: 'Marangoz',
        other: 'Diğer',
      }
      const categoryName = categoryNames[mainCategoryId] || mainCategoryId

      // 10 km içindeki provider'ları bul ve mail gönder
      const emailPromises: Promise<void>[] = []

      for (const business of allMatchingBusinesses) {
        if (!business.lat || !business.lng) continue
        if (!business.owner) continue

        // Mesafe hesapla
        const distanceKm = haversineDistanceKm(jobLocation, {
          lat: business.lat,
          lng: business.lng,
        })

        // 10 km içindeyse
        if (distanceKm <= 10) {
          // Aynı provider'a aynı job için daha önce mail gönderilmiş mi kontrol et
          const existingNotification = await prisma.jobNotification.findUnique({
            where: {
              jobId_businessId: {
                jobId: job.id,
                businessId: business.id,
              },
            },
          })

          if (existingNotification) {
            // Zaten mail gönderilmiş, atla
            continue
          }

          // Provider'ın email adresini al (owner user'dan)
          const ownerUser = await prisma.user.findUnique({
            where: { id: business.owner.id },
            select: { email: true },
          })

          if (!ownerUser?.email) {
            continue
          }

          // JobNotification kaydı oluştur (mail göndermeden önce - duplicate mail'i önlemek için)
          await prisma.jobNotification.create({
            data: {
              jobId: job.id,
              businessId: business.id,
            },
          })

          // Mail gönder (async - hata olsa bile job oluşturma akışını etkilemesin)
          emailPromises.push(
            (async () => {
              try {
                const jobLink = `${APP_URL}/jobs/${job.id}`
                const { subject, html } = buildNearbyJobEmail({
                  providerName: business.owner.name,
                  jobId: job.id,
                  distanceKm,
                  category: categoryName,
                  neighborhood: jobDistrict,
                  jobLink,
                })

                await sendMail(ownerUser.email, subject, html)
                console.log('Yakın iş fırsatı maili gönderildi', {
                  jobId: job.id,
                  businessId: business.id,
                  email: ownerUser.email,
                  distanceKm,
                })
              } catch (mailError: any) {
                // Mail hatası job oluşturma akışını etkilemesin, sadece log'a yaz
                console.error('Yakın iş fırsatı maili gönderme hatası', {
                  jobId: job.id,
                  businessId: business.id,
                  error: mailError.message,
                })
              }
            })()
          )
        }
      }

      // Tüm mailleri paralel gönder (await yapmıyoruz - job oluşturma hızını etkilemesin)
      Promise.all(emailPromises).catch((error) => {
        console.error('Yakın provider mail gönderme genel hatası', error)
      })
    }

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

