

const sidebarLinks = [
  { label: "Dashboard", active: true },
  { label: "Products", active: false },
  { label: "Categories", active: false },
  { label: "Revenue", active: false },
  { label: "Stock Alerts", active: false },
  { label: "Reports", active: false },
  { label: "Settings", active: false },
];

const summaryCards = [
  { label: "Total products", value: "1,284", detail: "All active SKUs" },
  { label: "Good stock", value: "1,073", detail: "Ready to ship" },
  { label: "Low stock", value: "48", detail: "Action required" },
  { label: "Monthly revenue", value: "$82.6K", detail: "Sales this month" },
];

const productStages = [
  { step: "Receive goods", detail: "Verify inbound shipment and log arrivals." },
  { step: "Quality check", detail: "Inspect items before adding to inventory." },
  { step: "Stock allocation", detail: "Assign items to warehouse zones." },
  { step: "Order picking", detail: "Prepare products for outbound shipments." },
  { step: "Dispatch", detail: "Ship orders and update delivery status." },
];

const inventoryProducts = [
  { name: "Wireless Barcode Scanner", sku: "WS-3381", category: "Electronics", available: 184, status: "Good stock" },
  { name: "Packaging Tape", sku: "PK-9108", category: "Supplies", available: 24, status: "Low stock" },
  { name: "Storage Bin", sku: "SB-7204", category: "Logistics", available: 312, status: "Good stock" },
  { name: "Thermal Labels", sku: "TL-3320", category: "Supplies", available: 9, status: "Critical" },
  { name: "Pallet Jack", sku: "PJ-1109", category: "Equipment", available: 14, status: "Low stock" },
];

const categoryStats = [
  { name: "Electronics", count: 384, revenue: "$48.7K" },
  { name: "Supplies", count: 226, revenue: "$21.1K" },
  { name: "Logistics", count: 189, revenue: "$10.3K" },
  { name: "Equipment", count: 114, revenue: "$12.5K" },
];

const revenuePlan = {
  current: "$82,600",
  target: "$95,000",
  progress: 0.87,
  period: "Apr 2026",
};

const statusStyles: Record<string, string> = {
  "Good stock": "bg-emerald-100 text-emerald-700",
  "Low stock": "bg-amber-100 text-amber-800",
  Critical: "bg-rose-100 text-rose-700",
};

export default function Home() {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
            <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{card.value}</p>
            <p className="mt-3 text-sm text-slate-600">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Inventory process</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">Product lifecycle steps</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">Current period</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {productStages.map((stage) => (
              <div key={stage.step} className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">{stage.step}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{stage.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Category mix</p>
              <div className="mt-5 space-y-4">
                {categoryStats.map((category) => (
                  <div key={category.name} className="flex items-center justify-between rounded-3xl bg-white px-4 py-4 shadow-sm">
                    <div>
                      <p className="font-semibold text-slate-950">{category.name}</p>
                      <p className="text-sm text-slate-500">{category.count} SKUs</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{category.revenue}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Revenue</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{revenuePlan.current}</p>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{Math.round(revenuePlan.progress * 100)}%</div>
              </div>
              <p className="mt-4 text-sm text-slate-600">Target: {revenuePlan.target} · {revenuePlan.period}</p>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${revenuePlan.progress * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Stock alerts</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">Low stock items</h2>
            </div>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">Urgent</span>
          </div>

          <div className="space-y-4">
            {inventoryProducts.filter((item) => item.status !== "Good stock").map((item) => (
              <div key={item.sku} className="rounded-3xl border border-rose-100 bg-rose-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-slate-600">{item.category} · {item.sku}</p>
                  </div>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">{item.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">Available units: {item.available}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Inventory list</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Product stock table</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            Updated now
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 pr-6 font-semibold">Product</th>
                <th className="py-3 pr-6 font-semibold">SKU</th>
                <th className="py-3 pr-6 font-semibold">Category</th>
                <th className="py-3 pr-6 font-semibold">Available</th>
                <th className="py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {inventoryProducts.map((item) => (
                <tr key={item.sku}>
                  <td className="py-4 pr-6 font-medium text-slate-950">{item.name}</td>
                  <td className="py-4 pr-6">{item.sku}</td>
                  <td className="py-4 pr-6">{item.category}</td>
                  <td className="py-4 pr-6">{item.available}</td>
                  <td className="py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
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
