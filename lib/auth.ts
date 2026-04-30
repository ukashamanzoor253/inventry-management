import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from './prisma';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'SELLER';
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth_token')?.value || 
    request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) return null;

    const decoded = verify(token, process.env.JWT_SECRET!) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(request: NextRequest, allowedRoles?: ('ADMIN' | 'USER' | "SELLER")[]) {
  const user = await verifyAuth(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return user;
}

export async function authOptions(request: NextRequest, allowedRoles?: ('ADMIN' | 'USER' | "SELLER")[]) {
  const user = await verifyAuth(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return user;
}