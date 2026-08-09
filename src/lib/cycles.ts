import type { SupabaseClient } from "@supabase/supabase-js";
import type { Cycle } from "@/lib/types";

export function getActiveCycle(cycles: Cycle[]): Cycle | null {
  if (cycles.length === 0) return null;

  const today = Date.now();
  const past = cycles.filter((c) => new Date(c.cycle_start_date).getTime() <= today);
  if (past.length > 0) {
    return past.reduce((latest, c) =>
      new Date(c.cycle_start_date) > new Date(latest.cycle_start_date) ? c : latest
    );
  }

  return cycles.reduce((soonest, c) =>
    new Date(c.cycle_start_date) < new Date(soonest.cycle_start_date) ? c : soonest
  );
}

export async function resolveCycle(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  userId: string,
  requestedCycleId?: string
): Promise<Cycle | null> {
  const { data } = await supabase
    .from("cycles")
    .select("*")
    .eq("user_id", userId)
    .order("cycle_start_date", { ascending: true });

  const cycles = (data ?? []) as Cycle[];
  const requested = cycles.find((c) => c.id === requestedCycleId);
  return requested ?? getActiveCycle(cycles);
}
