"use client";

import { cn } from "@/lib/utils";
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-8 py-6 border-b border-[var(--mase-silver)] bg-[var(--mase-paper)]">
      <div className="min-w-0">
        {eyebrow && <div className="mase-eyebrow mb-1.5">{eyebrow}</div>}
        <h1 className="text-2xl font-medium tracking-tight font-serif text-[var(--mase-taupe)]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[var(--mase-grey-olive)] mt-1.5 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
    size?: "sm" | "md";
    loading?: boolean;
  }
>(function Button(
  { className, variant = "secondary", size = "md", loading, children, ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center gap-1.5 font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm";
  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };
  const variants = {
    primary:
      "bg-[var(--mase-taupe)] hover:bg-[var(--mase-ink)] border-[var(--mase-taupe)] text-[var(--mase-parchment)]",
    accent:
      "bg-[var(--mase-blush-deep)] hover:bg-[var(--mase-taupe)] border-[var(--mase-blush-deep)] hover:border-[var(--mase-taupe)] text-[var(--mase-parchment)]",
    secondary:
      "bg-[var(--mase-paper)] hover:bg-[var(--mase-parchment-dim)] border-[var(--mase-silver)] text-[var(--mase-taupe)]",
    ghost:
      "bg-transparent hover:bg-[var(--mase-parchment-dim)] border-transparent text-[var(--mase-grey-olive)] hover:text-[var(--mase-taupe)]",
    danger:
      "bg-[var(--mase-danger)] hover:opacity-90 border-[var(--mase-danger)] text-white",
  };
  return (
    <button
      ref={ref}
      className={cn(base, sizes[size], variants[variant], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="inline-block w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin opacity-70" />
      )}
      {children}
    </button>
  );
});

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border border-[var(--mase-silver)] bg-[var(--mase-paper)] card-hover",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-b border-[var(--mase-silver)] flex items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm font-medium tracking-tight text-[var(--mase-taupe)]",
        className
      )}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

export function Pill({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "violet"
    | "cyan"
    | "accent";
  className?: string;
}) {
  const tones = {
    default:
      "bg-[var(--mase-parchment-dim)] text-[var(--mase-grey-olive)] border-[var(--mase-silver)]",
    success:
      "bg-[#e9efe9] text-[var(--mase-success)] border-[#c8d5cb]",
    warning:
      "bg-[#f5e9d4] text-[var(--mase-warning)] border-[#e6d4b3]",
    danger:
      "bg-[#f3dcd6] text-[var(--mase-danger)] border-[#e6bdb2]",
    info: "bg-[var(--mase-parchment-dim)] text-[var(--mase-taupe)] border-[var(--mase-silver)]",
    violet:
      "bg-[var(--mase-parchment-dim)] text-[var(--mase-taupe-soft)] border-[var(--mase-silver)]",
    cyan: "bg-[#e6e2db] text-[var(--mase-taupe-soft)] border-[var(--mase-silver)]",
    accent:
      "bg-[var(--mase-blush-soft)] text-[var(--mase-blush-deep)] border-[var(--mase-blush)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium border whitespace-nowrap rounded-sm",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "success" | "warning" | "danger" | "info" | "accent";
}) {
  const colors = {
    success: "text-[var(--mase-success)]",
    warning: "text-[var(--mase-warning)]",
    danger: "text-[var(--mase-danger)]",
    info: "text-[var(--mase-taupe)]",
    accent: "text-[var(--mase-blush-deep)]",
  };
  return (
    <Card className="p-4">
      <div className="mase-eyebrow">{label}</div>
      <div
        className={cn(
          "text-2xl font-serif font-medium mt-1.5 tracking-tight tabular-nums",
          tone ? colors[tone] : "text-[var(--mase-taupe)]"
        )}
      >
        {value}
      </div>
      {hint && (
        <div className="text-xs text-[var(--mase-grey-olive)] mt-1">{hint}</div>
      )}
    </Card>
  );
}

export function Empty({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-[var(--mase-silver)] bg-[var(--mase-parchment)]">
      <p className="text-sm font-medium text-[var(--mase-taupe)]">{title}</p>
      {description && (
        <p className="text-xs text-[var(--mase-grey-olive)] mt-1.5 max-w-md">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span
      className="inline-block rounded-full border-2 border-[var(--mase-silver)] border-t-[var(--mase-taupe)] animate-spin"
      style={{ width: size, height: size }}
    />
  );
}
