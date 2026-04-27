"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  User, 
  LogOut, 
  Settings, 
  ShoppingBag, 
  ChevronDown,
  Loader2,
  Shield,
  Mail
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Inventory", href: "/dashboard/inventory" },
  { label: "Revenue", href: "/dashboard/revenue" },
  { label: "Alerts", href: "/dashboard/stock-alerts" },
  { label: "Settings", href: "/dashboard/settings" },
];

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // User is not authenticated, redirect to login
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        // Clear local storage
        localStorage.removeItem('user');
        // Redirect to login page
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700';
      case 'SELLER':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <aside className="fixed w-[12%] h-[100vh] left-0 top-0 flex flex-col rounded-[32px] 
      border border-pink-100 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed w-[12%] h-[100vh] left-0 top-0 flex flex-col rounded-[32px] 
    border border-pink-100 bg-white shadow-xl overflow-y-auto">

      {/* User Profile Section */}
      <div className="p-6 border-b border-pink-100">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center gap-3 group"
        >
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full   
          bg-gradient-to-br from-pink-500 via-red-400 to-pink-300 
          text-lg font-semibold text-white shadow-md">
            {user ? getInitials(user.name) : "U"}
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name || "Loading..."}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user?.role || 'USER')}`}>
                {user?.role || "USER"}
              </span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </button>

        {/* Profile Dropdown Menu */}
        {isProfileOpen && (
          <div className="mt-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-pink-50 hover:text-pink-600"
              onClick={() => setIsProfileOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </Link>
            
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-pink-50 hover:text-pink-600"
              onClick={() => setIsProfileOpen(false)}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>My Orders</span>
            </Link>
            
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-pink-50 hover:text-pink-600"
              onClick={() => setIsProfileOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
            
            <div className="border-t border-pink-100 my-2"></div>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`group relative block w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300
              ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-red-400 text-white shadow-md"
                  : "text-slate-600 hover:text-black hover:shadow-md hover:-translate-y-[1px]"
              }`}
            >
              <span className="relative z-10">{link.label}</span>

              {/* Hover Glow */}
              {!isActive && (
                <div className="absolute inset-0 rounded-2xl opacity-0 
                bg-gradient-to-r from-pink-500/20 to-red-400/20
                transition-all duration-300 group-hover:opacity-100" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Inventory Health Card */}
      <div className="m-4 rounded-3xl 
      bg-gradient-to-br from-pink-500 via-red-400 to-pink-300 
      p-5 text-white ring-1 ring-pink-600 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em]">
          Inventory health
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Good stock</span>
            <span className="font-semibold">1,073</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Low stock</span>
            <span className="font-semibold">48</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Critical</span>
            <span className="font-semibold">9</span>
          </div>
        </div>
      </div>
    </aside>
  );
}