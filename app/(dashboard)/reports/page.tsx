import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const reports = [
    { title: "Inventory turnover", detail: "Weekly stock movement and reorder recommendations." },
    { title: "Revenue performance", detail: "Monthly revenue versus target for product categories." },
    { title: "Low stock summary", detail: "Critical and low stock items requiring immediate action." },
];

export default function ReportsPage() {
    return (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Reports center</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Download inventory insights</h2>
                </div>
                <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Generate report
                </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {reports.map((report) => (
                    <article key={report.title} className="rounded-[28px] bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-base font-semibold text-slate-950">{report.title}</p>
                        <p className="mt-3 text-sm text-slate-600">{report.detail}</p>
                        <button className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100">
                            Download PDF
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
}
