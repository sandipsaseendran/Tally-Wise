-- ==============================================================================
-- Tally Wise - Production Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================
-- Execute this entire file in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table (Extends Supabase auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. Accounts & Cards Table
-- ------------------------------------------------------------------------------
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('checking', 'savings', 'credit', 'cash', 'investment')),
  balance numeric(14, 2) not null default 0.00,
  currency text not null default 'USD',
  is_active boolean not null default true,
  institution text default '',
  card_number text default '',
  theme_index integer default 0,
  last_updated text,
  created_at timestamptz default now()
);

alter table public.accounts enable row level security;

create policy "Users can access own accounts"
  on public.accounts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. Transactions Table
-- ------------------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date text not null,
  amount numeric(14, 2) not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  account text not null,
  payment_method text not null default 'digital',
  description text default '',
  recurring boolean default false,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

create policy "Users can access own transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for speedy transaction history queries
create index if not exists idx_transactions_user_date on public.transactions (user_id, date desc);

-- ------------------------------------------------------------------------------
-- 4. Budgets Table
-- ------------------------------------------------------------------------------
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  amount numeric(14, 2) not null,
  spent numeric(14, 2) not null default 0.00,
  period text not null check (period in ('monthly', 'yearly')) default 'monthly',
  start_date text,
  alert_threshold numeric(5, 2) default 80.00,
  rollover boolean default false,
  created_at timestamptz default now()
);

alter table public.budgets enable row level security;

create policy "Users can access own budgets"
  on public.budgets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. Goals Table
-- ------------------------------------------------------------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric(14, 2) not null,
  current_amount numeric(14, 2) not null default 0.00,
  deadline text,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  category text default '',
  description text default '',
  completed boolean default false,
  created_at timestamptz default now()
);

alter table public.goals enable row level security;

create policy "Users can access own goals"
  on public.goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 6. Bills Table
-- ------------------------------------------------------------------------------
create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(14, 2) not null,
  due_date text not null,
  frequency text not null default 'monthly',
  category text default '',
  account text default '',
  is_paid boolean default false,
  notes text default '',
  created_at timestamptz default now()
);

alter table public.bills enable row level security;

create policy "Users can access own bills"
  on public.bills for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7. Debts Table
-- ------------------------------------------------------------------------------
create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null default 'loan',
  balance numeric(14, 2) not null default 0.00,
  original_amount numeric(14, 2) not null default 0.00,
  interest_rate numeric(6, 2) default 0.00,
  minimum_payment numeric(14, 2) default 0.00,
  due_date text,
  start_date text,
  created_at timestamptz default now()
);

alter table public.debts enable row level security;

create policy "Users can access own debts"
  on public.debts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 8. Investments Table
-- ------------------------------------------------------------------------------
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null default 'stock',
  quantity numeric(14, 4) not null default 0,
  purchase_price numeric(14, 2) not null default 0.00,
  current_price numeric(14, 2) not null default 0.00,
  purchase_date text,
  symbol text default '',
  created_at timestamptz default now()
);

alter table public.investments enable row level security;

create policy "Users can access own investments"
  on public.investments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 9. Subscriptions Table
-- ------------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(14, 2) not null,
  billing_cycle text not null default 'monthly',
  next_billing_date text,
  category text default '',
  is_active boolean default true,
  website text default '',
  currency text default 'USD',
  created_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can access own subscriptions"
  on public.subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 10. Documents Table & Storage
-- ------------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  size bigint not null default 0,
  type text not null default '',
  upload_date text not null,
  file_path text,
  data_url text,
  created_at timestamptz default now()
);

alter table public.documents enable row level security;

create policy "Users can access own documents"
  on public.documents for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 11. User Settings Table
-- ------------------------------------------------------------------------------
create table if not exists public.settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  currency text not null default '$',
  dark_mode boolean not null default true,
  notifications boolean not null default true,
  budget_alerts boolean not null default true,
  bill_reminders boolean not null default true,
  show_balances boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.settings enable row level security;

create policy "Users can access own settings"
  on public.settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 12. Automatic User Initialization (Trigger on auth.users Signup)
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- 1. Insert Profile
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );

  -- 2. Insert Default Settings
  insert into public.settings (user_id, currency, dark_mode, notifications, budget_alerts, bill_reminders, show_balances)
  values (new.id, '$', true, true, true, true, true);

  -- 3. Provision Starter Default Accounts
  insert into public.accounts (user_id, name, type, balance, currency, is_active, institution, card_number, theme_index, last_updated)
  values
    (new.id, 'Chase Sapphire Reserve', 'credit', 5420.50, 'USD', true, 'JPMorgan Chase', '8842', 0, to_char(now(), 'YYYY-MM-DD')),
    (new.id, 'Amex Platinum Card', 'credit', 8320.00, 'USD', true, 'American Express', '4102', 1, to_char(now(), 'YYYY-MM-DD')),
    (new.id, 'Silicon Premier Checking', 'checking', 11450.75, 'USD', true, 'Silicon Bank', '9215', 2, to_char(now(), 'YYYY-MM-DD')),
    (new.id, 'Cash Vault Reserve', 'cash', 1500.00, 'USD', true, 'Personal Vault', '0000', 3, to_char(now(), 'YYYY-MM-DD'));

  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 13. Supabase Storage Bucket for Documents
-- ------------------------------------------------------------------------------
-- Insert 'documents' bucket into storage.buckets if not exists
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Storage RLS policies for documents bucket
create policy "Authenticated users can upload documents"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Authenticated users can read their own documents"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Authenticated users can delete their own documents"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
