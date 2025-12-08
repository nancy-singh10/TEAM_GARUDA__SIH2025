import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // Securely get campus_id from HttpOnly cookie
    const cookieStore = await cookies();
    const campus_id = cookieStore.get('campus_admin_id')?.value;

    if (!campus_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the capacities you saved during Sign Up
    const { data, error } = await supabase
      .from('campus_admin')
      .select('solar_capacity, wind_capacity, battery_capacity, campus_load_max')
      .eq('campus_admin_id', campus_id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Campus not found" }, { status: 404 });

    return NextResponse.json(data);

  } catch (error) {
    console.error("Capacity Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch capacities" }, { status: 500 });
  }
}
