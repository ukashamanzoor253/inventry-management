"use client";

import { useState } from "react";
import {
    TrendingUp,
    Store,
    CreditCard,
    Repeat,
    Calendar,
    ChevronDown,
    Download,
    Package,
    Truck,
    RefreshCw,
    ArrowUpRight,
    PieChart,
    BarChart3
} from "lucide-react";

const revenueBreakdown = [
  { label: "Online orders", value: "$49.2K", change: "+12%", trend: "up", icon: Package, detail: "E-commerce platform sales" },
  { label: "Wholesale", value: "$21.5K", change: "+8%", trend: "up", icon: Truck, detail: "B2B bulk orders" },
  { label: "Shop Sale", value: "$18.7K", change: "+15%", trend: "up", icon: Store, detail: "Physical store revenue" },
  { label: "Credit Sale", value: "$15.3K", change: "+5%", trend: "up", icon: CreditCard, detail: "Buy now, pay later" },
  { label: "Subscription", value: "$8.9K", change: "+22%", trend: "up", icon: Repeat, detail: "Recurring revenue" },
  { label: "Returns", value: "-$3.1K", change: "-2%", trend: "down", icon: RefreshCw, detail: "Refunds & adjustments" },
];

const monthlyData = [
    { month: "Jan", revenue: 42.5, target: 45.0 },
    { month: "Feb", revenue: 44.8, target: 45.0 },
    { month: "Mar", revenue: 47.2, target: 48.0 },
    { month: "Apr", revenue: 49.1, target: 48.0 },
    { month: "May", revenue: 51.3, target: 50.0 },
    { month: "Jun", revenue: 49.2, target: 51.0 },
];

const topProducts = [
    { name: "Wireless Barcode Scanner", revenue: "$12,450", growth: "+18%", category: "Electronics" },
    { name: "Storage Bin - Large", revenue: "$8,920", growth: "+24%", category: "Logistics" },
    { name: "Thermal Labels (500pk)", revenue: "$7,340", growth: "+32%", category: "Supplies" },
    { name: "Pallet Jack", revenue: "$5,280", growth: "+5%", category: "Equipment" },
];

const recentTransactions = [
    { id: "#ORD-001", customer: "Acme Corp", amount: "$2,450", status: "Completed", date: "2024-01-15" },
    { id: "#ORD-002", customer: "TechStart Inc", amount: "$1,280", status: "Completed", date: "2024-01-14" },
    { id: "#ORD-003", customer: "Global Logistics", amount: "$3,920", status: "Pending", date: "2024-01-14" },
    { id: "#ORD-004", customer: "SupplyChain Co", amount: "$890", status: "Completed", date: "2024-01-13" },
];

export default function RevenuePage() {
    const [timeframe, setTimeframe] = useState("This Month");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const totalRevenue = revenueBreakdown.reduce((sum, item) => {
        const value = parseFloat(item.value.replace(/[^0-9.-]/g, ''));
        return sum + value;
    }, 0).toFixed(1);

    const targetProgress = 87;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
                <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5 transition-all duration-500 group-hover:h-full group-hover:w-full group-hover:translate-x-0 group-hover:translate-y-0" />
                <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-8 translate-y-8 rounded-full bg-emerald-500/10 transition-all duration-500 group-hover:h-full group-hover:w-full group-hover:translate-x-0 group-hover:translate-y-0" />
                <div className="relative">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-widest text-emerald-300">Finance</p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight">Revenue Dashboard</h1>
                            <p className="mt-2 text-slate-300">Track and analyze your revenue performance</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-2xl font-bold">${totalRevenue}K</p>
                                <p className="text-xs text-slate-400">Total Revenue</p>
                            </div>
                            <div className="h-12 w-px bg-white/20" />
                            <div className="text-right">
                                <p className="text-2xl font-bold text-emerald-400">{targetProgress}%</p>
                                <p className="text-xs text-slate-400">Target Met</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Breakdown Cards */}
            <div className="grid gap-5 md:grid-cols-3">
                {revenueBreakdown.map((item) => {
                    const Icon = item.icon;
                    const isPositive = item.trend === "up";
                    return (
                        <article
                            key={item.label}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            {/* Animated Background Gradient */}
                            <div className={`absolute right-0 top-0 h-32 w-32 -translate-y-4 translate-x-4 rounded-full bg-linear-to-br ${isPositive ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-orange-500'
                                } opacity-10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-5 group-hover:-translate-y-10 group-hover:h-[700px] group-hover:w-[700px]`} />

                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    {/* Icon with Gradient Background */}
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${isPositive ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-orange-500'
                                        } bg-opacity-10`}>
                                        <Icon className={`h-5 w-5 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`} />
                                    </div>

                                    {/* Trend Badge */}
                                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                        <svg className={`h-3 w-3 ${isPositive ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                        {item.change}
                                    </span>
                                </div>

                                {/* Value */}
                                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{item.value}</p>

                                {/* Label */}
                                <p className="mt-1 text-sm font-semibold text-slate-700">{item.label}</p>

                                {/* Detail/Subtitle */}
                                <p className="mt-1 text-xs text-slate-400">vs last month</p>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Revenue Chart Section */}
                <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm">
                        {/* Chart Header */}
                        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-slate-500" />
                                    <h3 className="text-lg font-semibold text-slate-900">Revenue Trends</h3>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">Monthly performance vs targets</p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    <Calendar className="h-4 w-4" />
                                    {timeframe}
                                    <ChevronDown className={`h-4 w-4 transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white shadow-lg">
                                        {["This Month", "Last Month", "This Quarter", "This Year"].map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setTimeframe(option);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chart Content - Simplified visualization */}
                        <div className="p-6">
                            <div className="space-y-4">
                                {monthlyData.map((data) => {
                                    const percentage = (data.revenue / data.target) * 100;
                                    const isAbove = data.revenue >= data.target;
                                    return (
                                        <div key={data.month}>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span className="font-medium text-slate-600">{data.month}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-900">${data.revenue}K</span>
                                                    <span className="text-xs text-slate-400">target ${data.target}K</span>
                                                </div>
                                            </div>
                                            <div className="relative h-8 w-full overflow-hidden rounded-lg bg-slate-100">
                                                <div
                                                    className={`absolute left-0 top-0 h-full rounded-lg transition-all duration-500 ${isAbove ? 'bg-emerald-500' : 'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                                <div
                                                    className={`absolute left-0 top-0 h-full w-full rounded-lg border-r-2 border-white ${isAbove ? 'bg-emerald-400/20' : 'bg-blue-400/20'
                                                        }`}
                                                    style={{ width: `${(data.target / Math.max(...monthlyData.map(m => m.target))) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-6 border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                    <span className="text-xs text-slate-600">Actual Revenue</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-400" />
                                    <span className="text-xs text-slate-600">Target Line</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Products Section */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <div className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-slate-500" />
                            <h3 className="text-lg font-semibold text-slate-900">Top Products</h3>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Best performing by revenue</p>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {topProducts.map((product, idx) => (
                            <div key={idx} className="p-4 transition hover:bg-slate-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">{product.name}</p>
                                        <p className="text-xs text-slate-500">{product.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-900">{product.revenue}</p>
                                        <p className="text-xs text-emerald-600">{product.growth}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-200 p-4">
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                            View All Products
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Strategy & Insights Section */}
            <div className="overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-400" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Revenue Growth Strategy</p>
                        </div>
                        <p className="mt-3 text-lg font-semibold leading-relaxed">
                            Focus on best-selling categories and optimize inventory mix to increase revenue per shipment.
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                            Electronics and Supplies show highest growth potential. Consider bundling complementary products.
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                        <Download className="h-4 w-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 p-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
                        <p className="text-sm text-slate-500">Latest revenue activity</p>
                    </div>
                    <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                        View All
                    </button>
                </div>
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Order ID</th>
                            <th className="px-6 py-4 font-semibold">Customer</th>
                            <th className="px-6 py-4 font-semibold">Amount</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {recentTransactions.map((transaction) => (
                            <tr key={transaction.id} className="transition hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{transaction.id}</td>
                                <td className="px-6 py-4 text-slate-600">{transaction.customer}</td>
                                <td className="px-6 py-4 font-semibold text-slate-900">{transaction.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${transaction.status === "Completed"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-amber-50 text-amber-700"
                                        }`}>
                                        {transaction.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{transaction.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}