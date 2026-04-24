import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const revenueBreakdown = [
    { label: "Online orders", value: "$49.2K", change: "+12%" },
    { label: "Wholesale", value: "$21.5K", change: "+8%" },
    { label: "Returns", value: "-$3.1K", change: "-2%" },
];

export default function RevenuePage() {
    return (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Revenue dashboard</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Performance summary</h2>
                </div>
                <div className="inline-flex items-center gap-3 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                    Monthly target 87% reached
                </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {revenueBreakdown.map((item) => (
                    <div key={item.label} className="rounded-[28px] bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                        <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
                        <p className="mt-2 text-sm text-slate-600">{item.change} vs last month</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-slate-50">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Revenue growth</p>
                <p className="mt-4 text-xl font-semibold">Focus on best-selling categories and optimize inventory mix to increase revenue per shipment.</p>
            </div>
        </section>
    );
}
