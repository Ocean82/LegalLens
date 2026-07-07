export default function HistoryLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 bg-navy-200 rounded-lg" />
        <div className="h-4 w-64 bg-navy-100 rounded mt-2" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-navy-100">
            <div className="h-6 w-3/4 bg-navy-200 rounded mb-3" />
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-navy-100 rounded-full" />
              <div className="h-6 w-32 bg-navy-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
