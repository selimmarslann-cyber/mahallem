import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

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
    })

    return NextResponse.json({ job }, { status: 201 })
  } catch (error: any) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: error.message || 'İş kaydı oluşturulamadı' },
      { status: 400 }
    )
  }
}

