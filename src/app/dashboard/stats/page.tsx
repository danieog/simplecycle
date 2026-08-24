import { createClient } from "@/lib/supabase/server";
import { resolveCycle } from "@/lib/cycles";
import type { ExamScore } from "@/lib/types";
import AddExamForm from "@/components/add-exam-form";
import CycleStatsForm from "@/components/cycle-stats-form";
import ExamScoreRow from "@/components/exam-score-row";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ cycle?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { cycle: requestedCycleId } = await searchParams;
  const activeCycle = await resolveCycle(supabase, user!.id, requestedCycleId);

  const { data } = activeCycle
    ? await supabase
        .from("exam_scores")
        .select("*")
        .eq("cycle_id", activeCycle.id)
        .order("date_taken", { ascending: false })
    : { data: [] };

  const exams = (data ?? []) as ExamScore[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Stats</h1>
        <p className="mt-1 text-sm text-slate-600">
          Track your exam scores and the dates you took them.
        </p>
      </div>

      {!activeCycle ? (
        <p className="text-sm text-slate-500">Add a cycle first to start tracking stats.</p>
      ) : (
        <>
          <CycleStatsForm cycle={activeCycle} />

          <AddExamForm cycleId={activeCycle.id} />

          {exams.length === 0 ? (
            <p className="text-sm text-slate-500">No scores logged yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Exam</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Your score</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Date taken</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {exams.map((exam) => (
                    <ExamScoreRow key={exam.id} exam={exam} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4">
            <h2 className="text-lg font-medium text-slate-900">School recommendations</h2>
            <p className="mt-1 text-sm text-slate-500">
              Personalized school recommendations based on your stats are coming soon.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
