import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    // Direkt davet edilen kullanıcılar (L1)
    const invitedUsers = await prisma.$queryRaw<Array<{
      id: string
      name: string
      created_at: Date
      total_gmv: any
      total_earnings: any
    }>>`
      SELECT 
        u.id,
        u.name,
        u.created_at,
        COALESCE(u.network_cumulative_gmv, 0) as total_gmv,
        COALESCE((
          SELECT SUM(wt.amount)
          FROM wallet_transactions wt
          WHERE wt.order_id IN (
            SELECT o.id
            FROM orders o
            WHERE o.customer_id = u.id
              AND o.status = 'COMPLETED'
          )
          AND wt.user_id = ${userId}::uuid
          AND wt.source_type = 'referral'
          AND wt.level = 1
        ), 0) as total_earnings
      FROM users u
      WHERE u.referrer_id = ${userId}::uuid
      ORDER BY u.created_at DESC
    `

    // Her kullanıcının sipariş sayısını kontrol et (aktif/pasif)
    const usersWithStatus = await Promise.all(
      invitedUsers.map(async (user) => {
        const orderCount = await prisma.order.count({
          where: {
            customerId: user.id,
            status: 'COMPLETED',
          },
        })

        return {
          id: user.id,
          name: user.name.length > 2 
            ? `${user.name.charAt(0)}${'*'.repeat(user.name.length - 2)}${user.name.charAt(user.name.length - 1)}`
            : user.name,
          registeredAt: user.created_at.toISOString(),
          status: orderCount > 0 ? 'active' as const : 'inactive' as const,
          totalGMV: parseFloat(user.total_gmv?.toString() || '0'),
          earnings: parseFloat(user.total_earnings?.toString() || '0'),
        }
      })
    )

    return NextResponse.json({ users: usersWithStatus })
  } catch (error: any) {
    console.error('Invited users error:', error)
    return NextResponse.json(
      { error: error.message || 'Davet edilen kullanıcılar yüklenemedi' },
      { status: 500 }
    )
  }
}

