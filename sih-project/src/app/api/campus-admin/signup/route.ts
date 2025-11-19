import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const CampusSignupSchema = z.object({
  username: z.string().min(3).max(100),
  password: z.string().min(6).max(255),
  campus_name: z.string().min(2).max(150),
  admin_name: z.string().min(2).max(150).optional(),
  email: z.string().email().optional(),
  state_admin_id: z.number().optional()
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = CampusSignupSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }
    const { username, password, campus_name, admin_name, email, state_admin_id } = parsed.data;

    const existing = await supabaseAdmin.from('campus_admin').select('campus_admin_id').eq('username', username).maybeSingle();
    if (existing.data) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const insertRes = await supabaseAdmin
      .from('campus_admin')
      .insert({ username, password: hashed, campus_name, admin_name, email, state_admin_id })
      .select('campus_admin_id, username, campus_name')
      .single();
    if (insertRes.error) {
      return NextResponse.json({ error: insertRes.error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, user: insertRes.data });
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
  }
}