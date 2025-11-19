import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function migrate(table, idCol, passCol) {
  const { data, error } = await supabase.from(table).select(`${idCol}, ${passCol}`);
  if (error) throw error;
  for (const row of data) {
    if (!row[passCol].startsWith('$2a$')) {
      const hashed = await bcrypt.hash(row[passCol], 10);
      const { error: upErr } = await supabase.from(table).update({ [passCol]: hashed }).eq(idCol, row[idCol]);
      if (upErr) console.error('Failed to update', table, row[idCol], upErr.message);
    }
  }
  console.log(`Migration complete for ${table}`);
}
await migrate('state_admin', 'state_admin_id', 'password');
await migrate('campus_admin', 'campus_admin_id', 'password');

import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';
import { z } from 'zod';

const SignupSchema = z.object({
  username: z.string().min(3).max(100),
  password: z.string().min(6).max(255)
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = SignupSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }
    const { username, password } = parsed.data;

    // Check uniqueness
    const existing = await supabaseAdmin.from('state_admin').select('state_admin_id').eq('username', username).maybeSingle();
    if (existing.data) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const insertRes = await supabaseAdmin.from('state_admin').insert({ username, password: hashed }).select('state_admin_id, username').single();
    if (insertRes.error) {
      return NextResponse.json({ error: insertRes.error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, user: insertRes.data });
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
  }
}