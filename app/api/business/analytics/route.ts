/**
 * Business Analytics API
 * 
 * GET /api/business/analytics
 * İşletme analitik verilerini getir
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı girişi gerekli' },
        { status: 401 }
      )
    }

    // Get user's business
    const business = await prisma.business.findFirst({
      where: { ownerUserId: userId },
    })

    if (!business) {
      return NextResponse.json(
        { error: 'İşletme bulunamadı' },
        { status: 404 }
      )
    }

    const now = new Date()
    const todayStart = new Date(now.setHours(0, 0, 0, 0))
    const weekStart = new Date(now.setDate(now.getDate() - 7))
    const monthStart = new Date(now.setMonth(now.getMonth() - 1))
    const lastMonthStart = new Date(now.setMonth(now.getMonth() - 1))
    const lastMonthEnd = new Date(now.setMonth(now.getMonth() + 1))

    // Revenue calculations
    const todayOrders = await prisma.order.findMany({
      where: {
        businessId: business.id,
        status: 'COMPLETED',
        completedAt: { gte: todayStart },
      },
      select: { vendorAmount: true },
    })

    const thisWeekOrders = await prisma.order.findMany({
      where: {
        businessId: business.id,
        status: 'COMPLETED',
        completedAt: { gte: weekStart },
      },
      select: { vendorAmount: true },
    })

    const thisMonthOrders = await prisma.order.findMany({
      where: {
        businessId: business.id,
        status: 'COMPLETED',
        completedAt: { gte: monthStart },
      },
      select: { vendorAmount: true },
    })

    const lastMonthOrders = await prisma.order.findMany({
      where: {
        businessId: business.id,
        status: 'COMPLETED',
        completedAt: {
          gte: lastMonthStart,
          lt: lastMonthEnd,
        },
      },
      select: { vendorAmount: true },
    })

    const revenue = {
      today: todayOrders.reduce((sum, o) => sum + parseFloat(o.vendorAmount.toString()), 0),
      thisWeek: thisWeekOrders.reduce((sum, o) => sum + parseFloat(o.vendorAmount.toString()), 0),
      thisMonth: thisMonthOrders.reduce((sum, o) => sum + parseFloat(o.vendorAmount.toString()), 0),
      lastMonth: lastMonthOrders.reduce((sum, o) => sum + parseFloat(o.vendorAmount.toString()), 0),
      trend: 0,
    }

    // Calculate trend
    if (revenue.lastMonth > 0) {
      revenue.trend = ((revenue.thisMonth - revenue.lastMonth) / revenue.lastMonth) * 100
    }

    // Orders count
    const orders = {
      today: await prisma.order.count({
        where: {
          businessId: business.id,
          status: 'COMPLETED',
          completedAt: { gte: todayStart },
        },
      }),
      thisWeek: await prisma.order.count({
        where: {
          businessId: business.id,
          status: 'COMPLETED',
          completedAt: { gte: weekStart },
        },
      }),
      thisMonth: await prisma.order.count({
        where: {
          businessId: business.id,
          status: 'COMPLETED',
          completedAt: { gte: monthStart },
        },
      }),
      trend: 0,
    }

    const lastMonthOrderCount = await prisma.order.count({
      where: {
        businessId: business.id,
        status: 'COMPLETED',
        completedAt: {
          gte: lastMonthStart,
          lt: lastMonthEnd,
        },
      },
    })

    if (lastMonthOrderCount > 0) {
      orders.trend = ((orders.thisMonth - lastMonthOrderCount) / lastMonthOrderCount) * 100
    }

    // Top products
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          businessId: business.id,
          status: 'COMPLETED',
          completedAt: { gte: monthStart },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    const productSales = new Map<string, { sales: number; revenue: number }>()
    orderItems.forEach((item) => {
      if (!item.product) return
      const existing = productSales.get(item.product.id) || { sales: 0, revenue: 0 }
      productSales.set(item.product.id, {
        sales: existing.sales + item.quantity,
        revenue: existing.revenue + parseFloat(item.totalPrice.toString()),
      })
    })

    const topProducts = Array.from(productSales.entries())
      .map(([id, stats]) => ({
        id,
        name: orderItems.find((item) => item.product?.id === id)?.product?.name || 'Bilinmeyen',
        sales: stats.sales,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Weekly data (last 7 days)
    const weeklyData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayOrders = await prisma.order.findMany({
        where: {
          businessId: business.id,
          status: 'COMPLETED',
          completedAt: {
            gte: date,
            lt: nextDate,
          },
        },
        select: { vendorAmount: true },
      })

      weeklyData.push({
        date: date.toISOString(),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + parseFloat(o.vendorAmount.toString()), 0),
      })
    }

    return NextResponse.json({
      revenue,
      orders,
      topProducts,
      ratings: {
        average: business.avgRating,
        count: business.reviewCount,
        trend: 0, // TODO: Calculate rating trend
      },
      weeklyData,
    })
  } catch (error: any) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Analitik veriler yüklenemedi' },
      { status: 500 }
    )
  }
}

