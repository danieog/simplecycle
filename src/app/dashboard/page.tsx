import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { School, Secondary, ExamScore, Interview } from "@/lib/types";

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: schools }, { data: secondaries }, { data: exams }, { data: interviews }] =
    await Promise.all([
      supabase.from("schools").select("*").order("created_at", { ascending: false }),
      supabase.from("secondaries").select("*, schools(name)").order("deadline"),
      supabase.from("exam_scores").select("*").order("date_taken", { ascending: false }),
      supabase.from("interviews").select("*, schools(name)").order("interview_date"),
    ]);

  const typedSchools = (schools ?? []) as School[];
  const typedSecondaries = (secondaries ?? []) as (Secondary & { schools: { name: string } | null })[];
  const typedExams = (exams ?? []) as ExamScore[];
  const typedInterviews = (interviews ?? []) as (Interview & { schools: { name: string } | null })[];

  const upcomingDeadlines = typedSecondaries
    .filter((s) => s.received && !s.date_submitted && s.deadline)
    .filter((s) => daysUntil(s.deadline!) >= -1)
    .slice(0, 5);

  const upcomingInterviews = typedInterviews
    .filter((i) => i.invited && i.interview_date && daysUntil(i.interview_date) >= -1)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
        <p className="mt-1 text-sm text-slate-600">
          Your application cycle at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Schools tracked" value={typedSchools.length} />
        <StatCard
          label="Secondaries received"
          value={typedSecondaries.filter((s) => s.received).length}
        />
        <StatCard
          label="Latest MCAT"
          value={typedExams.find((e) => e.exam_name === "MCAT")?.score ?? "—"}
        />
      </div>

      <section>
        <h2 className="text-lg font-medium text-slate-900">
          Secondary deadlines (two-week mark)
        </h2>
        {upcomingDeadlines.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No pending secondary deadlines.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {upcomingDeadlines.map((s) => {
              const days = daysUntil(s.deadline!);
              return (
                <li key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="font-medium text-slate-900">{s.schools?.name}</span>
                  <span className={days <= 3 ? "font-semibold text-red-600" : "text-slate-600"}>
                    {days < 0 ? "Overdue" : `${days} day${days === 1 ? "" : "s"} left`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium text-slate-900">Upcoming interviews</h2>
        {upcomingInterviews.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No upcoming interviews.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {upcomingInterviews.map((i) => (
              <li key={i.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="font-medium text-slate-900">{i.schools?.name}</span>
                <span className="text-slate-600">{i.interview_date}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        href="/dashboard/schools"
        className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Manage schools
      </Link>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
