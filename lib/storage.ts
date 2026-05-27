import { demoCallLogs, demoPatients, demoReminders } from "./mock-data";
import type { CallLog, Patient, Reminder } from "./types";

const STORAGE_KEYS = {
  patients: "memoryline:patients",
  reminders: "memoryline:reminders",
  logs: "memoryline:logs",
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readCollection<T>(key: string, fallback: T[]): T[] {
  if (!canUseStorage()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(raw) as T[];
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function writeCollection<T>(key: string, value: T[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function mergeById<T extends { id: string }>(current: T[], required: T[]) {
  const existingIds = new Set(current.map((item) => item.id));
  return [...current, ...required.filter((item) => !existingIds.has(item.id))];
}

export function ensureDemoData() {
  if (!canUseStorage()) {
    return;
  }

  writeCollection(
    STORAGE_KEYS.patients,
    mergeById(readCollection(STORAGE_KEYS.patients, demoPatients), demoPatients),
  );
  writeCollection(
    STORAGE_KEYS.reminders,
    mergeById(
      readCollection(STORAGE_KEYS.reminders, demoReminders),
      demoReminders,
    ),
  );
  writeCollection(
    STORAGE_KEYS.logs,
    mergeById(readCollection(STORAGE_KEYS.logs, demoCallLogs), demoCallLogs),
  );
}

export function getStoredPatients(): Patient[] {
  ensureDemoData();
  return readCollection(STORAGE_KEYS.patients, demoPatients);
}

export function saveStoredPatients(patients: Patient[]) {
  writeCollection(STORAGE_KEYS.patients, patients);
}

export function getStoredReminders(): Reminder[] {
  ensureDemoData();
  return readCollection(STORAGE_KEYS.reminders, demoReminders);
}

export function saveStoredReminders(reminders: Reminder[]) {
  writeCollection(STORAGE_KEYS.reminders, reminders);
}

export function getStoredCallLogs(): CallLog[] {
  ensureDemoData();
  return readCollection(STORAGE_KEYS.logs, demoCallLogs);
}

export function saveStoredCallLogs(logs: CallLog[]) {
  writeCollection(STORAGE_KEYS.logs, logs);
}
