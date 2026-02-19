// app/page.tsx
export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome back, Atif</h1>
      <p className="text-slate-600 mb-8">
        Your sourcing engine is active. You have 5 new signals today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Simple Stat Cards */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 font-medium">
            Total Companies
          </div>
          <div className="text-3xl font-bold mt-2">1,240</div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 font-medium">
            Enriched Profiles
          </div>
          <div className="text-3xl font-bold mt-2 text-blue-600">85%</div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500 font-medium">
            Pending Review
          </div>
          <div className="text-3xl font-bold mt-2 text-orange-500">12</div>
        </div>
      </div>
    </div>
  );
}
