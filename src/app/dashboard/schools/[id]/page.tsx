import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { School, Secondary, Interview, EssayPrompt } from "@/lib/types";
import SchoolDetailPanel from "@/components/school-detail-panel";

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: school }, { data: secondary }, { data: interview }, { data: essays }] =
    await Promise.all([
      supabase.from("schools").select("*").eq("id", id).single(),
      supabase.from("secondaries").select("*").eq("school_id", id).maybeSingle(),
      supabase.from("interviews").select("*").eq("school_id", id).maybeSingle(),
      supabase.from("essay_prompts").select("*").eq("school_id", id).order("created_at"),
    ]);

  if (!school) {
    notFound();
  }

  return (
    <SchoolDetailPanel
      school={school as School}
      secondary={secondary as Secondary | null}
      interview={interview as Interview | null}
      essays={(essays ?? []) as EssayPrompt[]}
    />
  );
}
