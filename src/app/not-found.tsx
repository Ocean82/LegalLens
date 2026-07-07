import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 px-6">
      <div className="text-center">
        <span className="text-7xl">⚖️</span>
        <h1 className="text-6xl font-bold text-white mt-6">404</h1>
        <h2 className="text-2xl font-semibold text-navy-300 mt-4">Page Not Found</h2>
        <p className="text-navy-400 mt-2 max-w-md mx-auto">
          The legal document you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href="/"
            className="px-6 py-3 bg-gold-500 text-navy-900 rounded-xl font-semibold hover:bg-gold-400 transition"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard/search"
            className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition border border-white/20"
          >
            Search Cases
          </Link>
        </div>
      </div>
    </div>
  );
}
