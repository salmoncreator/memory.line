import { maryTranscript } from "./mock-data";
import {
  getStoredCallLogs,
  getStoredPatients,
  getStoredReminders,
  saveStoredCallLogs,
  saveStoredPatients,
  saveStoredReminders,
} from "./storage";
import type {
  CallLog,
  CallResult,
  NewPatientInput,
  NewReminderInput,
  Patient,
  Reminder,
} from "./types";

const WAIT_MS = 250;

function delay<T>(value: T, wait = WAIT_MS): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), wait);
  });
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function firstName(name: string) {
  return name.trim().split(" ")[0] || "Patient";
}

function titleForReminder(reminder: NewReminderInput) {
  if (reminder.type === "Medication") {
    return "Medication reminder";
  }

  return `${reminder.type} reminder`;
}

function formatDateLabel(value: string) {
  if (!value.includes("-")) {
    return value;
  }

  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTimeLabel(value: string) {
  if (!value.includes(":")) {
    return value;
  }

  const date = new Date(`2026-01-01T${value}:00`);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export async function getPatients(): Promise<Patient[]> {
  return delay(getStoredPatients());
}

export async function createPatient(input: NewPatientInput): Promise<Patient> {
  const patients = getStoredPatients();
  const patient: Patient = {
    id: createId("patient"),
    name: input.name.trim(),
    phone: input.phone.trim(),
    relationship: input.relationship,
    notes: input.notes.trim(),
    riskLevel: "Medium",
    preferredTone: input.preferredTone,
    createdAt: new Date().toISOString(),
  };

  saveStoredPatients([patient, ...patients]);
  return delay(patient);
}

export async function getReminders(): Promise<Reminder[]> {
  return delay(getStoredReminders());
}

export async function createReminder(
  input: NewReminderInput,
): Promise<Reminder> {
  const patients = getStoredPatients();
  const patient = patients.find((item) => item.id === input.patientId);
  const patientName = patient?.name ?? "Unknown patient";
  const reminder: Reminder = {
    id: createId("reminder"),
    patientId: input.patientId,
    patientName,
    type: input.type,
    title: titleForReminder(input),
    message: input.message.trim(),
    scheduledDate: formatDateLabel(input.scheduledDate),
    scheduledTime: formatTimeLabel(input.scheduledTime),
    repeat: input.repeat,
    voiceStyle: input.voiceStyle,
    safetyAlert: input.safetyAlert,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  saveStoredReminders([reminder, ...getStoredReminders()]);
  return delay(reminder);
}

export async function triggerCall(reminderId: string): Promise<CallResult> {
  const reminders = getStoredReminders();
  const patients = getStoredPatients();
  const reminder = reminders.find((item) => item.id === reminderId);

  if (!reminder) {
    throw new Error("Reminder not found");
  }

  const patient = patients.find((item) => item.id === reminder.patientId);
  const name = firstName(reminder.patientName);
  const response = await fetch("/api/call-now", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reminderId: reminder.id,
      patientId: reminder.patientId,
      patientName: reminder.patientName,
      toNumber: patient?.phone,
      reminderTitle: reminder.title,
      reminderType: reminder.type,
      reminderMessage: reminder.message,
      safetyAlert: reminder.safetyAlert,
    }),
  });

  if (!response.ok) {
    const details = await response.json().catch(() => null);
    throw new Error(details?.error ?? "Could not start the call");
  }

  const callResponse = (await response.json()) as {
    status?: "Completed" | "Pending";
    summary?: string;
    realCall?: boolean;
    conversationId?: string | null;
    callSid?: string | null;
  };
  const status = callResponse.status ?? "Completed";
  const summary =
    callResponse.summary ??
    (reminder.type === "Medication"
      ? `${name} confirmed she took her medication.`
      : `${name} confirmed the reminder.`);
  const transcript = callResponse.realCall
    ? [
        {
          speaker: "AI" as const,
          text: `A real outbound call was started for ${reminder.patientName}.`,
        },
        {
          speaker: "Patient" as const,
          text: "Live transcript will be available from ElevenLabs call history after the call.",
        },
      ]
    : reminder.patientName === "Mary Thompson" && reminder.type === "Medication"
      ? maryTranscript
      : [
          {
            speaker: "AI" as const,
            text: `Hi ${name}, this is MemoryLine calling with your ${reminder.title.toLowerCase()}.`,
          },
          {
            speaker: "Patient" as const,
            text: "Okay, thank you for reminding me.",
          },
          {
            speaker: "AI" as const,
            text: "Thank you. I will let your caregiver know.",
          },
        ];

  const updatedReminders = reminders.map((item) =>
    item.id === reminderId
      ? { ...item, status, summary }
      : item,
  );
  const log: CallLog = {
    id: createId("log"),
    reminderId: reminder.id,
    patientId: reminder.patientId,
    patientName: reminder.patientName,
    reminderTitle: reminder.title,
    dateTime: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date()),
    status,
    summary,
    transcript,
    caregiverAlert: callResponse.realCall
      ? "Real call initiated. Review ElevenLabs call history for the live conversation record."
      : "No urgent concerns detected.",
  };

  saveStoredReminders(updatedReminders);
  saveStoredCallLogs([log, ...getStoredCallLogs()]);

  return delay(
    {
      status,
      summary,
      log,
      realCall: callResponse.realCall,
      conversationId: callResponse.conversationId,
      callSid: callResponse.callSid,
    },
    callResponse.realCall ? 250 : 900,
  );
}

export async function getCallLogs(): Promise<CallLog[]> {
  return delay(getStoredCallLogs());
}
