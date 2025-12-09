-- Store Items available for purchase
create table if not exists public.store_items (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  token_cost numeric not null,
  category text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Seed some default items
insert into public.store_items (name, description, token_cost, category)
select 'EV Charging Station', 'Level 2 Electric Vehicle charging station for campus parking slots.', 5000, 'Infrastructure'
where not exists (select 1 from public.store_items where name = 'EV Charging Station');

insert into public.store_items (name, description, token_cost, category)
select 'Smart Electric Geyser', 'Energy-efficient IoT-enabled geyser for hostels.', 800, 'Appliances'
where not exists (select 1 from public.store_items where name = 'Smart Electric Geyser');

insert into public.store_items (name, description, token_cost, category)
select 'Solar Street Light', 'Standalone solar street light with motion sensor.', 1200, 'Infrastructure'
where not exists (select 1 from public.store_items where name = 'Solar Street Light');

insert into public.store_items (name, description, token_cost, category)
select 'Smart Meter', 'Advanced metering infrastructure for precise monitoring.', 1500, 'Devices'
where not exists (select 1 from public.store_items where name = 'Smart Meter');

-- Requests from "Block Admins" (simulated or real entities within a campus)
create table if not exists public.block_requests (
  id uuid primary key default uuid_generate_v4(),
  campus_admin_id bigint references public.campus_admin(campus_admin_id) on delete cascade,
  block_identifier text not null, -- e.g., "Hostel Block A", "Academic Block 3"
  item_id uuid references public.store_items(id) on delete set null,
  status text not null check (status in ('PENDING', 'APPROVED', 'REJECTED')) default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  approved_at timestamp with time zone
);

-- Index
create index if not exists idx_block_requests_campus on public.block_requests(campus_admin_id);
create index if not exists idx_block_requests_status on public.block_requests(status);
