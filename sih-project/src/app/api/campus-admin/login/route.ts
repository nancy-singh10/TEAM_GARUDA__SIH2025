import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const CampusLoginSchema = z.object({
  username: z.string().min(3).max(100),
  password: z.string().min(6).max(255)
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = CampusLoginSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }
    const { username, password } = parsed.data;
    const res = await supabaseAdmin
      .from('campus_admin')
      .select('campus_admin_id, username, password, campus_name')
      .eq('username', username)
      .maybeSingle();
    if (!res.data) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const match = await bcrypt.compare(password, res.data.password);
    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ success: true, user: { id: res.data.campus_admin_id, username: res.data.username, campus_name: res.data.campus_name } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
  }
}