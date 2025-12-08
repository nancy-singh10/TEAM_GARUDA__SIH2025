-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. Solar System Tables
-- ==========================================

-- Configuration for a Campus' Solar System
create table if not exists public.solar_system_config (
    id uuid primary key default uuid_generate_v4(),
    campus_admin_id bigint references public.campus_admin(campus_admin_id) on delete cascade unique,
    system_capacity_kw numeric not null,
    total_panels int default 0,
    efficiency numeric default 0.18,
    installation_date date default CURRENT_DATE,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Daily Summary (Aggregated data)
create table if not exists public.solar_daily_summary (
    id uuid primary key default uuid_generate_v4(),
    campus_admin_id bigint references public.campus_admin(campus_admin_id) on delete cascade,
    record_date date not null,
    total_generation_kwh numeric default 0,
    peak_generation_kw numeric default 0,
    peak_time time,
    avg_cloud_cover numeric default 0, -- 0-100%
    weather_condition varchar(50), -- Sunny, Cloudy, etc.
    prediction_accuracy numeric, -- comparison with forecast
    is_forecast boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    unique(campus_admin_id, record_date, is_forecast)
);

-- Hourly Readings (Granular data)
create table if not exists public.solar_hourly_readings (
    id uuid primary key default uuid_generate_v4(),
    campus_admin_id bigint references public.campus_admin(campus_admin_id) on delete cascade,
    record_date date not null,
    record_time time not null,
    actual_generation_kw numeric default 0,
    predicted_generation_kw numeric default 0,
    solar_irradiance numeric, -- W/m2
    temperature_c numeric,
    weather_icon varchar(50),
    created_at timestamp with time zone default timezone('utc'::text, now())
);
-- Index for faster time-series queries
create index if not exists idx_solar_readings_date on public.solar_hourly_readings(campus_admin_id, record_date);


-- ==========================================
-- 2. Wind System Tables
-- ==========================================

-- Configuration for a Campus' Wind System
create table if not exists public.wind_system_config (
    id uuid primary key default uuid_generate_v4(),
    campus_admin_id bigint references public.campus_admin(campus_admin_id) on delete cascade unique,
    system_capacity_kw numeric not null,
    total_turbines int default 0,
    active_turbines int default 0,
    avg_wind_speed_ms numeric default 0,
    installation_date date default CURRENT_DATE,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Daily Summary
create table if not exists public.wind_daily_summary (
    id uuid primary key default uuid_generate_v4(),
    campus_admin_id bigint references public.campus_admin(campus_admin_id) on delete cascade,
    record_date date not null,
    total_generation_kwh numeric default 0,
    peak_generation_kw numeric default 0,
    peak_time time,
    avg_wind_speed_ms numeric default 0,
    weather_condition varchar(50),
    prediction_accuracy numeric,
    is_forecast boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    unique(campus_admin_id, record_date, is_forecast)
);

-- Hourly Readings
create table if not exists public.wind_hourly_readings (
    id uuid primary key default uuid_generate_v4(),
    campus_admin_id bigint references public.campus_admin(campus_admin_id) on delete cascade,
    record_date date not null,
    record_time time not null,
    actual_generation_kw numeric default 0,
    predicted_generation_kw numeric default 0,
    wind_speed_ms numeric,
    wind_direction_deg numeric,
    weather_icon varchar(50),
    created_at timestamp with time zone default timezone('utc'::text, now())
);
-- Index for faster time-series queries
create index if not exists idx_wind_readings_date on public.wind_hourly_readings(campus_admin_id, record_date);
