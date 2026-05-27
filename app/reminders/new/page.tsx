import { Suspense } from "react";
import { NewReminderClient } from "@/components/NewReminderClient";

export default function NewReminderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7fbfb] px-6 py-10 text-lg font-semibold text-slate-800">
          Loading reminder form...
        </div>
      }
    >
      <NewReminderClient />
    </Suspense>
  );
}
