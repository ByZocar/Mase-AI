import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui";
import { ContentClient } from "./content-client";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const { data: posts } = await supabaseAdmin
    .from("content_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: pains } = await supabaseAdmin
    .from("pain_points_library")
    .select("pain_point, segment, frequency_count")
    .order("last_seen_at", { ascending: false })
    .limit(20);

  return (
    <>
      <PageHeader
        title="Content Studio"
        subtitle="Genera contenido educativo basado en los dolores reales detectados en tus leads"
      />
      <div className="p-8">
        <ContentClient initialPosts={posts || []} pains={pains || []} />
      </div>
    </>
  );
}
