import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const LoginSchema = z.object({
  username: z.string().min(3).max(100),
  password: z.string().min(6).max(255)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }
    const { username, password } = parsed.data;
    const res = await supabaseAdmin.from('state_admin').select('state_admin_id, username, password').eq('username', username).maybeSingle();
    if (!res.data) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const match = await bcrypt.compare(password, res.data.password);
    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Issue a very simple session token placeholder (replace with JWT/NextAuth later)
    return NextResponse.json({ success: true, user: { id: res.data.state_admin_id, username: res.data.username } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
  }
}