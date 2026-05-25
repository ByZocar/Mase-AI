"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Inbox,
  Megaphone,
  Sparkles,
  Radio,
  Settings,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MaseLogo } from "./mase-logo";

const NAV = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/leads", label: "Leads", icon: Users },
  { href: "/app/inbox", label: "Inbox", icon: Inbox },
  { href: "/app/discovery", label: "Discovery", icon: Radio },
  { href: "/app/content", label: "Content Studio", icon: Sparkles },
  { href: "/app/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/app/activity", label: "Activity", icon: Activity },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-[var(--mase-silver)] bg-[var(--mase-paper)] flex flex-col">
      <div className="px-5 py-5 border-b border-[var(--mase-silver)]">
        <Link href="/app" className="flex items-center gap-2.5">
          <MaseLogo size={28} variant="mark" />
          <div className="flex flex-col">
            <span className="text-[15px] font-medium tracking-tight font-serif text-[var(--mase-taupe)]">
              Mase
            </span>
            <span className="text-[10px] text-[var(--mase-grey-olive)] uppercase tracking-widest">
              AI Sales Engine
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          const active =
            item.href === "/app"
              ? path === "/app"
              : path.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded-sm",
                active
                  ? "bg-[var(--mase-parchment-dim)] text-[var(--mase-taupe)] font-medium"
                  : "text-[var(--mase-grey-olive)] hover:text-[var(--mase-taupe)] hover:bg-[var(--mase-parchment)]"
              )}
            >
              <Icon
                size={15}
                className={cn(active && "text-[var(--mase-blush-deep)]")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[var(--mase-silver)] text-[11px] text-[var(--mase-grey-olive)] space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span>Sistema operando</span>
        </div>
        <p className="leading-snug">
          AI Sales & Growth Engine
          <br />
          <Link href="/" className="hover:text-[var(--mase-taupe)] underline-offset-2 hover:underline">
            ver landing
          </Link>
        </p>
      </div>
    </aside>
  );
}
