import { NextRequest, NextResponse } from 'next/server'
import { getReferralOverview } from '@/lib/services/referralService'
import { getUserId } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    const overview = await getReferralOverview(userId)

    return NextResponse.json({
      ...overview,
      // Decimal'ları number'a çevir
      totalEarnings: overview.totalEarnings.toNumber(),
      monthlyEarnings: overview.monthlyEarnings.toNumber(),
      level1Earnings: overview.level1Earnings.toNumber(),
      level2Earnings: overview.level2Earnings.toNumber(),
      currentBalance: overview.currentBalance.toNumber(),
    })
  } catch (error: any) {
    console.error('Referral overview error:', error)
    return NextResponse.json(
      { error: error.message || 'Referral bilgileri yüklenemedi' },
      { status: 500 }
    )
  }
}

