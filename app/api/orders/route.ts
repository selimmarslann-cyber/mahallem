import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/services/orderService'
import { createOrderSchema } from '@/lib/validations/order'
import { getUserId } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    const validated = createOrderSchema.parse(body)

    const order = await createOrder({
      customerId: userId,
      businessId: validated.businessId,
      items: validated.items,
      addressText: validated.addressText,
      locationLat: validated.locationLat,
      locationLng: validated.locationLng,
      scheduledAt: validated.scheduledAt
        ? new Date(validated.scheduledAt)
        : undefined,
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Sipariş oluşturulamadı' },
      { status: 400 }
    )
  }
}

