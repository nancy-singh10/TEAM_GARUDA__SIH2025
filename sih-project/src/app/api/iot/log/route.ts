import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"; // Import Supabase

// Initialize the Supabase client
const supabaseUrl = "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campus_id, solar, wind, load, battery_percent } = body;

    // 1. UPDATE LIVE STATUS (campus_analysis)
    const { error: updateError } = await supabase
      .from('campus_analysis')
      .update({ 
        energy_solar: solar, 
        energy_wind: wind, 
        load: load, 
        battery_percent: battery_percent 
      })
      .eq('campus_admin_id', campus_id);

    if (updateError) throw updateError;
    
    // 2. INSERT HISTORY (campus_history)
    const { error: insertError } = await supabase
      .from('campus_history')
      .insert([
        { 
          campus_admin_id: campus_id, 
          energy_solar: solar, 
          energy_wind: wind, 
          load: load, 
          battery_percent: battery_percent,
          recorded_at: new Date().toISOString() // NOW()
        }
      ]);

    if (insertError) throw insertError;

    // 3. AUTO-CLEANUP (Delete data older than 30 days)
    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error: cleanupError } = await supabase
      .from('campus_history')
      .delete()
      .lt('recorded_at', thirtyDaysAgo.toISOString());

    if (cleanupError) console.error("Cleanup warning:", cleanupError);

    return NextResponse.json({ success: true, message: "Data logged and history updated" });

  } catch (error) {
    console.error("IoT Log Error:", error);
    return NextResponse.json({ success: false, error: "Failed to log data" }, { status: 500 });
  }
}