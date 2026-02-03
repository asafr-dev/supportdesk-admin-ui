import { clsx } from "clsx";
import * as React from "react";

export function Card(props: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200", props.className)}>
      {props.title ? (
        <div className="border-b border-zinc-100 px-4 py-3">
          <h2 className="text-sm font-semibold">{props.title}</h2>
        </div>
      ) : null}
      <div className="p-4">{props.children}</div>
    </div>
  );
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }
>(function Button({ className, variant = "primary", ...props }, ref) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50";
  const style =
    variant === "danger"
      ? "bg-rose-600 text-white hover:bg-rose-500"
      : variant === "ghost"
        ? "bg-transparent text-zinc-900 hover:bg-zinc-100"
        : "bg-zinc-900 text-white hover:bg-zinc-800";
  return <button ref={ref} className={clsx(base, style, className)} {...props} />;
});

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300",
        className
      )}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={clsx(
        "rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300",
        className
      )}
      {...props}
    />
  );
});

export function Badge(props: { children: React.ReactNode; tone?: "neutral" | "green" | "yellow" }) {
  const tone = props.tone ?? "neutral";
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "yellow"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-zinc-50 text-zinc-700 ring-zinc-200";
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1", cls)}>
      {props.children}
    </span>
  );
}

export function Skeleton(props: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-xl bg-zinc-100", props.className)} />;
}
