
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request: Request) {
    try {
        const { messageId } = await request.json();

        if (!messageId) {
            return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ is_read: true })
            .eq('id', messageId);

        if (error) {
            console.error('Mark read error:', error);
            return NextResponse.json({ error: 'Failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
