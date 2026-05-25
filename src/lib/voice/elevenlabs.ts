import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { supabaseAdmin } from "../supabase/admin";
import { nanoid } from "nanoid";

const apiKey = process.env.ELEVENLABS_API_KEY!;
if (!apiKey) {
  console.warn("ELEVENLABS_API_KEY not set");
}

export const elevenlabs = new ElevenLabsClient({ apiKey });

const DEFAULT_VOICE =
  process.env.ELEVENLABS_DEFAULT_VOICE_ID || "BXEoDUvSz0PGA1yx0mkm";
const DEFAULT_MODEL =
  process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

export type VoicePresetKey = "latam_male" | "latam_female" | "user_custom" | "default";

export const VOICE_PRESETS: Record<VoicePresetKey, string> = {
  user_custom: "BXEoDUvSz0PGA1yx0mkm",
  latam_male: "BXEoDUvSz0PGA1yx0mkm",
  latam_female: "EXAVITQu4vr4xnSDxMaL",
  default: DEFAULT_VOICE,
};

function preprocessForSpanishLATAM(text: string): string {
  let out = text;

  out = out.replace(/\b(\d{1,3})\s*%/g, "$1 por ciento");
  out = out.replace(/\bUSD?\$?\s*(\d[\d.,]*)/gi, "$1 dólares");
  out = out.replace(/\b\$\s*(\d[\d.,]*)/g, "$1 dólares");

  out = out.replace(/\bvs\.?\b/gi, "versus");
  out = out.replace(/\bROI\b/g, "retorno de inversión");
  out = out.replace(/\bSDR\b/g, "ese de erre");
  out = out.replace(/\bCAC\b/g, "ce a ce");
  out = out.replace(/\bCRM\b/g, "ce erre eme");
  out = out.replace(/\bCEO\b/g, "ce e o");
  out = out.replace(/\bCFO\b/g, "ce efe o");
  out = out.replace(/\bVP\b/g, "vipi");
  out = out.replace(/\bB2B\b/gi, "be a be");
  out = out.replace(/\bLATAM\b/gi, "latam");
  out = out.replace(/\bIA\b/g, "i a");
  out = out.replace(/\bAI\b/g, "ei ai");
  out = out.replace(/\bLLM\b/g, "ele ele eme");
  out = out.replace(/\bYC\b/g, "y combinator");

  out = out.replace(/—/g, ", ");
  out = out.replace(/—/g, ", ");
  out = out.replace(/\s+\.\s+/g, ". ");
  out = out.replace(/\.\s*\./g, ".");
  out = out.replace(/,\s*,/g, ",");

  out = out.replace(/([.!?])\s+/g, "$1 ... ");

  return out.trim();
}

export type VoiceQualityPreset = "ultra_realistic" | "balanced" | "fast";

const VOICE_SETTINGS: Record<
  VoiceQualityPreset,
  {
    stability: number;
    similarityBoost: number;
    style: number;
    useSpeakerBoost: boolean;
    speed?: number;
  }
> = {
  ultra_realistic: {
    stability: 0.38,
    similarityBoost: 0.88,
    style: 0.65,
    useSpeakerBoost: true,
    speed: 0.95,
  },
  balanced: {
    stability: 0.5,
    similarityBoost: 0.85,
    style: 0.55,
    useSpeakerBoost: true,
    speed: 1.0,
  },
  fast: {
    stability: 0.6,
    similarityBoost: 0.75,
    style: 0.3,
    useSpeakerBoost: true,
    speed: 1.05,
  },
};

export async function generateVoiceNote(opts: {
  text: string;
  voicePreset?: VoicePresetKey;
  voiceId?: string;
  modelId?: string;
  qualityPreset?: VoiceQualityPreset;
  leadId?: string;
  preprocess?: boolean;
}): Promise<{
  audioUrl: string;
  durationSec?: number;
  storagePath: string;
  voiceId: string;
  modelId: string;
}> {
  const voiceId =
    opts.voiceId || VOICE_PRESETS[opts.voicePreset || "user_custom"];
  const modelId = opts.modelId || DEFAULT_MODEL;
  const settings = VOICE_SETTINGS[opts.qualityPreset || "ultra_realistic"];

  const finalText =
    opts.preprocess !== false ? preprocessForSpanishLATAM(opts.text) : opts.text;

  const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
    text: finalText,
    modelId,
    outputFormat: "mp3_44100_192",
    voiceSettings: {
      stability: settings.stability,
      similarityBoost: settings.similarityBoost,
      style: settings.style,
      useSpeakerBoost: settings.useSpeakerBoost,
      speed: settings.speed,
    },
    languageCode: "es",
    applyTextNormalization: "on",
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream as unknown as AsyncIterable<Uint8Array>) {
    chunks.push(Buffer.from(chunk));
  }
  const audioBuffer = Buffer.concat(chunks);

  const fileName = `${opts.leadId || "anon"}/${Date.now()}-${nanoid(8)}.mp3`;

  const { error: upErr } = await supabaseAdmin.storage
    .from("voice-notes")
    .upload(fileName, audioBuffer, {
      contentType: "audio/mpeg",
      upsert: false,
    });

  if (upErr) {
    throw new Error(`Failed to upload voice note: ${upErr.message}`);
  }

  const { data: pubUrl } = supabaseAdmin.storage
    .from("voice-notes")
    .getPublicUrl(fileName);

  const estimatedDuration = Math.round((finalText.length / 14) * 1.0);

  if (opts.leadId) {
    await supabaseAdmin.from("voice_generations").insert({
      lead_id: opts.leadId,
      script: opts.text,
      voice_id: voiceId,
      audio_url: pubUrl.publicUrl,
      duration_seconds: estimatedDuration,
    });
  }

  return {
    audioUrl: pubUrl.publicUrl,
    durationSec: estimatedDuration,
    storagePath: fileName,
    voiceId,
    modelId,
  };
}
