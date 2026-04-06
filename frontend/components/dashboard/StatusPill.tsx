import type { ReactNode } from "react";

type StatusVariant = "pending" | "done" | "progress" | "paid";

const styles: Record<StatusVariant, string> = {
  pending: "bg-amber-100 text-amber-900 ring-1 ring-amber-200/80",
  done: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/80",
  progress: "bg-amber-100 text-amber-900 ring-1 ring-amber-200/80",
  paid: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/80",
};

export function StatusPill({
  children,
  variant,
}: {
  children: ReactNode;
  variant: StatusVariant;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
