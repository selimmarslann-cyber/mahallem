/**
 * Job Detail API
 * 
 * GET /api/jobs/[id] - Job detayını getir
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'

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

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        acceptedBy: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        offers: {
          include: {
            business: {
              include: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!job) {
      return NextResponse.json(
        { error: 'İş bulunamadı' },
        { status: 404 }
      )
    }

    // Sadece iş sahibi veya teklif veren işletmeler görebilir
    const isOwner = job.customerId === userId
    const userBusiness = await prisma.business.findFirst({
      where: { ownerUserId: userId },
    })
    const hasOffer = userBusiness
      ? job.offers.some((o) => o.businessId === userBusiness.id)
      : false

    if (!isOwner && !hasOffer) {
      return NextResponse.json(
        { error: 'Bu işi görme yetkiniz yok' },
        { status: 403 }
      )
    }

    return NextResponse.json({ job })
  } catch (error: any) {
    console.error('Job fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'İş yüklenemedi' },
      { status: 500 }
    )
  }
}

