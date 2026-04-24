"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Route configurations
const routeConfig: Record<string, {
    title: string;
    navLinks: Array<{ label: string; href: string }>;
    showAddButton?: boolean;
    customButton?: { label: string; action: string };
}> = {
    "/": {
        title: "Warehouse operations overview",
        navLinks: [
            { label: "Dashboard", href: "/" }
        ],
        showAddButton: false,
    },
    "/inventory": {
        title: "Inventory Management",
        navLinks: [
            { label: "Inventory", href: "/inventory" },
            { label: "Products", href: "/products" },
            { label: "Categories", href: "/categories" },
        ],
        showAddButton: true,
    },
     "/products": {
        title: "Inventory Management",
        navLinks: [
            { label: "Inventory", href: "/inventory" },
            { label: "Products", href: "/products" },
            { label: "Categories", href: "/categories" },
        ],
        showAddButton: true,
    },
     "/categories": {
        title: "Inventory Management",
        navLinks: [
            { label: "Inventory", href: "/inventory" },
            { label: "Products", href: "/products" },
            { label: "Categories", href: "/categories" },
        ],
        showAddButton: true,
    },

    "/revenue": {
        title: "Revenue Analytics",
        navLinks: [
            { label: "Dashboard", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Categories", href: "/categories" },
        ],
        showAddButton: false,
        customButton: { label: "Export Report", action: "export" },
    },
    "/stock-alerts": {
        title: "Stock Alerts & Monitoring",
        navLinks: [
            { label: "Dashboard", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Categories", href: "/categories" },
        ],
        showAddButton: false,
        customButton: { label: "Mark as Read", action: "markRead" },
    },
};

// Default config for unknown routes
const defaultConfig = {
    title: "Warehouse operations overview",
    navLinks: [
        { label: "Dashboard", href: "/" },
        { label: "Products", href: "/products" },
        { label: "Categories", href: "/categories" },
    ],
    showAddButton: false,
};

export default function Header() {
    const pathname = usePathname();
    const config = routeConfig[pathname] || defaultConfig;

    const showAddProductButton = config.showAddButton;
    const customButton = config.customButton;

    const handleButtonClick = () => {
        if (customButton?.action === "export") {
            console.log("Exporting report...");
        } else if (customButton?.action === "markRead") {
            console.log("Marking alerts as read...");
        } else if (showAddProductButton) {
            window.dispatchEvent(new CustomEvent('openAddProductModal'));
        }
    };

    return (
        <header className="fixed top-0 right-0 w-[88%] px-[10px] h-[19%] z-50">
            <div className="overflow-auto rounded-[32px] border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-2 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[1px] pb-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-lg font-semibold text-white">
                                IMS
                            </div>
                            <div>
                                <p className="text-sm font-light my-0 uppercase tracking-[0.24em] text-slate-500">
                                    Inventory dashboard
                                </p>
                                <h1 className="text-[24px] font-semibold leading-tight text-slate-950">
                                    {config.title}
                                </h1>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            {customButton && (
                                <button
                                    onClick={handleButtonClick}
                                    className="inline-flex items-center gap-2 rounded-full border font-medium border-slate-200 bg-gray-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                                >
                                    {customButton.label}
                                </button>
                            )}

                            {showAddProductButton && (
                                <button
                                    onClick={handleButtonClick}
                                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm text-white font-medium transition hover:bg-slate-800"
                                >
                                    Add product
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col mt-2 gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Dynamic Navigation Links */}
                        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
                            {config.navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={`inline-flex items-center rounded-full px-4 py-2 text-sm transition font-medium ${isActive
                                                ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                                                : "border border-slate-200 bg-gray-200 text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}