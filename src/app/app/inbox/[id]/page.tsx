import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader, Card, CardBody, Pill } from "@/components/ui";
import { CHANNEL_LABELS, type ChannelType } from "@/lib/types";
import { ConversationView } from "./conversation-view";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: conv, error } = await supabaseAdmin
    .from("conversations")
    .select("*, leads(*)")
    .eq("id", id)
    .single();

  if (error || !conv) notFound();

  const { data: messages } = await supabaseAdmin
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  return (
    <>
      <PageHeader
        title={(conv.leads as { full_name: string }).full_name}
        subtitle={`${CHANNEL_LABELS[conv.channel as ChannelType]} · ${
          (conv.leads as { role?: string }).role || ""
        } · ${(conv.leads as { company_name?: string }).company_name || ""}`}
        actions={
          <Pill
            tone={
              conv.status === "human_takeover"
                ? "warning"
                : conv.status === "active"
                ? "info"
                : "default"
            }
          >
            {conv.status}
          </Pill>
        }
      />

      <div className="p-8">
        <ConversationView
          conversation={conv}
          initialMessages={messages || []}
        />
      </div>
    </>
  );
}
