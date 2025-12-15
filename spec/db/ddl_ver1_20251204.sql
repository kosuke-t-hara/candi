create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;



-- ===============================
-- 1. プロフィール
-- ===============================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  desired_annual_income integer, -- 希望年収（万円なら別カラムで単位を持っても良い）
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_current_timestamp_updated_at();


-- ===============================
-- 2. 応募（applications）
-- ===============================
create type public.application_source as enum (
  'agent',
  'direct',
  'scout',
  'self',
  'referral',
  'other'
);

create type public.application_stage as enum (
  'research',        -- 情報収集中
  'applied',         -- 応募済み
  'screening',       -- 書類選考中
  'interviewing',    -- 面接中（詳細は events で管理）
  'offered',         -- 内定
  'rejected',        -- 不合格
  'withdrawn'        -- 辞退
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  position_title text,
  source public.application_source not null default 'direct',
  stage public.application_stage not null default 'research',
  priority smallint,           -- 優先度(1=高〜5=低など)
  status_note text,            -- 状況メモ
  archived boolean not null default false,
  selection_phase smallint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

COMMENT ON COLUMN public.applications.selection_phase IS 'Selection phase (1-5): 1=research, 2=screening, 3=interviewing, 4=final, 5=offered';

create index applications_user_id_idx on public.applications(user_id);
create index applications_user_stage_idx on public.applications(user_id, stage);

create trigger set_applications_updated_at
before update on public.applications
for each row
execute procedure public.set_current_timestamp_updated_at();


-- ===============================
-- 3. 応募に紐づくイベント（面談・カジュアル面談など）
-- ===============================
create type public.application_event_kind as enum (
  'casual_talk',
  'screening_call',
  'interview_1st',
  'interview_2nd',
  'interview_3rd',
  'interview_final',
  'offer_meeting',
  'rejected',
  'withdrawn',
  'other'
);

create type public.application_event_outcome as enum (
  'scheduled',
  'done',
  'cancelled',
  'no_show',
  'unknown'
);

create table public.application_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  title text, -- 例: "一次面接", "CTOカジュアル"
  kind public.application_event_kind not null default 'other',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  outcome public.application_event_outcome not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index application_events_user_starts_idx
  on public.application_events(user_id, starts_at);

create trigger set_application_events_updated_at
before update on public.application_events
for each row
execute procedure public.set_current_timestamp_updated_at();


-- ===============================
-- 4. 成長ログ（growth_logs）
-- ===============================
create type public.growth_category as enum (
  'input',       -- インプット（勉強会・読書など）
  'output',      -- 登壇・記事執筆など
  'community',   -- コミュニティ・交流
  'project',     -- サイドプロジェクト
  'other'
);

create type public.growth_type as enum (
  'study_session',   -- 勉強会参加
  'conference',
  'reading',
  'talk',            -- LT/登壇
  'article',
  'side_project',
  'certification',
  'other'
);

create type public.growth_source as enum (
  'manual',
  'google_calendar',
  'imported',
  'other'
);

create table public.growth_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,                     -- 例: "React勉強会", "社内LT登壇"
  category public.growth_category not null,
  type public.growth_type not null default 'other',
  source public.growth_source not null default 'manual',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  impact_score smallint,                  -- ユーザー主観のインパクト(1〜5など)
  reflection text,                        -- 振り返り・学びメモ
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index growth_logs_user_starts_idx
  on public.growth_logs(user_id, starts_at);

create trigger set_growth_logs_updated_at
before update on public.growth_logs
for each row
execute procedure public.set_current_timestamp_updated_at();


-- ===============================
-- 5. 価値観スナップショット（value_snapshots）
-- ===============================
create type public.value_snapshot_source as enum (
  'initial_hearing',
  'periodic_checkin',
  'manual',
  'other'
);

create table public.value_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  captured_at timestamptz not null default now(),
  source public.value_snapshot_source not null default 'initial_hearing',
  -- レーダーチャート用スコア（0〜10想定）
  score_growth smallint,          -- 成長
  score_autonomy smallint,        -- 自律性
  score_reward smallint,          -- 報酬
  score_stability smallint,       -- 安定
  score_wlb smallint,             -- ワークライフバランス
  score_impact smallint,          -- 社会/事業インパクト
  notes text,                     -- その時のコメントなど
  created_at timestamptz not null default now()
);

create index value_snapshots_user_captured_idx
  on public.value_snapshots(user_id, captured_at);


-- ===============================
-- 6. AIインサイト（insights）
-- ===============================
create type public.insight_kind as enum (
  'inner_voice',   -- 内側の声
  'advice',        -- 助言
  'risk',          -- リスク兆候
  'highlight'      -- 強み・良い傾向
);

create table public.insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind public.insight_kind not null default 'inner_voice',
  title text,
  body text not null,
  related_from_date date,
  related_to_date date,
  related_value_snapshot_id uuid references public.value_snapshots(id) on delete set null,
  created_at timestamptz not null default now()
);

create index insights_user_created_idx
  on public.insights(user_id, created_at);


-- ===============================
-- 7. 今日の1問 - マスタ（daily_questions）
-- ===============================
create type public.question_frequency as enum (
  'daily',
  'weekly',
  'adhoc'
);

create table public.daily_questions (
  id bigserial primary key,
  code text unique,                -- 例: "q_today_growth"
  text text not null,              -- 質問文
  frequency public.question_frequency not null default 'daily',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);


-- ===============================
-- 8. 今日の1問 - 回答ログ（daily_answers）
-- ===============================
create table public.daily_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id bigint not null references public.daily_questions(id) on delete cascade,
  answered_at timestamptz not null default now(),
  answer_text text not null,
  -- AI解析用のスコアなどを後から足せるようにカラムを予約
  sentiment_score numeric,         -- -1.0〜1.0 など
  tags text[],                     -- キーワードタグ
  created_at timestamptz not null default now()
);

create index daily_answers_user_answered_idx
  on public.daily_answers(user_id, answered_at);


-- ===============================
-- 9. TODO（ホーム画面用）
-- ===============================
create type public.todo_status as enum (
  'open',
  'done',
  'snoozed'
);

create type public.todo_category as enum (
  'application',
  'growth',
  'personal',
  'other'
);

create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category public.todo_category not null default 'application',
  status public.todo_status not null default 'open',
  due_at timestamptz,
  related_application_id uuid references public.applications(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index todos_user_status_idx
  on public.todos(user_id, status);

create trigger set_todos_updated_at
before update on public.todos
for each row
execute procedure public.set_current_timestamp_updated_at();
