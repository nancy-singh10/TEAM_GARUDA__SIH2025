import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('receiver_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching messages:', error);
            return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
        }

        return NextResponse.json({ messages: data });
    } catch (e: any) {
        return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
    }
}
