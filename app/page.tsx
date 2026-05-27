import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Voice reminders",
    body: "Schedule gentle calls for medication, meals, appointments, hydration, and safety checks.",
  },
  {
    title: "Caregiver visibility",
    body: "Receive clear summaries and transcripts so families know how each call went.",
  },
  {
    title: "Safety-aware design",
    body: "MemoryLine stays calm, avoids medical advice, and flags confusion for caregiver follow-up.",
  },
];

const steps = [
  {
    title: "Create a reminder",
    body: "Choose the patient, message, time, repeat schedule, and preferred voice style.",
  },
  {
    title: "MemoryLine calls",
    body: "The patient receives a familiar, supportive voice reminder at the scheduled time.",
  },
  {
    title: "The call is summarized",
    body: "Caregivers can review the status, transcript, and any attention notes afterward.",
  },
];

const previewRows = [
  ["Evening medication", "7:00 PM", "Completed"],
  ["Hydration check", "3:00 PM", "Needs attention"],
  ["Doctor appointment", "Tomorrow", "Scheduled"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7fbfb] text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#edf8fa]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
              aria-label="MemoryLine home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                ML
              </span>
              <span className="text-lg font-bold text-slate-950">
                MemoryLine
              </span>
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="#how-it-works"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
              >
                How it works
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
              >
                Dashboard
              </Link>
            </div>
          </nav>
        </div>

        <div className="relative mx-auto grid min-h-[660px] max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.75fr)] lg:px-8 lg:pt-12">
          <div className="max-w-3xl">
            <p className="text-base font-semibold text-teal-800">
              Voice reminders for dementia care
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-[1.05] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              A familiar voice when memory fades.
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-700">
              MemoryLine helps caregivers schedule supportive AI voice calls
              for daily reminders, routine check-ins, and simple follow-up
              reports.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/dashboard" size="lg" className="w-full sm:w-auto">
                Open Dashboard
              </LinkButton>
              <LinkButton
                href="#how-it-works"
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                See How It Works
              </LinkButton>
            </div>
          </div>

          <div className="relative">
            <Card className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-teal-700">
                    Today's care plan
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    Reminder calls
                  </h2>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
                  Active
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {previewRows.map(([name, time, status]) => (
                  <div
                    key={name}
                    className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-bold text-slate-950">{name}</p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {time}
                      </p>
                    </div>
                    <p className="self-center rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                      {status}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-teal-800">
                  Caregiver update
                </p>
                <p className="mt-2 text-base leading-7 text-teal-950">
                  Medication reminder completed. No urgent concerns detected.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-base font-semibold text-teal-800">
            Built for everyday support
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-normal text-slate-950">
            Gentle reminders with clear caregiver follow-up.
          </h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <h3 className="text-2xl font-bold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                {feature.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-base font-semibold text-teal-800">
              How MemoryLine works
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-normal text-slate-950">
              A simple loop from reminder to report.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-lg border border-slate-200 bg-[#f7fbfb] p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-700 text-base font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-2xl font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-lg leading-8 text-slate-700">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-base font-medium text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>MemoryLine</p>
        <p>
          Supportive reminders only. MemoryLine does not provide medical advice
          or emergency response.
        </p>
      </footer>
    </main>
  );
}
