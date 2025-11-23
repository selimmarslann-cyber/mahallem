import { NextRequest, NextResponse } from 'next/server'
import { getBusinessById } from '@/lib/services/businessService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const business = await getBusinessById(params.id)

    if (!business) {
      return NextResponse.json(
        { error: 'İşletme bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(business)
  } catch (error) {
    console.error('Business fetch error:', error)
    return NextResponse.json(
      { error: 'İşletme yüklenemedi' },
      { status: 500 }
    )
  }
}

