-- 1. Energy Readings Table (Hourly granularity for 24h charts)
create table if not exists public.energy_readings (
    id uuid default gen_random_uuid() primary key,
    campus_id uuid not null references public.campus_admin(campus_admin_id),
    timestamp timestamptz not null,
    
    -- Source Type: 'actual' (Manual Slider / Real) vs 'predicted' (Auto Pilot)
    is_predicted boolean default false,
    
    -- Values
    solar_output numeric default 0,
    wind_output numeric default 0,
    grid_usage numeric default 0,
    consumption numeric default 0,
    battery_level numeric default 0,
    
    created_at timestamptz default now()
);

-- Index for fast time-range queries
create index if not exists idx_energy_readings_timestamp on public.energy_readings(timestamp);
create index if not exists idx_energy_readings_campus on public.energy_readings(campus_id);
create index if not exists idx_energy_readings_type on public.energy_readings(is_predicted);

-- 3. Simulation Controller (For "Time Travel" Sync)
create table if not exists public.simulation_state (
    campus_id uuid primary key references public.campus_admin(campus_admin_id),
    is_manual_mode boolean default false, -- TRUE = Slider is Active, FALSE = Auto Pilot (Real/Predicted)
    simulated_timestamp timestamptz default now(),
    last_updated timestamptz default now()
);

-- 4. ML Archive (Long-term history for "ML Mode" Prediction Training)
-- Stores hourly data for past years (e.g., 3-5 years) to train the model.
create table if not exists public.energy_history (
    id uuid default gen_random_uuid() primary key,
    campus_id uuid not null references public.campus_admin(campus_admin_id),
    timestamp timestamptz not null,
    
    -- Actual generation recorded
    solar_output numeric default 0,
    wind_output numeric default 0,
    
    -- Weather features essential for ML
    temperature_c numeric,
    cloud_cover_pct numeric,
    wind_speed_ms numeric,
    
    created_at timestamptz default now()
);

create index if not exists idx_energy_history_range on public.energy_history(campus_id, timestamp);

-- 2. Monthly Aggregates Table (Historical data for bar charts)
create table if not exists public.monthly_aggregates (
    id uuid default gen_random_uuid() primary key,
    campus_id uuid not null references public.campus_admin(campus_admin_id),
    billing_period date not null, -- First day of the month, e.g., '2024-11-01'
    total_bill numeric default 0,
    savings_achieved numeric default 0,
    carbon_saved_kg numeric default 0,
    savings_target numeric default 0,
    carbon_target numeric default 0,
    created_at timestamptz default now()
);

-- Index for sorting by date
create index if not exists idx_monthly_aggregates_date on public.monthly_aggregates(billing_period);
