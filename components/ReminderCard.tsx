"use client";

import type { Reminder } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function ReminderCard({
  reminder,
  onCallNow,
  busy,
}: {
  reminder: Reminder;
  onCallNow?: (reminderId: string) => void;
  busy?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-slate-950">
              {reminder.patientName}
            </h3>
            <StatusBadge status={reminder.status} />
          </div>
          <p className="text-base font-semibold text-slate-700">
            {reminder.title}
          </p>
          <p className="text-base text-slate-600">
            {reminder.scheduledDate}, {reminder.scheduledTime}
          </p>
        </div>
        {onCallNow ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onCallNow(reminder.id)}
            disabled={busy}
            className="w-full sm:w-auto"
          >
            {busy ? "Calling..." : "Call Now"}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
