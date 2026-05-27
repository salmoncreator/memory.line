import { Patient } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { Card } from "./ui/card";
import { LinkButton } from "./ui/button";

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">{patient.name}</h2>
          <p className="mt-1 text-base font-medium text-slate-600">
            {patient.age ? `${patient.age} years old` : "Age not provided"}
          </p>
        </div>
        <StatusBadge status={patient.riskLevel} />
      </div>

      <dl className="mt-6 grid gap-4 text-base">
        <div>
          <dt className="font-semibold text-slate-500">Phone</dt>
          <dd className="mt-1 text-slate-950">{patient.phone}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Relationship</dt>
          <dd className="mt-1 text-slate-950">{patient.relationship}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Notes</dt>
          <dd className="mt-1 text-slate-700">{patient.notes}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <LinkButton
          href={`/reminders/new?patient=${patient.id}`}
          className="w-full"
          size="sm"
        >
          Create Reminder
        </LinkButton>
        <LinkButton
          href="/logs"
          variant="outline"
          className="w-full"
          size="sm"
        >
          View Logs
        </LinkButton>
      </div>
    </Card>
  );
}
