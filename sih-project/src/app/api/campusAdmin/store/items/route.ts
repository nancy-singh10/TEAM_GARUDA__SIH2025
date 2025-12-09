
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);


export async function GET(request: Request) {
    try {
        const { data: items, error } = await supabaseAdmin
            .from('store_items')
            .select('*')
            .order('name'); // Good practice to order

        if (error) throw error;

        return NextResponse.json(items);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, token_cost } = body;

        if (!id || token_cost === undefined) {
            return NextResponse.json({ error: 'ID and token_cost are required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('store_items')
            .update({ token_cost })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

