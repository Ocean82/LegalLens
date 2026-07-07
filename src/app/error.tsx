"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-50 px-6">
      <div className="text-center max-w-md">
        <span className="text-6xl">⚠️</span>
        <h1 className="text-2xl font-bold text-navy-900 mt-6">Something went wrong</h1>
        <p className="text-navy-500 mt-3 leading-relaxed">
          {error.message.includes("DATABASE_URL") || error.message.includes("connect")
            ? "Unable to connect to the database. Please check your configuration or try again in a moment."
            : "An unexpected error occurred. Our team has been notified."}
        </p>
        {error.digest && (
          <p className="text-xs text-navy-400 mt-2 font-mono">Error ID: {error.digest}</p>
        )}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={reset}
            className="px-6 py-3 bg-navy-900 text-white rounded-xl font-semibold hover:bg-navy-800 transition"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-navy-100 text-navy-700 rounded-xl font-semibold hover:bg-navy-200 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
