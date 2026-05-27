export type RiskLevel = "Low" | "Medium" | "High";

export type ReminderStatus =
  | "Completed"
  | "Confused"
  | "No Answer"
  | "Needs Attention"
  | "Pending";

export type ReminderType =
  | "Medication"
  | "Meal"
  | "Appointment"
  | "Hydration"
  | "Safety Check"
  | "Custom";

export type RepeatOption = "Once" | "Daily" | "Weekly";

export type VoiceStyle = "Calm assistant" | "Gentle nurse" | "Family-like";

export type Patient = {
  id: string;
  name: string;
  age?: number;
  phone: string;
  relationship: string;
  notes: string;
  riskLevel: RiskLevel;
  preferredTone: VoiceStyle;
  createdAt: string;
};

export type Reminder = {
  id: string;
  patientId: string;
  patientName: string;
  type: ReminderType;
  title: string;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  repeat: RepeatOption;
  voiceStyle: VoiceStyle;
  safetyAlert: boolean;
  status: ReminderStatus;
  summary?: string;
  createdAt: string;
};

export type TranscriptLine = {
  speaker: "AI" | "Patient";
  text: string;
};

export type CallLog = {
  id: string;
  reminderId: string;
  patientId: string;
  patientName: string;
  reminderTitle: string;
  dateTime: string;
  status: ReminderStatus;
  summary: string;
  transcript: TranscriptLine[];
  caregiverAlert: string;
};

export type NewPatientInput = {
  name: string;
  phone: string;
  relationship: string;
  notes: string;
  preferredTone: VoiceStyle;
};

export type NewReminderInput = {
  patientId: string;
  type: ReminderType;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  repeat: RepeatOption;
  voiceStyle: VoiceStyle;
  safetyAlert: boolean;
};

export type CallResult = {
  status: ReminderStatus;
  summary: string;
  log: CallLog;
  realCall?: boolean;
  conversationId?: string | null;
  callSid?: string | null;
};
