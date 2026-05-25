# Checklist Pre-Grabación · Zolvo Pitch Video

## Estado del sistema (verificable ahora mismo)

| Servicio | URL | Estado |
|----------|-----|--------|
| Dashboard Zolvo Engine | http://localhost:3001 | ✅ Funcionando |
| n8n (orquestador) | http://localhost:5678 | ✅ Docker arriba (user: `zolvo`, pass: `zolvo_n8n_2026`) |
| WAHA (WhatsApp API) | http://localhost:3030 | ✅ Docker arriba |
| Supabase | https://excchoebhxigvhbeubxz.supabase.co | ✅ Schema aplicado |
| ElevenLabs | API | ✅ Generando audios reales |
| Apify | API | ✅ Conectado (modo demo activo para velocidad) |
| ValueSerp | API | ✅ Conectado |
| Ollama (LLM local) | http://localhost:11434 | ✅ llama3:8b cargado |

## Datos demo ya poblados

- ✅ 5 leads reales LATAM (María Fernanda Rojas / Carlos Mendoza / Andrés Vélez / Julián Castro / Laura Gómez)
- ✅ Cada uno clasificado por segmento (founder_scaleup, cfo, vp_sales, founder_young, other)
- ✅ Pain points específicos detectados con evidencia
- ✅ 2 voice notes MP3 reales en Supabase Storage:
  - María Fernanda (WhatsApp Voice femenino LATAM)
  - Andrés Vélez (LinkedIn Voice masculino LATAM)
- ✅ Email personalizado para Carlos (CFO) con subject específico
- ✅ LinkedIn DM para Andrés
- ✅ 3 posts educativos basados en dolores reales

## Pre-vuelo (5 minutos antes de grabar)

```powershell
# 1. Verificar que todo está arriba
docker ps
# Deberías ver: zolvo-engine-postgres-1, zolvo-engine-n8n-1, zolvo-engine-waha-1

# 2. Verificar dev server
# Si no está corriendo:
cd C:\Users\andre\Documents\Mase_AI\zolvo-engine
npm run dev -- -p 3001

# 3. (Opcional) Refrescar data demo desde cero
npx tsx scripts/prepare-demo.ts --clean

# 4. Abrir pestañas en este orden:
# - http://localhost:3001/           (Overview)
# - http://localhost:3001/discovery
# - http://localhost:3001/leads
# - http://localhost:3001/inbox
# - http://localhost:3001/content
# - http://localhost:3001/settings
```

## Setup de grabación

- [ ] **Pantalla:** 1920x1080 limpia (cerrar todo lo demás)
- [ ] **Browser:** ventana zoom al 100%, sin extensiones a la vista, dark mode
- [ ] **Cámara:** webcam en esquina superior-derecha (cara visible)
- [ ] **Audio:**
  - Mic externo si tienes (mejor calidad)
  - Habilita "compartir audio del sistema" en OBS/Loom (para que se oiga ElevenLabs)
  - Volumen al 80%
- [ ] **Iluminación:** luz suave por delante, no contraluz
- [ ] **Conexión:** prueba reproducir el voice note antes de grabar (lo encuentras en `/leads/{maria-id}/`)

## Plan de grabación · 5 minutos

Sigue `PITCH_VIDEO_SCRIPT.md`. Resumen del timing:

| Minuto | Sección | Acción clave |
|--------|---------|-------------|
| 0:00 — 0:30 | Hook con cara | "73% de buyers B2B evita vendedores genéricos en LATAM" |
| 0:30 — 1:15 | Investigación | Mostrar 4 segmentos, datos clave (98% WhatsApp open rate) |
| 1:15 — 2:00 | Arquitectura | 8 módulos, n8n, ElevenLabs, Supabase |
| 2:00 — 3:30 | Demo en vivo | Discovery → Classify → Voice Note REPRODUCIDO |
| 3:30 — 4:15 | Content + escala | Content studio + inbox + takeover |
| 4:15 — 5:00 | Cierre | "Construí esto en 2 días. Vine a demostrar..." |

## Cosas que NO olvidar mencionar

1. **"En LATAM, el 73% evita vendedores genéricos y el 80% ya tiene proveedor antes del primer contacto"**
2. **"WhatsApp tiene 98% de apertura y 45-70% de conversión en LATAM"** (vs Email 1-3%)
3. **"Una persona maneja el trabajo de 20 SDRs"**
4. **"Costo: <$250/mes vs $10-15k de equipo equivalente"**
5. **"Voice notes con IA en español, indistinguibles de humanos"**
6. **"Construí esto en 2 días"**

## Diferenciador que SOLO tú tienes

> "Zolvo hoy automatiza LinkedIn + Email. Lo que construí agrega 5 capas:
> 1. Detección de **señales de intención** en X/Twitter
> 2. **WhatsApp voice notes** con IA de voz (ElevenLabs)
> 3. **LinkedIn voice messages** (3x mejor que texto, casi nadie los usa)
> 4. **Routing automático** según el segmento detectado
> 5. **Content studio** que publica contenido basado en dolores reales detectados"

Ese es el momento de "OH WOW" del pitch.

## Plan B si algo falla durante grabación

- Si el voice note no carga en vivo: reproducir uno que ya está en `/leads/{maria}/` (audio precargado)
- Si discovery falla: la data está ya seeded, navega directo a `/leads`
- Si Ollama está caído: el fallback determinístico ya genera mensajes (es transparente)
- Si Internet está inestable: TODO funciona local salvo el LLM en cloud y Apify/ValueSerp (modo demo no los necesita)

## Despues de grabar

1. Editar minimamente con Loom/CapCut (solo cortar errores grandes)
2. Exportar 1080p MP4
3. Subir a Google Drive
4. Compartir con permiso "Cualquiera con el enlace puede ver"
5. Enviar link al equipo Zolvo con email corto:

> "Equipo Zolvo, aquí mi pitch. Llamen al sistema 'Zolvo Engine' — lo construí en 2 días. Repo: [GitHub link si lo subes]. Hablamos cuando quieran. — Andrés"

## Bonus: deploy en Vercel (si quieres URL pública)

```powershell
cd C:\Users\andre\Documents\Mase_AI\zolvo-engine
npx vercel login   # te pedirá login en el navegador (1 vez)
npx vercel link --yes
npx vercel env add SUPABASE_SECRET_KEY production   # paste el valor
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
npx vercel env add ELEVENLABS_API_KEY production
npx vercel env add APIFY_API_KEY production
npx vercel env add VALUESERP_API_KEY production
# (opcional) npx vercel env add OPENAI_API_KEY production
npx vercel --prod
```

Resultado: `https://zolvo-engine-{tu-user}.vercel.app`

Después de eso, agrega esa URL al video pitch o al mensaje.
