-- PenDone Data Core Schema & Row Level Security (RLS)
-- Strict 3-Platform Stack: Google AI Studio + GitHub + Supabase (with BYOS Google Drive)

-- Enable UUID extension if not already active
create extension if not exists "pgcrypto";

-- 1. User Profiles (linked 1:1 to Supabase Auth users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'builder', 'admin')),
  google_drive_connected boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. PenDone Store Apps (built by creators, listed in PenDone Store)
create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  builder_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text,
  category text not null default 'Productivity',
  manifest_json jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. BYOS Storage Pointers (stores Drive file/folder IDs & field rules, NOT bulk user files)
create table if not exists public.user_app_storage_pointers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  app_id uuid not null references public.apps(id) on delete cascade,
  provider text not null default 'google_drive',
  drive_folder_id text,
  drive_file_id text,
  storage_path text not null, -- e.g. /PenDone/task-vault/data.json
  updatable_fields text[] not null default '{}'::text[],
  read_only_fields text[] not null default '{}'::text[],
  access_granted boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (user_id, app_id)
);

-- 4. API Metering & Quota Logs (populated server-side by Edge Functions)
create table if not exists public.api_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  app_id uuid references public.apps(id) on delete set null,
  endpoint text not null,
  api_calls integer not null default 1 check (api_calls > 0),
  bytes_transferred bigint not null default 0 check (bytes_transferred >= 0),
  status_code integer not null default 200,
  created_at timestamptz not null default now()
);

-- 5. Revenue Ledger (server-calculated 10% PenDone fee, 90% builder share)
create table if not exists public.revenue_transactions (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete restrict,
  builder_id uuid not null references public.profiles(id) on delete restrict,
  payer_user_id uuid references public.profiles(id) on delete set null,
  gross_amount numeric(12, 2) not null check (gross_amount > 0),
  platform_fee_10pct numeric(12, 2) generated always as (round(gross_amount * 0.10, 2)) stored,
  net_to_builder_90pct numeric(12, 2) generated always as (round(gross_amount * 0.90, 2)) stored,
  currency text not null default 'USD',
  status text not null default 'recorded' check (status in ('pending', 'recorded', 'paid_out', 'refunded')),
  created_at timestamptz not null default now()
);

-- Enforce that builder_id matches apps.builder_id automatically
create or replace function public.sync_transaction_builder()
returns trigger
language plpgsql
as $$
declare
  v_builder_id uuid;
begin
  select builder_id into v_builder_id from public.apps where id = new.app_id;
  if v_builder_id is null then
    raise exception 'App % not found', new.app_id;
  end if;
  new.builder_id := v_builder_id;
  return new;
end;
$$;

drop trigger if exists trg_sync_transaction_builder on public.revenue_transactions;
create trigger trg_sync_transaction_builder
before insert on public.revenue_transactions
for each row execute function public.sync_transaction_builder();

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.apps enable row level security;
alter table public.user_app_storage_pointers enable row level security;
alter table public.api_usage_logs enable row level security;
alter table public.revenue_transactions enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Apps policies (published apps are readable by anyone; builders manage their own apps)
create policy "Anyone can view published apps"
  on public.apps for select
  using (is_published = true or auth.uid() = builder_id);

create policy "Builders can insert own apps"
  on public.apps for insert
  with check (auth.uid() = builder_id);

create policy "Builders can update own apps"
  on public.apps for update
  using (auth.uid() = builder_id);

-- Storage pointers policies (user owns their pointer record; field allowlists enforced in Edge Function)
create policy "Users can manage own storage pointers"
  on public.user_app_storage_pointers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- API usage logs (users/builders can read their own logs; Edge Function service role writes logs)
create policy "Users or builders can view relevant api logs"
  on public.api_usage_logs for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.apps a
      where a.id = api_usage_logs.app_id and a.builder_id = auth.uid()
    )
  );

-- Revenue transactions (builders can view earnings on their apps; payers can view their own payments)
create policy "Builders and payers can view own transactions"
  on public.revenue_transactions for select
  using (auth.uid() = builder_id or auth.uid() = payer_user_id);
