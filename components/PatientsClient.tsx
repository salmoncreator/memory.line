"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppHeader } from "./AppHeader";
import { PatientCard } from "./PatientCard";
import { Button } from "./ui/button";
import { Card, CardTitle } from "./ui/card";
import { createPatient, getPatients } from "@/lib/api";
import type { NewPatientInput, Patient, VoiceStyle } from "@/lib/types";

const fieldClass =
  "mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20";
const labelClass = "block text-base font-semibold text-slate-800";
const relationships = ["son", "daughter", "spouse", "nurse", "other"];
const voiceTones: VoiceStyle[] = [
  "Calm assistant",
  "Gentle nurse",
  "Family-like",
];

const emptyForm: NewPatientInput = {
  name: "",
  phone: "",
  relationship: "daughter",
  notes: "",
  preferredTone: "Calm assistant",
};

export function PatientsClient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NewPatientInput>(emptyForm);

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

  function updateForm<Key extends keyof NewPatientInput>(
    key: Key,
    value: NewPatientInput[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const patient = await createPatient(form);
      setPatients((current) => [patient, ...current]);
      setForm(emptyForm);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7fbfb]">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-teal-700">
              Patients
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-normal text-slate-950">
              Support circles
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-700">
              Keep each patient profile simple, readable, and ready for gentle
              reminder scheduling.
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => setModalOpen(true)}
          >
            Add Patient
          </Button>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </section>
      </main>

      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-patient-title"
        >
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-teal-700">
                  New profile
                </p>
                <CardTitle id="add-patient-title" className="mt-2">
                  Add Patient
                </CardTitle>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Close
              </Button>
            </div>

            <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
              <label className={labelClass}>
                Patient name
                <input
                  className={fieldClass}
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  required
                />
              </label>

              <label className={labelClass}>
                Phone number
                <input
                  className={fieldClass}
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                  required
                />
              </label>

              <label className={labelClass}>
                Caregiver relationship
                <select
                  className={fieldClass}
                  value={form.relationship}
                  onChange={(event) =>
                    updateForm("relationship", event.target.value)
                  }
                >
                  {relationships.map((relationship) => (
                    <option key={relationship} value={relationship}>
                      {relationship}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Notes
                <textarea
                  className={`${fieldClass} min-h-28 resize-y leading-7`}
                  value={form.notes}
                  onChange={(event) => updateForm("notes", event.target.value)}
                />
              </label>

              <label className={labelClass}>
                Preferred voice tone
                <select
                  className={fieldClass}
                  value={form.preferredTone}
                  onChange={(event) =>
                    updateForm("preferredTone", event.target.value as VoiceStyle)
                  }
                >
                  {voiceTones.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </label>

              <Button type="submit" size="lg" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
