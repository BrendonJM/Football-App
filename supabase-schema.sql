create extension if not exists "pgcrypto";

create table if not exists public.teams (
  id text primary key default gen_random_uuid()::text,
  team_name text not null,
  players_on_field integer not null check (players_on_field between 5 and 11),
  players jsonb not null default '[]'::jsonb,
  formations jsonb not null default '[]'::jsonb,
  selected_formation text not null,
  lineup jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.teams
  add column if not exists team_name text,
  add column if not exists players_on_field integer,
  add column if not exists players jsonb,
  add column if not exists formations jsonb,
  add column if not exists selected_formation text,
  add column if not exists lineup jsonb,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

update public.teams
set
  players = coalesce(players, '[]'::jsonb),
  formations = coalesce(formations, '[]'::jsonb),
  lineup = coalesce(lineup, '{}'::jsonb),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.teams enable row level security;

drop policy if exists "Users can read their own teams" on public.teams;
drop policy if exists "Users can insert their own teams" on public.teams;
drop policy if exists "Users can update their own teams" on public.teams;
drop policy if exists "Users can delete their own teams" on public.teams;
drop policy if exists "Public can read teams" on public.teams;
drop policy if exists "Public can insert teams" on public.teams;
drop policy if exists "Public can update teams" on public.teams;
drop policy if exists "Public can delete teams" on public.teams;

alter table public.teams
  drop constraint if exists teams_user_id_fkey;

alter table public.teams
  alter column user_id drop not null;

alter table public.teams
  drop column if exists user_id;

alter table public.teams
  drop column if exists owner_id;

alter table public.teams
  alter column team_name set not null,
  alter column players_on_field set not null,
  alter column players set default '[]'::jsonb,
  alter column players set not null,
  alter column formations set default '[]'::jsonb,
  alter column formations set not null,
  alter column selected_formation set not null,
  alter column lineup set default '{}'::jsonb,
  alter column lineup set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

alter table public.teams
  drop constraint if exists teams_players_on_field_check;

alter table public.teams
  add constraint teams_players_on_field_check
  check (players_on_field between 5 and 11);

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

create policy "Public can read teams"
on public.teams
for select
to anon, authenticated
using (true);

create policy "Public can insert teams"
on public.teams
for insert
to anon, authenticated
with check (true);

create policy "Public can update teams"
on public.teams
for update
to anon, authenticated
using (true)
with check (true);

create policy "Public can delete teams"
on public.teams
for delete
to anon, authenticated
using (true);
