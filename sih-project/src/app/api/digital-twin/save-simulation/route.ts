import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Received simulation data:", JSON.stringify(body, null, 2));

        const {
            campus_id,
            date,
            time,
            wind_capacity,
            solar_capacity,
            battery_output,
            saved,
            battery_percentage,
            grid_used,
            total_load
        } = body;

        const { error } = await supabase
            .from('digital_twin_simulation_logs')
            .insert([
                {
                    campus_id,
                    simulation_date: date,
                    simulation_time: time,
                    wind_generated: wind_capacity,   // Mapped to new column
                    solar_generated: solar_capacity, // Mapped to new column
                    battery_output,
                    battery_percentage,
                    cost_saved: saved,               // Mapped to new column
                    grid_used,                       // New Column
                    total_load,                      // New Column
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error("Supabase Insert Error:", error);
            throw error;
        }

        return NextResponse.json({ success: true, message: "Simulation data saved" });

    } catch (error) {
        console.error("Simulation Log Error:", error);
        return NextResponse.json({ success: false, error: "Failed to save simulation data" }, { status: 500 });
    }
}
