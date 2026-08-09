import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveCycle } from "@/lib/cycles";
import type { Cycle } from "@/lib/types";
import LogoutButton from "@/components/logout-button";
import CycleSwitcher from "@/components/cycle-switcher";
import DashboardNav from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: cyclesData } = await supabase
    .from("cycles")
    .select("*")
    .eq("user_id", user.id)
    .order("cycle_start_date", { ascending: true });

  const cycles = (cyclesData ?? []) as Cycle[];
  const defaultCycle = getActiveCycle(cycles);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
              simplecycle
            </Link>
            <DashboardNav defaultCycleId={defaultCycle?.id} />
          </div>
          <div className="flex items-center gap-3">
            {cycles.length > 0 && defaultCycle && (
              <CycleSwitcher cycles={cycles} defaultCycleId={defaultCycle.id} />
            )}
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
