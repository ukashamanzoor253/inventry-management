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

    const supplier = await prisma.supplier.findUnique({
      where: { id: (await params).id },
      include: {
        orders: {
          include: {
            items: {
              include: { product: true }
            }
          }
        }
      }
    });

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier);
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
    const { name, email, phone, address } = body;

    const supplier = await prisma.supplier.update({
      where: { id: (await params).id },
      data: { name, email, phone, address }
    });

    return NextResponse.json(supplier);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }
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

    await prisma.supplier.delete({
      where: { id: (await params).id }
    });

    return NextResponse.json(
      { message: 'Supplier deleted successfully' }
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}