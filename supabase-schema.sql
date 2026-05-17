create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.teams (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  team_name text not null,
  players_on_field integer not null check (players_on_field between 5 and 11),
  players jsonb not null default '[]'::jsonb,
  formations jsonb not null default '[]'::jsonb,
  selected_formation text not null,
  lineup jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_contacts (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  team_id text not null references public.teams(id) on delete cascade,
  contact_name text not null,
  email text,
  phone text,
  role text,
  linked_players jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_events (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  team_id text not null references public.teams(id) on delete cascade,
  event_title text not null,
  event_type text not null default 'other',
  event_date date not null,
  start_time text,
  end_time text,
  location text,
  notes text,
  status text not null default 'planned',
  reminder_3_day_enabled boolean not null default true,
  reminder_1_day_enabled boolean not null default true,
  reminder_same_day_enabled boolean not null default true,
  repeat_pattern text not null default 'once',
  repeat_end_date date,
  repeat_day_of_week integer,
  series_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint team_events_status_check check (status in ('planned', 'sent', 'cancelled', 'completed')),
  constraint team_events_event_type_check check (event_type in ('training', 'game', 'tournament', 'other')),
  constraint team_events_repeat_pattern_check check (repeat_pattern in ('once', 'weekly')),
  constraint team_events_repeat_day_of_week_check check (
    repeat_day_of_week is null or repeat_day_of_week between 0 and 6
  )
);

create table if not exists public.ai_communication_drafts (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  team_id text not null references public.teams(id) on delete cascade,
  event_id text references public.team_events(id) on delete set null,
  raw_prompt text not null,
  draft_json jsonb not null,
  status text not null default 'draft',
  draft_type text not null default 'manual',
  reminder_type text,
  scheduled_for timestamptz,
  admin_notified_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_communication_drafts_status_check
    check (status in ('draft', 'pending_review', 'used', 'discarded')),
  constraint ai_communication_drafts_draft_type_check
    check (draft_type in ('manual', 'scheduled_reminder')),
  constraint ai_communication_drafts_reminder_type_check
    check (
      reminder_type is null
      or reminder_type in ('reminder_3_day', 'reminder_1_day', 'reminder_same_day')
    )
);

create table if not exists public.event_update_logs (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  team_id text not null references public.teams(id) on delete cascade,
  event_id text not null references public.team_events(id) on delete cascade,
  delivery_method text not null,
  recipient_count integer not null default 0,
  subject text,
  message_text text not null,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_update_logs_delivery_method_check check (delivery_method in ('email', 'sms_preview', 'copy', 'admin_review_email'))
);

create table if not exists public.event_rsvps (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  team_id text not null references public.teams(id) on delete cascade,
  event_id text not null references public.team_events(id) on delete cascade,
  contact_id text not null references public.team_contacts(id) on delete cascade,
  player_name text,
  response text not null default 'no_response',
  response_note text,
  token text not null,
  token_expires_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_rsvps_response_check
    check (response in ('no_response', 'yes', 'no', 'maybe'))
);

create index if not exists teams_user_id_idx
  on public.teams (user_id);

create index if not exists team_contacts_user_id_idx
  on public.team_contacts (user_id);

create index if not exists team_contacts_team_id_idx
  on public.team_contacts (team_id);

create index if not exists team_contacts_user_team_idx
  on public.team_contacts (user_id, team_id);

create index if not exists team_events_user_id_idx
  on public.team_events (user_id);

create index if not exists team_events_team_id_idx
  on public.team_events (team_id);

create index if not exists team_events_user_team_idx
  on public.team_events (user_id, team_id);

create index if not exists team_events_series_id_idx
  on public.team_events (series_id);

create index if not exists team_events_team_date_idx
  on public.team_events (team_id, event_date);

create index if not exists team_events_user_date_idx
  on public.team_events (user_id, event_date);

create index if not exists ai_communication_drafts_user_id_idx
  on public.ai_communication_drafts (user_id);

create index if not exists ai_communication_drafts_team_id_idx
  on public.ai_communication_drafts (team_id);

create index if not exists ai_communication_drafts_event_id_idx
  on public.ai_communication_drafts (event_id);

create index if not exists ai_communication_drafts_user_team_idx
  on public.ai_communication_drafts (user_id, team_id);

create index if not exists ai_communication_drafts_status_idx
  on public.ai_communication_drafts (status);

create index if not exists ai_communication_drafts_scheduled_for_idx
  on public.ai_communication_drafts (scheduled_for);

create index if not exists ai_communication_drafts_reminder_type_idx
  on public.ai_communication_drafts (reminder_type);

create unique index if not exists ai_communication_drafts_event_reminder_uidx
  on public.ai_communication_drafts (event_id, reminder_type)
  where reminder_type is not null;

create index if not exists event_update_logs_user_id_idx
  on public.event_update_logs (user_id);

create index if not exists event_update_logs_team_id_idx
  on public.event_update_logs (team_id);

create index if not exists event_update_logs_event_id_idx
  on public.event_update_logs (event_id);

create unique index if not exists event_rsvps_token_uidx
  on public.event_rsvps (token);

create unique index if not exists event_rsvps_event_contact_player_uidx
  on public.event_rsvps (
    event_id,
    contact_id,
    coalesce(player_name, '')
  );

create index if not exists event_rsvps_user_id_idx
  on public.event_rsvps (user_id);

create index if not exists event_rsvps_team_id_idx
  on public.event_rsvps (team_id);

create index if not exists event_rsvps_event_id_idx
  on public.event_rsvps (event_id);

create index if not exists event_rsvps_contact_id_idx
  on public.event_rsvps (contact_id);

create index if not exists event_rsvps_event_response_idx
  on public.event_rsvps (event_id, response);

alter table public.teams enable row level security;
alter table public.team_contacts enable row level security;
alter table public.team_events enable row level security;
alter table public.ai_communication_drafts enable row level security;
alter table public.event_update_logs enable row level security;
alter table public.event_rsvps enable row level security;

drop policy if exists "Users can read their own teams" on public.teams;
drop policy if exists "Users can insert their own teams" on public.teams;
drop policy if exists "Users can update their own teams" on public.teams;
drop policy if exists "Users can delete their own teams" on public.teams;

create policy "Users can read their own teams"
on public.teams
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own teams"
on public.teams
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own teams"
on public.teams
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own teams"
on public.teams
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read their own team contacts" on public.team_contacts;
drop policy if exists "Users can insert their own team contacts" on public.team_contacts;
drop policy if exists "Users can update their own team contacts" on public.team_contacts;
drop policy if exists "Users can delete their own team contacts" on public.team_contacts;

create policy "Users can read their own team contacts"
on public.team_contacts
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own team contacts"
on public.team_contacts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own team contacts"
on public.team_contacts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own team contacts"
on public.team_contacts
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read their own team events" on public.team_events;
drop policy if exists "Users can insert their own team events" on public.team_events;
drop policy if exists "Users can update their own team events" on public.team_events;
drop policy if exists "Users can delete their own team events" on public.team_events;

create policy "Users can read their own team events"
on public.team_events
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own team events"
on public.team_events
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own team events"
on public.team_events
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own team events"
on public.team_events
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read their own communication drafts" on public.ai_communication_drafts;
drop policy if exists "Users can insert their own communication drafts" on public.ai_communication_drafts;
drop policy if exists "Users can update their own communication drafts" on public.ai_communication_drafts;
drop policy if exists "Users can delete their own communication drafts" on public.ai_communication_drafts;

create policy "Users can read their own communication drafts"
on public.ai_communication_drafts
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own communication drafts"
on public.ai_communication_drafts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own communication drafts"
on public.ai_communication_drafts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own communication drafts"
on public.ai_communication_drafts
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read their own event update logs" on public.event_update_logs;
drop policy if exists "Users can insert their own event update logs" on public.event_update_logs;
drop policy if exists "Users can update their own event update logs" on public.event_update_logs;
drop policy if exists "Users can delete their own event update logs" on public.event_update_logs;

create policy "Users can read their own event update logs"
on public.event_update_logs
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own event update logs"
on public.event_update_logs
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own event update logs"
on public.event_update_logs
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own event update logs"
on public.event_update_logs
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read their own event RSVPs" on public.event_rsvps;
drop policy if exists "Users can insert their own event RSVPs" on public.event_rsvps;
drop policy if exists "Users can update their own event RSVPs" on public.event_rsvps;
drop policy if exists "Users can delete their own event RSVPs" on public.event_rsvps;

create policy "Users can read their own event RSVPs"
on public.event_rsvps
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own event RSVPs"
on public.event_rsvps
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own event RSVPs"
on public.event_rsvps
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own event RSVPs"
on public.event_rsvps
for delete
to authenticated
using (auth.uid() = user_id);

drop trigger if exists set_teams_updated_at on public.teams;
create trigger set_teams_updated_at
before update on public.teams
for each row
execute function public.set_updated_at();

drop trigger if exists set_team_contacts_updated_at on public.team_contacts;
create trigger set_team_contacts_updated_at
before update on public.team_contacts
for each row
execute function public.set_updated_at();

drop trigger if exists set_team_events_updated_at on public.team_events;
create trigger set_team_events_updated_at
before update on public.team_events
for each row
execute function public.set_updated_at();

drop trigger if exists set_ai_communication_drafts_updated_at on public.ai_communication_drafts;
create trigger set_ai_communication_drafts_updated_at
before update on public.ai_communication_drafts
for each row
execute function public.set_updated_at();

drop trigger if exists set_event_update_logs_updated_at on public.event_update_logs;
create trigger set_event_update_logs_updated_at
before update on public.event_update_logs
for each row
execute function public.set_updated_at();

drop trigger if exists set_event_rsvps_updated_at on public.event_rsvps;
create trigger set_event_rsvps_updated_at
before update on public.event_rsvps
for each row
execute function public.set_updated_at();
