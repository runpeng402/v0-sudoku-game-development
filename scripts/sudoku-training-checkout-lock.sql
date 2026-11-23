create table if not exists public.sudoku_training_checkouts (
  mode text not null check (mode in ('test_mode', 'live_mode')),
  pack text not null,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  session_id text,
  checkout_url text,
  created_at timestamptz not null default now(),
  primary key (mode, pack, buyer_id),
  check ((session_id is null) = (checkout_url is null))
);

alter table public.sudoku_training_checkouts enable row level security;
revoke all on public.sudoku_training_checkouts from public, anon, authenticated;
grant select, insert, update, delete on public.sudoku_training_checkouts to service_role;
