# Visual Storyboard · Mase Pitch · 5:00

Companion to `PITCH_VIDEO_SCRIPT.md`. Tells you **exactly what to show** at each second.

## Camera mode legend

- **FULL FACE** — webcam fills the frame, no screen share. Used for hook and close.
- **PIP** — picture-in-picture: screen share full, webcam in top-right corner (~20% of screen). Used during demo.
- **SCREEN** — full-screen share, webcam tiny or hidden. Used only for fast architecture/content scrolls.

## Tabs pinned in browser (in this order, left to right)

| # | Tab | URL |
|---|-----|-----|
| 1 | Landing | https://mase-ai.vercel.app |
| 2 | Architecture canvas | open `zolvo-architecture.canvas.tsx` in Cursor / a screenshot you can pull up |
| 3 | Overview | http://localhost:3001/app |
| 4 | Discovery | http://localhost:3001/app/discovery |
| 5 | María's lead | http://localhost:3001/app/leads/{maria-id} |
| 6 | Inbox | http://localhost:3001/app/inbox |
| 7 | Content | http://localhost:3001/app/content |

---

# BLOCK 1 · The Hook · 0:00 → 0:35

## Camera: FULL FACE

### 0:00 → 0:03 — Opening beat
- **Visual:** your face only, frame steady, slight smile, eyes on camera
- **Action:** take one breath, hold for half a second
- **Say:** _"Cold email is dead in Latin America."_

### 0:03 → 0:05 — Hold the silence
- **Visual:** FULL FACE, don't move, hold eye contact
- **Action:** 1.5 seconds of total silence (this is the hook landing)
- **Say:** [nothing]

### 0:05 → 0:18 — The data drop
- **Visual:** FULL FACE
- **Action:** light hand gesture as you cite each stat (don't over-do it)
- **Say:** _"Eighty-four percent of B2B buyers here just stopped opening them. They live in WhatsApp now — where ninety-eight percent of messages get opened and conversion runs forty-five to seventy percent."_

### 0:18 → 0:25 — The strategic threat
- **Visual:** FULL FACE
- **Action:** tilt head slightly forward, more direct gaze
- **Say:** _"And here's the part that should keep Zolvo's team up at night: eighty percent of those same buyers already have a vendor in mind **before** sales ever reaches them."_

### 0:25 → 0:32 — Enemy framing
- **Visual:** FULL FACE
- **Action:** brief pause after "doesn't", lean back slightly
- **Say:** _"Every AI SDR tool on the market was built for a buyer who reads their inbox. Latin America's buyer doesn't. So Zolvo is not competing with HubSpot or Outreach. Zolvo is competing with whoever writes the LATAM playbook first."_

### 0:32 → 0:35 — Your reveal
- **Visual:** FULL FACE → start fading to landing tab at 0:34
- **Action:** soften, but stay confident
- **Say:** _"I'm Andrés. I spent the last two days writing that playbook — and the code that runs it. I called it **Mase**."_

**Transition cue:** at 0:35, screen swaps to **Tab 1 — Landing** (https://mase-ai.vercel.app), webcam goes to **PIP** (top-right corner).

---

# BLOCK 2 · Four Segments · 0:35 → 1:15

## Camera: PIP

## Screen: Tab 1 — Landing page · mase-ai.vercel.app

### 0:35 → 0:42 — Frame the research
- **Visual:** landing page at the top, hero visible. Webcam PIP.
- **Action:** scroll slowly to the "Para quién" / segments section (4 cards)
- **Say:** _"Before writing a single line of code, I did field research. The LATAM B2B buyer is not one persona — it's four, and each one buys differently."_

### 0:42 → 1:00 — Walk through each segment
- **Visual:** the 4 segment cards visible at once if possible. Cursor hovers each one as you name them.
- **Action:** mouse over Card 1 → 2 → 3 → 4 in rhythm with the dialogue
- **Say:**
  - _"**Founders 25 to 35** — they live on X and respond to peer-to-peer. They prefer voice notes over text."_ _(hover card 1)_
  - _"**Scale-up founders** — LinkedIn DMs with a case study from someone in their exact industry."_ _(hover card 2)_
  - _"**VPs of Sales** — LinkedIn voice messages. Three times higher reply rate than text, and only two percent of SDRs use them."_ _(hover card 3)_
  - _"**CFOs** — they only open the door through a referral or an email with ROI math attached."_ _(hover card 4)_

### 1:00 → 1:15 — The principle
- **Visual:** scroll down to the metrics row ("98% · 20× · $250 · 65% · 5 min")
- **Action:** brief pause when the metrics appear on screen
- **Say:** _"The mistake every US tool makes is treating these four as one funnel. Mase routes each one to the channel and tone they actually convert in. That's the first principle. The rest is architecture."_

**Transition cue:** at 1:15, switch to **Tab 2 — Architecture canvas**.

---

# BLOCK 3 · Architecture · 1:15 → 2:00

## Camera: PIP

## Screen: Tab 2 — Architecture canvas (or screenshot)

> **Note:** if the canvas is too cluttered, use a static screenshot of the data-flow diagram from `zolvo-architecture.canvas.tsx` (the section that shows the 8 modules connected). Have it ready in a separate tab as backup.

### 1:15 → 1:20 — Frame the claim
- **Visual:** architecture canvas / diagram open, 8 modules visible
- **Action:** position cursor at the entry point (top-left)
- **Say:** _"Eight modules, all running in production right now."_

### 1:20 → 1:50 — Walk the data flow
- **Visual:** move the cursor module by module as you name each one. Don't zoom, just point.
- **Action:** ~3-4 seconds per module
- **Say:**
  - _"**Apify and ValueSerp** scan LinkedIn Sales Navigator and listen for intent signals — phrases like _hiring SDR_, _scaling sales_, _bank reconciliation_."_
  - _"**Gemini** classifies the lead into one of the four segments, pulls pain points directly from their recent posts, and tags their journey stage."_
  - _"The **personalization engine** writes the exact message — text or voice script — in LATAM-native Spanish."_
  - _"**ElevenLabs** renders the voice note using a custom-trained voice with an ultra-realistic preset and Spanish-LATAM phonetic preprocessing — acronyms get pronounced, pauses land where humans would pause."_
  - _"**WAHA** delivers WhatsApp, **Resend** delivers email, **Apify** delivers LinkedIn DMs."_
  - _"**n8n** orchestrates three workflows: daily discovery, weekly content, and inbound message handling."_
  - _"**Supabase** is the single source of truth — seven tables, Storage for audio, Realtime for the inbox."_

### 1:50 → 2:00 — Pivot to live
- **Visual:** still architecture
- **Action:** look back at the camera briefly during this line
- **Say:** _"The whole dashboard runs on **Next.js on Vercel**. Public URL. Let me show you."_

**Transition cue:** at 2:00, switch to **Tab 4 — Discovery** (http://localhost:3001/app/discovery). Webcam stays PIP.

---

# BLOCK 4 · LIVE DEMO · 2:00 → 3:55 · _Centerpiece_

## Camera: PIP throughout

## 4a · Discovery · 2:00 → 2:20

### 2:00 → 2:05 — Setup
- **Visual:** Tab 4, Discovery page, sidebar visible on left
- **Action:** scroll to the "Trigger discovery" button so it's centered
- **Say:** _"I trigger discovery."_

### 2:05 → 2:10 — Click
- **Visual:** cursor hovers the button, click
- **Action:** click _Trigger discovery_ (demo mode is selected by default, so it's instant)
- **Say:** [pause while it loads]

### 2:10 → 2:20 — Results land
- **Visual:** 5 result cards appear. Hover over María's card (top one, score 96)
- **Action:** point mouse at the score "96" and her name
- **Say:** _"Five real leads from LATAM in two seconds. Top result: María Fernanda Rojas, founder of Pagomatic, based in Bogotá. Intent score 96. She's the hottest lead of the day."_

## 4b · AI Classification · 2:20 → 2:45

### 2:20 → 2:25 — Trigger classification
- **Visual:** still Discovery page
- **Action:** click _Classify all with AI_ button
- **Say:** _"Gemini classifies them."_

### 2:25 → 2:35 — Watch results populate
- **Visual:** the cards update one by one with the segment badges and pain points appearing under each
- **Action:** when María's card updates, point at the segment "founder_scaleup" and the stage "active_frustration"
- **Say:** _"Watch what happens with María: founder scale-up, journey stage active frustration."_

### 2:35 → 2:45 — The pain point reveal
- **Visual:** zoom mentally / point at the pain point text under María's card
- **Action:** read it slowly
- **Say:** _"Pain point detected, quoted from her own LinkedIn post: _'Cold email doesn't work in LATAM because our clients live in WhatsApp.'_ That **is** Zolvo's thesis. Mase found her saying it, by herself, in public."_

## 4c · Voice Note · 2:45 → 3:25 · _THE WOW MOMENT_

### 2:45 → 2:50 — Open María's profile
- **Visual:** click María's card → switch to Tab 5 (her lead detail)
- **Action:** click the card; the lead detail page loads with pain points, emotional trigger, recommended opening visible
- **Say:** _"I open her profile."_

### 2:50 → 3:00 — Show the depth
- **Visual:** point at the pain points section (with severity badges) and the "emotional trigger" callout
- **Action:** trace mouse over each pain point briefly
- **Say:** _"I see her pain points with textual evidence. I see the emotional trigger. And I generate a WhatsApp voice note with the voice I uploaded to ElevenLabs."_

### 3:00 → 3:05 — Click WhatsApp Voice
- **Visual:** scroll down to the "Acciones IA" / "AI Actions" card with channel buttons
- **Action:** click the _WhatsApp Voice_ button
- **Say:** [no narration, let the spinner load]

### 3:05 → 3:15 — Bridge the wait
- **Visual:** spinner is visible. While it loads, talk over it.
- **Action:** the audio takes 15-30 seconds to generate. If it's slow, narrate continuously.
- **Say:** _"While it renders: the system pulls her name, her company, her actual post, writes a natural script, sends it to ElevenLabs with the ultra-realistic preset and the LATAM phonetic layer."_

### 3:15 → 3:18 — The audio appears
- **Visual:** the message bubble appears with the audio player
- **Action:** cursor moves to the play button
- **Say:** [pause]

### 3:18 → 3:20 — Press play
- **Visual:** click ▶
- **Action:** click play. **STOP TALKING NOW.**
- **Say:** [silence — let the voice note speak]

### 3:20 → 3:23 — Reaction shot
- **Visual:** if comfortable, briefly look up to camera while the audio plays
- **Action:** subtle nod, hand on chin or off-camera — but don't speak over the audio
- **Say:** [silence]

### 3:23 → 3:25 — Punchline
- **Visual:** audio finishes (the voice note is ~30s; let it play in full or fade gracefully at ~25s of audio)
- **Action:** 1-second beat after audio ends
- **Say:** _"Thirty seconds. My voice. Her name. Her pain. Cost: four cents. Time from discovery to ready-to-send: under twelve seconds."_

> **CRITICAL:** the voice note IS the moment of the pitch. Do not talk over it. Do not edit it. Let it run.

## 4d · Multi-channel + Inbox · 3:25 → 3:55

### 3:25 → 3:32 — Email channel
- **Visual:** scroll up in the lead detail OR click _Email_ button next to WhatsApp Voice
- **Action:** click _Email_. A new generated message appears with subject line visible.
- **Say:** _"Same lead, different channel."_ _(let it generate)_

### 3:32 → 3:42 — Show the subject + body
- **Visual:** the email subject appears: "María, CAC LATAM 2026 benchmark for Pagomatic". Point at it. Then point at the body where her own post is cited.
- **Action:** hover over the subject line, then scroll down to show the body
- **Say:** _"Subject line built around her specific data. Body cites her own post. **The system knows which channel each segment actually responds to.**"_

### 3:42 → 3:48 — Switch to Inbox
- **Visual:** click sidebar → Inbox (Tab 6)
- **Action:** the inbox shows all conversations
- **Say:** _"Everything lives here. Five active conversations across four channels — all handled by AI."_

### 3:48 → 3:55 — Show takeover capability
- **Visual:** click one conversation to open it. The conversation view shows the messages thread and the "Tomar control" / "Take over" button in the top right.
- **Action:** hover the takeover button (don't click — just hover so it's highlighted)
- **Say:** _"When a lead replies with high intent, I get an alert. One click and I take over. I type as a human. When I'm done, the AI continues with the full thread context."_

**Transition cue:** at 3:55, click sidebar → Content (Tab 7).

---

# BLOCK 5 · The Three Answers · 3:55 → 4:40

## Camera: PIP

## 5a · Growth Marketing · 3:55 → 4:15

### 3:55 → 4:00 — Frame the brief
- **Visual:** FULL FACE briefly (1-2 seconds, optional) OR stay on the Content tab transitioning in
- **Action:** look at camera briefly
- **Say:** _"Zolvo's brief asked for three things. Mase has an answer for each."_

### 4:00 → 4:15 — Content Studio
- **Visual:** Tab 7 — Content. The "Top dolores detectados" panel visible on the right, and the 3 generated posts cards below.
- **Action:** point at the pain points list on the right, then at one of the post cards
- **Say:** _"Every week, the content studio aggregates the pain points the system detected across all leads, and writes educational content from those real quotes. Here — a carousel on _why cold email doesn't work in LATAM_, written from posts of the leads we discovered. **That's how growth becomes a flywheel: leads feed content, content attracts more leads.**"_

## 5b · Finance & Sales · 4:15 → 4:25

### 4:15 → 4:25 — LTV/churn answer
- **Visual:** stay on Content tab OR switch back to Tab 3 (Overview). Either works — the visual is secondary here.
- **Action:** look at camera while speaking, since this is more philosophical
- **Say:** _"Segmentation happens first, before a single message. Personalization hits the real pain. Conversations retain because they feel human, not templated. **Lower CAC, higher conversion, and from day one the client feels understood — that is retention.** Pricing can scale by channel — voice notes on WhatsApp justify a premium tier."_

## 5c · Automation · 4:25 → 4:40

### 4:25 → 4:35 — Show n8n briefly
- **Visual:** switch to a quick view of n8n at http://localhost:5678 (have it pre-opened in another tab — workflows list visible) OR show Tab 3 (Overview) with the activity feed
- **Action:** if showing n8n, point at the 3 workflow names. If on Overview, point at the activity log entries.
- **Say:** _"Three n8n workflows already running. Supabase with seven tables and Realtime. Gemini, OpenRouter and a local Ollama in a fallback chain."_

### 4:35 → 4:40 — The ROI hammer
- **Visual:** ideally back on the Overview metric strip (the "20×" big number)
- **Action:** point at the "20×" or recite while looking at camera
- **Say:** _"**One operator handles what twenty SDRs would. Two hundred and fifty dollars a month against twelve to fifteen thousand. That's ROI of fifty times in the first month.**"_

**Transition cue:** at 4:40, screen cuts to **FULL FACE**.

---

# BLOCK 6 · The Close · 4:40 → 5:00

## Camera: FULL FACE

### 4:40 → 4:48 — Point one
- **Visual:** FULL FACE, no screen share
- **Action:** straight eye contact, no hand gestures
- **Say:** _"Three things to close. **One:** what I just showed you is not slides. It's production code at mase-ai.vercel.app. The repo is open at github.com/ByZocar/Mase-AI. Read it tonight if you want."_

### 4:48 → 4:55 — Point two
- **Visual:** FULL FACE
- **Action:** slight head tilt, brief humility beat
- **Say:** _"**Two:** I built this in two days. Not because I'm a genius. Because the moment I realized Zolvo's problem in LATAM isn't a tech problem — it's a human-touch problem — the rest was just wiring the right pieces."_

### 4:55 → 4:59 — Point three (the kill shot)
- **Visual:** FULL FACE
- **Action:** lean forward 1cm, direct gaze
- **Say:** _"**Three:** Isabela, your team is building the sales engine LATAM has needed for a decade. I didn't come here to apply to a fellowship. I came to prove I already know how to operate inside one."_

### 4:59 → 5:00 — The walk-off line
- **Visual:** FULL FACE
- **Action:** half-second pause, then deliver
- **Say:** _"Let's talk."_

### 5:00 — CUT
- **Visual:** hold the face for 1 second after the last word, then cut
- **Action:** **stop recording**

---

# Visual checklist before pressing record

- [ ] **Browser:** zoom at 100%, dark mode OFF for landing (the Mase brand looks better light), or matching whichever theme demoes best
- [ ] **Tabs:** all 7 pre-loaded and in order
- [ ] **Cursor:** make sure the macOS/Windows cursor is visible (sometimes invisible in screen recordings on Windows — enable "highlight cursor" in your recording tool)
- [ ] **Webcam:** in PIP top-right, ~280px wide, 1px subtle border
- [ ] **Mic:** test 3 seconds, no clipping, no background hum
- [ ] **System audio:** enabled in OBS/Loom (otherwise the voice note won't be heard by the viewer)
- [ ] **OS notifications:** Do Not Disturb ON
- [ ] **Discord/Slack/email:** quit completely
- [ ] **Backup voice note:** confirm the audio file at María's lead is playable before going live (so if generation in real-time fails, you fall back to it)
- [ ] **Stopwatch:** visible (phone face-down on desk with timer running, or use the Loom timer)
- [ ] **One bottle of water within reach** (do NOT drink on camera)

---

# Cue card · in case you blank out

Print this card or have it stickied behind your monitor (face-side toward you):

```
0:00  COLD EMAIL DEAD       hook, 1s pause
0:18  THE PART THAT...      enemy framing
0:35  4 SEGMENTS            hover 4 cards
1:15  ARCHITECTURE          point at 8 modules
2:00  TRIGGER DISCOVERY     1 click
2:20  CLASSIFY              1 click, point at María
2:45  MARÍA'S LEAD          open detail
3:00  WHATSAPP VOICE        click, wait
3:18  PLAY → SILENCE        30s, do NOT talk
3:25  EMAIL CHANNEL         click, show subject
3:42  INBOX                 takeover button
3:55  3 ANSWERS — CONTENT   carousel
4:15  FINANCE/SALES         no screen needed
4:25  AUTOMATION            ROI 50x
4:40  FACE — 3 points
4:55  KILL SHOT             "I already know how to operate inside one"
5:00  CUT
```

---

# What NOT to do

1. **Do NOT talk over the voice note.** It's the proof. Silence makes it land.
2. **Do NOT scroll fast.** The viewer needs to read along.
3. **Do NOT apologize** if something is slow. ("Sorry the demo is slow…" instantly kills credibility.)
4. **Do NOT explain the obvious.** The viewer is Isabela, not a stranger. She knows what a "lead" is.
5. **Do NOT smile while delivering the data drop** (0:05-0:25). Stay serious — these are numbers, not jokes.
6. **Do NOT break the 5:00 mark.** If you're at 4:50 and still in Block 5, skip the part about Automation pricing and jump straight to the close.
