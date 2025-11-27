import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kullanıcıyı veritabanından çek ve role kontrolü yap
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Toplam kullanıcı sayısı
    const totalUsers = await prisma.user.count()

    // Toplam işletme sayısı
    const totalBusinesses = await prisma.business.count()

    // Toplam sipariş sayısı
    const totalOrders = await prisma.order.count()

    // Açık destek talepleri
    const openTickets = await prisma.supportTicket.count({
      where: {
        status: {
          in: ['OPEN', 'ADMIN_OPEN', 'ADMIN_REPLIED'],
        },
      },
    })

    // Toplam gelir (tamamlanmış siparişlerden platform fee)
    const revenueResult = await prisma.payment.aggregate({
      where: {
        status: 'CAPTURED',
      },
      _sum: {
        platformFee: true,
      },
    })
    const totalRevenue = Number(revenueResult._sum.platformFee || 0)

    // Bu ayın geliri
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyRevenueResult = await prisma.payment.aggregate({
      where: {
        status: 'CAPTURED',
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        platformFee: true,
      },
    })
    const monthlyRevenue = Number(monthlyRevenueResult._sum.platformFee || 0)

    return NextResponse.json({
      totalUsers,
      totalBusinesses,
      totalOrders,
      openTickets,
      totalRevenue,
      monthlyRevenue,
    })
  } catch (error: any) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to load stats', details: error.message },
      { status: 500 }
    )
  }
}

