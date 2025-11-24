import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { createProductSchema } from '@/lib/validations/product'

// GET: İşletmenin ürünlerini listele
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    const businessId = params.id

    // İşletmenin sahibi olduğunu kontrol et
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerUserId: userId,
      },
    })

    if (!business) {
      return NextResponse.json(
        { error: 'İşletme bulunamadı veya yetkiniz yok' },
        { status: 404 }
      )
    }

    const products = await prisma.product.findMany({
      where: {
        businessId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Ürünler yüklenemedi' },
      { status: 400 }
    )
  }
}

// POST: Yeni ürün ekle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    const businessId = params.id

    // İşletmenin sahibi olduğunu kontrol et
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerUserId: userId,
      },
    })

    if (!business) {
      return NextResponse.json(
        { error: 'İşletme bulunamadı veya yetkiniz yok' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validated = createProductSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        businessId,
        name: validated.name,
        description: validated.description,
        price: validated.price,
        isService: validated.isService,
        deliveryType: validated.deliveryType,
        photoUrl: validated.photoUrl || null,
        active: validated.active,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Ürün oluşturulamadı' },
      { status: 400 }
    )
  }
}

