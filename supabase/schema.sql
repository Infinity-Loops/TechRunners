-- TechRunners playtest — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Safe to run more than once.

-- ---------------------------------------------------------------------------
-- Reports table
-- ---------------------------------------------------------------------------
create table if not exists public.reports (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text not null default 'new',

  -- reporter (optional)
  contact_email text,
  player_name   text,

  -- device / platform
  platform      text not null,
  device_model  text,
  os_version    text,
  app_version   text,
  network_type  text,
  region        text,

  -- the problem
  problem_area  text not null,
  severity      text not null default 'medium',
  frequency     text,
  title         text not null,
  description   text not null,
  steps         text,
  expected      text,
  actual_result text,

  -- meta
  attachments   jsonb not null default '[]'::jsonb,
  user_agent    text,
  admin_notes   text
);

create index if not exists reports_created_at_idx on public.reports (created_at desc);
create index if not exists reports_status_idx      on public.reports (status);
create index if not exists reports_platform_idx    on public.reports (platform);
create index if not exists reports_area_idx        on public.reports (problem_area);
create index if not exists reports_severity_idx    on public.reports (severity);

-- Lock the table down. The app only ever touches it with the service-role key,
-- which bypasses RLS. With RLS enabled and no policies, the anon/public key
-- cannot read or write anything directly.
alter table public.reports enable row level security;

-- ---------------------------------------------------------------------------
-- Private storage bucket for screenshots / clips
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('report-media', 'report-media', false, 52428800)  -- 50 MB / file
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit;

-- No storage policies are added on purpose: uploads and signed-URL reads are
-- performed server-side with the service-role key, so the bucket stays private.

-- ---------------------------------------------------------------------------
-- Contact / support messages (from the /contact form)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text not null default 'new',
  name          text,
  email         text not null,
  subject       text,
  category      text,
  message       text not null,
  user_agent    text
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx     on public.contact_messages (status);

alter table public.contact_messages enable row level security;
