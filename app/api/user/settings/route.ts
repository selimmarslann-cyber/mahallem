import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const settingsSchema = z.object({
  instantJobNotifications: z.boolean().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  city: z.string().optional(),
})

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = settingsSchema.parse(body)

    const updateData: any = {}
    if (validated.instantJobNotifications !== undefined) {
      updateData.instantJobNotifications = validated.instantJobNotifications
    }
    if (validated.locationLat !== undefined) {
      updateData.locationLat = validated.locationLat
    }
    if (validated.locationLng !== undefined) {
      updateData.locationLng = validated.locationLng
    }
    if (validated.city !== undefined) {
      updateData.city = validated.city
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        instantJobNotifications: true,
        locationLat: true,
        locationLng: true,
        city: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: error.message || 'Ayarlar güncellenemedi' },
      { status: 500 }
    )
  }
}

