
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3ZkY290amluZ25wZWhhdWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NjM0ODIsImV4cCI6MjA3ODQzOTQ4Mn0.pZVEwm-z3qvXLTu9a7Av3fxwLIVhCc_wqBnBUlXy0_s";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  const { data: campusData, error: campusError } = await supabase
    .from('campus_admin')
    .select('*')
    .limit(5);

  if (campusError) {
    console.error('Error fetching campus_admin:', campusError);
  } else {
    console.log('Campus Admin Data:', JSON.stringify(campusData, null, 2));
  }

  const { data: comparisonData, error: comparisonError } = await supabase
    .from('campus_comparison')
    .select('*')
    .limit(5);

  if (comparisonError) {
    console.error('Error fetching campus_comparison:', comparisonError);
  } else {
    console.log('Campus Comparison Data:', JSON.stringify(comparisonData, null, 2));
  }
}

checkData();
