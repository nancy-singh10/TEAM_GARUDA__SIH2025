import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { z } from 'zod';

const SendMessageSchema = z.object({
    sender_id: z.union([z.string(), z.number()]).transform(val => String(val)),
    receiver_id: z.union([z.string(), z.number()]).transform(val => String(val)),
    message: z.string().min(1),
    type: z.enum(['info', 'warning', 'alert']).default('info'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = SendMessageSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
        }

        const { sender_id, receiver_id, message, type } = parsed.data;

        const { error } = await supabaseAdmin
            .from('notifications')
            .insert({
                sender_id,
                receiver_id,
                message,
                type,
                is_read: false,
                created_at: new Date().toISOString(),
            });

        if (error) {
            console.error('Error sending message:', error);
            return NextResponse.json({ error: 'Failed to send message', details: error.message, code: error.code }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
    }
}
