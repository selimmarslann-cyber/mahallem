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

    const tickets = await prisma.supportTicket.findMany({
      orderBy: [
        { priority: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    return NextResponse.json({ tickets })
  } catch (error: any) {
    console.error('Admin tickets error:', error)
    return NextResponse.json(
      { error: 'Failed to load tickets', details: error.message },
      { status: 500 }
    )
  }
}

