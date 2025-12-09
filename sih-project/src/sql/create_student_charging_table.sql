-- Create a table to store student charging sessions
create table if not exists student_charging_logs (
  id uuid default gen_random_uuid() primary key,
  phone_number text not null,
  energy_used float not null, -- Energy consumed in kWh
  tokens_earned int not null, -- Green points earned
  campus_admin_id uuid not null, -- Link to the campus admin
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Optional but recommended)
alter table student_charging_logs enable row level security;

-- Policy: Campus admins can view their own logs
create policy "Campus Admins can view own logs"
  on student_charging_logs for select
  using (auth.uid() = campus_admin_id);

-- Policy: Campus admins can insert logs (simulation)
create policy "Campus Admins can insert logs"
  on student_charging_logs for insert
  with check (auth.uid() = campus_admin_id);
