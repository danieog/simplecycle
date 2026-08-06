import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-4xl font-semibold text-slate-900">simplecycle</h1>
      <p className="mt-3 max-w-md text-slate-600">
        The easiest way to apply to school. Track secondaries, scores, interviews,
        and essays for your med school cycle in one place.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
