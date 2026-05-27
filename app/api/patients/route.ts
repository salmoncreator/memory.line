import { demoPatients } from "@/lib/mock-data";
import type { NewPatientInput, Patient } from "@/lib/types";

function createId() {
  return `patient-${Date.now()}`;
}

export async function GET() {
  return Response.json({ patients: demoPatients });
}

export async function POST(request: Request) {
  const body = (await request.json()) as NewPatientInput;
  const patient: Patient = {
    id: createId(),
    name: body.name,
    phone: body.phone,
    relationship: body.relationship,
    notes: body.notes,
    riskLevel: "Medium",
    preferredTone: body.preferredTone,
    createdAt: new Date().toISOString(),
  };

  return Response.json({ patient }, { status: 201 });
}
