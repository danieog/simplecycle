"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Cycle } from "@/lib/types";

export default function CycleStatsForm({ cycle }: { cycle: Cycle }) {
  const router = useRouter();
  const supabase = createClient();

  const [gpaScale, setGpaScale] = useState(cycle.gpa_scale?.toString() ?? "");
  const [gpa, setGpa] = useState(cycle.gpa?.toString() ?? "");
  const [majorGpa, setMajorGpa] = useState(cycle.major_gpa?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const { error } = await supabase
      .from("cycles")
      .update({
        gpa: gpa || null,
        major_gpa: majorGpa || null,
        gpa_scale: gpa || majorGpa ? gpaScale || null : gpaScale || null,
      })
      .eq("id", cycle.id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-medium text-slate-900">GPA</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">GPA scale</label>
          <select
            value={gpaScale}
            onChange={(e) => setGpaScale(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select a scale</option>
            <option value="4.0">4.0</option>
            <option value="5.0">5.0</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">GPA</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max={gpaScale || undefined}
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            disabled={!gpaScale}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Major GPA</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max={gpaScale || undefined}
            value={majorGpa}
            onChange={(e) => setMajorGpa(e.target.value)}
            disabled={!gpaScale}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && <p className="text-sm text-green-600">Saved.</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save GPA"}
      </button>
    </form>
  );
}
