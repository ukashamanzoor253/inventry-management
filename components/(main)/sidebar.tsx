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
  LayoutDashboard,
  Package,
  TrendingUp,
  Bell,
  Users,
  Menu
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package },
  { label: "Revenue", href: "/dashboard/revenue", icon: TrendingUp },
  { label: "Alerts", href: "/dashboard/stock-alerts", icon: Bell },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'SELLER':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };



  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed left-4 top-4 z-50 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-2 text-white "
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className={`
        fixed left-0 top-0 z-40 h-screen 
        bg-gradient-to-br from-slate-50/95 via-white/95 to-slate-50/95 
        backdrop-blur-md
        border-r border-slate-200/80 
         shadow-slate-200/50
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isCollapsed ? 'w-20' : 'w-64'}
        lg:w-64
      `}>
        
        

        {/* User Profile Section */}
        <div className="p-4 border-b border-slate-200/80">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full group"
          >
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              {/* Avatar with Gradient */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition duration-300"></div>
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full   
                  bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-400 
                  text-lg font-semibold text-white">
                  {user ? getInitials(user.name) : "U"}
                </div>
              </div>
              
              {/* User Info - Hidden when collapsed */}
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user?.name || "Loading..."}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user?.role || 'USER')}`}>
                      {user?.role || "checking..."}
                    </span>
                    <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              )}
              
              {/* Chevron for collapsed view */}
              {isCollapsed && (
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              )}
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className={`mt-4 space-y-2 animate-in slide-in-from-top-2 duration-200 ${isCollapsed ? 'ml-0' : ''}`}>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600"
                onClick={() => setIsProfileOpen(false)}
              >
                <User className="h-4 w-4" />
                {!isCollapsed && <span>My Profile</span>}
              </Link>
              
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600"
                onClick={() => setIsProfileOpen(false)}
              >
                <ShoppingBag className="h-4 w-4" />
                {!isCollapsed && <span>My Orders</span>}
              </Link>
              
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings className="h-4 w-4" />
                {!isCollapsed && <span>Settings</span>}
              </Link>
              
              <div className="border-t border-slate-200 my-2"></div>
              
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {!isCollapsed && <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>}
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`group relative block w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white  shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                } ${isCollapsed ? 'text-center' : ''}`}
              >
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {!isCollapsed && <span>{link.label}</span>}
                </div>

                {/* Active Indicator */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Inventory Health Card */}
        {!isCollapsed && (
          <div className="m-4 rounded-2xl 
            bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-400 
            p-5 text-white  shadow-blue-500/25
            transition-all duration-300 hover:scale-[1.02]">
            
            {/* Card Header */}
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 opacity-80" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
                Inventory Summary
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-80">✅ Good stock</span>
                <span className="font-bold text-lg">1,073</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="opacity-80">⚠️ Low stock</span>
                <span className="font-bold text-lg">48</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="opacity-80">🔴 Critical</span>
                <span className="font-bold text-lg text-red-200">9</span>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="mt-4 space-y-2">
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-white rounded-full"></div>
              </div>
              <p className="text-xs text-white/70 text-center">85% Stock Health</p>
            </div>
          </div>
        )}

        {/* Collapsed version of health indicator */}
        {isCollapsed && (
          <div className="m-2 p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white  shadow-blue-500/25">
            <Package className="h-5 w-5 mx-auto" />
          </div>
        )}
      </aside>
    </>
  );
}