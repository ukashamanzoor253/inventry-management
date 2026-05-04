'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Inbox,
  ClipboardCheck,
  Factory,
  ClipboardList,
  Truck,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2
} from 'lucide-react';
import HeroHeader from '@/components/ui/HeroHeader';

// Main Dashboard Component
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Icon mapping for dynamic icons
  const iconMap: Record<string, any> = {
    Package,
    CheckCircle,
    AlertTriangle,
    DollarSign,
    Inbox,
    ClipboardCheck,
    Factory,
    ClipboardList,
    Truck
  };

  // Status styles mapping
  const statusStyles: Record<string, string> = {
    "Good stock": "bg-emerald-100 text-emerald-700",
    "Low stock": "bg-amber-100 text-amber-800",
    "Critical": "bg-rose-100 text-rose-700",
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
        setLastRefresh(new Date());
      } else {
        setDashboardData(result.data);
        setError(result.error || 'Using cached data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);

      setError('Unable to load live data. Showing cached data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Transform API data to frontend format
  const getSummaryCards = () => {
    if (!dashboardData) return [
      {
        label: "Total products",
        value: "...",
        detail: "...",
        icon: Package,
        trend: "...",
        trendUp: true,
        gradient: "from-blue-600 to-indigo-600",
        bgGradient: "from-blue-50 to-indigo-50"
      },
      {
        label: "Good stock",
        value: "...",
        detail: "...",
        icon: CheckCircle,
        trend: "...",
        trendUp: true,
        gradient: "from-emerald-500 to-teal-600",
        bgGradient: "from-emerald-50 to-teal-50"
      },
      {
        label: "Low stock",
        value: "...",
        detail: "...",
        icon: AlertTriangle,
        trend: "...",
        trendUp: false,
        gradient: "from-amber-500 to-orange-600",
        bgGradient: "from-amber-50 to-orange-50"
      },
      {
        label: "Monthly revenue",
        value: "...",
        detail: "...",
        icon: DollarSign,
        trend: "...",
        trendUp: true,
        gradient: "from-purple-500 to-pink-600",
        bgGradient: "from-purple-50 to-pink-50"
      },
    ];
    else {
      return [
        {
          label: "Total products",
          value: dashboardData.summaryCards?.totalProducts?.value || "0",
          detail: dashboardData.summaryCards?.totalProducts?.detail || "All active SKUs",
          icon: Package,
          trend: dashboardData.summaryCards?.totalProducts?.trend || "+0%",
          trendUp: true,
          gradient: "from-blue-600 to-indigo-600",
          bgGradient: "from-blue-50 to-indigo-50"
        },
        {
          label: "Good stock",
          value: dashboardData.summaryCards?.goodStock?.value || "0",
          detail: dashboardData.summaryCards?.goodStock?.detail || "Ready to ship",
          icon: CheckCircle,
          trend: dashboardData.summaryCards?.goodStock?.trend || "+0%",
          trendUp: true,
          gradient: "from-emerald-500 to-teal-600",
          bgGradient: "from-emerald-50 to-teal-50"
        },
        {
          label: "Low stock",
          value: dashboardData.summaryCards?.lowStock?.value || "0",
          detail: dashboardData.summaryCards?.lowStock?.detail || "Action required",
          icon: AlertTriangle,
          trend: dashboardData.summaryCards?.lowStock?.trend || "0%",
          trendUp: false,
          gradient: "from-amber-500 to-orange-600",
          bgGradient: "from-amber-50 to-orange-50"
        },
        {
          label: "Monthly revenue",
          value: dashboardData.summaryCards?.monthlyRevenue?.value || "$0",
          detail: dashboardData.summaryCards?.monthlyRevenue?.detail || "Sales this month",
          icon: DollarSign,
          trend: dashboardData.summaryCards?.monthlyRevenue?.trend || "+0%",
          trendUp: true,
          gradient: "from-purple-500 to-pink-600",
          bgGradient: "from-purple-50 to-pink-50"
        },
      ];
    }
  };

  const getProductStages = () => {
    if (!dashboardData) return [];

    const stages = dashboardData.productStages || [];
    const icons = [Inbox, ClipboardCheck, Factory, ClipboardList, Truck];

    return stages.map((stage: any, index: number) => ({
      ...stage,
      icon: icons[index] || Inbox
    }));
  };

  const getInventoryProducts = () => {
    if (!dashboardData) return [];
    return dashboardData.inventoryProducts || [];
  };

  const getCategoryStats = () => {
    if (!dashboardData) return [];
    return dashboardData.categoryStats || [];
  };

  const getRevenuePlan = () => {
    if (!dashboardData) {
      return {
        current: "$0",
        target: "$0",
        progress: 0,
        period: "...",
        lastMonth: "$0",
        growth: "+0%"
      };
    }
    return dashboardData.revenuePlan || {};
  };

  const getSystemStats = () => {
    if (!dashboardData) return [];

    const stats = dashboardData.systemStats || [];
    return stats.map((stat: any) => ({
      ...stat,
      icon: iconMap[stat.icon] || Truck
    }));
  };

  const getStockWarnings = () => {
    if (!dashboardData) return [];
    return dashboardData.stockWarnings || [];
  };

  const getTotalStats = () => {
    if (!dashboardData) {
      return { totalSKUs: 0, targetMet: 0 };
    }
    return dashboardData.totalStats || { totalSKUs: 0, targetMet: 0 };
  };

  const summaryCardsData = getSummaryCards();
  const productStagesData = getProductStages();
  const inventoryProductsData = getInventoryProducts();
  const categoryStatsData = getCategoryStats();
  const revenuePlanData = getRevenuePlan();
  const systemStatsData = getSystemStats();
  const stockWarningsData = getStockWarnings();
  const totalStatsData = getTotalStats();


  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="ml-auto flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-200 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
        </div>
      )}

      <HeroHeader
        title="Dashboard"
        subtitle="Real-time warehouse operations & stock management"
        badge="Overview"
        gradient="from-blue-600 via-indigo-600 to-blue-400"
        loading={loading}
        stats={[
          {
            label: "Total SKUs",
            value: totalStatsData.totalSKUs,
            loading: loading
          },
          {
            label: "Target Met",
            value: `${totalStatsData.targetMet}%`,
            loading: loading
          },
        ]}
        actions={
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCardsData.map((card) => (
          <article
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6  transition-all duration-300 hover:-translate-y-1 "
          >
            <div className={`absolute right-0 top-0 h-32 w-32 -translate-y-4 translate-x-4 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:w-[700px] group-hover:h-[700px]`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} `}>
                  {card.icon && <card.icon className="h-5 w-5 text-white" />}
                </div>
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${card.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {card.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {card.trend}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{loading ? "..." : card.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{card.label}</p>
              <p className="mt-1 text-xs text-slate-400">{card.detail}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Stats Row */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {systemStatsData.map((stat: any) => (
          <div key={stat.label} className="group flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white p-4  transition-all duration-300  hover:-translate-y-0.5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.bg}  transition-transform group-hover:scale-110`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900">{loading ? "..." : stat.value}</p>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{stat.change}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Left - Process & Categories */}
        <div className="space-y-6 lg:col-span-2">
          {/* Process Flow */}
          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Workflow</p>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Inventory Process</h2>
              </div>
              <span className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                {productStagesData.length} Steps
              </span>
            </div>
            <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2">
              {productStagesData.map((stage: any, idx: any) => (
                <div key={stage.step} className="flex items-center">
                  <div className="group flex min-w-[140px] flex-col items-center rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 text-center transition-all duration-300 hover:border-blue-200  hover:-translate-y-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600  transition-transform group-hover:scale-110">
                      <stage.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700">{stage.step}</p>
                    <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">{stage.detail}</p>
                    <div className="mt-3 rounded-full bg-slate-100 px-2 py-0.5">
                      <span className="text-xs font-bold text-slate-600">{stage.count}</span>
                    </div>
                  </div>
                  {idx < productStagesData.length - 1 && (
                    <svg className="mx-1 h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Categories & Revenue */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Categories */}
            <div className="rounded-2xl border border-slate-200/50 bg-white p-6 ">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">By Category</p>
              </div>
              <div className="space-y-4">
                {categoryStatsData.map((category: any) => (
                  <div key={category.name} className="group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${category.color} ring-2 ring-offset-2 ring-offset-white`} />
                        <span className="text-sm font-medium text-slate-700">{category.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{category.revenue}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full bg-gradient-to-r ${category.gradient || 'from-blue-600 to-indigo-600'} transition-all duration-500 group-hover:opacity-80`} style={{ width: `${category.percentage}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{category.count} SKUs · {category.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue */}
            <div className="rounded-2xl border border-slate-200/50 bg-white p-6 ">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-1 rounded-full bg-gradient-to-b from-purple-500 to-pink-600" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Revenue</p>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{revenuePlanData.current}</p>
                </div>
                <div className="relative h-16 w-16">
                  <svg className="h-16 w-16 -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                    <circle
                      cx="32" cy="32" r="28"
                      stroke="url(#revenueGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${revenuePlanData.progress * 176} 176`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-900">{Math.round(revenuePlanData.progress * 100)}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="text-xs text-slate-400">Last month</p>
                  <p className="text-sm font-semibold text-slate-700">{revenuePlanData.lastMonth}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Target</p>
                  <p className="text-sm font-semibold text-slate-700">{revenuePlanData.target}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Growth</p>
                  <p className="text-sm font-semibold text-emerald-600">{revenuePlanData.growth}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Alerts */}
        <div className="space-y-6 rounded-2xl border border-slate-200/50 bg-white p-6 ">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-rose-500 to-orange-500" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Alerts</p>
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Stock Warnings</h2>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rose-600" />
              {stockWarningsData.length} urgent
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {stockWarningsData.length > 0 ? (
              stockWarningsData.map((item: any) => (
                <div key={item.sku} className="group relative overflow-hidden rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/30 to-white p-4 transition-all duration-300 hover:border-rose-200 ">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.category} · {item.sku}</p>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${item.status === 'Critical'
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-amber-100 text-amber-700'
                        }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Available</p>
                        <p className="text-lg font-bold text-slate-900">{item.available}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Value</p>
                        <p className="text-sm font-bold text-slate-700">{item.price}</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-rose-200/50">
                      <div
                        className={`h-full rounded-full transition-all ${item.available < 15 ? 'bg-gradient-to-r from-rose-500 to-red-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                          }`}
                        style={{ width: `${Math.min((item.available / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-slate-700">No stock warnings</p>
                <p className="text-xs text-slate-400 mt-1">All inventory levels are healthy</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white px-6 py-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory</p>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Product Stock</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live
            </span>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              Last updated: {dashboardData?.metadata?.lastUpdated || 'Just now'}
            </span>
            <button
              onClick={fetchDashboardData}
              className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <RefreshCw className="h-3 w-3 inline mr-1" />
              Refresh
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Product</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">SKU</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Category</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Price</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Available</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventoryProductsData.map((item: any) => (
                <tr key={item.sku} className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">{item.sku}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{item.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.available}</span>
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${item.status === 'Good stock'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : item.status === 'Critical'
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500'
                            }`}
                          style={{ width: `${Math.min((item.available / 320) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

