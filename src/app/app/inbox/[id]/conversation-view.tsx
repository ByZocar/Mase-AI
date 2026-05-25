"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send, UserCog, UserMinus, Sparkles } from "lucide-react";
import { Button, Card, CardBody, Pill } from "@/components/ui";
import { formatRelative } from "@/lib/utils";

type Message = {
  id: string;
  direction: "outbound" | "inbound";
  sender: "ai" | "human" | "lead";
  content?: string | null;
  audio_url?: string | null;
  llm_reasoning?: string | null;
  sent_at?: string | null;
  created_at: string;
};

type Conversation = {
  id: string;
  status: string;
  channel: string;
  leads: { id: string; full_name: string };
};

export function ConversationView({
  conversation,
  initialMessages,
}: {
  conversation: Conversation;
  initialMessages: Message[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [inboundDraft, setInboundDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [takeover, setTakeover] = useState(
    conversation.status === "human_takeover"
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function toggleTakeover() {
    const action = takeover ? "release" : "takeover";
    const r = await fetch(
      `/api/conversations/${conversation.id}/takeover`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      }
    );
    const j = await r.json();
    if (j.ok) {
      setTakeover(!takeover);
      toast.success(
        action === "takeover"
          ? "Has tomado control de la conversación"
          : "IA reanudada"
      );
      router.refresh();
    }
  }

  async function simulateInbound() {
    if (!inboundDraft.trim()) return;
    setGenerating(true);
    try {
      const r = await fetch(`/api/conversations/${conversation.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inbound_text: inboundDraft }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);

      setMessages((prev) => [
        ...prev,
        {
          id: `tmp_in_${Date.now()}`,
          direction: "inbound",
          sender: "lead",
          content: inboundDraft,
          created_at: new Date().toISOString(),
        },
        {
          id: j.message.id,
          direction: "outbound",
          sender: "ai",
          content: j.message.content,
          llm_reasoning: j.message.llm_reasoning,
          created_at: j.message.created_at,
        },
      ]);
      setInboundDraft("");
      toast.success("IA respondió");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  async function sendHuman() {
    if (!draft.trim()) return;
    setSending(true);
    try {
      const r = await fetch(`/api/conversations/${conversation.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ human_text: draft, skip_ai: true }),
      });
      void r;
      setMessages((prev) => [
        ...prev,
        {
          id: `tmp_h_${Date.now()}`,
          direction: "outbound",
          sender: "human",
          content: draft,
          created_at: new Date().toISOString(),
        },
      ]);
      setDraft("");
      toast.success("Enviado como humano");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 flex flex-col h-[70vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="text-sm font-medium">Hilo de conversación</div>
          <Button
            variant={takeover ? "danger" : "secondary"}
            size="sm"
            onClick={toggleTakeover}
          >
            {takeover ? (
              <>
                <UserMinus size={13} /> Soltar a IA
              </>
            ) : (
              <>
                <UserCog size={13} /> Tomar control
              </>
            )}
          </Button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-sm text-[var(--muted)] py-12">
              Sin mensajes aún.
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.direction === "outbound" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 border ${
                    m.direction === "outbound"
                      ? m.sender === "human"
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-indigo-500/10 border-indigo-500/30"
                      : "bg-white/[0.04] border-[var(--border)]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Pill
                      tone={
                        m.sender === "ai"
                          ? "violet"
                          : m.sender === "human"
                          ? "success"
                          : "info"
                      }
                    >
                      {m.sender.toUpperCase()}
                    </Pill>
                    <span className="text-[10px] text-[var(--muted)]">
                      {formatRelative(m.created_at)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {m.content}
                  </p>
                  {m.audio_url && (
                    <audio
                      controls
                      src={m.audio_url}
                      className="w-full mt-2 h-9"
                    />
                  )}
                  {m.llm_reasoning && (
                    <details className="mt-2">
                      <summary className="text-[10px] text-[var(--muted)] cursor-pointer hover:text-white">
                        Razonamiento IA
                      </summary>
                      <p className="text-[11px] text-[var(--muted)] italic mt-1 leading-relaxed">
                        {m.llm_reasoning}
                      </p>
                    </details>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-[var(--border)] p-3 space-y-2">
          {takeover ? (
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Escribe como humano..."
                className="flex-1 bg-[var(--panel)] border border-[var(--border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
              />
              <Button onClick={sendHuman} loading={sending} variant="primary">
                <Send size={13} /> Enviar
              </Button>
            </div>
          ) : (
            <p className="text-xs text-[var(--muted)] text-center py-2">
              IA está manejando esta conversación. Toma control para escribir tú.
            </p>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-indigo-300" />
              <span className="text-sm font-medium">Simular respuesta lead</span>
            </div>
            <p className="text-xs text-[var(--muted)] mb-3">
              Útil para probar cómo respondería la IA a un mensaje del lead.
            </p>
            <textarea
              value={inboundDraft}
              onChange={(e) => setInboundDraft(e.target.value)}
              placeholder="ej: Suena interesante pero no tengo presupuesto este trimestre"
              rows={3}
              className="w-full bg-[var(--panel)] border border-[var(--border)] rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-indigo-500/50"
            />
            <Button
              onClick={simulateInbound}
              loading={generating}
              variant="primary"
              size="sm"
              className="w-full mt-2"
            >
              <Sparkles size={13} /> Generar respuesta IA
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
