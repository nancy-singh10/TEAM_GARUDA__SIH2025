import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Using fallback (which may be invalid).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
