import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const product = await prisma.product.findUnique({
      where: { id: (await params).id },
      include: {
        category: true,
        stockalert: true,
        orderItems: {
          include: { order: true }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { name, sku, categoryId, available, reorderPoint, price, location, images } = body;

    const oldProduct = await prisma.product.findUnique({
      where: { id: (await params).id }
    });

    if (!oldProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = await prisma.product.update({
      where: { id: (await params).id },
      data: {
        name,
        sku,
        categoryId,
        available,
        reorderPoint,
        price,
        location,
        images
      },
      include: { category: true }
    });

    // Update stock alerts if stock status changed
    if (available <= reorderPoint) {
      const existingAlert = await prisma.stockAlert.findFirst({
        where: { productId: (await params).id, isRead: false }
      });

      if (!existingAlert) {
        await prisma.stockAlert.create({
          data: {
            productId: product.id,
            type: available === 0 ? 'CRITICAL' : 'LOW_STOCK',
            message: `${product.name} is ${available === 0 ? 'out of stock' : 'below reorder point'} (${available} left)`
          }
        });
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request, ['ADMIN', "SELLER"]);
    if (auth instanceof NextResponse) return auth;

    const productId = (await params).id;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // First, check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        stockalert: true,
        orderItems: true
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete related records in correct order to avoid foreign key constraints
    try {
      // 1. Delete stock alerts first
      if (existingProduct.stockalert.length > 0) {
        await prisma.stockAlert.deleteMany({
          where: { productId: productId }
        });
      }

      // 2. Delete order items
      if (existingProduct.orderItems.length > 0) {
        await prisma.orderItem.deleteMany({
          where: { productId: productId }
        });
      }

      // 3. Finally delete the product
      await prisma.product.delete({
        where: { id: productId }
      });

    } catch (deleteError) {
      console.error('Error deleting related records:', deleteError);
      throw deleteError;
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Product deleted successfully',
        deletedProduct: {
          id: existingProduct.id,
          name: existingProduct.name,
          sku: existingProduct.sku
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete product error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { 
          error: 'Cannot delete product because it has related orders. Please remove product from orders first.',
          details: error.meta?.field_name || 'Foreign key constraint failed'
        },
        { status: 409 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Failed to delete product',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}