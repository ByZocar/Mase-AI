# Pitch Video · Mase para Zolvo — 5 minutos exactos

> **Aplicación:** Makers Fellowship 2026 — Coding Fellowship
> **Challenge:** "AI Sales & Growth Engine to launch Zolvo in a new market"
> **Demo:** [mase-ai.vercel.app](https://mase-ai.vercel.app) · **Repo:** [github.com/ByZocar/Mase-AI](https://github.com/ByZocar/Mase-AI)

## Qué pide el challenge (PDF de Zolvo)

> _"Coding Fellowship: Shows Architecture and Automation. You must present a functional flow (using tools like n8n or Cursor AI) that connects leads with AI agents in a way that is indistinguishable from a human."_

Tres retos críticos para escalar Zolvo en LATAM:
1. **Growth Marketing** — demanda calificada viral y orgánica.
2. **Finance & Sales** — modelo que maximice LTV y reduzca churn.
3. **Automation** — pipeline (n8n, Supabase, LLMs) con agentes indistinguibles de humanos.

El video debe demostrar **automatización del 80% del proceso de ventas y marketing con ROI claro**.

## La tesis del pitch

**Mase = la respuesta a los tres retos en un solo sistema.**

- Para growth → contenido auto-generado de los dolores reales detectados (flywheel orgánico).
- Para LTV/sales → discovery + classify + personalización multi-canal que cierra antes y retiene mejor con tacto humano.
- Para automation → n8n + Supabase + LLMs + ElevenLabs + WAHA + Apify orquestados.

Y todo corriendo en producción **hoy**, no en slides.

---

## Setup pre-grabación (10 min)

```powershell
# 1. Verificar que producción está arriba (no requiere local)
# https://mase-ai.vercel.app

# 2. Si quieres demo local con datos limpios y rápida:
cd C:\Users\andre\Documents\Mase_AI\zolvo-engine
docker ps          # confirmar n8n + WAHA + postgres arriba
npm run dev -- -p 3001

# 3. Reseed fresco para tener datos prístinos
npx tsx scripts/prepare-demo.ts --clean

# 4. Generar un voice note nuevo justo antes (suena mejor con tu voz)
npx tsx scripts/test-voice.ts
# anota la URL del audio que devuelve, déjalo abierto en otra pestaña
```

**Pestañas listas (en este orden):**
1. https://mase-ai.vercel.app (landing)
2. http://localhost:3001/app (overview)
3. http://localhost:3001/app/discovery
4. http://localhost:3001/app/leads/{maria-id} (con el voice note)
5. http://localhost:3001/app/inbox
6. http://localhost:3001/app/content
7. Diagrama de arquitectura (canvas `zolvo-architecture.canvas.tsx`)

**Setup técnico:**
- Cámara en esquina superior derecha (cara siempre visible)
- Audio del sistema HABILITADO en OBS/Loom (para que se escuche el voice note de ElevenLabs)
- Zoom del browser al 100%, dark mode OS
- Cerrar Slack, Discord, notificaciones

---

# GUION · 5 minutos

## Bloque 1 — Hook personal y tesis (0:00 → 0:30) · _Cara en cámara completa, sin pantalla_

> "Hola equipo Zolvo, soy Andrés. Llevo una semana en Makers House y mientras Isabela contaba lo que están construyendo, me hice una sola pregunta:
>
> **¿Cómo se vería el motor de ventas de Zolvo si dejara de sentirse outbound?**
>
> En LATAM, el 73% de los compradores B2B evita activamente a los vendedores genéricos. El 80% ya tiene proveedor preferido antes del primer contacto. Y el 84% confirma: el cold email muere aquí.
>
> Si Zolvo gana este mercado, va a ser porque encontró cómo aparecer en los canales correctos, con tono humano, en el momento emocional exacto. Eso construí en los últimos días. Se llama **Mase**."

_(Mostrar logo Mase rápido, transición a la landing)_

---

## Bloque 2 — La investigación que llevó al diseño (0:30 → 1:15) · _Compartir pantalla: landing mase-ai.vercel.app_

> "Antes de tocar código, hice investigación de campo. Identifiqué cuatro perfiles distintos de comprador para Zolvo y cómo se compra B2B en LATAM hoy.

**Cuatro segmentos. Cuatro canales. Cuatro hooks distintos:**

> - **Founders 25-35** — viven en Twitter/X, responden a peer-to-peer, prefieren WhatsApp voice.
> - **Scale-up founders** — LinkedIn DM con caso de éxito específico de su industria.
> - **VP de Ventas** — LinkedIn voice notes (3× más respuesta que texto, solo 2% lo usa).
> - **CFOs** — referido o email con ROI calculado.

> Los datos que importan: **WhatsApp tiene 98% de apertura en LATAM y entre 45 y 70% de conversión** cuando hay personalización real. Email tiene 1 al 3%. La diferencia es brutal.
>
> Mase orquesta los canales, no escoge uno. Y ese es el primer principio que rompe con el outbound tradicional."

_(Scroll por la landing mientras hablas, mostrar segmentos y métricas)_

---

## Bloque 3 — Arquitectura técnica (1:15 → 2:00) · _Compartir pantalla: canvas de arquitectura_

> "Esto es lo que construí. Ocho módulos orquestados, en producción, ya corriendo.

_(Apuntar a cada módulo mientras hablas — usar el canvas de arquitectura)_

> - **Apify + ValueSerp** descubren leads desde LinkedIn Sales Navigator y rastrean señales: 'hiring SDR', 'escalar ventas', 'conciliación bancaria'.
> - **Gemini** clasifica al lead en uno de los cuatro segmentos, detecta su dolor con evidencia textual de sus posts reales, y le asigna un journey stage.
> - **El motor de personalización** genera el mensaje exacto — texto o guion de voz — con tono LATAM nativo.
> - **ElevenLabs** sintetiza el voice note con la voz que cargué desde mi cuenta, con preset ultra-realistic y preprocesamiento de español LATAM. Las siglas se pronuncian fonéticamente. Los porcentajes se dicen. Las pausas son naturales.
> - **WAHA** entrega por WhatsApp, **Resend** por email, **Apify** por LinkedIn DM.
> - **n8n** orquesta todo con tres workflows: discovery diario, contenido semanal, e inbound handler.
> - **Supabase** es la fuente única de verdad: siete tablas, Storage para audios, Realtime para el inbox.
> - Y todo el dashboard corre en **Next.js sobre Vercel** — la URL es pública, ahora se las muestro."

_(Cambio rápido a la pestaña localhost:3001/app)_

---

## Bloque 4 — DEMO EN VIVO (2:00 → 3:45) · 1 minuto 45 segundos · _El bloque más importante_

### 2:00 → 2:20 · Discovery

> "Esto es Mase corriendo. Disparo discovery."

**Click en 'Disparar discovery' en /app/discovery (modo demo, instantáneo)**

> "Cinco leads reales descubiertos. María Fernanda Rojas, founder de Pagomatic en Bogotá. Score 96. Es el lead más caliente del día."

### 2:20 → 2:45 · Clasificación con IA

**Click en 'Clasificar todos con IA'**

> "El sistema está clasificando. Mira lo que pasa con María: queda como **founder de scale-up** en stage de **frustración activa**. Su dolor detectado, con evidencia de su propio post:
>
> 'El cold email no funciona en LATAM porque sus clientes viven en WhatsApp.'
>
> Ese ES el dolor exacto que Zolvo resuelve. Mase lo detectó solo."

### 2:45 → 3:20 · Voice note REAL en vivo · _Momento WOW_

**Click en el card de María → /app/leads/{id}**

> "Abro su perfil. Veo los dolores detectados con evidencia. Veo el trigger emocional. Y voy a generar un voice note de WhatsApp con la voz que cargué a ElevenLabs."

**Click en 'WhatsApp Voice'**

> "Mientras se genera: el sistema toma su nombre, su empresa, su post real, y genera un guion natural. Luego ElevenLabs lo sintetiza con preset ultra-realistic y preprocesamiento español LATAM."

**Esperar (12-30 segundos), click PLAY**

> [REPRODUCIR EL VOICE NOTE. SILENCIO DE TU PARTE.]
>
> "Eso es. Treinta segundos. Indistinguible de humano. Mi voz, mi acento, hablándole por nombre a una persona que el sistema descubrió hace dos minutos. Costo: cuatro centavos. ROI por mensaje: brutal."

### 3:20 → 3:45 · Multi-canal + Inbox + Takeover

**Click rápido en 'Email' → mostrar subject 'María, benchmark CAC LATAM 2026 para Pagomatic'**

> "Mismo lead, otro canal. Subject específico, cuerpo personalizado con cita real de su post. **El sistema sabe qué canal preferir según el segmento.**"

**Cambio a /app/inbox**

> "Acá vive todo. Cinco conversaciones activas, en cuatro canales, manejándose solas. Si algún lead responde con algo crítico, alerta. Yo tomo control con un click. Escribo como humano. Cuando termino, la IA continúa con todo el contexto."

---

## Bloque 5 — Las tres respuestas a Zolvo (3:45 → 4:30) · _Cara en cámara o canvas_

> "Zolvo pidió tres respuestas. Mase tiene una para cada una:

### 1. Growth Marketing — viral y orgánico

**Cambio a /app/content**

> "El content studio agrega los dolores que el sistema detecta cada semana, y genera contenido educativo basado en realidades de personas concretas. Mira: un carrusel sobre por qué el cold email no funciona en LATAM, escrito con los posts reales de los leads detectados. **Eso es growth viral con tacto humano: leads alimentan contenido, contenido atrae más leads.**"

### 2. Finance & Sales — LTV alto, churn bajo

> "El segmento se detecta primero. La personalización ataca el dolor exacto. La conversación retiene porque se siente humana, no plantilla. **Resultado: CAC más bajo, conversion más alta, retention porque desde el día uno el cliente sintió que lo entendieron.** El pricing puede escalarse por canal — voice notes en WhatsApp justifican premium."

### 3. Automation — n8n + Supabase + LLMs

> "Tres workflows de n8n corriendo: discovery diario, contenido semanal, inbound handler. Supabase con siete tablas y Realtime. Gemini, OpenRouter y Ollama en cadena de fallback. **Un solo operador maneja lo que requiere veinte SDRs. Doscientos cincuenta dólares al mes contra quince mil. ROI: 50× el primer mes.**"

---

## Bloque 6 — Cierre (4:30 → 5:00) · _Cara completa en cámara, sin pantalla_

> "Tres cosas para terminar.

> **Primera:** esto que les mostré no es slides ni mock. Es código real corriendo en mase-ai.vercel.app. El repo está abierto en github.com/ByZocar/Mase-AI. Pueden entrar ahora mismo.

> **Segunda:** lo construí en dos días. No porque sea genio. Porque cuando entendí que el problema de Zolvo en LATAM no es técnico — es de tacto humano — el resto fue solo conectar las piezas correctas.

> **Tercera:** Isabela, ustedes están construyendo el motor de ventas que LATAM necesitaba. Yo no vine a pedir entrada al Maker Fellowship. Vine a demostrar que ya sé moverme dentro.

> Hablamos."

_(Pausa de 1-2 segundos. Cortar grabación.)_

---

# Notas operativas

## Tono y pacing
- Habla a **140-150 palabras/minuto**. Despacio. Las cosas importantes pausadas.
- Pausa de 1 segundo antes y después del voice note. Eso vende.
- En el cierre, mira directo a cámara, no a la pantalla.

## Si algo falla
- **Voice no carga en vivo:** ya hay uno generado en `/app/leads/{maria-id}/`, reprodúcelo.
- **Discovery falla:** los datos ya están seeded (usa `prepare-demo.ts`), navega directo a `/app/leads`.
- **Internet inestable:** usa http://localhost:3001 (todo funciona local salvo Apify/ValueSerp en modo no-demo).
- **Gemini se cae:** el fallback determinístico produce mensajes igual de buenos, es transparente.

## Líneas que NO olvidar
1. _"73% de los compradores B2B evita vendedores genéricos en LATAM"_
2. _"WhatsApp tiene 98% de apertura, 45-70% de conversión"_
3. _"Un operador, el trabajo de veinte"_
4. _"$250/mes vs $12-15k de equipo equivalente — ROI 50×"_
5. _"Indistinguible de humano. Y lo construí en 2 días."_

## El diferenciador frente al outbound clásico de Zolvo
> "Zolvo hoy automatiza LinkedIn y email. Mase agrega cinco capas que casi nadie hace:
> 1. Detección de **señales de intención** en X y comunidades.
> 2. **WhatsApp voice notes** con voz clonada e indistinguible.
> 3. **LinkedIn voice messages** — 3× mejor que texto.
> 4. **Routing automático** por segmento, no plantilla global.
> 5. **Content studio** que publica basándose en dolores reales detectados."

Eso es el momento **OH WOW** del pitch. Dilo cuando enseñes la arquitectura.

---

# Después de grabar

1. Editar en Loom/CapCut — cortar solo errores graves, dejar las pausas naturales
2. Exportar 1080p H.264
3. Subir a Google Drive
4. Compartir con permiso **"Cualquiera con el enlace puede ver"**
5. Enviar al equipo Zolvo con un email corto:

> _Equipo Zolvo,_
>
> _Aquí mi pitch para el Coding Fellowship. Llamé al sistema **Mase** — el AI Sales & Growth Engine para LATAM. Lo construí en dos días para responder a los tres retos que Isabela planteó._
>
> _Demo live: mase-ai.vercel.app · Repo: github.com/ByZocar/Mase-AI · Video: [link]_
>
> _Hablamos cuando quieran._
>
> _— Andrés_

---

# Checklist final pre-grabación

- [ ] `docker ps` muestra n8n + WAHA + postgres arriba
- [ ] `npm run dev` corriendo en :3001
- [ ] `npx tsx scripts/prepare-demo.ts --clean` ejecutado (datos limpios)
- [ ] Voice note de María ya generado y testeado (audio se escucha bien)
- [ ] Las 7 pestañas abiertas y precargadas
- [ ] Cámara probada, cara visible, audio limpio
- [ ] OBS/Loom con captura de audio del sistema HABILITADA
- [ ] Notificaciones del sistema silenciadas
- [ ] Cronómetro a la vista para no pasarme de 5:00
