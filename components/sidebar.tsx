"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { label: "Dashboard", href: "/" },
  { label: "Inventory", href: "/inventory" },
  { label: "Revenue", href: "/revenue" },
  { label: "Alerts", href: "/stock-alerts" },
  { label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed w-[12%] h-[100vh] left-0 top-0 flex flex-col rounded-[32px] 
    border border-pink-100 bg-white p-6 shadow-xl">

      {/* LOGO */}
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl 
        bg-gradient-to-br from-pink-500 via-red-400 to-pink-300 
        text-lg font-semibold text-white shadow-md">
          I
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-pink-400">
            Inventory
          </p>
          <h2 className="text-xl font-semibold text-slate-800">
            ProManage
          </h2>
        </div>
      </div>

      {/* NAV */}
      <nav className="space-y-2">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/" && pathname?.startsWith(link.href));

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

      {/* CARD */}
      <div className="mt-auto rounded-3xl 
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