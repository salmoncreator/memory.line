import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

const accentStyles = {
  teal: "bg-teal-700",
  sky: "bg-sky-600",
  peach: "bg-orange-500",
  rose: "bg-rose-600",
};

export function StatCard({
  label,
  value,
  accent = "teal",
}: {
  label: string;
  value: string;
  accent?: keyof typeof accentStyles;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-4xl font-bold text-slate-950">{value}</p>
        </div>
        <span
          className={cn("mt-1 h-3 w-3 rounded-full", accentStyles[accent])}
          aria-hidden="true"
        />
      </div>
    </Card>
  );
}
