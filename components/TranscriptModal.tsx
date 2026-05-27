"use client";

import { useEffect } from "react";
import type { CallLog } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/button";

export function TranscriptModal({
  log,
  open,
  onClose,
}: {
  log: CallLog | null;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open || !log) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transcript-title"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-teal-700">
              Call Transcript
            </p>
            <h2
              id="transcript-title"
              className="mt-2 text-3xl font-bold text-slate-950"
            >
              Call Transcript
            </h2>
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <dl className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-500">Patient</dt>
            <dd className="mt-1 text-lg font-bold text-slate-950">
              {log.patientName}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Reminder</dt>
            <dd className="mt-1 text-lg font-bold text-slate-950">
              {log.reminderTitle}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Status</dt>
            <dd className="mt-2">
              <StatusBadge status={log.status} />
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Summary</dt>
            <dd className="mt-1 text-slate-800">{log.summary}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <h3 className="text-xl font-bold text-slate-950">Transcript</h3>
          {log.transcript.length > 0 ? (
            <div className="mt-4 space-y-3">
              {log.transcript.map((line, index) => (
                <p
                  key={`${line.speaker}-${index}`}
                  className="rounded-lg bg-white p-4 text-base leading-7 text-slate-800 ring-1 ring-slate-200"
                >
                  <span className="font-bold text-slate-950">
                    {line.speaker}:
                  </span>{" "}
                  {line.text}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-lg bg-slate-50 p-4 text-slate-700 ring-1 ring-slate-200">
              No transcript is available because the call was not answered.
            </p>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-4">
          <p className="font-semibold text-teal-950">Caregiver alert</p>
          <p className="mt-1 text-teal-900">{log.caregiverAlert}</p>
        </div>
      </div>
    </div>
  );
}
