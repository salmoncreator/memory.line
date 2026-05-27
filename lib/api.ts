import { maryTranscript } from "./mock-data";
import {
  getStoredCallLogs,
  getStoredPatients,
  getStoredReminders,
  saveStoredCallLogs,
  saveStoredPatients,
  saveStoredReminders,
} from "./storage";
import { supabase } from "./supabase";
import type {
  CallLog,
  CallResult,
  NewPatientInput,
  NewReminderInput,
  Patient,
  Reminder,
} from "./types";

const WAIT_MS = 250;
const SUPABASE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
const DISABLE_SUPABASE_FALLBACK =
  process.env.NEXT_PUBLIC_DISABLE_SUPABASE_FALLBACK === "true";

function delay<T>(value: T, wait = WAIT_MS): Promise<T> {
  return new Promise((resolve) => {
    globalThis.setTimeout(() => resolve(value), wait);
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

function mapPatientRow(row: Record<string, unknown>): Patient {
  return {
    id: String(row.id ?? createId("patient")),
    name: String(row.name ?? "Unknown patient"),
    age: typeof row.age === "number" ? row.age : undefined,
    phone: String(row.phone ?? ""),
    relationship: String(row.relationship ?? "other"),
    notes: String(row.notes ?? ""),
    riskLevel: String(row.risk_level ?? row.riskLevel ?? "Medium") as Patient["riskLevel"],
    preferredTone: String(
      row.preferred_tone ?? row.preferredTone ?? "Calm assistant",
    ) as Patient["preferredTone"],
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
  };
}

function mapReminderRow(
  row: Record<string, unknown>,
  patientsById?: Map<string, Patient>,
): Reminder {
  const patientId = String(row.patient_id ?? row.patientId ?? "");
  const patientName =
    String(row.patient_name ?? row.patientName ?? "") ||
    patientsById?.get(patientId)?.name ||
    "Unknown patient";

  return {
    id: String(row.id ?? createId("reminder")),
    patientId,
    patientName,
    type: String(row.type ?? "Custom") as Reminder["type"],
    title: String(row.title ?? "Reminder"),
    message: String(row.message ?? ""),
    scheduledDate: String(row.scheduled_date ?? row.scheduledDate ?? "Today"),
    scheduledTime: String(row.scheduled_time ?? row.scheduledTime ?? "12:00 PM"),
    repeat: String(row.repeat ?? "Once") as Reminder["repeat"],
    voiceStyle: String(
      row.voice_style ?? row.voiceStyle ?? "Calm assistant",
    ) as Reminder["voiceStyle"],
    safetyAlert: Boolean(row.safety_alert ?? row.safetyAlert),
    status: String(row.status ?? "Pending") as Reminder["status"],
    summary:
      typeof row.summary === "string" && row.summary.length > 0
        ? row.summary
        : undefined,
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
  };
}

function mapCallLogRow(row: Record<string, unknown>): CallLog {
  const transcript = Array.isArray(row.transcript) ? row.transcript : [];
  return {
    id: String(row.id ?? createId("log")),
    reminderId: String(row.reminder_id ?? row.reminderId ?? ""),
    patientId: String(row.patient_id ?? row.patientId ?? ""),
    patientName: String(row.patient_name ?? row.patientName ?? "Unknown patient"),
    reminderTitle: String(row.reminder_title ?? row.reminderTitle ?? "Reminder"),
    dateTime: String(row.date_time ?? row.dateTime ?? ""),
    status: String(row.status ?? "Pending") as CallLog["status"],
    summary: String(row.summary ?? ""),
    transcript: transcript as CallLog["transcript"],
    caregiverAlert: String(
      row.caregiver_alert ?? row.caregiverAlert ?? "No urgent concerns detected.",
    ),
  };
}

function warnAndUseLocal(error: unknown, context?: string) {
  console.warn(
    "Supabase request failed; using local fallback.",
    context ? { context } : undefined,
    error,
  );
  if (DISABLE_SUPABASE_FALLBACK) {
    throw error instanceof Error
      ? error
      : new Error(
          typeof error === "string"
            ? error
            : "Supabase request failed (see console for details).",
        );
  }
}

export async function getPatients(): Promise<Patient[]> {
  if (!SUPABASE_ENABLED) {
    return delay(getStoredPatients());
  }

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    warnAndUseLocal(error, "getPatients");
    return delay(getStoredPatients());
  }

  return delay((data as Record<string, unknown>[]).map(mapPatientRow));
}

export async function createPatient(input: NewPatientInput): Promise<Patient> {
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

  if (!SUPABASE_ENABLED) {
    saveStoredPatients([patient, ...getStoredPatients()]);
    return delay(patient);
  }

  const { data, error } = await supabase
    .from("patients")
    .insert({
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      relationship: patient.relationship,
      notes: patient.notes,
      risk_level: patient.riskLevel,
      preferred_tone: patient.preferredTone,
      created_at: patient.createdAt,
    })
    .select("*")
    .single();

  if (error || !data) {
    warnAndUseLocal(error, "createPatient insert patients");
    saveStoredPatients([patient, ...getStoredPatients()]);
    return delay(patient);
  }

  return delay(mapPatientRow(data as Record<string, unknown>));
}

export async function getReminders(): Promise<Reminder[]> {
  if (!SUPABASE_ENABLED) {
    return delay(getStoredReminders());
  }

  const [questionsResponse, patientsResponse] = await Promise.all([
    supabase.from("questions").select("*").order("created_at", { ascending: false }),
    supabase.from("patients").select("*"),
  ]);

  if (questionsResponse.error || !questionsResponse.data) {
    warnAndUseLocal(questionsResponse.error, "getReminders select questions");
    return delay(getStoredReminders());
  }

  const patientsById = new Map<string, Patient>(
    (patientsResponse.data ?? []).map((row) => {
      const patient = mapPatientRow(row as Record<string, unknown>);
      return [patient.id, patient];
    }),
  );

  return delay(
    (questionsResponse.data as Record<string, unknown>[]).map((row) =>
      mapReminderRow(row, patientsById),
    ),
  );
}

export async function createReminder(
  input: NewReminderInput,
): Promise<Reminder> {
  const patient = (await getPatients()).find((item) => item.id === input.patientId);
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

  if (!SUPABASE_ENABLED) {
    saveStoredReminders([reminder, ...getStoredReminders()]);
    return delay(reminder);
  }

  const { data, error } = await supabase
    .from("questions")
    .insert({
      id: reminder.id,
      patient_id: reminder.patientId,
      patient_name: reminder.patientName,
      type: reminder.type,
      title: reminder.title,
      message: reminder.message,
      scheduled_date: reminder.scheduledDate,
      scheduled_time: reminder.scheduledTime,
      repeat: reminder.repeat,
      voice_style: reminder.voiceStyle,
      safety_alert: reminder.safetyAlert,
      status: reminder.status,
      created_at: reminder.createdAt,
    })
    .select("*")
    .single();

  if (error || !data) {
    warnAndUseLocal(error, "createReminder insert questions");
    saveStoredReminders([reminder, ...getStoredReminders()]);
    return delay(reminder);
  }

  return delay(mapReminderRow(data as Record<string, unknown>));
}

async function persistCallResult(
  reminderId: string,
  status: Reminder["status"],
  summary: string,
  log: CallLog,
) {
  if (!SUPABASE_ENABLED) {
    const reminders = getStoredReminders();
    const updatedReminders = reminders.map((item) =>
      item.id === reminderId ? { ...item, status, summary } : item,
    );
    saveStoredReminders(updatedReminders);
    saveStoredCallLogs([log, ...getStoredCallLogs()]);
    return;
  }

  const [reminderUpdate, logInsert] = await Promise.all([
    supabase
      .from("questions")
      .update({ status, summary })
      .eq("id", reminderId),
    supabase.from("call_logs").insert({
      id: log.id,
      reminder_id: log.reminderId,
      patient_id: log.patientId,
      patient_name: log.patientName,
      reminder_title: log.reminderTitle,
      date_time: log.dateTime,
      status: log.status,
      summary: log.summary,
      transcript: log.transcript,
      caregiver_alert: log.caregiverAlert,
      created_at: new Date().toISOString(),
    }),
  ]);

  if (reminderUpdate.error || logInsert.error) {
    warnAndUseLocal(
      reminderUpdate.error ?? logInsert.error,
      "persistCallResult update questions / insert call_logs",
    );
    const reminders = getStoredReminders();
    const updatedReminders = reminders.map((item) =>
      item.id === reminderId ? { ...item, status, summary } : item,
    );
    saveStoredReminders(updatedReminders);
    saveStoredCallLogs([log, ...getStoredCallLogs()]);
  }
}

export async function getCallLogs(): Promise<CallLog[]> {
  if (!SUPABASE_ENABLED) {
    return delay(getStoredCallLogs());
  }

  const { data, error } = await supabase
    .from("call_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    warnAndUseLocal(error, "getCallLogs select call_logs");
    return delay(getStoredCallLogs());
  }

  return delay((data as Record<string, unknown>[]).map(mapCallLogRow));
}

export async function triggerCall(reminderId: string): Promise<CallResult> {
  const [reminders, patients] = await Promise.all([getReminders(), getPatients()]);
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

  await persistCallResult(reminderId, status, summary, log);

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
