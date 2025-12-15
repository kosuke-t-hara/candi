-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.application_events enable row level security;
alter table public.growth_logs enable row level security;

-- 以降は未作成
alter table public.value_snapshots enable row level security;
alter table public.insights enable row level security;
alter table public.daily_answers enable row level security;
alter table public.todos enable row level security;

-- Profiles
-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Applications
create policy "Users can view own applications"
  on public.applications for select
  using ( auth.uid() = user_id );

create policy "Users can insert own applications"
  on public.applications for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own applications"
  on public.applications for update
  using ( auth.uid() = user_id );

create policy "Users can delete own applications"
  on public.applications for delete
  using ( auth.uid() = user_id );

-- Application Events
create policy "Users can view own application events"
  on public.application_events for select
  using ( auth.uid() = user_id );

create policy "Users can insert own application events"
  on public.application_events for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own application events"
  on public.application_events for update
  using ( auth.uid() = user_id );

create policy "Users can delete own application events"
  on public.application_events for delete
  using ( auth.uid() = user_id );

-- Growth Logs
create policy "Users can view own growth logs"
  on public.growth_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert own growth logs"
  on public.growth_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own growth logs"
  on public.growth_logs for update
  using ( auth.uid() = user_id );

create policy "Users can delete own growth logs"
  on public.growth_logs for delete
  using ( auth.uid() = user_id );


----- 以降は未作成


-- Value Snapshots
create policy "Users can view own value snapshots"
  on public.value_snapshots for select
  using ( auth.uid() = user_id );

create policy "Users can insert own value snapshots"
  on public.value_snapshots for insert
  with check ( auth.uid() = user_id );

-- Insights
create policy "Users can view own insights"
  on public.insights for select
  using ( auth.uid() = user_id );

-- Daily Answers
create policy "Users can view own daily answers"
  on public.daily_answers for select
  using ( auth.uid() = user_id );

create policy "Users can insert own daily answers"
  on public.daily_answers for insert
  with check ( auth.uid() = user_id );

-- Todos
create policy "Users can view own todos"
  on public.todos for select
  using ( auth.uid() = user_id );

create policy "Users can insert own todos"
  on public.todos for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own todos"
  on public.todos for update
  using ( auth.uid() = user_id );

create policy "Users can delete own todos"
  on public.todos for delete
  using ( auth.uid() = user_id );
