"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ApplicationType } from "@/lib/types";

const examNameByType: Record<"medical" | "law" | "graduate", string> = {
  medical: "MCAT",
  law: "LSAT",
  graduate: "GRE",
};

const examRangeByType: Record<"medical" | "law" | "graduate", { min: number; max: number }> = {
  medical: { min: 472, max: 528 },
  law: { min: 120, max: 180 },
  graduate: { min: 260, max: 340 },
};

const gpaScaleOptions = [4.0, 5.0];

const CYCLE_START_YEAR = 2016;
const CYCLE_END_YEAR = 2126;
const cycleYearOptions = Array.from(
  { length: CYCLE_END_YEAR - CYCLE_START_YEAR + 1 },
  (_, i) => CYCLE_START_YEAR + i
).map((y) => `${y}-${y + 1}`);

export default function AddCycleForm() {
  const router = useRouter();
  const supabase = createClient();

  const [applyingTo, setApplyingTo] = useState<"medical" | "law" | "graduate" | "">("");
  const [graduateLevel, setGraduateLevel] = useState<"masters" | "doctorate" | "">("");
  const [examScore, setExamScore] = useState("");
  const [gpaScale, setGpaScale] = useState<"4.0" | "5.0" | "">("");
  const [gpa, setGpa] = useState("");
  const [majorGpa, setMajorGpa] = useState("");
  const [cycleYear, setCycleYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!applyingTo) {
      setError("Please select what you're applying to.");
      return;
    }

    if (applyingTo === "graduate" && !graduateLevel) {
      setError("Please select a graduate program level.");
      return;
    }

    if (!cycleYear) {
      setError("Please select an application cycle.");
      return;
    }

    if (examScore) {
      const range = examRangeByType[applyingTo as "medical" | "law" | "graduate"];
      const score = Number(examScore);
      if (!Number.isInteger(score) || score < range.min || score > range.max) {
        setError(
          `${examNameByType[applyingTo as "medical" | "law" | "graduate"]} score must be between ${range.min} and ${range.max}.`
        );
        return;
      }
    }

    if ((gpa || majorGpa) && !gpaScale) {
      setError("Please select a GPA scale.");
      return;
    }

    const scaleMax = Number(gpaScale);

    if (gpa) {
      const value = Number(gpa);
      if (Number.isNaN(value) || value < 0 || value > scaleMax) {
        setError(`GPA must be between 0 and ${gpaScale}.`);
        return;
      }
    }

    if (majorGpa) {
      const value = Number(majorGpa);
      if (Number.isNaN(value) || value < 0 || value > scaleMax) {
        setError(`Major GPA must be between 0 and ${gpaScale}.`);
        return;
      }
    }

    const applicationType: ApplicationType =
      applyingTo === "graduate"
        ? graduateLevel === "masters"
          ? "graduate_masters"
          : "graduate_doctorate"
        : applyingTo;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not signed in.");
      setLoading(false);
      return;
    }

    const cycleStartYear = Number(cycleYear.split("-")[0]);
    const cycleStartDate = `${cycleStartYear}-08-01`;

    const { data: cycle, error: cycleError } = await supabase
      .from("cycles")
      .insert({
        user_id: user.id,
        application_type: applicationType,
        cycle_year: cycleYear,
        cycle_start_date: cycleStartDate,
        gpa: gpa || null,
        gpa_scale: gpa || majorGpa ? gpaScale : null,
        major_gpa: majorGpa || null,
      })
      .select()
      .single();

    if (cycleError || !cycle) {
      setError(cycleError?.message ?? "Failed to create cycle.");
      setLoading(false);
      return;
    }

    if (examScore) {
      await supabase.from("exam_scores").insert({
        user_id: user.id,
        cycle_id: cycle.id,
        exam_name: examNameByType[applyingTo as "medical" | "law" | "graduate"],
        score: examScore,
      });
    }

    setLoading(false);
    router.push(`/dashboard?cycle=${cycle.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          What are you applying to? <span className="text-red-600">*</span>
        </label>
        <select
          required
          value={applyingTo}
          onChange={(e) => {
            const value = e.target.value as "medical" | "law" | "graduate" | "";
            setApplyingTo(value);
            if (value !== "graduate") {
              setGraduateLevel("");
            }
            setExamScore("");
          }}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="medical">Medical school</option>
          <option value="law">Law school</option>
          <option value="graduate">Graduate school</option>
        </select>
      </div>
      {applyingTo === "graduate" && (
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Program level <span className="text-red-600">*</span>
          </label>
          <select
            required
            value={graduateLevel}
            onChange={(e) => setGraduateLevel(e.target.value as "masters" | "doctorate" | "")}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="masters">Masters</option>
            <option value="doctorate">Doctorate</option>
          </select>
        </div>
      )}
      {applyingTo && (
        <div>
          <label className="block text-sm font-medium text-slate-700">
            {examNameByType[applyingTo]} score
          </label>
          <input
            type="number"
            step="1"
            min={examRangeByType[applyingTo].min}
            max={examRangeByType[applyingTo].max}
            value={examScore}
            onChange={(e) => setExamScore(e.target.value)}
            placeholder={`Optional (${examRangeByType[applyingTo].min}-${examRangeByType[applyingTo].max})`}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700">GPA scale</label>
        <select
          value={gpaScale}
          onChange={(e) => setGpaScale(e.target.value as "4.0" | "5.0" | "")}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="">Select a scale</option>
          {gpaScaleOptions.map((s) => (
            <option key={s} value={s.toFixed(1)}>
              {s.toFixed(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">GPA</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max={gpaScale || undefined}
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            placeholder="Optional"
            disabled={!gpaScale}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
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
            placeholder="Optional"
            disabled={!gpaScale}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Application cycle <span className="text-red-600">*</span>
        </label>
        <select
          required
          value={cycleYear}
          onChange={(e) => setCycleYear(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="" disabled>
            Select an option
          </option>
          {cycleYearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "Creating cycle..." : "Create cycle"}
      </button>
    </form>
  );
}
