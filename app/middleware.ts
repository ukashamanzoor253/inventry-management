// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

const publicPaths = ['/api/auth/login', '/api/auth/register'];
const protectedPaths = ['/api/categories', '/api/products', '/api/inventory', '/api/revenue', '/api/stock-alerts', '/api/dashboard', '/api/orders', '/api/users', '/api/suppliers'];

// Define role-based access rules
const roleAccessRules: Record<string, { allowedRoles: string[], operations?: Record<string, string[]> }> = {
  '/api/products': {
    allowedRoles: ['ADMIN', 'SELLER'],
    operations: {
      'GET': ['ADMIN', 'SELLER'],     // Both can read
      'POST': ['ADMIN', 'SELLER'],    // Both can create
      'PUT': ['ADMIN', 'SELLER'],     // Both can update (but filtered by ownership)
      'DELETE': ['ADMIN']              // Only admin can delete
    }
  },
  '/api/orders': {
    allowedRoles: ['ADMIN', 'SELLER', 'USER'],
    operations: {
      'GET': ['ADMIN', 'SELLER', 'USER'],  // All can read but filtered
      'POST': ['ADMIN', 'USER'],           // Only users and admin can create orders
      'PUT': ['ADMIN'],                    // Only admin can update order status
      'DELETE': ['ADMIN']
    }
  },
  '/api/inventory': {
    allowedRoles: ['ADMIN', 'SELLER'],
    operations: {
      'GET': ['ADMIN', 'SELLER'],
      'POST': ['ADMIN', 'SELLER'],
      'PUT': ['ADMIN', 'SELLER']
    }
  },
  '/api/revenue': {
    allowedRoles: ['ADMIN', 'SELLER'],
    operations: {
      'GET': ['ADMIN', 'SELLER']  // Filtered by role
    }
  },
  '/api/stock-alerts': {
    allowedRoles: ['ADMIN', 'SELLER'],
    operations: {
      'GET': ['ADMIN', 'SELLER'],
      'PUT': ['ADMIN', 'SELLER']
    }
  },
  '/api/dashboard': {
    allowedRoles: ['ADMIN', 'SELLER', 'USER'],
    operations: {
      'GET': ['ADMIN', 'SELLER', 'USER']
    }
  },
  '/api/users': {
    allowedRoles: ['ADMIN'],  // Only admin can manage users
    operations: {
      'GET': ['ADMIN'],
      'POST': ['ADMIN'],
      'PUT': ['ADMIN'],
      'DELETE': ['ADMIN']
    }
  },
  '/api/suppliers': {
    allowedRoles: ['ADMIN', 'SELLER'],  // Sellers can view but not create suppliers
    operations: {
      'GET': ['ADMIN', 'SELLER'],
      'POST': ['ADMIN'],      // Only admin can add suppliers
      'PUT': ['ADMIN'],
      'DELETE': ['ADMIN']
    }
  },
  '/api/categories': {
    allowedRoles: ['ADMIN', 'SELLER'],
    operations: {
      'GET': ['ADMIN', 'SELLER'],  // Anyone can view categories
      'POST': ['ADMIN'],           // Only admin can create categories
      'PUT': ['ADMIN'],
      'DELETE': ['ADMIN']
    }
  }
};

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method; 

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if path is protected
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtected) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      // Verify and decode token
      const decoded = verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
      
      // Check role-based access
      const matchedRoute = Object.keys(roleAccessRules).find(route => 
        pathname.startsWith(route)
      );

      if (matchedRoute) {
        const rule = roleAccessRules[matchedRoute];
        const userRole = decoded.role;
        
        // Check if role is allowed for this route
        if (!rule.allowedRoles.includes(userRole)) {
          return NextResponse.json(
            { error: `Access denied. ${userRole} role cannot access ${pathname}` },
            { status: 403 }
          );
        }
        
        // Check operation-specific permissions
        if (rule.operations && rule.operations[method]) {
          if (!rule.operations[method].includes(userRole)) {
            return NextResponse.json(
              { error: `Access denied. ${userRole} role cannot perform ${method} on ${pathname}` },
              { status: 403 }
            );
          }
        }
      }
      
      // Attach user info to headers for downstream use
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('X-User-Id', decoded.id);
      requestHeaders.set('X-User-Role', decoded.role);
      requestHeaders.set('X-User-Email', decoded.email);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};