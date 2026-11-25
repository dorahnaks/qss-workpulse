import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FA] px-6 text-center">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#0056A7] text-base font-bold text-white relative">
          Q
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#F6BA16]" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#0056A7]">
          Module Unavailable
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[#0B2D4D]">
          This section is not available yet
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This route is either still in development by the team or the page
          address could not be found.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#0056A7] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#004485]"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#0B2D4D] transition-colors hover:bg-slate-50"
          >
            Portal Home
          </Link>
        </div>
      </div>
    </div>
  );
}
