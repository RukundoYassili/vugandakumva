-- ============================================================
-- Vugandakumva — Digital Reporting System
-- Run this entire file in Supabase SQL Editor (once)
-- ============================================================

-- 1. Cases table
create table if not exists cases (
  id                   uuid primary key default gen_random_uuid(),
  case_code            text unique not null,
  user_id              uuid references auth.users,
  identity_type        text not null default 'anonymous',
  violence_type        text[] not null default '{}',
  incident_date        date,
  incident_location    text,
  incident_description text,
  people_involved      text,
  help_needed          text[] not null default '{}',
  risk_level           text not null default 'low',
  status               text not null default 'submitted',
  assigned_to          uuid references auth.users,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

alter table cases enable row level security;

create policy "Anyone can submit a case"
  on cases for insert with check (true);

create policy "Public read by case_code (API enforced)"
  on cases for select using (true);

create policy "Staff can update cases"
  on cases for update
  using ((auth.jwt() ->> 'role') in ('counselor','admin'));

-- 2. Case timeline
create table if not exists case_timeline (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid references cases on delete cascade,
  status      text not null,
  note        text,
  changed_by  uuid references auth.users,
  created_at  timestamptz default now()
);

alter table case_timeline enable row level security;

create policy "Anyone can read timeline"
  on case_timeline for select using (true);

create policy "System can insert timeline"
  on case_timeline for insert with check (true);

-- 3. Evidence metadata
create table if not exists evidence (
  id           uuid primary key default gen_random_uuid(),
  case_id      uuid references cases on delete cascade,
  storage_key  text not null,
  file_name    text not null,
  file_type    text,
  file_size    integer,
  uploaded_at  timestamptz default now()
);

alter table evidence enable row level security;

create policy "Anyone can upload evidence"
  on evidence for insert with check (true);

create policy "Staff can view evidence"
  on evidence for select
  using ((auth.jwt() ->> 'role') in ('counselor','admin','legal'));

-- 4. Support chat messages
create table if not exists messages (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid references cases on delete cascade,
  sender_role text not null default 'user',
  sender_id   uuid references auth.users,
  content     text not null,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

alter table messages enable row level security;

create policy "Anyone can send messages"
  on messages for insert with check (true);

create policy "Anyone can read messages"
  on messages for select using (true);

create policy "Staff can mark messages read"
  on messages for update
  using ((auth.jwt() ->> 'role') in ('counselor','admin'));

-- 5. Enable Realtime on messages (for live chat)
-- Run in Supabase Dashboard → Database → Replication
-- Or uncomment below if using Supabase CLI:
-- alter publication supabase_realtime add table messages;

-- ============================================================
-- Storage: Create the 'evidence' bucket
-- Do this in Supabase Dashboard → Storage → New Bucket
-- Name: evidence   |   Public: NO (private)
-- ============================================================

-- ============================================================
-- To create a staff account:
-- 1. Sign up via /auth on the website
-- 2. In Supabase Dashboard → Auth → Users → click the user
-- 3. Under "User metadata", set: { "role": "counselor" }
--    (or "admin", "legal")
-- ============================================================
