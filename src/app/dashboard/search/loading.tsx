export default function SearchLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-40 bg-navy-200 rounded-lg" />
        <div className="h-4 w-80 bg-navy-100 rounded mt-2" />
      </div>
      <div className="bg-white rounded-2xl p-6 border border-navy-100 mb-8">
        <div className="h-5 w-24 bg-navy-100 rounded mb-2" />
        <div className="h-14 w-full bg-navy-50 rounded-xl mb-4" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="h-12 bg-navy-50 rounded-xl" />
          <div className="h-12 bg-navy-50 rounded-xl" />
        </div>
        <div className="h-14 w-full bg-navy-200 rounded-xl" />
      </div>
    </div>
  );
}
