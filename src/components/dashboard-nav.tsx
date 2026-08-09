"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/schools", label: "Schools" },
  { href: "/dashboard/stats", label: "Stats" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default function DashboardNav({ defaultCycleId }: { defaultCycleId?: string }) {
  const searchParams = useSearchParams();
  const cycleId = searchParams.get("cycle") ?? defaultCycleId;
  const cycleQuery = cycleId ? `?cycle=${cycleId}` : "";

  return (
    <nav className="flex gap-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={`${item.href}${cycleQuery}`}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
