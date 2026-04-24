import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const products = [
    { name: "Wireless Barcode Scanner", sku: "WS-3381", category: "Electronics", available: 184, status: "Good stock" },
    { name: "Packaging Tape", sku: "PK-9108", category: "Supplies", available: 24, status: "Low stock" },
    { name: "Storage Bin", sku: "SB-7204", category: "Logistics", available: 312, status: "Good stock" },
    { name: "Thermal Labels", sku: "TL-3320", category: "Supplies", available: 9, status: "Critical" },
    { name: "Pallet Jack", sku: "PJ-1109", category: "Equipment", available: 14, status: "Low stock" },
];

const statusStyles: Record<string, string> = {
    "Good stock": "bg-emerald-100 text-emerald-700",
    "Low stock": "bg-amber-100 text-amber-800",
    Critical: "bg-rose-100 text-rose-700",
};

export default function ProductsPage() {
    return (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Product catalog</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">All inventory products</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                        Add new product
                    </button>
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                        Sync inventory
                    </button>
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
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
                        {products.map((item) => (
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

    );
}
