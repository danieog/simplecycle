import { createClient } from "@/lib/supabase/server";
import type { ExamScore } from "@/lib/types";
import AddExamForm from "@/components/add-exam-form";

// Rough national averages for context; not medical/admissions advice.
const NATIONAL_AVERAGES: Record<string, string> = {
  MCAT: "506",
  CASPer: "N/A",
};

export default async function StatsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exam_scores")
    .select("*")
    .order("date_taken", { ascending: false });

  const exams = (data ?? []) as ExamScore[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Stats</h1>
        <p className="mt-1 text-sm text-slate-600">
          Your exam scores and how they compare to national figures.
        </p>
      </div>

      <AddExamForm />

      {exams.length === 0 ? (
        <p className="text-sm text-slate-500">No scores logged yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Exam</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Your score</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">National avg</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Date taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td className="px-4 py-2 font-medium text-slate-900">{exam.exam_name}</td>
                  <td className="px-4 py-2 text-slate-600">{exam.score}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {NATIONAL_AVERAGES[exam.exam_name] ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{exam.date_taken ?? "—"}</td>
                </tr>
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
    </div>
  );
}
