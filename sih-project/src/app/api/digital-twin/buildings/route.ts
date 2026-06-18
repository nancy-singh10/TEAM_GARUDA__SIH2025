import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campus_id = searchParams.get("campus_id");

  if (!campus_id) return NextResponse.json({ error: "Campus ID required" }, { status: 400 });

  const { data, error } = await supabase
    .from("campus_buildings")
    .select("*")
    .eq("campus_admin_id", campus_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { campus_id, buildings } = body;

  // 1. Delete old buildings layout (Simple Sync Strategy)
  // In a real app, you might want to upsert, but deleting and rewriting is safer for a prototype layout sync
  await supabase.from("campus_buildings").delete().eq("campus_admin_id", campus_id);

  // 2. Insert new layout
  if (buildings.length > 0) {
    const formattedBuildings = buildings.map((b: any) => ({
      campus_admin_id: campus_id,
      id: b.id, // Keep frontend ID
      type: b.type,
      name: b.name,
      base_load: b.baseLoad,
      priority: b.priority,
      x: b.x,
      y: b.y,
      status: b.status,
      tokens: b.tokens || 0
    }));

    const { error } = await supabase.from("campus_buildings").insert(formattedBuildings);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}