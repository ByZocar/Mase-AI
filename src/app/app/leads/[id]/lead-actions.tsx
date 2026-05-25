"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Brain, Mic, MessageCircle, Mail, Send, Sparkles, AtSign } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Pill,
  Button,
  Spinner,
} from "@/components/ui";
import type { ChannelType } from "@/lib/types";

const CHANNEL_ICONS: Record<ChannelType, typeof Mic> = {
  whatsapp_voice: Mic,
  whatsapp_text: MessageCircle,
  email: Mail,
  linkedin_dm: AtSign,
  linkedin_voice: Mic,
  twitter_dm: MessageCircle,
  twitter_engage: MessageCircle,
};

const CHANNEL_LABELS: Record<ChannelType, string> = {
  whatsapp_voice: "WhatsApp Voice",
  whatsapp_text: "WhatsApp Text",
  email: "Email",
  linkedin_dm: "LinkedIn DM",
  linkedin_voice: "LinkedIn Voice",
  twitter_dm: "Twitter DM",
  twitter_engage: "Twitter Engage",
};

export function LeadActions({
  leadId,
  preferredChannels,
  isClassified,
}: {
  leadId: string;
  preferredChannels: ChannelType[];
  isClassified: boolean;
}) {
  const router = useRouter();
  const [classifying, setClassifying] = useState(false);
  const [generating, setGenerating] = useState<ChannelType | null>(null);
  const [latest, setLatest] = useState<{
    channel: ChannelType;
    body: string;
    voice_script?: string;
    audio_url?: string | null;
    reasoning: string;
    emotional_hook: string;
    cta: string;
    message_id: string;
  } | null>(null);
  const [sending, setSending] = useState(false);

  async function runClassify() {
    setClassifying(true);
    try {
      const r = await fetch(`/api/leads/${leadId}/classify`, {
        method: "POST",
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      toast.success("Lead clasificado y enriquecido");
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setClassifying(false);
    }
  }

  async function runGenerate(channel: ChannelType) {
    setGenerating(channel);
    try {
      const r = await fetch(`/api/leads/${leadId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          sequence_step: 1,
          voice_preset:
            channel === "whatsapp_voice" || channel === "linkedin_voice"
              ? "latam_female"
              : undefined,
        }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      setLatest({
        channel,
        body: j.personalized.body,
        voice_script: j.personalized.voice_script,
        audio_url: j.audio_url,
        reasoning: j.personalized.reasoning,
        emotional_hook: j.personalized.emotional_hook,
        cta: j.personalized.cta,
        message_id: j.message.id,
      });
      toast.success(`Mensaje generado para ${CHANNEL_LABELS[channel]}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setGenerating(null);
    }
  }

  async function sendNow() {
    if (!latest) return;
    setSending(true);
    try {
      const r = await fetch(`/api/messages/${latest.message_id}/send`, {
        method: "POST",
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      toast.success(j.result?.mocked ? "Enviado (modo simulado)" : "Mensaje enviado");
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  const channels: ChannelType[] =
    preferredChannels.length > 0
      ? preferredChannels.slice(0, 4)
      : ["whatsapp_voice", "linkedin_dm", "email"];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Acciones IA</CardTitle>
          <p className="text-[11px] text-[var(--muted)] mt-0.5">
            Genera y envía un mensaje personalizado por canal
          </p>
        </div>
        {!isClassified && (
          <Button
            onClick={runClassify}
            loading={classifying}
            variant="primary"
            size="sm"
          >
            <Brain size={13} /> Clasificar lead
          </Button>
        )}
        {isClassified && (
          <Button
            onClick={runClassify}
            loading={classifying}
            variant="ghost"
            size="sm"
          >
            <Brain size={13} /> Re-clasificar
          </Button>
        )}
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {channels.map((c) => {
            const Icon = CHANNEL_ICONS[c];
            const isGen = generating === c;
            return (
              <button
                key={c}
                onClick={() => runGenerate(c)}
                disabled={!!generating}
                className="flex flex-col items-center gap-1 p-3 rounded-md border border-[var(--border)] hover:border-indigo-500/50 hover:bg-indigo-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGen ? <Spinner /> : <Icon size={16} className="text-indigo-300" />}
                <span className="text-[11px]">{CHANNEL_LABELS[c]}</span>
              </button>
            );
          })}
        </div>

        {latest && (
          <div className="border border-indigo-500/30 rounded-md p-4 bg-indigo-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-300" />
                <span className="text-sm font-medium">
                  Mensaje generado · {CHANNEL_LABELS[latest.channel]}
                </span>
              </div>
              <Pill tone="info">{latest.emotional_hook}</Pill>
            </div>

            {latest.audio_url ? (
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
                  Voice note (ElevenLabs)
                </div>
                <audio
                  controls
                  src={latest.audio_url}
                  className="w-full h-10"
                />
                <details className="text-xs text-[var(--muted)]">
                  <summary className="cursor-pointer hover:text-white">
                    Ver guion
                  </summary>
                  <p className="mt-2 italic leading-relaxed">
                    {latest.voice_script}
                  </p>
                </details>
              </div>
            ) : (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">
                  Mensaje
                </div>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {latest.body}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-indigo-500/20">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-0.5">
                  CTA
                </div>
                <p className="text-xs">{latest.cta}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-0.5">
                  Por qué funciona
                </div>
                <p className="text-xs italic">{latest.reasoning}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setLatest(null)}>
                Descartar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={sendNow}
                loading={sending}
              >
                <Send size={13} /> Enviar ahora
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
