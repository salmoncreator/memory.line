"use client";

import { FormEvent, useMemo, useState } from "react";
import type {
  NewReminderInput,
  Patient,
  ReminderType,
  RepeatOption,
  VoiceStyle,
} from "@/lib/types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const reminderTypes: ReminderType[] = [
  "Medication",
  "Meal",
  "Appointment",
  "Hydration",
  "Safety Check",
  "Custom",
];

const repeatOptions: RepeatOption[] = ["Once", "Daily", "Weekly"];
const voiceStyles: VoiceStyle[] = [
  "Calm assistant",
  "Gentle nurse",
  "Family-like",
];

const fieldClass =
  "mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20";
const labelClass = "block text-base font-semibold text-slate-800";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function ReminderForm({
  patients,
  initialPatientId,
  onSave,
  onCallNow,
  saving,
  calling,
}: {
  patients: Patient[];
  initialPatientId?: string;
  onSave: (input: NewReminderInput) => Promise<void>;
  onCallNow: (input: NewReminderInput) => Promise<void>;
  saving?: boolean;
  calling?: boolean;
}) {
  const defaultPatientId = useMemo(
    () => initialPatientId || patients[0]?.id || "",
    [initialPatientId, patients],
  );
  const [patientId, setPatientId] = useState(defaultPatientId);
  const [type, setType] = useState<ReminderType>("Medication");
  const [message, setMessage] = useState(
    "Hi Mary, this is your reminder to take your evening blood pressure medication.",
  );
  const [scheduledDate, setScheduledDate] = useState(todayIso());
  const [scheduledTime, setScheduledTime] = useState("19:00");
  const [repeat, setRepeat] = useState<RepeatOption>("Once");
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>("Calm assistant");
  const [safetyAlert, setSafetyAlert] = useState(true);

  const selectedPatientId = patientId || defaultPatientId;

  function getPayload(): NewReminderInput {
    return {
      patientId: selectedPatientId,
      type,
      message,
      scheduledDate,
      scheduledTime,
      repeat,
      voiceStyle,
      safetyAlert,
    };
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave(getPayload());
  }

  return (
    <Card className="p-6">
      <form className="grid gap-6" onSubmit={handleSave}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Select patient
            <select
              className={fieldClass}
              value={selectedPatientId}
              onChange={(event) => setPatientId(event.target.value)}
              required
            >
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Reminder type
            <select
              className={fieldClass}
              value={type}
              onChange={(event) => setType(event.target.value as ReminderType)}
            >
              {reminderTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={labelClass}>
          Reminder message
          <textarea
            className={`${fieldClass} min-h-36 resize-y leading-7`}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Hi Mary, this is your reminder to take your evening blood pressure medication."
            required
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Scheduled date
            <input
              className={fieldClass}
              type="date"
              value={scheduledDate}
              onChange={(event) => setScheduledDate(event.target.value)}
              required
            />
          </label>

          <label className={labelClass}>
            Scheduled time
            <input
              className={fieldClass}
              type="time"
              value={scheduledTime}
              onChange={(event) => setScheduledTime(event.target.value)}
              required
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Repeat
            <select
              className={fieldClass}
              value={repeat}
              onChange={(event) => setRepeat(event.target.value as RepeatOption)}
            >
              {repeatOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Voice style
            <select
              className={fieldClass}
              value={voiceStyle}
              onChange={(event) => setVoiceStyle(event.target.value as VoiceStyle)}
            >
              {voiceStyles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-4 text-base font-semibold text-slate-800">
          <input
            className="mt-1 h-5 w-5 accent-teal-700"
            type="checkbox"
            checked={safetyAlert}
            onChange={(event) => setSafetyAlert(event.target.checked)}
          />
          <span>
            Alert caregiver if patient sounds confused or distressed
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            disabled={saving || !patients.length}
            className="w-full sm:w-auto"
          >
            {saving ? "Saving..." : "Save Reminder"}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            disabled={calling || !patients.length}
            onClick={() => onCallNow(getPayload())}
            className="w-full sm:w-auto"
          >
            {calling ? "Calling patient..." : "Call Now for Demo"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
