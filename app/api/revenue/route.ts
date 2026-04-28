import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// Types
interface RevenueMetrics {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  revenueByPeriod: Array<{ date: string; amount: number }>;
  topProducts: TopProduct[];
  orders: OrderSummary[];
}

interface TopProduct {
  productId: string;
  totalQuantity: number;
  totalRevenue: number;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
  } | null;
}

interface OrderSummary {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
}

// Constants
const VALID_PERIODS = ['day', 'week', 'month', 'year'] as const;
type Period = typeof VALID_PERIODS[number];

const PERIOD_CONFIG: Record<Period, { days: number; label: string }> = {
  day: { days: 1, label: 'Last 24 Hours' },
  week: { days: 7, label: 'Last 7 Days' },
  month: { days: 30, label: 'Last 30 Days' },
  year: { days: 365, label: 'Last 365 Days' }
};

// Helper functions
const getStartDate = (period: Period): Date => {
  const startDate = new Date();
  const config = PERIOD_CONFIG[period];
  
  if (!config) {
    throw new Error(`Invalid period: ${period}`);
  }
  
  startDate.setDate(startDate.getDate() - config.days);
  startDate.setHours(0, 0, 0, 0); // Reset to start of day
  
  return startDate;
};

const calculateOrderTotal = (items: Array<{ price: number; quantity: number }>): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const groupRevenueByDate = (orders: any[]): Map<string, number> => {
  const revenueMap = new Map<string, number>();
  
  orders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0];
    const orderTotal = calculateOrderTotal(order.items);
    const currentTotal = revenueMap.get(date) || 0;
    revenueMap.set(date, currentTotal + orderTotal);
  });
  
  return revenueMap;
};

const validatePeriod = (period: string | null): Period => {
  if (!period || !VALID_PERIODS.includes(period as Period)) {
    return 'month';
  }
  return period as Period;
};

// Main handler
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user
    const auth = await requireAuth(request, ['ADMIN', 'SELLER']);
    if (auth instanceof NextResponse) return auth;

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const periodParam = searchParams.get('period');
    const period = validatePeriod(periodParam);
    
    // Calculate date range
    const startDate = getStartDate(period);
    const endDate = new Date();

    // Fetch completed orders with optimized query
    const [completedOrders, topProductsAggregation] = await Promise.all([
      prisma.order.findMany({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          items: {
            select: {
              quantity: true,
              price: true,
              productId: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 10
      })
    ]);

    // Early return if no orders found
    if (completedOrders.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalRevenue: 0,
          orderCount: 0,
          averageOrderValue: 0,
          revenueByPeriod: [],
          topProducts: [],
          orders: []
        },
        meta: {
          period,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
    }

    // Calculate revenue metrics
    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + calculateOrderTotal(order.items),
      0
    );
    
    const averageOrderValue = totalRevenue / completedOrders.length;
    
    // Group revenue by date
    const revenueMap = groupRevenueByDate(completedOrders);
    const revenueByPeriod = Array.from(revenueMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Fetch product details for top products
    const productIds = [...new Set(topProductsAggregation.map(tp => tp.productId))];
    const productDetails = productIds.length > 0
      ? await prisma.product.findMany({
          where: {
            id: { in: productIds }
          },
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            category: {
              select: {
                name: true
              }
            }
          }
        })
      : [];

    // Create a map for quick product lookup
    const productMap = new Map(
      productDetails.map(product => [product.id, product])
    );

    // Calculate revenue for each top product
    const topProductsWithDetails: TopProduct[] = topProductsAggregation.map(tp => {
      const product = productMap.get(tp.productId) || null;
      const quantity = tp._sum.quantity ?? 0;
      const totalRevenue = product 
        ? quantity * product.price
        : 0;
      
      return {
        productId: tp.productId,
        totalQuantity: tp._sum.quantity || 0,
        totalRevenue,
        product: product ? {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price
        } : null
      };
    });

    // Prepare order summaries for response
    const orderSummaries: OrderSummary[] = completedOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      type: order.type,
      status: order.status,
      totalAmount: calculateOrderTotal(order.items),
      createdAt: order.createdAt.toISOString(),
      customer: {
        name: order.user?.name || 'Guest',
        email: order.user?.email || 'N/A'
      }
    }));

    // Return successful response
    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        orderCount: completedOrders.length,
        averageOrderValue,
        revenueByPeriod,
        topProducts: topProductsWithDetails,
        orders: orderSummaries
      },
      meta: {
        period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });

  } catch (error) {
    // Log error with context
    console.error('[Revenue API] Error fetching revenue data:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Return appropriate error response
    if (error instanceof Error && error.message.includes('Invalid period')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid period parameter',
          message: 'Period must be one of: day, week, month, year'
        },
        { status: 400 }
      );
    }

    // Check for Prisma connection errors
    if (error instanceof Error && error.message.includes('prisma')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection error',
          message: 'Unable to fetch revenue data at this time'
        },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching revenue data'
      },
      { status: 500 }
    );
  }
}

// Optional: Add OPTIONS handler for CORS if needed
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Allow': 'GET, OPTIONS',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}