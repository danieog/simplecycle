"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Residency, SchoolStatus } from "@/lib/types";
import {
  findMedSchool,
  rankMedSchoolsBySelectivity,
  searchMedSchools,
} from "@/lib/med-schools";

const statuses: SchoolStatus[] = [
  "considering",
  "applied",
  "secondary_pending",
  "interview",
  "waitlist",
  "accepted",
  "rejected",
  "withdrawn",
];

/**
 * Falls back to the average national_ranking other users have already
 * entered for this school name when the reference dataset lacks enough
 * stats (MCAT/GPA/class size) to compute a selectivity rank.
 */
async function fallbackRankFromStoredSchools(
  supabase: ReturnType<typeof createClient>,
  name: string
): Promise<number | null> {
  const { data } = await supabase
    .from("schools")
    .select("national_ranking")
    .ilike("name", name)
    .not("national_ranking", "is", null);

  const rankings = (data ?? [])
    .map((row) => row.national_ranking as number | null)
    .filter((v): v is number => v != null);

  if (rankings.length === 0) return null;
  return Math.round(rankings.reduce((sum, r) => sum + r, 0) / rankings.length);
}

export default function AddSchoolForm({ cycleId }: { cycleId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [inTuition, setInTuition] = useState("");
  const [outTuition, setOutTuition] = useState("");
  const [residency, setResidency] = useState<Residency>("unknown");
  const [ranking, setRanking] = useState("");
  const [userRanking, setUserRanking] = useState("");
  const [status, setStatus] = useState<SchoolStatus>("considering");
  const [matchedReference, setMatchedReference] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [availableCombinedDegrees, setAvailableCombinedDegrees] = useState<string[]>([]);
  const [combinedProgram, setCombinedProgram] = useState("");
  const [customCombinedProgram, setCustomCombinedProgram] = useState("");

  const selectivityRanks = useMemo(() => rankMedSchoolsBySelectivity(), []);
  const suggestions = useMemo(() => searchMedSchools(name), [name]);
  const hasExactMatch = useMemo(() => !!findMedSchool(name), [name]);

  async function requestSchool() {
    setRequesting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not signed in.");
      setRequesting(false);
      return;
    }

    await supabase.from("school_requests").insert({
      user_id: user.id,
      requested_name: name.trim(),
    });

    setRequesting(false);
    setRequestSent(true);
  }

  async function applyReferenceData(schoolName: string) {
    const reference = findMedSchool(schoolName);
    if (!reference) {
      setMatchedReference(null);
      setAvailableCombinedDegrees([]);
      return;
    }

    setMatchedReference(reference.name);
    if (reference.city) setCity(reference.city);
    if (reference.state) setState(reference.state);
    if (reference.inStateCost != null) setInTuition(String(reference.inStateCost));
    if (reference.outStateCost != null) setOutTuition(String(reference.outStateCost));
    setAvailableCombinedDegrees(reference.comboDegrees);
    setCombinedProgram("");
    setCustomCombinedProgram("");

    const computedRank = selectivityRanks.get(reference.name);
    if (computedRank != null) {
      setRanking(String(computedRank));
    } else {
      const fallbackRank = await fallbackRankFromStoredSchools(supabase, reference.name);
      if (fallbackRank != null) setRanking(String(fallbackRank));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not signed in.");
      setLoading(false);
      return;
    }

    const finalCombinedProgram =
      combinedProgram === "__custom__" ? customCombinedProgram.trim() : combinedProgram;

    const { error } = await supabase.from("schools").insert({
      user_id: user.id,
      cycle_id: cycleId,
      name,
      city: city || null,
      state: state || null,
      in_state_tuition: inTuition ? Number(inTuition) : null,
      out_state_tuition: outTuition ? Number(outTuition) : null,
      residency,
      national_ranking: ranking ? Number(ranking) : null,
      combined_program: finalCombinedProgram || null,
      user_ranking: userRanking ? Number(userRanking) : null,
      status,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setName("");
    setCity("");
    setState("");
    setInTuition("");
    setOutTuition("");
    setRanking("");
    setUserRanking("");
    setStatus("considering");
    setMatchedReference(null);
    setRequestSent(false);
    setAvailableCombinedDegrees([]);
    setCombinedProgram("");
    setCustomCombinedProgram("");
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        + Add school
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3"
    >
      <div className="relative sm:col-span-3">
        <label className="block text-sm font-medium text-slate-700">School name</label>
        <input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setMatchedReference(null);
            setRequestSent(false);
          }}
          autoComplete="off"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {suggestions.length > 0 && !matchedReference && (
          <ul className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
            {suggestions.map((s) => (
              <li key={s.name}>
                <button
                  type="button"
                  onClick={() => {
                    setName(s.name);
                    applyReferenceData(s.name);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-900">{s.name}</span>
                  <span className="ml-2 text-xs text-slate-500">
                    {[s.city, s.state].filter(Boolean).join(", ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {matchedReference && (
          <p className="mt-1 text-xs text-slate-500">
            Autofilled from reference data for {matchedReference}. MCAT/GPA medians and combo
            degrees are shown on the school&apos;s detail page.
          </p>
        )}
        {name.trim().length > 2 &&
          !hasExactMatch &&
          suggestions.length === 0 &&
          (requestSent ? (
            <p className="mt-1 text-xs text-green-600">
              Thanks! We&apos;ve received your request to add &quot;{name.trim()}&quot;.
            </p>
          ) : (
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs text-slate-500">
                We don&apos;t have reference data for this school yet.
              </p>
              <button
                type="button"
                onClick={requestSchool}
                disabled={requesting}
                className="text-xs font-medium text-slate-900 underline disabled:opacity-50"
              >
                {requesting ? "Sending..." : "Request it be added"}
              </button>
            </div>
          ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">City</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">State</label>
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Residency</label>
        <select
          value={residency}
          onChange={(e) => setResidency(e.target.value as Residency)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="unknown">Unknown</option>
          <option value="in_state">In-state</option>
          <option value="out_state">Out-of-state</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">In-state tuition</label>
        <input
          type="number"
          value={inTuition}
          onChange={(e) => setInTuition(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Out-of-state tuition</label>
        <input
          type="number"
          value={outTuition}
          onChange={(e) => setOutTuition(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="flex items-center gap-1 text-sm font-medium text-slate-700">
          SimpleCycle rank
          <span
            tabIndex={0}
            title="SimpleCycle rank estimates how difficult a school is to get into, computed from its MCAT median, GPA median, and first-year class size (smaller classes score as more competitive). Schools without enough reference data fall back to the average rank other users have entered for that school. Lower numbers mean more competitive."
            className="group relative inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600"
          >
            i
            <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-md bg-slate-900 px-3 py-2 text-xs font-normal normal-case text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100">
              SimpleCycle rank estimates admission difficulty from each school&apos;s MCAT
              median, GPA median, and first-year class size (smaller classes score more
              competitive). When a school lacks enough reference data, we fall back to the
              average rank other users have entered for it. Lower numbers mean more
              competitive.
            </span>
          </span>
        </label>
        <input
          type="number"
          value={ranking}
          onChange={(e) => setRanking(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Your ranking</label>
        <input
          type="number"
          value={userRanking}
          onChange={(e) => setUserRanking(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Combined degree</label>
        {availableCombinedDegrees.length > 0 ? (
          <select
            value={combinedProgram}
            onChange={(e) => setCombinedProgram(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">None</option>
            {availableCombinedDegrees.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
              </option>
            ))}
            <option value="__custom__">Other...</option>
          </select>
        ) : (
          <input
            value={customCombinedProgram}
            onChange={(e) => setCustomCombinedProgram(e.target.value)}
            placeholder="e.g. MD/PhD"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        )}
        {availableCombinedDegrees.length > 0 && combinedProgram === "__custom__" && (
          <input
            value={customCombinedProgram}
            onChange={(e) => setCustomCombinedProgram(e.target.value)}
            placeholder="e.g. MD/PhD"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as SchoolStatus)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600 sm:col-span-3">{error}</p>}

      <div className="flex gap-2 sm:col-span-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save school"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
