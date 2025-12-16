-- 1. Application Links Table
create table public.application_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  label text,
  url text not null,
  sort_order smallint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint application_links_url_format check (url ~* '^https?://')
);

create unique index application_links_unique_sort
  on public.application_links(application_id, sort_order);

-- 2. Application Event Links Table
create table public.application_event_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_event_id uuid not null references public.application_events(id) on delete cascade,
  label text,
  url text not null,
  sort_order smallint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint application_event_links_url_format check (url ~* '^https?://')
);

create unique index application_event_links_unique_sort
  on public.application_event_links(application_event_id, sort_order);

-- 3. Max 5 Links Trigger for Applications
create or replace function public.enforce_max_5_application_links()
returns trigger language plpgsql as $$
begin
  if (
    select count(*) 
    from public.application_links 
    where application_id = new.application_id
  ) >= 5 then
    raise exception 'Maximum 5 links per application.';
  end if;
  return new;
end $$;

create trigger trg_application_links_max5
before insert on public.application_links
for each row execute function public.enforce_max_5_application_links();

-- 4. Max 5 Links Trigger for Events
create or replace function public.enforce_max_5_event_links()
returns trigger language plpgsql as $$
begin
  if (
    select count(*) 
    from public.application_event_links 
    where application_event_id = new.application_event_id
  ) >= 5 then
    raise exception 'Maximum 5 links per application event.';
  end if;
  return new;
end $$;

create trigger trg_application_event_links_max5
before insert on public.application_event_links
for each row execute function public.enforce_max_5_event_links();

-- 5. RLS Policies
alter table public.application_links enable row level security;

create policy "application_links_own"
on public.application_links
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

alter table public.application_event_links enable row level security;

create policy "application_event_links_own"
on public.application_event_links
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
