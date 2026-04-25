create extension if not exists "pgcrypto";

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

create table if not exists public.app_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active_team_id text null references public.teams(id) on delete set null,
  last_page text not null default 'config' check (last_page in ('config', 'manage')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_teams_updated_at on public.teams;
create trigger set_teams_updated_at
before update on public.teams
for each row
execute function public.set_updated_at();

drop trigger if exists set_app_preferences_updated_at on public.app_preferences;
create trigger set_app_preferences_updated_at
before update on public.app_preferences
for each row
execute function public.set_updated_at();

alter table public.teams enable row level security;
alter table public.app_preferences enable row level security;

drop policy if exists "Users can read their own teams" on public.teams;
create policy "Users can read their own teams"
on public.teams
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own teams" on public.teams;
create policy "Users can insert their own teams"
on public.teams
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own teams" on public.teams;
create policy "Users can update their own teams"
on public.teams
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own teams" on public.teams;
create policy "Users can delete their own teams"
on public.teams
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own preferences" on public.app_preferences;
create policy "Users can read their own preferences"
on public.app_preferences
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own preferences" on public.app_preferences;
create policy "Users can insert their own preferences"
on public.app_preferences
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own preferences" on public.app_preferences;
create policy "Users can update their own preferences"
on public.app_preferences
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own preferences" on public.app_preferences;
create policy "Users can delete their own preferences"
on public.app_preferences
for delete
to authenticated
using ((select auth.uid()) = user_id);
