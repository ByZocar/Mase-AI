# Mase

**Ventas con tacto humano para LATAM.**

Mase es un AI Sales & Growth Engine que combina lead discovery (Apify + ValueSerp), clasificación con IA (Gemini), personalización multi-canal (LinkedIn, WhatsApp, Email, Twitter/X), voice notes hiperpersonalizados en español LATAM (ElevenLabs), conversation manager con takeover humano y generación automática de contenido educativo basado en dolores reales.

Una sola persona puede operar lo que normalmente requiere un equipo de veinte SDRs.

> **Slogan oficial:** _Ventas con tacto humano._

---

## Demo en vivo

- **Landing:** `/`
- **Dashboard:** `/app`
- **Discovery (lead scouting):** `/app/discovery`
- **Inbox unificado:** `/app/inbox`
- **Content Studio:** `/app/content`

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind v4 |
| Identidad visual | Paleta Mase (taupe / grey-olive / silver / parchment / powder-blush) — sin glass, colores sólidos |
| Database | Supabase (Postgres + Storage + Realtime) |
| LLM primario | Google Gemini (`gemini-2.0-flash-exp`) |
| LLM fallback | OpenRouter (Claude / GPT-4o) + Ollama local (`llama3:8b`) |
| Voice | ElevenLabs `eleven_multilingual_v2` con voice ID personalizado y preset **ultra-realistic** (stability 0.38, similarity 0.88, style 0.65, speed 0.95, speaker boost on, preprocessing español LATAM) |
| Scraping | Apify (LinkedIn Sales Navigator) + ValueSerp (SERP + news) |
| Channels | Resend (email) + WAHA (WhatsApp) + Apify (LinkedIn DM) |
| Orquestación | n8n self-hosted (Docker) |
| Deploy | Vercel |

---

## Quick start

```bash
git clone https://github.com/ByZocar/Mase-AI.git
cd Mase-AI/zolvo-engine

# 1. Instalar dependencias
npm install

# 2. Copiar y rellenar variables de entorno
cp .env.example .env.local

# 3. Aplicar schema de DB (una sola vez)
npx tsx scripts/migrate.ts

# 4. (Opcional) Levantar orquestador n8n + WhatsApp WAHA
docker compose up -d

# 5. Correr dashboard
npm run dev -- -p 3001

# 6. Poblar data demo (opcional)
npx tsx scripts/prepare-demo.ts --clean

# 7. Abrir http://localhost:3001
```

---

## Arquitectura — 8 módulos

1. **Discovery Engine** (`/api/leads/discover`) — Apify + ValueSerp + scoring inicial.
2. **Enrichment Pipeline** — perfil + empresa + señales en redes.
3. **Segmentation Classifier** (`/api/leads/[id]/classify`) — 4 perfiles, journey stage, pain points con evidencia.
4. **Personalization Engine** (`/api/leads/[id]/generate`) — mensaje por canal y segmento.
5. **Voice Generation** — ElevenLabs con voice custom + preset ultra-realistic + preprocessing para español LATAM.
6. **Multi-Channel Sender** (`/api/messages/[id]/send`) — WhatsApp, Email, LinkedIn.
7. **Conversation Manager** (`/api/conversations/[id]/reply`, `/takeover`) — autoreply + handoff humano.
8. **Content Studio** (`/api/content/generate`) — contenido educativo generado de los dolores detectados.

## Workflows n8n

En `n8n/workflows/`:

- `01-discovery-daily.json` — cron diario discovery + classify + first-touch.
- `02-content-weekly.json` — cron lunes 8am, genera 3 piezas educativas.
- `03-whatsapp-inbound.json` — webhook desde WAHA hacia el backend.

Importarlos en `http://localhost:5678` (n8n) con credenciales `mase / mase_n8n_2026` (cambiar después de primer arranque).

## WhatsApp setup (WAHA)

1. `docker compose up -d waha`
2. Abrir `http://localhost:3030`
3. Crear sesión `default`, escanear QR con WhatsApp
4. Configurar webhook hacia `http://host.docker.internal:3001/api/webhooks/whatsapp`
5. Listo — el sistema envía y responde automáticamente

## Voz avanzada con ElevenLabs

El motor de voz usa el modelo `eleven_multilingual_v2` con preset **ultra-realistic** para máxima fidelidad:

```ts
{
  stability: 0.38,      // bajo → más expresivo, más acento
  similarityBoost: 0.88,// alto → mantiene la voz del clone
  style: 0.65,          // alto → mayor expresividad emocional
  useSpeakerBoost: true,
  speed: 0.95,          // ligeramente más lento → más natural en LATAM
  language_code: "es",
  apply_text_normalization: "on"
}
```

Además aplica **preprocessing de español LATAM** antes de sintetizar:
- Siglas → fonética (`CAC` → "ce a ce", `SDR` → "ese de erre", `CFO` → "ce efe o")
- Números con `%` → "por ciento"
- Pausas (`...`) automáticas entre oraciones para entonación natural
- Em-dashes y signos múltiples → comas

Voice ID por defecto: `BXEoDUvSz0PGA1yx0mkm` (voz custom del usuario, masculina LATAM).

## Modo demo vs real

- **Discovery**: si `useDemoData=true`, usa 5 perfiles seed reales de LATAM. Si no, llama Apify.
- **LLM**: primary Gemini → fallback OpenRouter → fallback Ollama local → fallback determinístico.
- **Voice**: ElevenLabs siempre real.
- **Send**: WhatsApp/Email son reales si las claves están configuradas; mockean si no.

## Estructura

```
zolvo-engine/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing pública
│   │   ├── layout.tsx             # Root (Mase brand)
│   │   ├── globals.css            # Paleta Mase
│   │   ├── app/                   # Dashboard
│   │   │   ├── layout.tsx         # Sidebar wrapper
│   │   │   ├── page.tsx           # Overview
│   │   │   ├── discovery/
│   │   │   ├── leads/             # list + detail
│   │   │   ├── inbox/             # unified inbox + conversation
│   │   │   ├── content/           # Content studio
│   │   │   ├── campaigns/
│   │   │   ├── activity/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── leads/             # discover, classify, generate
│   │       ├── messages/[id]/send
│   │       ├── conversations/[id]/reply, takeover
│   │       ├── content/generate
│   │       └── webhooks/whatsapp
│   ├── components/
│   │   ├── mase-logo.tsx          # SVG logo (default | mark | light)
│   │   ├── sidebar.tsx
│   │   └── ui.tsx                 # Card / Button / Pill / Stat (Mase palette)
│   └── lib/
│       ├── supabase/              # admin + browser clients
│       ├── ai/                    # Gemini + OpenRouter + Ollama + deterministic fallback
│       ├── voice/                 # ElevenLabs (preset ultra-realistic)
│       ├── scraping/              # Apify, ValueSerp
│       ├── channels/              # Email, WhatsApp
│       └── modules/               # discovery, content
├── supabase/migrations/           # SQL schema
├── n8n/workflows/                 # JSON workflows
├── scripts/                       # migrate, seed-demo, prepare-demo, smoke-test, test-voice
├── docker-compose.yml             # n8n + WAHA + postgres
├── .env.example                   # template (commit)
└── .env.local                     # secrets (gitignored)
```

## Brand · Mase

**Paleta:** taupe `#463f3a`, grey-olive `#8a817c`, silver `#bcb8b1`, parchment `#f4f3ee`, powder-blush `#e0afa0`.

**Tipografía:** Geist Sans para UI · serif del sistema para titulares (mase-headline).

**Logo:** mark cuadrado con la letra `M` estilizada en taupe + acento powder-blush.

**Tono:** serio, cálido, refinado. Nada de glass, gradientes ni neón. Colores sólidos.

---

## Roadmap

- [x] Brand Mase aplicada en todas las vistas
- [x] Landing page con hero, segmentos, métricas, CTA
- [x] Voice ultra-realistic con preprocessing español LATAM
- [x] Gemini como LLM primario
- [x] Deploy en Vercel
- [ ] Conectar key de opencode (reemplazar Gemini temporal)
- [ ] Twitter/X listener para señales de intención en vivo
- [ ] LinkedIn DM real via Apify
- [ ] Programa de referidos para canales CFO

---

Construido para el Maker Fellowship 2026 · Zolvo Challenge.
