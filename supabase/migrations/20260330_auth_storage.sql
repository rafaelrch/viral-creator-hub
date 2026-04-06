-- Clipzy: autenticação + projetos + armazenamento de vídeos
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update on auth.users
for each row
execute procedure public.handle_new_user();

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute procedure public.set_updated_at();

create table if not exists public.user_videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  storage_path text not null,
  public_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.user_videos enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Users can view own project" on public.projects;
create policy "Users can view own project"
on public.projects
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own project" on public.projects;
create policy "Users can insert own project"
on public.projects
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own project" on public.projects;
create policy "Users can update own project"
on public.projects
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view own videos" on public.user_videos;
create policy "Users can view own videos"
on public.user_videos
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own videos" on public.user_videos;
create policy "Users can insert own videos"
on public.user_videos
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own videos" on public.user_videos;
create policy "Users can delete own videos"
on public.user_videos
for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('videos', 'videos', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload own storage videos" on storage.objects;
create policy "Users can upload own storage videos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'videos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can read own storage videos" on storage.objects;
create policy "Users can read own storage videos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'videos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own storage videos" on storage.objects;
create policy "Users can update own storage videos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'videos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'videos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own storage videos" on storage.objects;
create policy "Users can delete own storage videos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'videos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
