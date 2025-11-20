import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using service role key (DO NOT expose service role key to the browser)
// Ensure you have these in .env.local:
// SUPABASE_URL=...
// SUPABASE_SERVICE_ROLE_KEY=...

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!supabaseUrl || !supabaseServiceRoleKey) {
  // Throwing helps surface misconfiguration early during route handler execution
  throw new Error('Missing Supabase environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabaseAdmin;