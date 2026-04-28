import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    // Users can only view their own profile unless admin
    if (auth.role !== 'ADMIN' && auth.userId !== (await params).id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only view your own profile' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: (await params).id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
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

    // Users can only update their own profile unless admin
    if (auth.role !== 'ADMIN' && auth.userId !== (await params).id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only update your own profile' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role, isActive } = body;

    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (password) updateData.password = await bcrypt.hash(password, 12);
    
    // Only admin can change role and active status
    if (auth.role === 'ADMIN') {
      if (role) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;
    }

    // Prevent admin from deactivating themselves
    if (isActive === false && auth.userId === (await params).id && auth.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'You cannot deactivate your own account' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: (await params).id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }
    console.error('Error updating user:', error);
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

    // Prevent deleting yourself
    if (auth.userId === (await params).id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: (await params).id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: (await params).id }
    });

    return NextResponse.json(
      { message: 'User deleted successfully' }
    );
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}