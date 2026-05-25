import Link from "next/link";
import { MaseLogo } from "@/components/mase-logo";
import {
  ArrowRight,
  Mic,
  MessageCircle,
  AtSign,
  Sparkles,
  Radio,
  Brain,
  Users,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Mase — Ventas con tacto humano para LATAM",
  description:
    "El motor de ventas con IA que se siente humano. WhatsApp, voice notes, LinkedIn, email — todo orquestado para LATAM, todo en una persona.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--mase-parchment)] text-[var(--mase-taupe)]">
      <Nav />
      <Hero />
      <Marquee />
      <ProblemSection />
      <SolutionPillars />
      <SegmentsSection />
      <FlowSection />
      <MetricsSection />
      <ClosingCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="border-b border-[var(--mase-silver)] bg-[var(--mase-parchment)] sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MaseLogo size={28} variant="default" />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--mase-taupe)]">
          <a href="#problema" className="hover:text-[var(--mase-blush-deep)]">
            Problema
          </a>
          <a href="#solucion" className="hover:text-[var(--mase-blush-deep)]">
            Solución
          </a>
          <a href="#segmentos" className="hover:text-[var(--mase-blush-deep)]">
            Para quién
          </a>
          <a href="#numeros" className="hover:text-[var(--mase-blush-deep)]">
            Números
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/app"
            className="mase-cta-ghost !py-2 !text-xs"
          >
            Ver dashboard
          </Link>
          <Link href="/app/discovery" className="mase-cta !py-2 !text-xs">
            Probar Mase <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--mase-silver)]">
      <div className="absolute inset-0 mase-hero-grid opacity-50" />
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3">
          <div className="mase-eyebrow mb-5">
            <span className="pulse-dot mr-2" />
            AI Sales & Growth Engine para LATAM
          </div>
          <h1 className="mase-headline text-[58px] md:text-[72px] leading-[0.95] tracking-tight">
            Ventas con
            <br />
            <span className="text-[var(--mase-blush-deep)]">tacto humano.</span>
          </h1>
          <p className="text-[17px] text-[var(--mase-grey-olive)] mt-8 max-w-xl leading-relaxed">
            Un solo operador haciendo el trabajo de veinte. Mase descubre leads,
            entiende su dolor, y los aborda por el canal que de verdad usan en
            LATAM —{" "}
            <span className="text-[var(--mase-taupe)] font-medium">
              WhatsApp, voice notes, LinkedIn, email
            </span>
            — con voz humana y tono local. Tú entras solo cuando importa.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-9">
            <Link href="/app/discovery" className="mase-cta">
              <Radio size={14} /> Disparar discovery
            </Link>
            <Link href="/app" className="mase-cta-ghost">
              Ver el sistema en vivo <ArrowRight size={13} />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 text-xs text-[var(--mase-grey-olive)]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[var(--mase-blush-deep)]" />
              Voice notes en español LATAM
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[var(--mase-blush-deep)]" />
              Conversación humana con takeover
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[var(--mase-blush-deep)]" />
              Detección de intención en tiempo real
            </span>
          </div>
        </div>
        <div className="md:col-span-2">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="border border-[var(--mase-silver)] bg-[var(--mase-paper)] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-[var(--mase-grey-olive)]">
          <Mic size={13} className="text-[var(--mase-blush-deep)]" />
          Voice note · WhatsApp
        </div>
        <span className="mase-tag">0:32</span>
      </div>
      <div className="border-l-2 border-[var(--mase-blush-deep)] pl-3 mb-4">
        <p className="text-[13px] leading-relaxed text-[var(--mase-taupe)] italic">
          &ldquo;Hola María, te escribo por tu post sobre el outbound manual.
          Como founder de scale-up, ese tema del CAC subiendo me sonó muy
          familiar. ¿Te paso 2 minutos para mostrarte cómo lo están resolviendo
          founders en tu mismo stage?&rdquo;
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-[11px] mb-4">
        <div className="border border-[var(--mase-silver)] bg-[var(--mase-parchment)] p-2">
          <div className="text-[var(--mase-grey-olive)]">Para</div>
          <div className="text-[var(--mase-taupe)] font-medium mt-0.5">
            María Rojas
          </div>
        </div>
        <div className="border border-[var(--mase-silver)] bg-[var(--mase-parchment)] p-2">
          <div className="text-[var(--mase-grey-olive)]">Segmento</div>
          <div className="text-[var(--mase-taupe)] font-medium mt-0.5">
            Founder scale-up
          </div>
        </div>
        <div className="border border-[var(--mase-silver)] bg-[var(--mase-parchment)] p-2">
          <div className="text-[var(--mase-grey-olive)]">Intent</div>
          <div className="text-[var(--mase-blush-deep)] font-medium mt-0.5">
            96 / 100
          </div>
        </div>
      </div>
      <div className="h-9 bg-[var(--mase-parchment)] border border-[var(--mase-silver)] flex items-center px-3 gap-2">
        <div className="w-7 h-7 rounded-full bg-[var(--mase-taupe)] flex items-center justify-center text-[var(--mase-parchment)]">
          ▶
        </div>
        <div className="flex-1 flex items-center gap-px h-5">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="flex-1 bg-[var(--mase-grey-olive)]"
              style={{
                height: `${20 + Math.sin(i * 0.7) * 14 + Math.cos(i * 0.3) * 8}%`,
                opacity: i < 18 ? 1 : 0.35,
              }}
            />
          ))}
        </div>
        <span className="text-[10px] text-[var(--mase-grey-olive)] tabular-nums">
          0:12 / 0:32
        </span>
      </div>
    </div>
  );
}

function Marquee() {
  const stats = [
    { v: "98%", l: "tasa apertura WhatsApp LATAM" },
    { v: "20×", l: "equipo SDR en un solo operador" },
    { v: "$250", l: "vs $12k de equipo equivalente" },
    { v: "65%", l: "reducción de costo por lead" },
    { v: "5 min", l: "tiempo respuesta a inbound" },
  ];
  return (
    <div className="border-b border-[var(--mase-silver)] bg-[var(--mase-paper)]">
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-5 gap-6">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="mase-headline text-2xl text-[var(--mase-taupe)]">
              {s.v}
            </div>
            <div className="text-[11px] text-[var(--mase-grey-olive)] mt-1 leading-tight">
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section
      id="problema"
      className="border-b border-[var(--mase-silver)] py-24 md:py-28"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="mase-eyebrow mb-4">El problema</div>
        <h2 className="mase-headline text-4xl md:text-5xl max-w-3xl">
          El comprador LATAM no responde como el comprador gringo.
        </h2>
        <p className="text-[var(--mase-grey-olive)] mt-6 max-w-2xl leading-relaxed text-[15px]">
          73% de los compradores B2B en LATAM evita activamente a los
          vendedores con mensajes genéricos. 80% ya tiene proveedor preferido
          antes del primer contacto. Y el 84% confirma que el cold email
          tradicional simplemente ya no funciona aquí.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          <ProblemCard
            number="01"
            title="Equipo SDR carísimo y agotado"
            body="Un SDR junior en LATAM cuesta $1.5k-$2.5k al mes. El 71% del tiempo se va en data entry, prospecting manual y seguimiento."
          />
          <ProblemCard
            number="02"
            title="Cold email muerto en LATAM"
            body="El comprador LATAM vive en WhatsApp, no en su bandeja de entrada. Los emails outbound en español tienen <2% de conversión."
          />
          <ProblemCard
            number="03"
            title="Pipeline impredecible"
            body="Sin un sistema que orqueste los canales correctos para cada segmento, el pipeline depende de la energía del SDR del día."
          />
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border-t-2 border-[var(--mase-taupe)] pt-5">
      <div className="text-[var(--mase-grey-olive)] text-xs mb-3 tabular-nums">
        {number}
      </div>
      <h3 className="font-medium text-[var(--mase-taupe)] mb-2 text-[17px]">
        {title}
      </h3>
      <p className="text-sm text-[var(--mase-grey-olive)] leading-relaxed">
        {body}
      </p>
    </div>
  );
}

function SolutionPillars() {
  const pillars = [
    {
      icon: Radio,
      title: "Discover",
      body: "Mase escucha señales en LinkedIn, X, Sales Navigator y news. Detecta dolores específicos: 'hiring SDR', 'escalar ventas', 'conciliación bancaria'. Cada lead viene con contexto, no con un email frío.",
    },
    {
      icon: Brain,
      title: "Understand",
      body: "Un LLM clasifica al lead en uno de cuatro perfiles (founder joven, scale-up, VP, CFO), detecta su journey stage y los dolores con evidencia textual de sus posts reales.",
    },
    {
      icon: Mic,
      title: "Engage",
      body: "Mensajes generados con tono LATAM nativo. Voice notes en español producidos con IA de voz indistinguible de humano. Cada canal — WhatsApp, LinkedIn, email — adaptado al lead específico.",
    },
    {
      icon: Users,
      title: "Hand off",
      body: "Cuando un lead responde con intención alta, Mase te alerta. Tomas el hilo con un click, conversas como humano, y devuelves el control a la IA cuando termines.",
    },
  ];

  return (
    <section
      id="solucion"
      className="border-b border-[var(--mase-silver)] py-24 md:py-28 bg-[var(--mase-paper)]"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="mase-eyebrow mb-4">La solución</div>
        <h2 className="mase-headline text-4xl md:text-5xl max-w-3xl">
          Un sistema que se mueve por los canales que tu cliente sí usa.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-14">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex items-start gap-5">
                <div className="w-12 h-12 border border-[var(--mase-taupe)] flex items-center justify-center shrink-0 bg-[var(--mase-parchment)]">
                  <Icon size={20} className="text-[var(--mase-taupe)]" />
                </div>
                <div>
                  <h3 className="mase-headline text-2xl text-[var(--mase-taupe)] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[var(--mase-grey-olive)] leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SegmentsSection() {
  const segments = [
    {
      name: "Founders 25-35",
      desc: "Pre-Serie A. Sin presupuesto para SDR.",
      channel: "Twitter/X → WhatsApp voice",
      hook: "Comunión peer-to-peer",
    },
    {
      name: "Scale-up Founders",
      desc: "10-100 empleados. CAC subiendo.",
      channel: "LinkedIn DM → Email",
      hook: "Presión de crecimiento",
    },
    {
      name: "VP / Director Ventas",
      desc: "Equipo 5-20 SDRs. Pipeline impredecible.",
      channel: "LinkedIn voice → Loom",
      hook: "Alivio operativo",
    },
    {
      name: "CFO / Finance",
      desc: "+200 facturas/mes. Cierre caótico.",
      channel: "Email con ROI → Referido WhatsApp",
      hook: "Control y predictibilidad",
    },
  ];

  return (
    <section
      id="segmentos"
      className="border-b border-[var(--mase-silver)] py-24 md:py-28"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="mase-eyebrow mb-4">Para quién</div>
        <h2 className="mase-headline text-4xl md:text-5xl max-w-3xl">
          Cuatro perfiles. Cuatro estilos. Una misma plataforma.
        </h2>
        <p className="text-[var(--mase-grey-olive)] mt-6 max-w-2xl leading-relaxed text-[15px]">
          Mase no te vende un canal. Detecta el segmento, identifica el dolor
          real, y elige el canal y tono que más probabilidad tiene de convertir
          con ese tipo de comprador.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
          {segments.map((s, i) => (
            <div
              key={s.name}
              className="border border-[var(--mase-silver)] bg-[var(--mase-paper)] p-6"
            >
              <div className="text-[10px] text-[var(--mase-grey-olive)] tabular-nums mb-3">
                0{i + 1} / 04
              </div>
              <h3 className="text-xl font-medium text-[var(--mase-taupe)] mb-2">
                {s.name}
              </h3>
              <p className="text-sm text-[var(--mase-grey-olive)] mb-4 leading-relaxed">
                {s.desc}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--mase-silver)]">
                <div>
                  <div className="mase-eyebrow !text-[10px]">Canales</div>
                  <div className="text-xs text-[var(--mase-taupe)] mt-1">
                    {s.channel}
                  </div>
                </div>
                <div>
                  <div className="mase-eyebrow !text-[10px]">Hook</div>
                  <div className="text-xs text-[var(--mase-taupe)] mt-1">
                    {s.hook}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowSection() {
  const steps = [
    {
      n: "01",
      t: "Descubrir",
      d: "Apify + ValueSerp + LinkedIn Sales Navigator + listening de señales en X.",
      icon: Radio,
    },
    {
      n: "02",
      t: "Enriquecer",
      d: "Posts recientes, empresa, funding stage, hiring signals, news.",
      icon: Sparkles,
    },
    {
      n: "03",
      t: "Clasificar",
      d: "Segmento + journey stage + pain points con evidencia textual.",
      icon: Brain,
    },
    {
      n: "04",
      t: "Personalizar",
      d: "Mensaje, subject, guion de voz — adaptados al canal y tono del segmento.",
      icon: AtSign,
    },
    {
      n: "05",
      t: "Entregar",
      d: "WhatsApp + voice notes + LinkedIn + email + Twitter, con horarios óptimos.",
      icon: MessageCircle,
    },
    {
      n: "06",
      t: "Conversar",
      d: "IA responde con contexto. Takeover humano en un click cuando importa.",
      icon: Mic,
    },
  ];

  return (
    <section className="border-b border-[var(--mase-silver)] py-24 md:py-28 bg-[var(--mase-paper)]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mase-eyebrow mb-4">Cómo funciona</div>
        <h2 className="mase-headline text-4xl md:text-5xl max-w-2xl">
          De señal a conversación en menos de 12 segundos.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 mt-14">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="border-t border-[var(--mase-taupe)] pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[var(--mase-grey-olive)] text-xs tabular-nums">
                    {s.n}
                  </span>
                  <Icon size={16} className="text-[var(--mase-blush-deep)]" />
                </div>
                <h3 className="text-lg font-medium text-[var(--mase-taupe)] mb-1.5">
                  {s.t}
                </h3>
                <p className="text-sm text-[var(--mase-grey-olive)] leading-relaxed">
                  {s.d}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  return (
    <section
      id="numeros"
      className="border-b border-[var(--mase-silver)] py-24 md:py-28"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="mase-eyebrow mb-4">Por qué funciona</div>
        <h2 className="mase-headline text-4xl md:text-5xl max-w-3xl">
          Los números detrás del tacto.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
          <BigStat
            value="98%"
            label="Tasa de apertura en WhatsApp"
            sub="vs 25% en email · 15% en LinkedIn DM frío"
          />
          <BigStat
            value="3×"
            label="Mejor respuesta en LinkedIn voice"
            sub="vs texto · y solo el 2% de SDRs lo usa"
          />
          <BigStat
            value="71%"
            label="Tiempo SDR en tareas no productivas"
            sub="Mase recupera ese 71% sin contratar nadie"
          />
          <BigStat
            value="45-70%"
            label="Tasa de conversión WhatsApp DM"
            sub="vs 1-3% de email outbound tradicional"
          />
        </div>
      </div>
    </section>
  );
}

function BigStat({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="border-l-2 border-[var(--mase-blush-deep)] pl-6">
      <div className="mase-headline text-6xl text-[var(--mase-taupe)] tabular-nums">
        {value}
      </div>
      <div className="text-[var(--mase-taupe)] mt-3 font-medium">{label}</div>
      <div className="text-sm text-[var(--mase-grey-olive)] mt-1.5 leading-relaxed">
        {sub}
      </div>
    </div>
  );
}

function ClosingCTA() {
  return (
    <section className="border-b border-[var(--mase-silver)] py-28 bg-[var(--mase-taupe)] text-[var(--mase-parchment)]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mase-eyebrow mb-5 !text-[var(--mase-blush)]">
          Está corriendo. Está vivo.
        </div>
        <h2 className="mase-headline text-5xl md:text-6xl text-[var(--mase-parchment)]">
          Esto no es una demo.
          <br />
          <span className="text-[var(--mase-blush)]">Es producto.</span>
        </h2>
        <p className="text-[15px] text-[var(--mase-silver)] mt-7 max-w-2xl mx-auto leading-relaxed">
          Mase ya está descubriendo leads, clasificándolos, generando voice
          notes y conversando con prospectos en este momento. Si tu equipo
          comercial siente que el motor de outbound no escala, esto es para ti.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <Link
            href="/app/discovery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--mase-blush-deep)] text-[var(--mase-parchment)] font-medium hover:bg-[var(--mase-blush)]"
          >
            Probar Mase ahora <ArrowRight size={14} />
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--mase-silver)] text-[var(--mase-parchment)] hover:border-[var(--mase-blush)]"
          >
            Ver dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-[var(--mase-parchment)]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <MaseLogo size={26} variant="default" />
          <span className="text-xs text-[var(--mase-grey-olive)] ml-3">
            · Ventas con tacto humano para LATAM
          </span>
        </div>
        <div className="text-xs text-[var(--mase-grey-olive)] flex flex-wrap items-center gap-4">
          <span>© 2026 Mase</span>
          <span>Bogotá · CDMX · Buenos Aires</span>
          <Link
            href="/app"
            className="hover:text-[var(--mase-taupe)] underline-offset-2 hover:underline"
          >
            Acceso al dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
