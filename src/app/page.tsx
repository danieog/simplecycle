import Link from "next/link";

const cycleTypes = [
  {
    name: "Medical school",
    status: "In progress",
    statusClass: "bg-green-100 text-green-700",
    description:
      "Track secondaries, MCAT scores, interviews, and essays across every school in your cycle.",
  },
  {
    name: "Law school",
    status: "Coming soon",
    statusClass: "bg-amber-100 text-amber-700",
    description:
      "LSAT tracking, application status, and school comparisons built for the law admissions timeline.",
  },
  {
    name: "Grad school",
    status: "Coming soon",
    statusClass: "bg-amber-100 text-amber-700",
    description:
      "Masters and doctorate applications, GRE scores, and program deadlines in one dashboard.",
  },
];

export default function Home() {
  return (
    <div className="bg-slate-50">
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.06),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(15,23,42,0.05),transparent_40%)]"
        />
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">simplecycle</h1>
        <p className="mt-3 max-w-md text-slate-600">
          The easiest way to apply to school. Track secondaries, scores, interviews,
          and essays for your application cycle in one place.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Log in
          </Link>
        </div>

        <a
          href="#cycle-types"
          className="absolute bottom-8 flex flex-col items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-slate-600"
        >
          See what we support
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 animate-bounce"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>

      <section id="cycle-types" className="mx-auto max-w-5xl px-4 pb-24">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">
            Built for every kind of application cycle
          </h2>
          <p className="mt-2 text-slate-600">
            We&apos;re starting with medical school and expanding from there.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {cycleTypes.map((cycle) => (
            <div
              key={cycle.name}
              className="rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-900">{cycle.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${cycle.statusClass}`}
                >
                  {cycle.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{cycle.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/signup"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Start your medical school cycle
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <Link href="/privacy" className="hover:text-slate-900">
          Privacy Policy
        </Link>
        <span className="mx-2">·</span>
        <Link href="/terms" className="hover:text-slate-900">
          Terms of Use
        </Link>
      </footer>
    </div>
  );
}
