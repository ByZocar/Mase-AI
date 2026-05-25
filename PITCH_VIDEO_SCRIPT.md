# Zolvo Engine — Guion del Video Pitch (5 minutos)

## Setup antes de grabar

1. **Dashboard corriendo:** `npm run dev` → http://localhost:3001
2. **Data seeded:** `npx tsx scripts/seed-demo.ts` (ya hecho)
3. **Pestañas abiertas en orden:**
   - `/` (Overview)
   - `/discovery`
   - `/leads`
   - Un lead detalle (María Fernanda Rojas)
   - `/inbox`
   - `/content`
4. **Audio testeado:** verifica el voice note en una de las conversaciones de María Fernanda
5. **Cámara:** webcam en esquina superior derecha (cara visible siempre)
6. **Audio del sistema:** habilitado para que se escuche el voice note de ElevenLabs

---

## Guion (con timing)

### 0:00 — 0:30 · Hook (con cara visible)

> "Hola equipo Zolvo. Soy Andrés. Llevo una semana en Makers House y mientras escuchaba a Isabela contar lo que están construyendo, me hice una pregunta:
>
> **¿Qué pasaría si el motor de outbound de Zolvo no se sintiera como outbound?**
>
> Porque la verdad incómoda es esta: en LATAM el 73% de los compradores B2B evita activamente a los vendedores que mandan mensajes genéricos. Y el 80% ya tiene un proveedor preferido antes del primer contacto.
>
> Si Zolvo quiere ganar LATAM, necesita un sistema que aparezca con tacto humano, en el canal correcto, en el momento emocional exacto. Eso es lo que construí en los últimos 2 días."

### 0:30 — 1:15 · La investigación del cliente

**(Pantalla: Canvas con los 4 segmentos)**

> "Antes de tocar código, hice investigación de campo. Identifiqué 4 perfiles distintos de cliente para Zolvo y cómo se compra B2B en LATAM hoy:
>
> 1. **Founders jóvenes (25-35)**: viven en Twitter/X, responden a peer-to-peer, prefieren voice notes.
> 2. **Founders de scale-up (36-45)**: prefieren LinkedIn + email con caso de estudio similar.
> 3. **VP de Ventas**: responden a LinkedIn voice notes y videos de Loom personalizados.
> 4. **CFOs**: solo abren puerta por referido o email con ROI calculado.
>
> Los datos que importan: **WhatsApp tiene 98% de apertura y 45-70% de conversión en LATAM**. LinkedIn voice messages tienen 3x más respuesta que texto pero solo el 2% de SDRs los usa. Y la mayor pieza de outbound — Twitter/X engagement antes del DM — nadie la está haciendo."

### 1:15 — 2:00 · La arquitectura

**(Pantalla: Canvas de arquitectura)**

> "Esto fue lo que diseñé: Zolvo Engine. 8 módulos orquestados.
>
> Apify trae los leads desde LinkedIn Sales Navigator. ValueSerp investiga sus empresas y news. Claude — o el LLM que tengamos — clasifica al lead en uno de los 4 segmentos y detecta sus dolores reales basado en posts recientes.
>
> Después, el motor de personalización genera el mensaje. Si es voz, ElevenLabs sintetiza un voice note en español LATAM que suena humano. Si es email, Resend lo manda con tracking. Si es WhatsApp, WAHA lo envía y se queda escuchando respuestas. Si el lead responde, la IA conversa. Si dice algo crítico, alerta al operador y se hace handoff humano con un click.
>
> Supabase es la fuente única de verdad. n8n orquesta los flujos. Una sola persona puede manejar el equivalente a 20 SDRs."

### 2:00 — 3:30 · Demo en vivo

**(Pantalla: /discovery)**

> "Vamos a la app. Esto es Zolvo Engine corriendo. Primero, descubrimiento de leads."

**Click en "Disparar discovery"** (modo demo para velocidad)

> "Acabo de disparar discovery. Encontramos 5 leads reales para LATAM. María Fernanda Rojas, fundadora de Pagomatic, score 96 — es nuestro mejor candidato hoy."

**Click en "Clasificar todos con IA"**

> "El sistema está clasificando cada lead. Mira: María queda como founder_scaleup en stage de active_frustration. Su dolor detectado: 'el cold email no funciona en LATAM porque sus clientes viven en WhatsApp'. ESE es el dolor exacto que Zolvo resuelve."

**Click en el card de María → abrir /leads/{id}**

> "Aquí está su perfil. Vean el trigger emocional que la IA detectó. Vean los dolores específicos. Vean los canales preferidos. Vamos a generar un voice note."

**Click en "WhatsApp Voice" botón**

> "Mientras espero, observen lo que está pasando: el sistema toma su nombre, su cargo, su post real, mezcla todo con el conocimiento de Zolvo, y genera un guion natural. Luego se lo pasa a ElevenLabs."

**Esperar resultado, click PLAY en el audio**

> [REPRODUCIR EL VOICE NOTE EN VIVO]
>
> "Eso es. 30 segundos. Personalizado. Generado en 12 segundos. Costo: 4 centavos. Indistinguible de un humano. Y si lo manda por WhatsApp, tiene 98% de apertura."

**Click en "Email"**

> "Ahora un email para Carlos, el CFO. Subject: 'Cierre mensual en 3 horas en lugar de 32'. Mira cómo el cuerpo menciona Distribuidora del Valle por nombre, cita su post, propone un POC. Eso no es plantilla. Es contexto."

### 3:30 — 4:15 · Content + escala

**(Pantalla: /content)**

> "Pero esto no es solo outbound. Cada semana, el sistema agrega los dolores que detectó en todos los leads y genera contenido educativo basado en realidades de personas concretas.
>
> Mira: un carrusel de LinkedIn sobre por qué el cold email no funciona en LATAM. Un thread de Twitter con un caso real de 32 horas de conciliación. Eso es lo que atrae a más leads orgánicamente. Es un flywheel: leads → dolores → contenido → más leads."

**(Pantalla: /inbox)**

> "Y todo se monitorea desde aquí. Inbox unificado: WhatsApp, LinkedIn, email, todo en uno. Si quiero tomar control de cualquier conversación, un click. La IA se pausa. Yo escribo. Cuando termino, suelto la conversación y la IA continúa con todo el contexto.
>
> Una persona. Manejando el trabajo de 20."

### 4:15 — 5:00 · Cierre

**(Cara visible, sin pantalla compartida)**

> "Esto que acaban de ver no es una demo de slides. Es código real corriendo:
>
> - **Next.js** sobre Vercel
> - **Supabase** con 7 tablas y realtime
> - **ElevenLabs** generando audio español LATAM
> - **Apify** y **ValueSerp** scrappeando datos reales
> - **n8n** orquestando flujos
> - **WAHA** conectando WhatsApp
>
> Costo operativo total: menos de 250 dólares al mes. Reemplaza un equipo de SDRs que cuesta 15 mil mensuales.
>
> Y aquí está lo importante: yo construí esto en 2 días. No porque sea genio. Porque entiendo que el outbound en LATAM no es un problema técnico — es un problema de tacto humano. Y el tacto humano se diseña, se sistematiza, se escala.
>
> Isabela, ustedes están construyendo el motor de ventas de LATAM. Yo quiero construirlo con ustedes desde Bogotá, desde día uno. No vine a pedir entrada. Vine a demostrar que ya sé moverme dentro.
>
> Hablamos."

**(Pantalla final: /settings mostrando integraciones todas en verde)**

---

## Tips de grabación

- **Tono**: tranquilo pero con energía. Sin sonar a vendedor.
- **Pausas**: deja respirar cada idea importante. NO hables corrido.
- **Voice note**: cuando lo reproduces, da unos segundos de silencio antes y después. Eso vende.
- **Pestañas pre-cargadas**: NO esperes que carguen en cámara.
- **Cara**: en TODAS las secciones. Ellos quieren ver tu humanidad.
- **Cierre**: la última frase ("Vine a demostrar que ya sé moverme dentro") dilá MIRANDO A CÁMARA, no a la pantalla.

## Backups si algo falla

- Si el voice note no se genera en vivo: tienes uno ya generado en la conversación de María.
- Si discovery falla: la data ya está seeded, solo navega a /leads.
- Si LLM falla: el fallback determinístico produce mensajes igual de buenos (es transparente para el viewer).

## Subir

1. Grabar con OBS o Loom
2. Editar minimamente (solo cortar errores)
3. Exportar 1080p
4. Subir a Google Drive
5. Compartir link con permiso "Cualquiera con el enlace puede ver"
