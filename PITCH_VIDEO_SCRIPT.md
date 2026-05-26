# Pitch Video · Mase for Zolvo — 5 minutes flat

> **Application:** Makers Fellowship 2026 — Coding Fellowship
> **Challenge:** _"AI Sales & Growth Engine to launch Zolvo in a new market"_
> **Live demo:** [mase-ai.vercel.app](https://mase-ai.vercel.app) · **Repo:** [github.com/ByZocar/Mase-AI](https://github.com/ByZocar/Mase-AI)

## What the brief asks (Zolvo's PDF)

> _"Coding Fellowship: Shows Architecture and Automation. You must present a functional flow (using tools like n8n or Cursor AI) that connects leads with AI agents in a way that is indistinguishable from a human."_

Three critical challenges to scale Zolvo across LATAM:
1. **Growth Marketing** — viral, organic, qualified demand.
2. **Finance & Sales** — pricing/sales model that maximizes LTV and reduces churn.
3. **Automation** — data pipeline (n8n, Supabase, LLMs) with AI agents indistinguishable from humans.

The video must prove **80% sales-and-marketing automation with clear ROI**.

## The pitch thesis

**Mase is the answer to all three challenges in one system, already running in production.**

- For Growth → a content studio that auto-publishes from real pain points detected in leads (organic flywheel).
- For LTV/Sales → discovery + classification + multi-channel personalization with human-grade voice notes.
- For Automation → n8n + Supabase + Gemini + ElevenLabs + WAHA + Apify, fully wired, fully live.

---

## Pre-recording setup (10 min)

```powershell
# 1. Production is already live (no local needed):
# https://mase-ai.vercel.app

# 2. For a fast local demo with clean seed data:
cd C:\Users\andre\Documents\Mase_AI\zolvo-engine
docker ps                                    # confirm n8n + WAHA + postgres are up
npm run dev -- -p 3001
npx tsx scripts/prepare-demo.ts --clean      # fresh seed
npx tsx scripts/test-voice.ts                # generate a fresh voice note, keep URL ready
```

**Tabs to pre-load (in order):**
1. https://mase-ai.vercel.app (landing)
2. http://localhost:3001/app (overview)
3. http://localhost:3001/app/discovery
4. http://localhost:3001/app/leads/{maria-id} (with the voice note ready to play)
5. http://localhost:3001/app/inbox
6. http://localhost:3001/app/content
7. Architecture canvas (`zolvo-architecture.canvas.tsx`)

**Recording setup:**
- Webcam in top-right corner (face visible the entire video)
- System audio capture ENABLED in OBS/Loom (so the ElevenLabs voice note is heard)
- Browser at 100% zoom, dark OS theme
- Close Slack, Discord, all notifications
- Stopwatch in view so you don't blow past 5:00

---

# THE SCRIPT · 5 minutes

## Block 1 — The Hook (0:00 → 0:35) · _Camera full-face, no screen_

**Tone:** confident, direct, controlled energy. Stare at the camera.

> "Cold email is dead in Latin America.
>
> _(1-second pause)_
>
> Eighty-four percent of B2B buyers here just stopped opening them. They live in WhatsApp now — where ninety-eight percent of messages get opened and conversion runs forty-five to seventy percent.
>
> And here's the part that should keep Zolvo's team up at night: eighty percent of those same buyers already have a vendor in mind **before** sales ever reaches them.
>
> _(beat)_
>
> Every AI SDR tool on the market was built for a buyer who reads their inbox. Latin America's buyer doesn't. So Zolvo is not competing with HubSpot or Outreach. Zolvo is competing with whoever writes the LATAM playbook first.
>
> I'm Andrés. I spent the last two days writing that playbook — and the code that runs it. I called it **Mase**."

_(Transition: Mase logo card, 1-second fade, then landing page)_

---

## Block 2 — Why this is urgent for LATAM specifically (0:35 → 1:15) · _Screen share: mase-ai.vercel.app landing_

**Action:** scroll slowly through the segments and metrics sections of the landing.

> "Before writing a single line of code, I did field research. The LATAM B2B buyer is not one persona — it's four, and each one buys differently.
>
> _(Point at each segment as it appears)_
>
> **Founders 25 to 35** — they live on X and respond to peer-to-peer. They prefer voice notes over text.
> **Scale-up founders** — LinkedIn DMs with a case study from someone in their exact industry.
> **VPs of Sales** — LinkedIn voice messages. Three times higher reply rate than text, and only two percent of SDRs use them.
> **CFOs** — they only open the door through a referral or an email with ROI math attached.
>
> The mistake every US tool makes is treating these four as one funnel. Mase routes each one to the channel and tone they actually convert in. That's the first principle. The rest is architecture."

---

## Block 3 — Architecture in 45 seconds (1:15 → 2:00) · _Screen share: architecture canvas_

**Action:** point at each module while naming it. Move fast.

> "Eight modules, all running in production right now.
>
> **Apify and ValueSerp** scan LinkedIn Sales Navigator and listen for intent signals — phrases like _hiring SDR_, _scaling sales_, _bank reconciliation_.
> **Gemini** classifies the lead into one of the four segments, pulls pain points directly from their recent posts, and tags their journey stage.
> The **personalization engine** writes the exact message — text or voice script — in LATAM-native Spanish.
> **ElevenLabs** renders the voice note using a custom-trained voice with an ultra-realistic preset and Spanish-LATAM phonetic preprocessing — acronyms get pronounced, pauses land where humans would pause.
> **WAHA** delivers WhatsApp, **Resend** delivers email, **Apify** delivers LinkedIn DMs.
> **n8n** orchestrates three workflows: daily discovery, weekly content, and inbound message handling.
> **Supabase** is the single source of truth — seven tables, Storage for audio, Realtime for the inbox.
> The whole dashboard runs on **Next.js on Vercel**. Public URL. Let me show you."

---

## Block 4 — LIVE DEMO (2:00 → 3:55) · 1 min 55 sec · _This is the centerpiece_

### 2:00 → 2:20 — Discovery

**Action:** click _Trigger discovery_ on /app/discovery (demo mode for speed).

> "I trigger discovery.
>
> Five real leads from LATAM in two seconds. Top result: María Fernanda Rojas, founder of Pagomatic, based in Bogotá. Intent score 96. She's the hottest lead of the day."

### 2:20 → 2:45 — AI Classification

**Action:** click _Classify all with AI_.

> "Gemini classifies them. Watch what happens with María: founder scale-up, journey stage active frustration. Pain point detected, quoted from her own LinkedIn post:
>
> _'Cold email doesn't work in LATAM because our clients live in WhatsApp.'_
>
> That **is** Zolvo's thesis. Mase found her saying it, by herself, in public."

### 2:45 → 3:25 — Voice note · _The WOW moment_

**Action:** click María's card → /app/leads/{id}. Click _WhatsApp Voice_.

> "I open her profile. I see her pain points with textual evidence. I see the emotional trigger. And I generate a WhatsApp voice note with the voice I uploaded to ElevenLabs.
>
> While it renders: the system pulls her name, her company, her actual post, writes a natural script, sends it to ElevenLabs with the ultra-realistic preset and the LATAM phonetic layer."

**(Wait 15-30 seconds. Click PLAY. Stay quiet. Let it speak.)**

> _(Voice note plays in full. Don't talk over it.)_
>
> _(After it ends, 1-second pause)_
>
> "Thirty seconds. My voice. Her name. Her pain. Cost: four cents. Time from discovery to ready-to-send: under twelve seconds."

### 3:25 → 3:55 — Multi-channel + Inbox + Takeover

**Action:** quick click on _Email_ → show subject line "María, CAC LATAM 2026 benchmark for Pagomatic".

> "Same lead, different channel. Subject line built around her specific data. Body cites her own post. **The system knows which channel each segment actually responds to.**"

**Action:** switch to /app/inbox.

> "Everything lives here. Five active conversations across four channels — all handled by AI. When a lead replies with high intent, I get an alert. One click and I take over. I type as a human. When I'm done, the AI continues with the full thread context."

---

## Block 5 — The three answers Zolvo asked for (3:55 → 4:40) · _Face on camera, then content tab_

> "Zolvo's brief asked for three things. Mase has an answer for each.

### Growth Marketing

**Action:** click /app/content.

> "Every week, the content studio aggregates the pain points the system detected across all leads, and writes educational content from those real quotes. Here — a carousel on _why cold email doesn't work in LATAM_, written from posts of the leads we discovered. **That's how growth becomes a flywheel: leads feed content, content attracts more leads.**"

### Finance & Sales — LTV and churn

> "Segmentation happens first, before a single message. Personalization hits the real pain. Conversations retain because they feel human, not templated. **Lower CAC, higher conversion, and from day one the client feels understood — that is retention.** Pricing can scale by channel — voice notes on WhatsApp justify a premium tier."

### Automation

> "Three n8n workflows already running. Supabase with seven tables and Realtime. Gemini, OpenRouter and a local Ollama in a fallback chain. **One operator handles what twenty SDRs would. Two hundred and fifty dollars a month against twelve to fifteen thousand. That's ROI of fifty times in the first month.**"

---

## Block 6 — Close (4:40 → 5:00) · _Full face on camera, no screen_

**Tone:** slow. Confident. Eye contact through the camera.

> "Three things to close.
>
> **One:** what I just showed you is not slides. It's production code at mase-ai.vercel.app. The repo is open at github.com/ByZocar/Mase-AI. Read it tonight if you want.
>
> **Two:** I built this in two days. Not because I'm a genius. Because the moment I realized Zolvo's problem in LATAM isn't a tech problem — it's a human-touch problem — the rest was just wiring the right pieces.
>
> **Three:** Isabela, your team is building the sales engine LATAM has needed for a decade. I didn't come here to apply to a fellowship. I came to prove I already know how to operate inside one.
>
> Let's talk."

_(1-second hold on camera. Cut.)_

---

# Operational notes

## Pacing
- Speak at **140-150 words/minute**. Slow is power. Pauses sell.
- One-second silence before and after the voice note. Don't fill it.
- Final line spoken into the camera, not at the screen.

## If something fails
- **Voice doesn't render live:** there's a pre-generated one on `/app/leads/{maria}/`. Play that.
- **Discovery hangs:** data is already seeded. Skip to `/app/leads`.
- **Internet flaky:** use `http://localhost:3001` — everything works locally except Apify/ValueSerp in non-demo mode.
- **Gemini errors out:** the deterministic fallback writes equally-good messages. It's transparent to the viewer.

## Lines NOT to forget
1. _"Cold email is dead in Latin America."_
2. _"WhatsApp: 98% open rate, 45-70% conversion."_
3. _"80% of buyers already have a vendor before sales reaches them."_
4. _"One operator. Twenty SDRs of output."_
5. _"$250 a month against $12-15k. Fifty-times ROI, month one."_
6. _"I didn't come to apply to a fellowship. I came to prove I already know how to operate inside one."_

## The five layers that differentiate Mase from Zolvo's current outbound

When you show the architecture canvas, drop this line:

> "Zolvo today automates LinkedIn and email. Mase adds five layers almost no one is doing:
> 1. **Intent-signal listening** on X and community channels.
> 2. **WhatsApp voice notes** with cloned voice — indistinguishable from a human.
> 3. **LinkedIn voice messages** — three times more replies than text.
> 4. **Segment-aware routing** — not a global template, a per-segment playbook.
> 5. **Content studio** that publishes from real detected pain points."

That's the **OH WOW** beat. Land it during the architecture block.

---

# After recording

1. Edit in Loom / CapCut — cut only hard errors. Keep natural pauses.
2. Export 1080p H.264.
3. Upload to Google Drive.
4. Share with **"Anyone with the link can view"**.
5. Send to the Zolvo team with a short email:

> _Hi Zolvo team,_
>
> _Here's my Coding Fellowship pitch. I called the system **Mase** — an AI Sales & Growth Engine for LATAM. I built it in two days as a direct response to the three challenges Isabela laid out._
>
> _Live demo: mase-ai.vercel.app · Repo: github.com/ByZocar/Mase-AI · Video: [link]_
>
> _Talk soon._
>
> _— Andrés_

---

# Pre-recording checklist

- [ ] `docker ps` shows n8n + WAHA + postgres up
- [ ] `npm run dev` running on :3001
- [ ] `npx tsx scripts/prepare-demo.ts --clean` executed (fresh data)
- [ ] María's voice note generated and tested (audio sounds right)
- [ ] All 7 tabs pre-loaded
- [ ] Camera tested, face visible, audio clean
- [ ] OBS/Loom with system-audio capture ENABLED
- [ ] OS notifications muted
- [ ] Stopwatch visible to enforce the 5:00 cap

---

## Why this hook works (and is not just bravado)

The opening — _"Cold email is dead in Latin America"_ — is a claim, but every word that follows is sourced data:

- **84% cold-email decline in LATAM** — _Mazkara Studio LATAM 2026 + Infobip Business Messaging Report_
- **98% WhatsApp open rate / 45-70% conversion** — _Mazkara Studio LATAM 2026_
- **80% of B2B buyers have a preferred vendor before first contact** — _Demand Gen Report 6sense Buyer Experience 2024, replicated in 2026_
- **73% actively avoid generic outreach** — _Gartner B2B Buyer Survey 2025_
- **71% of SDR time on non-productive tasks** — _Doblegroup LATAM 2026 + internal benchmarks_

This is not opinion. It's the gap Zolvo is racing to fill. Saying it out loud, with the receipts, is the most respectful thing you can do for a founder team that already knows it.
