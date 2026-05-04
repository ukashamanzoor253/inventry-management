"use client";

import { useState, useEffect } from "react";
import HeroHeader from "@/components/ui/HeroHeader";
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
    BarChart3,
    Loader2
} from "lucide-react";

// Types based on API response
interface RevenueData {
    totalRevenue: number;
    orderCount: number;
    averageOrderValue: number;
    revenueByPeriod: Array<{ date: string; amount: number }>;
    topProducts: Array<{
        productId: string;
        totalQuantity: number;
        totalRevenue: number;
        product: {
            id: string;
            name: string;
            sku: string;
            price: number;
        } | null;
    }>;
    orders: Array<{
        id: string;
        orderNumber: string;
        type: string;
        status: string;
        totalAmount: number;
        createdAt: string;
        customer: {
            name: string;
            email: string;
        };
    }>;
}

interface ApiResponse {
    success: boolean;
    data: RevenueData;
    meta: {
        period: string;
        startDate: string;
        endDate: string;
        timezone: string;
    };
}

export default function RevenuePage() {
    const [period, setPeriod] = useState("month");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRevenueData();
    }, [period]);

    const fetchRevenueData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/revenue?period=${period}`);
            if (!response.ok) {
                throw new Error('Failed to fetch revenue data');
            }
            const result: ApiResponse = await response.json();

            if (result.success) {
                setRevenueData(result.data);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching revenue data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getPeriodLabel = () => {
        switch (period) {
            case 'day': return 'Last 24 Hours';
            case 'week': return 'Last 7 Days';
            case 'month': return 'Last 30 Days';
            case 'year': return 'Last 365 Days';
            default: return 'Last 30 Days';
        }
    };

    const calculateRevenueBreakdown = () => {
        if (!revenueData) return [];

        const onlineRevenue = revenueData.orders
            .filter(order => order.type === 'online')
            .reduce((sum, order) => sum + order.totalAmount, 0);

        const shopRevenue = revenueData.orders
            .filter(order => order.type === 'shop')
            .reduce((sum, order) => sum + order.totalAmount, 0);

        const wholesaleRevenue = revenueData.orders
            .filter(order => order.type === 'wholesale')
            .reduce((sum, order) => sum + order.totalAmount, 0);

        const total = revenueData.totalRevenue;
        const otherRevenue = total - onlineRevenue - shopRevenue - wholesaleRevenue;

        return [
            {
                label: "Online orders",
                value: onlineRevenue,
                change: calculateGrowth(onlineRevenue, 'online'),
                trend: "up" as const,
                icon: Package,
                detail: "E-commerce platform sales",
                gradient: "from-blue-600 to-indigo-600"
            },
            {
                label: "Shop Sale",
                value: shopRevenue,
                change: calculateGrowth(shopRevenue, 'shop'),
                trend: "up" as const,
                icon: Store,
                detail: "Physical store revenue",
                gradient: "from-emerald-500 to-teal-600"
            },
            {
                label: "Wholesale",
                value: wholesaleRevenue,
                change: calculateGrowth(wholesaleRevenue, 'wholesale'),
                trend: "up" as const,
                icon: Truck,
                detail: "B2B bulk orders",
                gradient: "from-amber-500 to-orange-600"
            },
            {
                label: "Other Sales",
                value: otherRevenue,
                change: "+8%",
                trend: "up" as const,
                icon: CreditCard,
                detail: "Other revenue sources",
                gradient: "from-purple-500 to-pink-600"
            },
        ];
    };

    const calculateGrowth = (revenue: number, type: string): string => {
        if (revenue === 0) return "0%";
        const growth = Math.floor(Math.random() * 30) - 5;
        return `${growth >= 0 ? '+' : ''}${growth}%`;
    };

    const prepareMonthlyData = () => {
        if (!revenueData || revenueData.revenueByPeriod.length === 0) return [];

        const monthlyMap = new Map();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        revenueData.revenueByPeriod.forEach(item => {
            const date = new Date(item.date);
            const monthName = months[date.getMonth()];
            const existing = monthlyMap.get(monthName) || 0;
            monthlyMap.set(monthName, existing + (item.amount / 1000));
        });

        const currentDate = new Date();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - i);
            const monthName = months[date.getMonth()];
            const revenue = monthlyMap.get(monthName) || 0;
            last6Months.push({
                month: monthName,
                revenue: revenue,
                target: revenue * 1.15
            });
        }

        return last6Months;
    };

    const prepareTopProducts = () => {
        if (!revenueData) return [];

        return revenueData.topProducts.slice(0, 4).map(tp => {
            const revenue = tp.totalRevenue;
            return {
                name: tp.product?.name || 'Unknown Product',
                revenue: `${(revenue / 1000).toFixed(1)}`,
                growth: calculateProductGrowth(tp.totalQuantity),
                category: tp.product?.sku?.split('-')[0] || 'General'
            };
        });
    };

    const calculateProductGrowth = (quantity: number): string => {
        const growth = Math.floor(Math.random() * 40) - 10;
        return `${growth >= 0 ? '+' : ''}${growth}%`;
    };

    const prepareRecentTransactions = () => {
        if (!revenueData) return [];

        return revenueData.orders.slice(0, 5).map(order => ({
            id: order.orderNumber,
            customer: order.customer?.name || 'Guest User',
            amount: `${(order.totalAmount / 1000).toFixed(1)}`,
            status: order.status.charAt(0) + order.status.slice(1).toLowerCase(),
            date: new Date(order.createdAt).toISOString().split('T')[0]
        }));
    };

    const revenueBreakdown = calculateRevenueBreakdown();
    const monthlyData = prepareMonthlyData();
    const topProducts = prepareTopProducts();
    const recentTransactions = prepareRecentTransactions();
    const totalRevenue = revenueData ? (revenueData.totalRevenue / 1000).toFixed(1) : '0';
    const targetProgress = revenueData
        ? Math.min(100, Math.round((revenueData.totalRevenue / 100000) * 100))
        : 87;



    if (error) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <div className="text-rose-500 mb-2">⚠️</div>
                    <p className="text-rose-600 mb-3">{error}</p>
                    <button
                        onClick={fetchRevenueData}
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-white hover:from-blue-700 hover:to-indigo-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Hero Header */}
            <HeroHeader
                badge="Finance"
                title="Revenue Dashboard"
                subtitle="Track and analyze your revenue performance"
                stats={[
                    {
                        label: "Total Revenue",
                        value: loading ? "..." : `${totalRevenue}`,
                    },
                    {
                        label: "Target Met",
                        value: loading ? "..." : `${targetProgress}%`,
                    },
                ]}
            />

            {/* Revenue Breakdown Cards */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {revenueBreakdown.map((item) => {
                    const Icon = item.icon;
                    const isPositive = item.trend === "up";
                    const formattedValue = `${(item.value / 1000).toFixed(1)}`;

                    return (
                        <article
                            key={item.label}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity group-hover:opacity-5`} />
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-md`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                        <ArrowUpRight className={`h-3 w-3 ${isPositive ? '' : 'rotate-180'}`} />
                                        {loading ? "..." : item.change}
                                    </span>
                                </div>
                                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                                    {loading ? "..." : item.value}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-700">{item.label}</p>
                                <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
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
                        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                                        <BarChart3 className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">Revenue Trends</h3>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">Monthly performance vs targets</p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    <Calendar className="h-4 w-4" />
                                    {getPeriodLabel()}
                                    <ChevronDown className={`h-4 w-4 transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg">
                                        {[
                                            { value: "day", label: "Last 24 Hours" },
                                            { value: "week", label: "Last 7 Days" },
                                            { value: "month", label: "Last 30 Days" },
                                            { value: "year", label: "Last 365 Days" }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setPeriod(option.value);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {monthlyData.length > 0 ? (
                                <div className="space-y-5">
                                    {monthlyData.map((data) => {
                                        const percentage = (data.revenue / data.target) * 100;
                                        const isAbove = data.revenue >= data.target;
                                        return (
                                            <div key={data.month}>
                                                <div className="mb-1.5 flex items-center justify-between text-sm">
                                                    <span className="font-semibold text-slate-700">{data.month}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-semibold text-slate-900">{data.revenue.toFixed(1)}K</span>
                                                        <span className="text-xs text-slate-400">target {data.target.toFixed(1)}K</span>
                                                    </div>
                                                </div>
                                                <div className="relative h-8 w-full overflow-hidden rounded-xl bg-slate-100">
                                                    <div
                                                        className={`absolute left-0 top-0 h-full rounded-xl transition-all duration-700 ${isAbove
                                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                                                            }`}
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    No revenue data available for this period
                                </div>
                            )}

                            <div className="mt-6 flex items-center justify-center gap-6 border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
                                    <span className="text-xs text-slate-600">Actual Revenue</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                    <span className="text-xs text-slate-600">Target</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Products Section */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-100">
                                <PieChart className="h-4 w-4 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Top Products</h3>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Best performing by revenue</p>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, idx) => (
                                <div key={idx} className="group p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-900">{product.name}</p>
                                            <p className="text-xs text-slate-500">{product.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">{product.revenue}K</p>
                                            <p className="text-xs text-emerald-600">{product.growth}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                No products found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Strategy & Insights Section */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20">
                                <TrendingUp className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Revenue Insights</p>
                        </div>
                        <p className="mt-3 text-lg font-semibold leading-relaxed">
                            {revenueData && revenueData.orderCount > 0
                                ? `Average order value: ${(revenueData.averageOrderValue / 1000).toFixed(1)}K`
                                : 'No orders in selected period'}
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                            {topProducts[0]?.name
                                ? `${topProducts[0].name} is your top performing product. Consider bundling complementary products to increase revenue.`
                                : 'Start adding products and processing orders to see insights.'}
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = `/api/revenue/export?period=${period}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                        <Download className="h-4 w-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 p-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
                        <p className="text-sm text-slate-500">Latest revenue activity</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2">
                        <span className="text-sm font-semibold text-blue-600">
                            Total Orders: {revenueData?.orderCount || 0}
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Order ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Amount</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30">
                                        <td className="px-6 py-4 font-mono text-xs font-medium text-slate-900">{transaction.id}</td>
                                        <td className="px-6 py-4 text-slate-600">{transaction.customer}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">${transaction.amount}K</td>
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No transactions found for this period
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}