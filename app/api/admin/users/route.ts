import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            ownedBusinesses: true,
          },
        },
      },
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Admin users error:', error)
    return NextResponse.json(
      { error: 'Failed to load users', details: error.message },
      { status: 500 }
    )
  }
}

