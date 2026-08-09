"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Cycle } from "@/lib/types";

const applicationTypeLabels: Record<string, string> = {
  medical: "Medical school",
  law: "Law school",
  graduate_masters: "Graduate (Masters)",
  graduate_doctorate: "Graduate (Doctorate)",
};

export default function CycleSwitcher({
  cycles,
  defaultCycleId,
}: {
  cycles: Cycle[];
  defaultCycleId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCycleId = searchParams.get("cycle") ?? defaultCycleId;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === "__new__") {
      router.push("/dashboard/cycles/new");
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("cycle", value);
    router.push(`${window.location.pathname}?${params.toString()}`);
  }

  return (
    <select
      value={activeCycleId}
      onChange={handleChange}
      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
    >
      {cycles.map((c) => (
        <option key={c.id} value={c.id}>
          {(c.application_type && applicationTypeLabels[c.application_type]) || "Cycle"} · {c.cycle_year}
        </option>
      ))}
      <option value="__new__">+ Add cycle</option>
    </select>
  );
}
