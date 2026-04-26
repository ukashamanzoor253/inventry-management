import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');

    let where: any = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (userId && auth.role === 'ADMIN') where.userId = userId;
    if (auth.role !== 'ADMIN') where.userId = auth.userId;

    const orders = await prisma.order.findMany({
      where,
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
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform orders for frontend
    const transformedOrders = orders.map(order => ({
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
      shipping: 0, // Will be calculated based on shipping method
      totalAmount: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { 
      type, 
      supplierId, 
      customer, 
      items, 
      expectedDate, 
      priority, 
      notes,
      paymentMethod,
      shippingMethod,
      deliveryMethod 
    } = body;

    if (!type || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate order number
    const lastOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    const lastNumber = lastOrder?.orderNumber?.split('-')[1];
    const newNumber = lastNumber ? String(parseInt(lastNumber) + 1).padStart(6, '0') : '000001';
    const orderNumber = `ORD-${newNumber}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        type,
        supplierId: supplierId || null,
        customerName: customer?.name,
        customerEmail: customer?.email,
        customerPhone: customer?.phone,
        customerAddress: customer?.address,
        expectedDate: new Date(expectedDate),
        priority: priority?.toUpperCase() || 'MEDIUM',
        notes: notes || '',
        paymentMethod: paymentMethod?.toUpperCase(),
        shippingMethod: shippingMethod?.toUpperCase(),
        deliveryMethod: deliveryMethod?.toUpperCase(),
        status: 'PENDING',
        userId: auth.userId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.unitPrice
          }))
        }
      },
      include: {
        items: {
          include: { product: true }
        },
        supplier: true
      }
    });

    // Transform response
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

    return NextResponse.json(transformedOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}