-- MemoryLine baseline schema
-- Run this in Supabase SQL Editor.

begin;

create table if not exists public.patients (
  id text primary key,
  name text not null,
  age integer,
  phone text not null,
  relationship text not null,
  notes text not null default '',
  risk_level text not null default 'Medium',
  preferred_tone text not null default 'Calm assistant',
  created_at timestamptz not null default now()
);

-- Ensure columns exist on pre-existing patients table
alter table public.patients
  add column if not exists age integer,
  add column if not exists relationship text,
  add column if not exists notes text not null default '',
  add column if not exists risk_level text not null default 'Medium',
  add column if not exists preferred_tone text not null default 'Calm assistant',
  add column if not exists created_at timestamptz not null default now();

create table if not exists public.questions (
  id text primary key,
  patient_id text not null references public.patients(id) on delete cascade,
  patient_name text not null,
  type text not null,
  title text not null,
  message text not null,
  scheduled_date text not null,
  scheduled_time text not null,
  repeat text not null,
  voice_style text not null,
  safety_alert boolean not null default false,
  status text not null default 'Pending',
  summary text,
  created_at timestamptz not null default now()
);

-- Ensure columns exist on pre-existing questions table
alter table public.questions
  add column if not exists patient_id uuid,
  add column if not exists patient_name text,
  add column if not exists type text,
  add column if not exists title text,
  add column if not exists message text,
  add column if not exists scheduled_date text,
  add column if not exists scheduled_time text,
  add column if not exists repeat text,
  add column if not exists voice_style text,
  add column if not exists safety_alert boolean not null default false,
  add column if not exists status text not null default 'Pending',
  add column if not exists summary text,
  add column if not exists created_at timestamptz not null default now();

create table if not exists public.call_logs (
  id text primary key,
  reminder_id text not null references public.questions(id) on delete cascade,
  patient_id text not null references public.patients(id) on delete cascade,
  patient_name text not null,
  reminder_title text not null,
  date_time text not null,
  status text not null,
  summary text not null,
  transcript jsonb not null default '[]'::jsonb,
  caregiver_alert text not null default 'No urgent concerns detected.',
  created_at timestamptz not null default now()
);

-- Ensure columns exist on pre-existing call_logs table
alter table public.call_logs
  add column if not exists reminder_id text,
  add column if not exists patient_id text,
  add column if not exists patient_name text,
  add column if not exists reminder_title text,
  add column if not exists date_time text,
  add column if not exists status text,
  add column if not exists summary text,
  add column if not exists transcript jsonb not null default '[]'::jsonb,
  add column if not exists caregiver_alert text not null default 'No urgent concerns detected.',
  add column if not exists created_at timestamptz not null default now();

create index if not exists idx_questions_patient_id on public.questions(patient_id);
create index if not exists idx_questions_created_at on public.questions(created_at desc);
create index if not exists idx_call_logs_reminder_id on public.call_logs(reminder_id);
create index if not exists idx_call_logs_patient_id on public.call_logs(patient_id);
create index if not exists idx_call_logs_created_at on public.call_logs(created_at desc);

alter table public.patients enable row level security;
alter table public.questions enable row level security;
alter table public.call_logs enable row level security;

drop policy if exists "patients_all_anon_auth" on public.patients;
create policy "patients_all_anon_auth"
on public.patients
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "questions_all_anon_auth" on public.questions;
create policy "questions_all_anon_auth"
on public.questions
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "call_logs_all_anon_auth" on public.call_logs;
create policy "call_logs_all_anon_auth"
on public.call_logs
for all
to anon, authenticated
using (true)
with check (true);

commit;
