import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import { createNotification } from '@/lib/notifications/createNotification'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Mesaj içeriği boş olamaz').max(1000, 'Mesaj çok uzun'),
})

/**
 * GET /api/orders/[id]/messages
 * Sipariş mesajlarını getir
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    const orderId = params.id

    // Order'ı bul ve yetki kontrolü yap
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        business: {
          select: {
            ownerUserId: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    // Yetki kontrolü: Sadece müşteri veya işletme sahibi mesajları görebilir
    const isCustomer = order.customerId === userId
    const isBusinessOwner = order.business.ownerUserId === userId

    if (!isCustomer && !isBusinessOwner) {
      return NextResponse.json(
        { error: 'Bu siparişin mesajlarını görüntüleme yetkiniz yok' },
        { status: 403 }
      )
    }

    // Mesajları getir
    const messages = await prisma.message.findMany({
      where: { orderId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Order bilgisini de döndür (sistem mesajları için)
    return NextResponse.json({
      messages,
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Messages fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Mesajlar yüklenemedi' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/orders/[id]/messages
 * Yeni mesaj gönder
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    const orderId = params.id

    // Order'ı bul ve yetki kontrolü yap
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        business: {
          select: {
            ownerUserId: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    // Yetki kontrolü
    const isCustomer = order.customerId === userId
    const isBusinessOwner = order.business.ownerUserId === userId

    if (!isCustomer && !isBusinessOwner) {
      return NextResponse.json(
        { error: 'Bu siparişe mesaj gönderme yetkiniz yok' },
        { status: 403 }
      )
    }

    // Body'yi parse et
    const body = await request.json()
    const validated = sendMessageSchema.parse(body)

    // Alıcıyı belirle
    const receiverId = isCustomer
      ? order.business.ownerUserId
      : order.customerId

    // Mesaj oluştur
    const message = await prisma.message.create({
      data: {
        orderId,
        senderId: userId,
        receiverId,
        content: validated.content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Alıcıya bildirim gönder
    try {
      await createNotification({
        userId: receiverId,
        type: 'GENERAL',
        title: 'Yeni Mesaj',
        body: `${message.sender.name}: ${validated.content.substring(0, 50)}${validated.content.length > 50 ? '...' : ''}`,
        data: {
          orderId,
          messageId: message.id,
          senderId: userId,
        },
      })
    } catch (notifError) {
      console.error('Mesaj bildirimi gönderme hatası:', notifError)
      // Bildirim hatası mesaj göndermeyi engellememeli
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Message send error:', error)
    return NextResponse.json(
      { error: error.message || 'Mesaj gönderilemedi' },
      { status: 500 }
    )
  }
}

