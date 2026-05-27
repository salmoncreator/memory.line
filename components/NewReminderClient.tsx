"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "./AppHeader";
import { ReminderForm } from "./ReminderForm";
import { StatusBadge } from "./StatusBadge";
import { TranscriptModal } from "./TranscriptModal";
import { Button } from "./ui/button";
import { Card, CardTitle } from "./ui/card";
import {
  createReminder,
  getPatients,
  triggerCall,
} from "@/lib/api";
import type {
  CallLog,
  CallResult,
  NewReminderInput,
  Patient,
} from "@/lib/types";

export function NewReminderClient() {
  const searchParams = useSearchParams();
  const initialPatientId = searchParams.get("patient") ?? undefined;
  const [patients, setPatients] = useState<Patient[]>([]);
  const [saving, setSaving] = useState(false);
  const [calling, setCalling] = useState(false);
  const [success, setSuccess] = useState(false);
  const [callResult, setCallResult] = useState<CallResult | null>(null);
  const [transcriptLog, setTranscriptLog] = useState<CallLog | null>(null);

  useEffect(() => {
    let mounted = true;

    getPatients().then((nextPatients) => {
      if (mounted) {
        setPatients(nextPatients);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave(input: NewReminderInput) {
    setSaving(true);
    setSuccess(false);
    try {
      await createReminder(input);
      setSuccess(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleCallNow(input: NewReminderInput) {
    setCalling(true);
    setCallResult(null);
    try {
      const reminder = await createReminder(input);
      const result = await triggerCall(reminder.id);
      setCallResult(result);
    } finally {
      setCalling(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7fbfb]">
      <AppHeader />
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-teal-700">
            New reminder
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">
            Schedule a gentle call
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-700">
            Create a familiar, safety-aware reminder that keeps the caregiver
            informed after the call.
          </p>
        </div>

        {success ? (
          <Card className="border-emerald-200 bg-emerald-50 p-5">
            <p className="text-lg font-bold text-emerald-900">
              Reminder created successfully.
            </p>
          </Card>
        ) : null}

        {calling ? (
          <Card className="border-sky-200 bg-sky-50 p-5">
            <p className="text-lg font-bold text-sky-950">Calling patient...</p>
          </Card>
        ) : null}

        {callResult ? (
          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Demo call result</CardTitle>
                <div className="mt-4">
                  <StatusBadge status={callResult.status} />
                </div>
                <p className="mt-4 text-lg leading-8 text-slate-800">
                  <span className="font-bold text-slate-950">Summary: </span>
                  {callResult.summary}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setTranscriptLog(callResult.log)}
              >
                View Transcript
              </Button>
            </div>
          </Card>
        ) : null}

        <ReminderForm
          patients={patients}
          initialPatientId={initialPatientId}
          saving={saving}
          calling={calling}
          onSave={handleSave}
          onCallNow={handleCallNow}
        />
      </main>
      <TranscriptModal
        open={Boolean(transcriptLog)}
        log={transcriptLog}
        onClose={() => setTranscriptLog(null)}
      />
    </div>
  );
}
