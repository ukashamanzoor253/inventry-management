import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const lowStock = searchParams.get('lowStock') === 'true';
    const search = searchParams.get('search');

    let where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (lowStock) {
      where.available = { lte: prisma.product.fields.reorderPoint };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        stockalert: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { name, sku, categoryId, available, reorderPoint, price, location, images } = body;

    if (!name || !sku || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        categoryId,
        available: available || 0,
        reorderPoint: reorderPoint || 0,
        price,
        location: location || '',
        images: images || []
      },
      include: { category: true }
    });

    // Create stock alert if needed
    if (product.available <= product.reorderPoint) {
      await prisma.stockAlert.create({
        data: {
          productId: product.id,
          type: product.available === 0 ? 'CRITICAL' : 'LOW_STOCK',
          message: `${product.name} is ${product.available === 0 ? 'out of stock' : 'below reorder point'} (${product.available} left)`
        }
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}