import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { resolveCycle } from "@/lib/cycles";
import type { School } from "@/lib/types";
import AddSchoolForm from "@/components/add-school-form";

const statusColors: Record<string, string> = {
  considering: "bg-slate-100 text-slate-700",
  applied: "bg-blue-100 text-blue-700",
  secondary_pending: "bg-amber-100 text-amber-700",
  interview: "bg-purple-100 text-purple-700",
  waitlist: "bg-orange-100 text-orange-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-slate-100 text-slate-500",
};

export default async function SchoolsPage({
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
        .from("schools")
        .select("*")
        .eq("cycle_id", activeCycle.id)
        .order("user_ranking", { ascending: true, nullsFirst: false })
    : { data: [] };

  const schools = (data ?? []) as School[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Schools</h1>
        <p className="mt-1 text-sm text-slate-600">
          Costs, locations, rankings, and how each school aligns with you.
        </p>
      </div>

      {activeCycle ? (
        <AddSchoolForm cycleId={activeCycle.id} />
      ) : (
        <p className="text-sm text-slate-500">
          Add a cycle first to start tracking schools.
        </p>
      )}

      {schools.length === 0 ? (
        <p className="text-sm text-slate-500">No schools added yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-600">School</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Location</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Tuition</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Nat'l Rank</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Your Rank</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <Link
                      href={`/dashboard/schools/${school.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {school.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-slate-600">
                    {[school.city, school.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-2 text-slate-600">
                    {school.residency === "in_state" && school.in_state_tuition
                      ? `$${school.in_state_tuition.toLocaleString()}`
                      : school.out_state_tuition
                      ? `$${school.out_state_tuition.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{school.national_ranking ?? "—"}</td>
                  <td className="px-4 py-2 text-slate-600">{school.user_ranking ?? "—"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusColors[school.status] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {school.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
