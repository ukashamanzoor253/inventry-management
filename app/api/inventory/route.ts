import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const [totalProducts, lowStockCount, outOfStockCount, totalValue, categoryStats] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({
        where: {
          available: { gt: 0, lte: prisma.product.fields.reorderPoint }
        }
      }),
      prisma.product.count({
        where: { available: 0 }
      }),
      prisma.product.aggregate({
        _sum: { price: true }
      }),
      prisma.category.findMany({
        include: {
          products: {
            select: { available: true, price: true }
          }
        }
      })
    ]);

    const categoriesWithStats = categoryStats.map(cat => ({
      name: cat.name,
      productCount: cat.products.length,
      totalValue: cat.products.reduce((sum, p) => sum + (p.price * p.available), 0)
    }));

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    return NextResponse.json({
      summary: {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        totalInventoryValue: totalValue._sum.price || 0
      },
      categories: categoriesWithStats,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}