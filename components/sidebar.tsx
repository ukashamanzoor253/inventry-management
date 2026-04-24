"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Reports", href: "/reports" },
    { label: "Settings", href: "/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed w-[18%] h-[100vh] left-0 top-0 flex flex-col rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-xl">
            <div className="mb-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-semibold text-white">
                    I
                </div>
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Inventory</p>
                    <h2 className="text-xl font-semibold text-white">ProManage</h2>
                </div>
            </div>

            <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                    return (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`block w-full rounded-3xl px-4 py-3 text-left text-sm font-medium transition ${
                                isActive
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/15"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto rounded-3xl bg-slate-900 p-5 text-slate-300 ring-1 ring-slate-800">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Inventory health</p>
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span>Good stock</span>
                        <span className="font-semibold text-emerald-400">1,073</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Low stock</span>
                        <span className="font-semibold text-amber-300">48</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Critical</span>
                        <span className="font-semibold text-rose-300">9</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
