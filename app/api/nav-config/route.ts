import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    const role = user?.role || 'USER';
    
    const searchParams = request.nextUrl.searchParams;
    const route = searchParams.get('route');

    if (!route) {
      return NextResponse.json(
        { error: 'Route parameter is required' },
        { status: 400 }
      );
    }

    const navConfig = await prisma.navConfig.findUnique({
      where: {
        route_role: {
          route,
          role
        }
      }
    });

    if (!navConfig) {
      // Return default config if not found
      return NextResponse.json({
        navLinks: [],
        buttons: [],
        showAddButton: false
      });
    }

    return NextResponse.json({
      navLinks: navConfig.navLinks,
      buttons: navConfig.buttons,
      showAddButton: navConfig.showAddButton
    });
  } catch (error) {
    console.error('Error fetching nav config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}