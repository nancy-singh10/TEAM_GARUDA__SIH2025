import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3ZkY290amluZ25wZWhhdWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NjM0ODIsImV4cCI6MjA3ODQzOTQ4Mn0.pZVEwm-z3qvXLTu9a7Av3fxwLIVhCc_wqBnBUlXy0_s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
