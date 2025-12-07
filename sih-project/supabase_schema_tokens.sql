-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Token Settings (Global configuration)
create table if not exists public.token_settings (
  id uuid primary key default uuid_generate_v4(),
  conversion_rate_energy_to_token numeric not null default 1.0, -- 1 kWh = X Tokens
  conversion_rate_token_to_energy numeric not null default 1.0, -- 1 Token = Y kWh (for buying)
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert default settings if empty
insert into public.token_settings (conversion_rate_energy_to_token, conversion_rate_token_to_energy)
select 1.0, 1.0
where not exists (select 1 from public.token_settings);

-- 2. Token Wallets (One per Campus Admin)
create table if not exists public.token_wallets (
  wallet_id uuid primary key default uuid_generate_v4(),
  campus_admin_id bigint references public.campus_admin(campus_admin_id) on delete cascade unique,
  balance numeric not null default 0.0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Token Transactions (Immutable Ledger)
create table if not exists public.token_transactions (
  transaction_id uuid primary key default uuid_generate_v4(),
  wallet_id uuid references public.token_wallets(wallet_id) on delete cascade,
  type text not null check (type in ('MINT_REWARD', 'BURN_PURCHASE', 'TRANSFER', 'ADMIN_ADJUSTMENT')),
  amount numeric not null, -- Positive for Mint, Negative for Burn
  energy_amount numeric, -- Optional: related kWh amount
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Indexes for performance
create index if not exists idx_token_transactions_wallet_id on public.token_transactions(wallet_id);
create index if not exists idx_token_wallets_campus_admin_id on public.token_wallets(campus_admin_id);

-- Trigger to create a wallet when a campus_admin is created (Optional, but good practice)
-- OR just handle it lazily in the API. For now, let's stick to API handling to avoid complex SQL triggers if user is not comfortable.

-- RLS Policies
-- NOTE: We are removing the default RLS policies here because the application uses custom authentication (campus_admin_id in cookies) 
-- and accesses the database via the text 'supabaseAdmin' client in API routes, which bypasses RLS.
-- If you strictly need RLS, you would need to link auth.users to campus_admin table.

alter table public.token_settings enable row level security;
create policy "Public read settings" on public.token_settings for select using (true);
-- Kept settings public read as it's harmless and useful.

-- Removed 'Campus Admin view own wallet' policy to avoid UUID vs BIGINT error.

