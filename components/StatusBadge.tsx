import { cn } from "@/lib/utils";
import type { ReminderStatus, RiskLevel } from "@/lib/types";

type BadgeValue = ReminderStatus | RiskLevel;

const badgeStyles: Record<BadgeValue, string> = {
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Confused: "border-amber-200 bg-amber-50 text-amber-900",
  "No Answer": "border-slate-200 bg-slate-100 text-slate-700",
  "Needs Attention": "border-rose-200 bg-rose-50 text-rose-800",
  Pending: "border-sky-200 bg-sky-50 text-sky-800",
  Low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Medium: "border-amber-200 bg-amber-50 text-amber-900",
  High: "border-rose-200 bg-rose-50 text-rose-800",
};

export function StatusBadge({
  status,
  className,
}: {
  status: BadgeValue;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-sm font-semibold",
        badgeStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
