import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const categories = [
    { name: "Electronics", skus: 384, revenue: "$48.7K" },
    { name: "Supplies", skus: 226, revenue: "$21.1K" },
    { name: "Logistics", skus: 189, revenue: "$10.3K" },
    { name: "Equipment", skus: 114, revenue: "$12.5K" },
];

export default function CategoriesPage() {
    return (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Category view</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Inventory by category</h2>
                </div>
                <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">
                    Manage categories
                </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {categories.map((category) => (
                    <article key={category.name} className="rounded-[28px] bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{category.name}</p>
                        <p className="mt-4 text-3xl font-semibold text-slate-950">{category.skus}</p>
                        <p className="mt-2 text-sm text-slate-600">Revenue {category.revenue}</p>
                    </article>
                ))}
            </div>

            <div className="mt-6 rounded-[28px] bg-slate-900 p-6 text-slate-50">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Category health</p>
                <p className="mt-4 text-lg font-semibold">Keep product groups balanced and avoid stockouts in high-demand categories.</p>
            </div>
        </section>
    );
}
