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

alter table public.teams enable row level security;

drop policy if exists "Public can read teams" on public.teams;
create policy "Public can read teams"
on public.teams
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert teams" on public.teams;
create policy "Public can insert teams"
on public.teams
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can update teams" on public.teams;
create policy "Public can update teams"
on public.teams
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public can delete teams" on public.teams;
create policy "Public can delete teams"
on public.teams
for delete
to anon, authenticated
using (true);
