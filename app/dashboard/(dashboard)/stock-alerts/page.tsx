import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const alerts = [
    { name: "Thermal Labels", sku: "TL-3320", category: "Supplies", available: 9, priority: "Critical" },
    { name: "Packaging Tape", sku: "PK-9108", category: "Supplies", available: 24, priority: "Low stock" },
    { name: "Pallet Jack", sku: "PJ-1109", category: "Equipment", available: 14, priority: "Low stock" },
];

export default function StockAlertsPage() {
    return (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Stock alerts</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Priority replenishment</h2>
                </div>
                <button className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600">
                    Create purchase order
                </button>
            </div>

            <div className="mt-6 space-y-4">
                {alerts.map((item) => (
                    <div key={item.sku} className="rounded-[28px] border border-rose-100 bg-rose-50 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-lg font-semibold text-slate-950">{item.name}</p>
                                <p className="mt-1 text-sm text-slate-600">{item.category} · {item.sku}</p>
                            </div>
                            <div className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">{item.priority}</div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                            <span>Available units: {item.available}</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1">Urgent restock</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
