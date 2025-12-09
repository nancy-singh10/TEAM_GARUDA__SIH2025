
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const campusAdminId = searchParams.get('campusAdminId');

        if (!campusAdminId) {
            return NextResponse.json({ error: 'Campus Admin ID required' }, { status: 400 });
        }

        const { data: requests, error } = await supabaseAdmin
            .from('block_requests')
            .select(`
                *,
                store_items (
                    name,
                    token_cost,
                    image_url
                )
            `)
            .eq('campus_admin_id', campusAdminId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(requests);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// Helper to create a request (for simulation/testing)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { campusAdminId, blockIdentifier, itemId } = body;

        const { data, error } = await supabaseAdmin
            .from('block_requests')
            .insert({
                campus_admin_id: campusAdminId,
                block_identifier: blockIdentifier,
                item_id: itemId,
                status: 'PENDING'
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
