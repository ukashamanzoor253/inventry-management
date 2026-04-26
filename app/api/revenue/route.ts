import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month'; // day, week, month, year

    let startDate = new Date();
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const completedOrders = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate }
      },
      include: {
        items: true,
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    const totalRevenue = completedOrders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
      return sum + orderTotal;
    }, 0);

    const revenueByPeriod = completedOrders.reduce((acc: any, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      acc[date] = (acc[date] || 0) + orderTotal;
      return acc;
    }, {});

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10
    });

    const productDetails = await prisma.product.findMany({
      where: {
        id: { in: topProducts.map(p => p.productId) }
      },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true
      }
    });

    const topProductsWithDetails = topProducts.map(tp => ({
      ...tp,
      product: productDetails.find(p => p.id === tp.productId)
    }));

    return NextResponse.json({
      totalRevenue,
      orderCount: completedOrders.length,
      revenueByPeriod: Object.entries(revenueByPeriod).map(([date, amount]) => ({ date, amount })),
      topProducts: topProductsWithDetails,
      orders: completedOrders
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}