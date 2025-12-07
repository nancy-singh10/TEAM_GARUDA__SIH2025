import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { z } from 'zod';

const BroadcastMessageSchema = z.object({
    sender_id: z.union([z.string(), z.number()]).transform(val => String(val)),
    message: z.string().min(1),
    type: z.enum(['info', 'warning', 'alert']).default('info'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = BroadcastMessageSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
        }

        const { sender_id, message, type } = parsed.data;

        // 1. Fetch all campus admins
        const { data: campusAdmins, error: fetchError } = await supabaseAdmin
            .from('campus_admin')
            .select('campus_admin_id');

        if (fetchError) {
            console.error('Error fetching campus admins:', fetchError);
            return NextResponse.json({ error: 'Failed to fetch recipients', details: fetchError }, { status: 500 });
        }

        if (!campusAdmins || campusAdmins.length === 0) {
            return NextResponse.json({ success: true, message: 'No recipients found' });
        }

        // 2. Prepare notifications
        const notifications = campusAdmins.map(admin => ({
            sender_id,
            receiver_id: admin.campus_admin_id,
            message,
            type,
            is_read: false,
            created_at: new Date().toISOString(),
        }));

        // 3. Batch insert notifications
        const { error: insertError } = await supabaseAdmin
            .from('notifications')
            .insert(notifications);

        if (insertError) {
            console.error('Error broadcasting message:', insertError);
            return NextResponse.json({ error: 'Failed to send broadcast', details: insertError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, count: notifications.length });
    } catch (e: any) {
        return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
    }
}
