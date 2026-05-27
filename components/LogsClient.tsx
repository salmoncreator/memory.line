"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "./AppHeader";
import { StatusBadge } from "./StatusBadge";
import { TranscriptModal } from "./TranscriptModal";
import { Button } from "./ui/button";
import { Card, CardTitle } from "./ui/card";
import { getCallLogs } from "@/lib/api";
import type { CallLog } from "@/lib/types";

const safetyDisclaimer =
  "MemoryLine is a supportive reminder tool and does not provide medical advice, emergency response, or professional caregiving.";

export function LogsClient() {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);

  useEffect(() => {
    let mounted = true;

    getCallLogs().then((nextLogs) => {
      if (mounted) {
        setLogs(nextLogs);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7fbfb]">
      <AppHeader />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-teal-700">
            Call logs
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">
            Transcripts and caregiver reports
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-700">
            Review call outcomes, summaries, and transcript details after each
            supportive reminder.
          </p>
        </div>

        <Card className="p-6">
          <CardTitle>Recent calls</CardTitle>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-4 py-2">Patient</th>
                  <th className="px-4 py-2">Reminder</th>
                  <th className="px-4 py-2">Date/time</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Summary</th>
                  <th className="px-4 py-2 text-right">Transcript</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="bg-slate-50 text-base text-slate-800 ring-1 ring-slate-200"
                  >
                    <td className="rounded-l-lg px-4 py-4 font-bold text-slate-950">
                      {log.patientName}
                    </td>
                    <td className="px-4 py-4">{log.reminderTitle}</td>
                    <td className="px-4 py-4">{log.dateTime}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="max-w-sm px-4 py-4 leading-7">
                      {log.summary}
                    </td>
                    <td className="rounded-r-lg px-4 py-4 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        Open Transcript
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="rounded-lg border border-slate-200 bg-white p-4 text-base font-medium text-slate-700">
          {safetyDisclaimer}
        </p>
      </main>

      <TranscriptModal
        open={Boolean(selectedLog)}
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
