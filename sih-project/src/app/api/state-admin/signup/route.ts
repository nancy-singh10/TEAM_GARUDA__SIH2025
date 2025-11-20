import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const StateSignupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email().optional().or(z.literal('')),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = StateSignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    // 1. Check if username exists
    const { data: existingUser } = await supabaseAdmin
      .from('state_admin')
      .select('username')
      .eq('username', data.username)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    // 2. Create Auth User
    // If no email provided, generate a fake one for Auth purposes
    const authEmail = data.email || `${data.username}@state.gov`;
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: authEmail,
      password: data.password,
      email_confirm: true
    });

    if (authError || !authData.user) {
      console.error("Auth Creation Failed:", authError);
      return NextResponse.json({ error: 'Failed to register auth user' }, { status: 500 });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. Insert into DB
    const { error: dbError } = await supabaseAdmin
      .from('state_admin')
      .insert({
        username: data.username,
        password: hashedPassword,
        auth_id: authData.user.id, // <--- Crucial Link
        // Add email column here ONLY if you added it to your state_admin table structure
        // email: data.email 
      });

    if (dbError) {
      // Rollback: Delete auth user if DB insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      console.error("DB Insert Failed:", dbError);
      return NextResponse.json({ error: 'Database error', details: dbError }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (e: any) {
    console.error("Server Error:", e);
    return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
  }
}