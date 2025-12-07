import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';

// GET: Fetch system-wide analytics and settings
export async function GET(request: Request) {
    try {
        // 1. Fetch Global Settings
        const { data: settings, error: settingsError } = await supabaseAdmin
            .from('token_settings')
            .select('*')
            .single();

        if (settingsError) throw settingsError;

        // 2. Calculate Total Tokens in Circulation
        const { data: wallets, error: walletsError } = await supabaseAdmin
            .from('token_wallets')
            .select('balance');

        if (walletsError) throw walletsError;

        const totalTokens = wallets.reduce((sum, w) => sum + (Number(w.balance) || 0), 0);

        // 3. Fetch Recent Transactions (System Wide)
        const { data: transactions, error: txError } = await supabaseAdmin
            .from('token_transactions')
            .select('*, token_wallets(campus_admin_id, campus_admin(campus_name))')
            .order('created_at', { ascending: false })
            .limit(20);

        if (txError) throw txError;

        return NextResponse.json({
            settings,
            analytics: {
                totalTokens,
                walletCount: wallets.length,
            },
            recentTransactions: transactions
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST: Update Conversion Rates
export async function POST(request: Request) {
    try {
        const { conversion_rate_energy_to_token, conversion_rate_token_to_energy } = await request.json();

        // Update the single row in settings
        // We assume there is only 1 row (id is mostly irrelevant if we just update all)
        const { data, error } = await supabaseAdmin
            .from('token_settings')
            .update({
                conversion_rate_energy_to_token,
                conversion_rate_token_to_energy,
                updated_at: new Date().toISOString()
            })
            .neq('id', '00000000-0000-0000-0000-000000000000') // Dummy filter to update all (or just 1)
            .select()
            .single();

        // Note: A better way to update the single row is to know its ID or just update where true? 
        // Supabase update requires a WHERE clause usually.
        // Let's try fetching the ID first or assume we update based on not null?
        // Actually, since we only have 1 row, we can just update all rows.
        // But safety: let's fetch the ID first to be sure.

        const { data: currentSettings } = await supabaseAdmin.from('token_settings').select('id').single();

        if (currentSettings) {
            const { error: updateError } = await supabaseAdmin
                .from('token_settings')
                .update({
                    conversion_rate_energy_to_token,
                    conversion_rate_token_to_energy,
                    updated_at: new Date().toISOString()
                })
                .eq('id', currentSettings.id);

            if (updateError) throw updateError;
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
