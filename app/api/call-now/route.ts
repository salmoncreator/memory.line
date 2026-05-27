import { demoCallLogs, demoReminders } from "@/lib/mock-data";

type CallNowRequest = {
  reminderId?: string;
  patientId?: string;
  patientName?: string;
  toNumber?: string;
  reminderTitle?: string;
  reminderType?: string;
  reminderMessage?: string;
  safetyAlert?: boolean;
};

type ElevenLabsOutboundResponse = {
  success: boolean;
  message: string;
  conversation_id: string | null;
  callSid: string | null;
};

const ELEVENLABS_API_KEY = "sk_ae4747919ac4233a7dcfa29276abefe0f744e0f1476c6800";
const ELEVENLABS_AGENT_ID = "agent_0401ksn6gxfsf048sqade1tzqwfm";
const ELEVENLABS_AGENT_PHONE_NUMBER_ID = "phnum_2601ksn7d7vjf2xtyk4pv19bf91e";

function getAgentPhoneNumberId() {
  return ELEVENLABS_AGENT_PHONE_NUMBER_ID;
}

function missingElevenLabsConfig() {
  return false;
}

function mockCall(reminderId?: string) {
  const reminder =
    demoReminders.find((item) => item.id === reminderId) ?? demoReminders[0];
  const log =
    demoCallLogs.find((item) => item.reminderId === reminder.id) ??
    demoCallLogs[0];

  return Response.json({
    status: "Completed",
    summary: log.summary,
    realCall: false,
    conversationId: null,
    callSid: null,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CallNowRequest;

  if (missingElevenLabsConfig()) {
    return mockCall(body.reminderId);
  }

  if (!body.toNumber) {
    return Response.json(
      { error: "Patient phone number is required for a real call." },
      { status: 400 },
    );
  }

  const apiKey = ELEVENLABS_API_KEY;
  const agentId = ELEVENLABS_AGENT_ID;
  const agentPhoneNumberId = ELEVENLABS_AGENT_PHONE_NUMBER_ID;

  const elevenLabsResponse = await fetch(
    "https://api.elevenlabs.io/v1/convai/twilio/outbound-call",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        agent_id: agentId,
        agent_phone_number_id: agentPhoneNumberId,
        to_number: body.toNumber,
        conversation_initiation_client_data: {
          dynamic_variables: {
            patient_name: body.patientName ?? "patient",
            reminder_title: body.reminderTitle ?? "MemoryLine reminder",
            reminder_type: body.reminderType ?? "Reminder",
            reminder_message:
              body.reminderMessage ??
              "This is a gentle MemoryLine reminder.",
            safety_alert_enabled: String(Boolean(body.safetyAlert)),
          },
        },
      }),
    },
  );

  const data =
    (await elevenLabsResponse.json().catch(() => null)) as
      | ElevenLabsOutboundResponse
      | { detail?: unknown; message?: string }
      | null;

  if (!elevenLabsResponse.ok) {
    return Response.json(
      {
        error:
          "ElevenLabs could not start the call. Check your API key, agent id, phone number id, and Twilio setup.",
        details: data,
      },
      { status: elevenLabsResponse.status },
    );
  }

  const outbound = data as ElevenLabsOutboundResponse;

  return Response.json({
    status: "Pending",
    summary:
      outbound.message ||
      `Real call started for ${body.patientName ?? "the patient"}.`,
    realCall: true,
    conversationId: outbound.conversation_id,
    callSid: outbound.callSid,
  });
}
