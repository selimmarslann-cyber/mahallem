import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import { haversineDistanceKm } from '@/lib/utils/matching'

const createInstantJobSchema = z.object({
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı'),
  locationLat: z.number(),
  locationLng: z.number(),
  city: z.string().optional(),
})

const NOTIFICATION_RADIUS_KM = 50

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
    const validated = createInstantJobSchema.parse(body)

    // Kullanıcı bilgisini al
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { city: true },
    })

    const city = validated.city || user?.city || 'İstanbul'

    // Anlık iş oluştur
    const instantJob = await prisma.instantJob.create({
      data: {
        customerId: userId,
        description: validated.description.trim(),
        locationLat: validated.locationLat,
        locationLng: validated.locationLng,
        city,
        status: 'OPEN',
      },
    })

    // 50 km çevredeki bildirim almak isteyen kullanıcıları bul
    const nearbyUsers = await prisma.user.findMany({
      where: {
        instantJobNotifications: true,
        locationLat: { not: null },
        locationLng: { not: null },
        id: { not: userId }, // Kendisi hariç
      },
      select: {
        id: true,
        name: true,
        locationLat: true,
        locationLng: true,
      },
    })

    // 50 km içindeki kullanıcıları filtrele
    const usersToNotify = nearbyUsers.filter((u) => {
      if (!u.locationLat || !u.locationLng) return false
      const distance = haversineDistanceKm(
        { lat: validated.locationLat, lng: validated.locationLng },
        { lat: u.locationLat, lng: u.locationLng }
      )
      return distance <= NOTIFICATION_RADIUS_KM
    })

    // TODO: Bildirim gönderme sistemi (push notification, email, vb.)
    // Şimdilik sadece log
    console.log(`Anlık iş oluşturuldu: ${instantJob.id}, ${usersToNotify.length} kullanıcıya bildirim gönderilecek`)

    return NextResponse.json(
      {
        instantJob,
        notificationCount: usersToNotify.length,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Instant job creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Anlık iş oluşturulamadı' },
      { status: 500 }
    )
  }
}

