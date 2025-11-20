import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const CampusSignupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  campus_name: z.string(),
  admin_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  campus_load_min: z.number().optional(),
  campus_load_max: z.number().optional(),
  no_of_battery_sources: z.number().optional(),
  solar_capacity: z.number().optional(),
  wind_capacity: z.number().optional(),
  battery_capacity: z.number().optional(),
  location: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CampusSignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    // 1. Check if username exists
    const { data: existingUser } = await supabaseAdmin
      .from('campus_admin')
      .select('username')
      .eq('username', data.username)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    // 2. Get a valid State Admin ID (Dynamic Fix)
    // Instead of hardcoding '1', we fetch the first available state_admin_id
    const { data: stateAdmin, error: stateError } = await supabaseAdmin
      .from('state_admin')
      .select('state_admin_id')
      .limit(1)
      .maybeSingle();

    if (stateError || !stateAdmin) {
      console.error("State Admin Lookup Failed:", stateError);
      return NextResponse.json({ error: 'No State Admin found to link campus to. Create a State Admin first.' }, { status: 500 });
    }

    const validStateAdminId = stateAdmin.state_admin_id;

    // 3. Create Auth User
    const authEmail = data.email || `${data.username}@energyflow.app`;
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: authEmail,
      password: data.password,
      email_confirm: true
    });

    if (authError || !authData.user) {
      console.error("Auth Creation Failed:", authError);
      return NextResponse.json({ error: 'Failed to register auth user' }, { status: 500 });
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 5. Insert into DB
    const { error: dbError } = await supabaseAdmin
      .from('campus_admin')
      .insert({
        username: data.username,
        password: hashedPassword,
        campus_name: data.campus_name,
        auth_id: authData.user.id,
        admin_name: data.admin_name,
        email: data.email,
        campus_load_min: data.campus_load_min,
        campus_load_max: data.campus_load_max,
        no_of_battery_sources: data.no_of_battery_sources,
        solar_capacity: data.solar_capacity,
        wind_capacity: data.wind_capacity,
        battery_capacity: data.battery_capacity,
        location: data.location,
        state_admin_id: validStateAdminId // Uses the real ID found in step 2
      });

    if (dbError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      console.error("DB Insert Failed:", dbError);
      return NextResponse.json({ error: 'Database error', details: dbError }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (e: any) {
    console.error("Signup Error:", e);
    return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
  }
}