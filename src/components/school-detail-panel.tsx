"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { School, Secondary, Interview, EssayPrompt } from "@/lib/types";

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function SchoolDetailPanel({
  school,
  secondary,
  interview,
  essays,
}: {
  school: School;
  secondary: Secondary | null;
  interview: Interview | null;
  essays: EssayPrompt[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [pros, setPros] = useState(school.pros ?? "");
  const [cons, setCons] = useState(school.cons ?? "");
  const [alignment, setAlignment] = useState(school.alignment_notes ?? "");
  const [clubs, setClubs] = useState(school.clubs_of_interest ?? "");
  const [savingNotes, setSavingNotes] = useState(false);

  const [secReceived, setSecReceived] = useState(secondary?.received ?? false);
  const [secDateReceived, setSecDateReceived] = useState(secondary?.date_received ?? "");
  const [secDateSubmitted, setSecDateSubmitted] = useState(secondary?.date_submitted ?? "");
  const [savingSecondary, setSavingSecondary] = useState(false);

  const [invited, setInvited] = useState(interview?.invited ?? false);
  const [inviteDate, setInviteDate] = useState(interview?.invite_date ?? "");
  const [interviewDate, setInterviewDate] = useState(interview?.interview_date ?? "");
  const [savingInterview, setSavingInterview] = useState(false);

  const [newPrompt, setNewPrompt] = useState("");
  const [savingEssay, setSavingEssay] = useState(false);

  async function saveNotes() {
    setSavingNotes(true);
    await supabase
      .from("schools")
      .update({ pros, cons, alignment_notes: alignment, clubs_of_interest: clubs })
      .eq("id", school.id);
    setSavingNotes(false);
    router.refresh();
  }

  async function saveSecondary() {
    setSavingSecondary(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      school_id: school.id,
      user_id: user!.id,
      received: secReceived,
      date_received: secDateReceived || null,
      date_submitted: secDateSubmitted || null,
      deadline: secDateReceived ? addDays(secDateReceived, 14) : null,
    };

    if (secondary) {
      await supabase.from("secondaries").update(payload).eq("id", secondary.id);
    } else {
      await supabase.from("secondaries").insert(payload);
    }
    setSavingSecondary(false);
    router.refresh();
  }

  async function saveInterview() {
    setSavingInterview(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      school_id: school.id,
      user_id: user!.id,
      invited,
      invite_date: inviteDate || null,
      interview_date: interviewDate || null,
    };

    if (interview) {
      await supabase.from("interviews").update(payload).eq("id", interview.id);
    } else {
      await supabase.from("interviews").insert(payload);
    }
    setSavingInterview(false);
    router.refresh();
  }

  async function addEssay(e: React.FormEvent) {
    e.preventDefault();
    if (!newPrompt.trim()) return;
    setSavingEssay(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("essay_prompts").insert({
      school_id: school.id,
      user_id: user!.id,
      prompt: newPrompt,
    });
    setNewPrompt("");
    setSavingEssay(false);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{school.name}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {[school.city, school.state].filter(Boolean).join(", ")}
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-medium text-slate-900">Pros, cons & alignment</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Pros</label>
            <textarea
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Cons</label>
            <textarea
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              How you align with this school
            </label>
            <textarea
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Clubs of interest</label>
            <textarea
              value={clubs}
              onChange={(e) => setClubs(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          onClick={saveNotes}
          disabled={savingNotes}
          className="mt-3 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {savingNotes ? "Saving..." : "Save notes"}
        </button>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-medium text-slate-900">Secondary application</h2>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={secReceived}
              onChange={(e) => setSecReceived(e.target.checked)}
            />
            Received
          </label>
          <div>
            <label className="block text-sm font-medium text-slate-700">Date received</label>
            <input
              type="date"
              value={secDateReceived}
              onChange={(e) => setSecDateReceived(e.target.value)}
              className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Date submitted</label>
            <input
              type="date"
              value={secDateSubmitted}
              onChange={(e) => setSecDateSubmitted(e.target.value)}
              className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={saveSecondary}
            disabled={savingSecondary}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {savingSecondary ? "Saving..." : "Save"}
          </button>
        </div>
        {secondary?.deadline && (
          <p className="mt-2 text-xs text-slate-500">
            Two-week deadline: {secondary.deadline}
          </p>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-medium text-slate-900">Interview</h2>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={invited}
              onChange={(e) => setInvited(e.target.checked)}
            />
            Invited
          </label>
          <div>
            <label className="block text-sm font-medium text-slate-700">Invite date</label>
            <input
              type="date"
              value={inviteDate}
              onChange={(e) => setInviteDate(e.target.value)}
              className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Interview date</label>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={saveInterview}
            disabled={savingInterview}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {savingInterview ? "Saving..." : "Save"}
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-medium text-slate-900">Essay prompts</h2>
        <p className="mt-1 text-xs text-slate-500">
          AI feedback and rewrite suggestions are coming soon.
        </p>
        <ul className="mt-3 space-y-3">
          {essays.map((essay) => (
            <li key={essay.id} className="rounded-md border border-slate-200 p-3 text-sm">
              <p className="font-medium text-slate-900">{essay.prompt}</p>
              {essay.ai_feedback ? (
                <p className="mt-1 text-slate-600">{essay.ai_feedback}</p>
              ) : (
                <p className="mt-1 text-xs italic text-slate-400">
                  AI feedback not yet generated.
                </p>
              )}
            </li>
          ))}
        </ul>
        <form onSubmit={addEssay} className="mt-3 flex gap-2">
          <input
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            placeholder="Add essay prompt"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={savingEssay}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Add
          </button>
        </form>
      </section>
    </div>
  );
}
