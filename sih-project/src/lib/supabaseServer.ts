import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using service role key (DO NOT expose service role key to the browser)
// Ensure you have these in .env.local:
// SUPABASE_URL=...
// SUPABASE_SERVICE_ROLE_KEY=...

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zgkvdcotjingnpehauew.supabase.co";
// Fallback to empty string if missing to avoid hardcoding invalid keys, but this will fail requests.
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

// Safely create client. If key is missing, operations will fail with 401/400 but not crash the server boot.
// We use a dummy key if empty to satisfy type requirement of string.
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || "placeholder-key-to-prevent-crash",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default supabaseAdmin;