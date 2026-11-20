create table if not exists public.sudoku_training_payments (
  mode text not null check (mode in ('test_mode', 'live_mode')),
  payment_id text not null,
  pack text not null,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  revoked boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (mode, payment_id)
);

create index if not exists sudoku_training_active_purchases
  on public.sudoku_training_payments (mode, pack, buyer_id) where not revoked;

alter table public.sudoku_training_payments enable row level security;
revoke all on public.sudoku_training_payments from public, anon, authenticated;
grant select, insert, update on public.sudoku_training_payments to service_role;
