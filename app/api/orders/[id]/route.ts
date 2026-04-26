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

    const order = await prisma.order.findUnique({
      where: { id: (await params).id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        supplier: true,
        items: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (auth.role !== 'ADMIN' && order.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      type: order.type,
      supplier: order.supplier,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      orderDate: order.createdAt,
      expectedDate: order.expectedDate,
      status: order.status.toLowerCase(),
      priority: order.priority.toLowerCase(),
      notes: order.notes,
      paymentMethod: order.paymentMethod?.toLowerCase(),
      shippingMethod: order.shippingMethod?.toLowerCase(),
      deliveryMethod: order.deliveryMethod?.toLowerCase(),
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity
      })),
      subtotal: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      tax: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1,
      totalAmount: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
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
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { status } = body;

    const order = await prisma.order.findUnique({
      where: { id: (await params).id },
      include: { items: { include: { product: true } } }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Only ADMIN can update order status
    if (auth.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update inventory if order is completed (for shop orders)
    if (status === 'COMPLETED' && order.status !== 'COMPLETED' && order.type === 'shop') {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            available: { increment: item.quantity }
          }
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: (await params).id },
      data: { status: status.toUpperCase() },
      include: {
        items: {
          include: { product: true }
        },
        supplier: true
      }
    });

    return NextResponse.json({
      id: updatedOrder.id,
      status: updatedOrder.status.toLowerCase(),
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
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
    const auth = await requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;

    await prisma.order.delete({
      where: { id: (await params).id }
    });

    return NextResponse.json(
      { message: 'Order deleted successfully' }
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}