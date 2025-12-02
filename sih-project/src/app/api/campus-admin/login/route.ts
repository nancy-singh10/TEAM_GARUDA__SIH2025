import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer'; // ✅ FIXED: Added curly braces
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const CampusLoginSchema = z.object({
  username: z.string().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required")
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = CampusLoginSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { username, password } = parsed.data;

    // ✅ FIXED: Check BOTH username and email columns using .or()
    const { data: user, error } = await supabaseAdmin
      .from('campus_admin')
      .select('campus_admin_id, username, password, campus_name, email')
      .or(`username.eq.${username},email.eq.${username}`) 
      .maybeSingle();

    if (error) {
        console.error("Login DB Error:", error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Compare Password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Success
    return NextResponse.json({ 
        success: true, 
        user: { 
            id: user.campus_admin_id, 
            username: user.username, 
            campus_name: user.campus_name 
        } 
    });

  } catch (e: any) {
    console.error("Login Server Error:", e);
    return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
  }
}