"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Plus, Download, CheckCircle } from "lucide-react";

const routeConfig: Record<
  string,
  {
    title: string;
    navLinks: Array<{ label: string; href: string }>;
    showAddButton?: boolean;
    customButton?: { label: string; action: string };
  }
> = {
  "/dashboard": {
    title: "Warehouse operations overview",
    navLinks: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Purchase Orders", href: "/dashboard/orders" },
      { label: "Create Orders", href: "/dashboard/createorder" },
    ],
    showAddButton: false,
  },
  "/dashboard/orders": {
    title: "Warehouse operations overview",
    navLinks: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Purchase Orders", href: "/dashboard/orders" },
      { label: "Create Orders", href: "/dashboard/createorder" },
    ],
    showAddButton: false,
  },
  "/dashboard/createorder": {
    title: "Warehouse operations overview",
    navLinks: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Purchase Orders", href: "/dashboard/orders" },
      { label: "Create Orders", href: "/dashboard/createorder" },
    ],
    showAddButton: false,
  },
  "/dashboard/inventory": {
    title: "Inventory Management",
    navLinks: [
      { label: "Inventory", href: "/dashboard/inventory" },
      { label: "Products", href: "/dashboard/inventory/products" },
      { label: "Categories", href: "/dashboard/inventory/categories" },
    ],
    showAddButton: true,
  },
  "/dashboard/inventory/products": {
    title: "Inventory Management",
    navLinks: [
      { label: "Inventory", href: "/dashboard/inventory" },
      { label: "Products", href: "/dashboard/inventory/products" },
      { label: "Categories", href: "/dashboard/inventory/categories" },
    ],
    showAddButton: true,
  },
  "/dashboard/inventory/categories": {
    title: "Inventory Management",
    navLinks: [
      { label: "Inventory", href: "/dashboard/inventory" },
      { label: "Products", href: "/dashboard/inventory/products" },
      { label: "Categories", href: "/dashboard/inventory/categories" },
    ],
    showAddButton: true,
  },

  "/dashboard/revenue": {
    title: "Revenue Analytics",
    navLinks: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Orders", href: "/dashboard/orders" },
      { label: "Create Order", href: "/dashboard/createorder" },
    ],
    showAddButton: false,
    customButton: { label: "Export Report", action: "export" },
  },
  "/dashboard/stock-alerts": {
    title: "Stock Alerts & Monitoring",
    navLinks: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Orders", href: "/dashboard/orders" },
      { label: "Create Order", href: "/dashboard/createorder" },
    ],
    showAddButton: false,
    customButton: { label: "Mark as Read", action: "markRead" },
  },
};

const defaultConfig = {
  title: "Warehouse operations overview",
  navLinks: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Orders", href: "/dashboard/orders" },
    { label: "Create Order", href: "/dashboard/createorder" },
  ],
  showAddButton: false,
};

export default function Header() {
  const pathname = usePathname();
  const config = routeConfig[pathname] || defaultConfig;

  const handleCustomButtonClick = (action: string) => {
    if (action === "export") {
      // Handle export logic
      console.log("Exporting report...");
    } else if (action === "markRead") {
      // Handle mark as read logic
      console.log("Marking as read...");
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[250px] z-40 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b border-slate-200/80  shadow-slate-200/50">
      <div className="px-6 py-4 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* Top Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Logo and Title Section */}
            <div className="flex items-center gap-4">
              {/* Gradient Logo */}
              <div className="relative group">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600">
                  <span className="text-lg font-bold text-white tracking-tight">
                    IMS
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-blue-600">
                  Inventory Management System
                </p>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  {config.title}
                </h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Add Button - Dynamic based on config */}
              {config.showAddButton && (
                <button className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 font-semibold text-white  shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Plus className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative text-sm">Add New</span>
                </button>
              )}

              {/* Custom Button */}
              {config.customButton && (
                <button
                  onClick={() => handleCustomButtonClick(config.customButton!.action)}
                  className={`group relative flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 font-semibold  transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                    config.customButton.action === "export"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-500/25 hover:shadow-purple-500/40"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/25 hover:shadow-amber-500/40"
                  } text-white`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {config.customButton.action === "export" ? (
                    <Download className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  ) : (
                    <CheckCircle className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  )}
                  <span className="relative text-sm">{config.customButton.label}</span>
                </button>
              )}

              {/* Purchase Orders Button */}
              <Link
                href="/orders"
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-semibold text-white  shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <ShoppingCart className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative text-sm">Purchase Orders</span>
              </Link>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center gap-2">
              {config.navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative group inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white  shadow-blue-500/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                    {!isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Optional: Stats or additional info */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}