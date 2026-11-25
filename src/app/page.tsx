import { AUTH_ROUTES, PORTAL_NAV_ITEMS } from "@/config/navigation";

const STACK_RESPONSIBILITIES = [
  {
    layer: "Next.js",
    role: "Client-facing frontend portal",
  },
  {
    layer: "Laravel",
    role: "Backend, APIs, and business logic",
  },
  {
    layer: "Laravel Filament",
    role: "QSS administration and supervisor interfaces",
  },
  {
    layer: "Database",
    role: "Application and performance data storage",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
              QP
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                QSS WorkPulse
              </p>
              <p className="text-xs text-slate-500">Client Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Project Initialized
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        {/* Hero */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            QSS Client Operations Portal
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Monitor team delivery, production targets, and shift performance in
            one place.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            QSS WorkPulse gives clients a secure, responsive portal to track
            completed work, evaluate target achievement across teams and shifts,
            and stay ahead of pending activities.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-slate-700">
              Auth: {AUTH_ROUTES.login}
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-slate-700">
              Reset: {AUTH_ROUTES.forgotPassword}
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-slate-700">
              Portal: /dashboard
            </span>
          </div>
        </section>

        {/* Planned Portal Modules */}
        <section className="mt-10">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Portal Modules
              </h2>
              <p className="text-sm text-slate-600">
                Navigation routes scaffolded under{" "}
                <code className="rounded bg-slate-200/70 px-1.5 py-0.5 font-mono text-xs text-slate-800">
                  src/app/(portal)
                </code>
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {PORTAL_NAV_ITEMS.length} core sections
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PORTAL_NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.label}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
                <p className="mt-4 font-mono text-xs text-indigo-600">
                  {item.href}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* System Architecture Overview */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Platform Architecture
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STACK_RESPONSIBILITIES.map((item) => (
              <div
                key={item.layer}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold text-slate-900">
                  {item.layer}
                </p>
                <p className="mt-1 text-xs text-slate-600">{item.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-slate-500 sm:flex-row">
          <p>QSS WorkPulse — Client Portal</p>
          <p>Next.js Frontend · Powered by Laravel API</p>
        </div>
      </footer>
    </div>
  );
}
