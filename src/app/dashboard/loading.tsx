export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 bg-navy-200 rounded-lg" />
        <div className="h-4 w-72 bg-navy-100 rounded mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-navy-100">
            <div className="w-12 h-12 bg-navy-100 rounded-xl mb-4" />
            <div className="h-8 w-16 bg-navy-200 rounded mb-2" />
            <div className="h-4 w-24 bg-navy-100 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-navy-100 h-64" />
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-navy-100 h-64" />
      </div>
    </div>
  );
}
