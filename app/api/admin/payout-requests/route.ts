/**
 * Admin Payout Requests API - FAZ 3
 * 
 * GET: Tüm payout request'leri listele
 * PATCH: Payout request durumunu güncelle
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { updatePayoutRequestStatus } from '@/lib/services/walletService'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const updatePayoutStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'PAID']),
})

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    // Admin kontrolü (basit: role ADMIN olmalı)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin yetkisi gerekli' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined

    const where: any = {}
    if (status) {
      where.status = status
    }

    const requests = await prisma.payoutRequest.findMany({
      where,
      include: {
        wallet: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
    })

    return NextResponse.json({
      requests: requests.map((req) => ({
        id: req.id,
        walletId: req.walletId,
        userId: req.userId,
        user: req.wallet.user,
        amount: typeof req.amount === 'number' ? req.amount : req.amount.toNumber(),
        status: req.status,
        iban: req.iban,
        notes: req.notes,
        requestedAt: req.requestedAt.toISOString(),
        processedAt: req.processedAt?.toISOString() || null,
        createdAt: req.createdAt.toISOString(),
        updatedAt: req.updatedAt.toISOString(),
      })),
    })
  } catch (error: any) {
    console.error('Admin payout requests fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Çekim talepleri yüklenemedi' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    // Admin kontrolü
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin yetkisi gerekli' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body
    const validated = updatePayoutStatusSchema.parse(updateData)

    if (!id) {
      return NextResponse.json(
        { error: 'Payout request ID gerekli' },
        { status: 400 }
      )
    }

    const updated = await updatePayoutRequestStatus(id, validated.status, userId)

    return NextResponse.json({
      payoutRequest: {
        id: updated.id,
        status: updated.status,
        processedAt: updated.processedAt?.toISOString() || null,
      },
    })
  } catch (error: any) {
    console.error('Admin payout request update error:', error)
    return NextResponse.json(
      { error: error.message || 'Çekim talebi güncellenemedi' },
      { status: 400 }
    )
  }
}

