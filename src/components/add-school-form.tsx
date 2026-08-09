"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Residency, SchoolStatus } from "@/lib/types";

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
      <div className="sm:col-span-3">
        <label className="block text-sm font-medium text-slate-700">School name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
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
        <label className="block text-sm font-medium text-slate-700">National ranking</label>
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
