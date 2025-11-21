import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using service role key (DO NOT expose service role key to the browser)
// Ensure you have these in .env.local:
// SUPABASE_URL=...
// SUPABASE_SERVICE_ROLE_KEY=...

const supabaseUrl = "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3ZkY290amluZ25wZWhhdWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg2MzQ4MiwiZXhwIjoyMDc4NDM5NDgyfQ.S9nmEfjtwr-ihSTgmFI64Y30umZ3VqHpqrcOxd8Him8";
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