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
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_events (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  team_id text not null references public.teams(id) on delete cascade,
  event_title text not null,
  event_date date not null,
  event_time text,
  location text,
  notes text,
  status text not null default 'planned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint team_events_status_check check (status in ('planned', 'sent', 'cancelled'))
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
  constraint event_update_logs_delivery_method_check check (delivery_method in ('email', 'sms_preview', 'copy'))
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

create index if not exists event_update_logs_user_id_idx
  on public.event_update_logs (user_id);

create index if not exists event_update_logs_team_id_idx
  on public.event_update_logs (team_id);

create index if not exists event_update_logs_event_id_idx
  on public.event_update_logs (event_id);

alter table public.teams enable row level security;
alter table public.team_contacts enable row level security;
alter table public.team_events enable row level security;
alter table public.event_update_logs enable row level security;

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

drop trigger if exists set_event_update_logs_updated_at on public.event_update_logs;
create trigger set_event_update_logs_updated_at
before update on public.event_update_logs
for each row
execute function public.set_updated_at();
