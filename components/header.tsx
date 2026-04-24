
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
    { label: "Dashboard", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Revenue", href: "/revenue" },
    { label: "Alerts", href: "/stock-alerts" },
]
export default function Header() {
    const pathname = usePathname();
    return (
        <header className="fixed top-0 right-0 w-[80%] h-[22%] overflow-auto rounded-[32px] border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-2 px-6 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-lg font-semibold text-white">
                            IMS
                        </div>
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Inventory dashboard
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                                Warehouse operations overview
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                            Add product
                        </button>
                        <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                            Export report
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-4 rounded-[28px] bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
                        {links.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`rounded-full px-4 py-2 transition ${isActive
                                            ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                                            : "text-slate-600 hover:bg-white hover:text-slate-950"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <div className="relative w-full sm:max-w-xs">
                            <input
                                type="search"
                                placeholder="Search products, SKUs, categories"
                                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                        <button className="inline-flex items-center justify-center rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
                            View reports
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
