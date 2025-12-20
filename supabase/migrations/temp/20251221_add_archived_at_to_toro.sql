-- Toro /past アーカイブ機能用カラム追加
alter table public.toro_entries add column archived_at timestamptz;
