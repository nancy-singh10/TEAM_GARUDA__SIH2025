import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { campus_id } = body;

        console.log(`Resetting simulation for campus: ${campus_id}`);

        // Delete all rows for this campus to reset the day
        const { error } = await supabase
            .from('digital_twin_simulation_logs')
            .delete()
            .eq('campus_id', campus_id);

        if (error) {
            console.error("Supabase Delete Error:", error);
            throw error;
        }

        return NextResponse.json({ success: true, message: "Simulation reset successfully" });

    } catch (error) {
        console.error("Simulation Reset Error:", error);
        return NextResponse.json({ success: false, error: "Failed to reset simulation" }, { status: 500 });
    }
}
