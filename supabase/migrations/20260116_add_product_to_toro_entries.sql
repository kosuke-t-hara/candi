-- Add product column to toro_entries and set check constraint
alter table public.toro_entries 
add column product text not null default 'candi';

CREATE INDEX IF NOT EXISTS idx_toro_entries_product
ON public.toro_entries (product);

alter table public.toro_entries
add constraint toro_entries_product_check
check (product in ('candi', 'toro'));
