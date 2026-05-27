import { demoPatients, demoReminders } from "@/lib/mock-data";
import type { NewReminderInput, Reminder } from "@/lib/types";

function createId() {
  return `reminder-${Date.now()}`;
}

export async function GET() {
  return Response.json({ reminders: demoReminders });
}

export async function POST(request: Request) {
  const body = (await request.json()) as NewReminderInput;
  const patient = demoPatients.find((item) => item.id === body.patientId);
  const reminder: Reminder = {
    id: createId(),
    patientId: body.patientId,
    patientName: patient?.name ?? "Unknown patient",
    type: body.type,
    title: `${body.type} reminder`,
    message: body.message,
    scheduledDate: body.scheduledDate,
    scheduledTime: body.scheduledTime,
    repeat: body.repeat,
    voiceStyle: body.voiceStyle,
    safetyAlert: body.safetyAlert,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  return Response.json({ reminder }, { status: 201 });
}
