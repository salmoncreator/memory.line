"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "./AppHeader";
import { ReminderCard } from "./ReminderCard";
import { StatCard } from "./StatCard";
import { StatusBadge } from "./StatusBadge";
import { Button, LinkButton } from "./ui/button";
import { Card, CardTitle } from "./ui/card";
import { getCallLogs, getPatients, getReminders, triggerCall } from "@/lib/api";
import type { CallLog, Patient, Reminder } from "@/lib/types";

const safetyDisclaimer =
  "MemoryLine is a supportive reminder tool and does not provide medical advice, emergency response, or professional caregiving.";

const recentActivity = [
  "Mary confirmed medication at 7:02 PM",
  "John seemed confused during meal reminder",
  "No answer from Robert",
];

export function DashboardClient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [callingId, setCallingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([getPatients(), getReminders(), getCallLogs()]).then(
      ([nextPatients, nextReminders, nextLogs]) => {
        if (!mounted) {
          return;
        }

        setPatients(nextPatients);
        setReminders(nextReminders);
        setLogs(nextLogs);
      },
    );

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      activePatients: patients.length || 2,
      remindersToday: reminders.length || 4,
      completedCalls:
        logs.filter((log) => log.status === "Completed").length || 3,
      needsAttention:
        reminders.filter((reminder) => reminder.status === "Needs Attention")
          .length || 1,
    }),
    [logs, patients, reminders],
  );

  async function handleCallNow(reminderId: string) {
    setCallingId(reminderId);
    try {
      await triggerCall(reminderId);
      const [nextReminders, nextLogs] = await Promise.all([
        getReminders(),
        getCallLogs(),
      ]);
      setReminders(nextReminders);
      setLogs(nextLogs);
    } finally {
      setCallingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7fbfb]">
      <AppHeader />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active Patients"
            value={String(stats.activePatients)}
            accent="teal"
          />
          <StatCard
            label="Reminders Today"
            value={String(stats.remindersToday)}
            accent="sky"
          />
          <StatCard
            label="Completed Calls"
            value={String(stats.completedCalls)}
            accent="peach"
          />
          <StatCard
            label="Needs Attention"
            value={String(stats.needsAttention)}
            accent="rose"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-teal-700">
                  Caregiver dashboard
                </p>
                <CardTitle className="mt-2">Today's Reminders</CardTitle>
              </div>
              <LinkButton href="/reminders/new" className="w-full sm:w-auto">
                Create New Reminder
              </LinkButton>
            </div>

            <div className="mt-6 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
                    <th className="px-4 py-2">Patient</th>
                    <th className="px-4 py-2">Reminder</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reminders.map((reminder) => (
                    <tr
                      key={reminder.id}
                      className="rounded-lg bg-slate-50 text-base text-slate-800 ring-1 ring-slate-200"
                    >
                      <td className="rounded-l-lg px-4 py-4 font-bold text-slate-950">
                        {reminder.patientName}
                      </td>
                      <td className="px-4 py-4">{reminder.title}</td>
                      <td className="px-4 py-4">
                        {reminder.scheduledDate}, {reminder.scheduledTime}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={reminder.status} />
                      </td>
                      <td className="rounded-r-lg px-4 py-4 text-right">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCallNow(reminder.id)}
                          disabled={callingId === reminder.id}
                        >
                          {callingId === reminder.id ? "Calling..." : "Call Now"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-3 md:hidden">
              {reminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onCallNow={handleCallNow}
                  busy={callingId === reminder.id}
                />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <CardTitle>Recent Activity</CardTitle>
            <div className="mt-6 grid gap-4">
              {recentActivity.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-base font-semibold leading-7 text-slate-800">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <p className="rounded-lg border border-slate-200 bg-white p-4 text-base font-medium text-slate-700">
          {safetyDisclaimer}
        </p>
      </main>
    </div>
  );
}
