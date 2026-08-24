"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isPasswordStrong, passwordRequirements } from "@/lib/password";
import type { ApplicationType } from "@/lib/types";

type ApplyingTo = "medical" | "law" | "graduate" | "";

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

const STEP_LABELS = ["Name", "Account", "Cycle type", "GPA", "Scores", "Cycle year"];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 0: name
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Step 1: account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: cycle type
  const [applyingTo, setApplyingTo] = useState<ApplyingTo>("");
  const [graduateLevel, setGraduateLevel] = useState<"masters" | "doctorate" | "">("");

  // Step 3: GPA
  const [gpaScale, setGpaScale] = useState<"4.0" | "5.0" | "">("");
  const [gpa, setGpa] = useState("");
  const [majorGpa, setMajorGpa] = useState("");

  // Step 4: scores
  const [examScore, setExamScore] = useState("");

  // Step 5: cycle year
  const [cycleYear, setCycleYear] = useState("");

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const passwordStrong = isPasswordStrong(password);

  function goNext() {
    setError(null);

    if (step === 0) {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Please enter your first and last name.");
        return;
      }
    }

    if (step === 2) {
      if (!applyingTo) {
        setError("Please select what you're applying to.");
        return;
      }
      if (applyingTo === "graduate" && !graduateLevel) {
        setError("Please select a graduate program level.");
        return;
      }
    }

    if (step === 3) {
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
    }

    if (step === 4 && examScore && applyingTo) {
      const range = examRangeByType[applyingTo as "medical" | "law" | "graduate"];
      const score = Number(examScore);
      if (!Number.isInteger(score) || score < range.min || score > range.max) {
        setError(
          `${examNameByType[applyingTo as "medical" | "law" | "graduate"]} score must be between ${range.min} and ${range.max}.`
        );
        return;
      }
    }

    setStep((s) => s + 1);
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleCreateAccount() {
    setError(null);

    if (!passwordStrong) {
      setError("Password does not meet the security requirements below.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      console.error("Signup failed:", signUpError);
      setError(
        signUpError.message ||
          `Signup failed (${signUpError.status ?? "unknown"}). Check the console for details.`
      );
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    goNext();
  }

  async function handleFinish() {
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not signed in.");
      setLoading(false);
      return;
    }

    const applicationType: ApplicationType | null = !applyingTo
      ? null
      : applyingTo === "graduate"
      ? graduateLevel === "masters"
        ? "graduate_masters"
        : "graduate_doctorate"
      : applyingTo;

    const cycleStartYear = cycleYear ? Number(cycleYear.split("-")[0]) : null;
    const cycleStartDate = cycleStartYear ? `${cycleStartYear}-08-01` : null;

    const { data: cycle, error: cycleError } = await supabase
      .from("cycles")
      .insert({
        user_id: user.id,
        application_type: applicationType,
        cycle_year: cycleYear || "unspecified",
        cycle_start_date: cycleStartDate ?? new Date().toISOString().slice(0, 10),
        gpa: gpa || null,
        gpa_scale: gpa || majorGpa ? gpaScale : null,
        major_gpa: majorGpa || null,
      })
      .select()
      .single();

    if (cycleError || !cycle) {
      setError(cycleError?.message ?? "Failed to create your cycle.");
      setLoading(false);
      return;
    }

    if (examScore && applyingTo) {
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

  const isAccountStep = step === 1;
  const isFinalStep = step === STEP_LABELS.length - 1;

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between text-xs font-medium text-slate-400">
        <span>
          Step {step + 1} of {STEP_LABELS.length}: {STEP_LABELS[step]}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all"
          style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }}
        />
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              First name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Last name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 pr-16 text-sm focus:border-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {passwordRequirements.map((req) => {
                const met = req.test(password);
                return (
                  <li
                    key={req.label}
                    className={`flex items-center gap-1.5 text-xs ${
                      met ? "text-green-600" : "text-slate-400"
                    }`}
                  >
                    <span>{met ? "✓" : "○"}</span>
                    {req.label}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm password</label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={12}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 pr-16 text-sm focus:border-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              What are you applying to? <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={applyingTo}
              onChange={(e) => {
                const value = e.target.value as ApplyingTo;
                setApplyingTo(value);
                if (value !== "graduate") setGraduateLevel("");
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
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
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
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          {applyingTo ? (
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
          ) : (
            <p className="text-sm text-slate-500">No score needed yet.</p>
          )}
        </div>
      )}

      {step === 5 && (
        <div>
          <label className="block text-sm font-medium text-slate-700">Application cycle</label>
          <select
            value={cycleYear}
            onChange={(e) => setCycleYear(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            <option value="">Optional</option>
            {cycleYearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500">
            You can add the schools you&apos;re applying to from your dashboard once you&apos;re
            in.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2 pt-2">
        {step > 0 && !isAccountStep && (
          <button
            type="button"
            onClick={goBack}
            disabled={loading}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Back
          </button>
        )}

        {isAccountStep ? (
          <button
            type="button"
            onClick={handleCreateAccount}
            disabled={loading}
            className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        ) : isFinalStep ? (
          <button
            type="button"
            onClick={handleFinish}
            disabled={loading}
            className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Finishing up..." : "Finish"}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Continue
          </button>
        )}
      </div>

      {step === 0 && (
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-slate-900 underline">
            Log in
          </Link>
        </p>
      )}

      {isAccountStep && (
        <p className="text-center text-xs text-slate-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="font-medium text-slate-900 underline">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-slate-900 underline">
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </div>
  );
}
