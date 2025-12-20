
-- ===============================
-- Toro Entries (toro_entries)
-- ===============================

create table public.toro_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for faster retrieval by user and time
create index toro_entries_user_created_idx
  on public.toro_entries(user_id, created_at desc);

-- Updated_at trigger
create trigger set_toro_entries_updated_at
before update on public.toro_entries
for each row
execute procedure public.set_current_timestamp_updated_at();

-- RLS Policies
alter table public.toro_entries enable row level security;

create policy "Users can view their own toro entries"
  on public.toro_entries
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own toro entries"
  on public.toro_entries
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own toro entries"
  on public.toro_entries
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own toro entries"
  on public.toro_entries
  for delete
  using (auth.uid() = user_id);
