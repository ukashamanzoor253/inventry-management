
export default function SettingsPage() {
    return (
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Settings</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Warehouse management controls</h2>
                </div>
                <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                    Admin options
                </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <article className="rounded-[28px] bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="font-semibold text-slate-950">User access</p>
                    <p className="mt-3 text-sm text-slate-600">Manage team roles, permissions, and system access for warehouse operators.</p>
                </article>
                <article className="rounded-[28px] bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="font-semibold text-slate-950">Notification rules</p>
                    <p className="mt-3 text-sm text-slate-600">Configure stock alerts, email updates, and low inventory notifications.</p>
                </article>
                <article className="rounded-[28px] bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="font-semibold text-slate-950">Warehouse zones</p>
                    <p className="mt-3 text-sm text-slate-600">Update storage area layouts and assign inventory categories to zones.</p>
                </article>
            </div>
        </section>
    );
}
