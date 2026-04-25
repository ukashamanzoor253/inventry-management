import {
  Package,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Inbox,
  ClipboardCheck,
  Factory,
  ClipboardList,
  Truck
} from 'lucide-react';

const summaryCards = [
  {
    label: "Total products",
    value: "1,284",
    detail: "All active SKUs",
    icon: Package,
    trend: "+12%",
    trendUp: true,
    color_1: "from-blue-100 to-blue-200",
    color_2: "from-blue-500 to-blue-600"
  },
  {
    label: "Good stock",
    value: "1,073",
    detail: "Ready to ship",
    icon: CheckCircle,
    trend: "+8%",
    trendUp: true,
    color_1: "from-emerald-100 to-emerald-200",
    color_2: "from-emerald-500 to-emerald-600"
  },
  {
    label: "Low stock",
    value: "48",
    detail: "Action required",
    icon: AlertTriangle,
    trend: "-5%",
    trendUp: false,
    color_1: "from-amber-100 to-amber-200",
    color_2: "from-amber-500 to-amber-600"
  },
  {
    label: "Monthly revenue",
    value: "$82.6K",
    detail: "Sales this month",
    icon: DollarSign,
    trend: "+23%",
    trendUp: true,
    color_1: "from-violet-100 to-violet-200",
    color_2: "from-violet-500 to-violet-600"
  },
];

const productStages = [
  { step: "Receive goods", detail: "Verify inbound shipment and log arrivals.", icon: Inbox, count: 24 },
  { step: "Quality check", detail: "Inspect items before adding to inventory.", icon: ClipboardCheck, count: 18 },
  { step: "Stock allocation", detail: "Assign items to warehouse zones.", icon: Factory, count: 32 },
  { step: "Order picking", detail: "Prepare products for outbound shipments.", icon: ClipboardList, count: 45 },
  { step: "Dispatch", detail: "Ship orders and update delivery status.", icon: Truck, count: 28 },
];

const inventoryProducts = [
  { name: "Wireless Barcode Scanner", sku: "WS-3381", category: "Electronics", available: 184, status: "Good stock", price: "$249.99" },
  { name: "Packaging Tape", sku: "PK-9108", category: "Supplies", available: 24, status: "Low stock", price: "$12.99" },
  { name: "Storage Bin", sku: "SB-7204", category: "Logistics", available: 312, status: "Good stock", price: "$34.99" },
  { name: "Thermal Labels", sku: "TL-3320", category: "Supplies", available: 9, status: "Critical", price: "$8.99" },
  { name: "Pallet Jack", sku: "PJ-1109", category: "Equipment", available: 14, status: "Low stock", price: "$599.99" },
];

const categoryStats = [
  { name: "Electronics", count: 384, revenue: "$48.7K", color: "bg-blue-500", percentage: 96 },
  { name: "Supplies", count: 226, revenue: "$21.1K", color: "bg-emerald-500", percentage: 56 },
  { name: "Logistics", count: 189, revenue: "$10.3K", color: "bg-amber-500", percentage: 47 },
  { name: "Equipment", count: 114, revenue: "$12.5K", color: "bg-violet-500", percentage: 28 },
];

const revenuePlan = {
  current: "$82,600",
  target: "$95,000",
  progress: 0.87,
  period: "Apr 2026",
  lastMonth: "$71,200",
  growth: "+16%",
};

const systemStats = [
  { label: "Active Orders", value: "156", change: "+12 today", icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Pending Shipments", value: "43", change: "8 in transit", icon: Truck, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Returns", value: "12", change: "-3 from last week", icon: Inbox, color: "text-rose-600", bg: "bg-rose-50" },
  { label: "Suppliers", value: "28", change: "2 new this month", icon: Factory, color: "text-emerald-600", bg: "bg-emerald-50" },
];

const statusStyles: Record<string, string> = {
  "Good stock": "bg-emerald-100 text-emerald-700",
  "Low stock": "bg-amber-100 text-amber-800",
  Critical: "bg-rose-100 text-rose-700",
};

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-red-400 to-pink-300 p-8 text-white">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5 transition-all duration-500 group-hover:h-full group-hover:w-[1900px] group-hover:translate-x-6 group-hover:-translate-y-0" />
       <div className="relative">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white">Overview</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="mt-2 text-white">Real-time warehouse operations & stock management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">1,284</p>
                <p className="text-xs text-white">Total SKUs</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-right">
                <p className="text-2xl font-bold text-white">87%</p>
                <p className="text-xs text-white">Target Met</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`absolute right-0 top-0 h-32 w-32 -translate-y-4 translate-x-4 rounded-full bg-linear-to-br ${card.color_2} opacity-10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:w-[700px] group-hover:h-[700px]`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${card.color_1} bg-opacity-10`}>
                  {card.icon && <card.icon className={`h-5 w-5 ${card.trendUp ? 'text-blue-600' : 'text-amber-600'}`} />}
                </div>
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${card.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  <svg className={`h-3 w-3 ${card.trendUp ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {card.trend}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{card.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{card.label}</p>
              <p className="mt-1 text-xs text-slate-400">{card.detail}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Stats Row */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            </div>
            <div>
              <p className="text-md text-slate-900">{stat.change}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Left - Process & Categories */}
        <div className="space-y-6 lg:col-span-2">
          {/* Process Flow */}
          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Workflow</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">Inventory Process</h2>
              </div>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">5 Steps</span>
            </div>
            <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2">
              {productStages.map((stage, idx) => (
                <div key={stage.step} className="flex items-center">
                  <div className="group flex min-w-35 flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center transition-all hover:border-blue-200 hover:bg-blue-50/30">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                      <stage.icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700">{stage.step}</p>
                    <p className="mt-1 text-[10px] text-slate-400 line-clamp-2">{stage.detail}</p>
                    <div className="mt-3 rounded-full bg-slate-200/50 px-2 py-0.5">
                      <span className="text-xs font-bold text-slate-600">{stage.count}</span>
                    </div>
                  </div>
                  {idx < productStages.length - 1 && (
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
            <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">By Category</p>
              <div className="mt-5 space-y-4">
                {categoryStats.map((category) => (
                  <div key={category.name} className="group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${category.color}`} />
                        <span className="text-sm font-medium text-slate-700">{category.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{category.revenue}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${category.color} transition-all duration-500`} style={{ width: `${category.percentage}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{category.count} SKUs · {category.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue */}
            <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Revenue</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{revenuePlan.current}</p>
                </div>
                <div className="relative h-16 w-16">
                  <svg className="h-16 w-16 -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                    <circle cx="32" cy="32" r="28" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray={`${revenuePlan.progress * 176} 176`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-900">{Math.round(revenuePlan.progress * 100)}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="text-xs text-slate-400">Last month</p>
                  <p className="text-sm font-semibold text-slate-700">{revenuePlan.lastMonth}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Target</p>
                  <p className="text-sm font-semibold text-slate-700">{revenuePlan.target}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Growth</p>
                  <p className="text-sm font-semibold text-emerald-600">{revenuePlan.growth}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Alerts */}
        <div className="space-y-6 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Alerts</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">Stock Warnings</h2>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rose-600" />
              {inventoryProducts.filter((i) => i.status !== "Good stock").length} urgent
            </span>
          </div>

          <div className="space-y-3">
            {inventoryProducts.filter((item) => item.status !== "Good stock").map((item) => (
              <div key={item.sku} className="group relative overflow-hidden rounded-xl border border-rose-100/50 bg-rose-50/30 p-4 transition-all hover:border-rose-200 hover:shadow-md">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-rose-400 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.category} · {item.sku}</p>
                    </div>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold ${item.status === 'Critical' ? 'bg-rose-200 text-rose-800' : 'bg-amber-100 text-amber-700'}`}>
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
                    <div className={`h-full rounded-full transition-all ${item.available < 15 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${Math.min((item.available / 50) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/30 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Inventory</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Product Stock</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">Live</span>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">Last updated: Just now</span>
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
              {inventoryProducts.map((item) => (
                <tr key={item.sku} className="transition-colors hover:bg-blue-50/20">
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
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${item.status === 'Good stock' ? 'bg-emerald-500' : item.status === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${Math.min((item.available / 320) * 100, 100)}%` }} />
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
