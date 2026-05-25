import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelative(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `${sec}s atrás`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m atrás`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h atrás`;
  const day = Math.floor(hr / 24);
  return `${day}d atrás`;
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function colorFromString(s: string): string {
  const colors = [
    "bg-cyan-500/20 text-cyan-300",
    "bg-violet-500/20 text-violet-300",
    "bg-emerald-500/20 text-emerald-300",
    "bg-rose-500/20 text-rose-300",
    "bg-amber-500/20 text-amber-300",
    "bg-fuchsia-500/20 text-fuchsia-300",
    "bg-blue-500/20 text-blue-300",
    "bg-teal-500/20 text-teal-300",
  ];
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
  return colors[Math.abs(hash) % colors.length];
}
