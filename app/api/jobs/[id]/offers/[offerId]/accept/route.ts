/**
 * Accept Job Offer API
 * 
 * POST /api/jobs/[id]/offers/[offerId]/accept
 * Müşteri bir teklifi kabul eder, iş o işletmeye atanır
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { requireRole } from '@/lib/auth/roleCheck'
import { prisma } from '@/lib/db/prisma'
import { createNotification } from '@/lib/notifications/createNotification'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; offerId: string } }
) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    // Sadece CUSTOMER teklif kabul edebilir
    const roleCheck = await requireRole(userId, ['CUSTOMER'])
    if (roleCheck.status === 403) {
      return NextResponse.json({ error: roleCheck.error }, { status: 403 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        offers: {
          where: { id: params.offerId },
          include: {
            business: true,
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json(
        { error: 'İş bulunamadı' },
        { status: 404 }
      )
    }

    if (job.customerId !== userId) {
      return NextResponse.json(
        { error: 'Bu işe ait teklifleri kabul etme yetkiniz yok' },
        { status: 403 }
      )
    }

    if (job.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Bu iş artık teklif kabul etmiyor' },
        { status: 400 }
      )
    }

    const offer = job.offers[0]
    if (!offer) {
      return NextResponse.json(
        { error: 'Teklif bulunamadı' },
        { status: 404 }
      )
    }

    if (offer.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Bu teklif artık kabul edilemez' },
        { status: 400 }
      )
    }

    // Transaction: Teklifi kabul et, diğer teklifleri reddet, job'ı ACCEPTED yap
    const result = await prisma.$transaction(async (tx) => {
      // Seçilen teklifi ACCEPTED yap
      await tx.jobOffer.update({
        where: { id: params.offerId },
        data: { status: 'ACCEPTED' },
      })

      // Diğer teklifleri REJECTED yap
      await tx.jobOffer.updateMany({
        where: {
          jobId: params.id,
          id: { not: params.offerId },
          status: 'PENDING',
        },
        data: { status: 'REJECTED' },
      })

      // Job'ı ACCEPTED yap ve business'ı ata
      const updatedJob = await tx.job.update({
        where: { id: params.id },
        data: {
          status: 'ACCEPTED',
          acceptedByBusinessId: offer.businessId,
        },
        include: {
          acceptedBy: {
            include: {
              owner: true,
            },
          },
        },
      })

      return updatedJob
    })

    // İşletme sahibine bildirim gönder
    await createNotification(
      offer.business.ownerUserId,
      'OFFER_ACCEPTED',
      'Teklifiniz Kabul Edildi!',
      `${job.customer.name} işinizi kabul etti. İşe başlayabilirsiniz.`,
      { jobId: job.id, offerId: offer.id }
    )

    // Diğer teklif verenlere bildirim gönder
    const rejectedOffers = await prisma.jobOffer.findMany({
      where: {
        jobId: params.id,
        status: 'REJECTED',
        businessId: { not: offer.businessId },
      },
      include: {
        business: true,
      },
    })

    for (const rejectedOffer of rejectedOffers) {
      await createNotification(
        rejectedOffer.business.ownerUserId,
        'OFFER_REJECTED',
        'Teklifiniz Reddedildi',
        `${job.customer.name} başka bir teklifi seçti.`,
        { jobId: job.id, offerId: rejectedOffer.id }
      )
    }

    return NextResponse.json({ job: result })
  } catch (error: any) {
    console.error('Job offer accept error:', error)
    return NextResponse.json(
      { error: error.message || 'Teklif kabul edilemedi' },
      { status: 500 }
    )
  }
}

