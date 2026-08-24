"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ExamScore } from "@/lib/types";

export default function ExamScoreRow({ exam }: { exam: ExamScore }) {
  const router = useRouter();
  const supabase = createClient();

  const [editing, setEditing] = useState(false);
  const [score, setScore] = useState(exam.score);
  const [dateTaken, setDateTaken] = useState(exam.date_taken ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await supabase
      .from("exam_scores")
      .update({ score, date_taken: dateTaken || null })
      .eq("id", exam.id);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  function handleCancel() {
    setScore(exam.score);
    setDateTaken(exam.date_taken ?? "");
    setEditing(false);
  }

  if (editing) {
    return (
      <tr>
        <td className="px-4 py-2 font-medium text-slate-900">{exam.exam_name}</td>
        <td className="px-4 py-2">
          <input
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </td>
        <td className="px-4 py-2">
          <input
            type="date"
            value={dateTaken}
            onChange={(e) => setDateTaken(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </td>
        <td className="px-4 py-2">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-medium text-slate-900 underline disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="text-xs font-medium text-slate-400 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-4 py-2 font-medium text-slate-900">{exam.exam_name}</td>
      <td className="px-4 py-2 text-slate-600">{exam.score}</td>
      <td className="px-4 py-2 text-slate-600">{exam.date_taken ?? "—"}</td>
      <td className="px-4 py-2">
        <button
          onClick={() => setEditing(true)}
          className="text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}
