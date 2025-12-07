import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';

// Helper to get campus_admin_id from Cookies (since we use custom auth)
// In a real app, use middleware or rigorous validation. 
// Here we rely on the implementation in header_campus.tsx which sets 'campus_admin_id' cookie.
function getUserId(request: Request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
    return cookies['campus_admin_id'];
}

// GET: Fetch Wallet Balance and History
export async function GET(request: Request) {
    try {
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get Wallet (Create if not exists - Lazy initialization)
        let { data: wallet, error } = await supabaseAdmin
            .from('token_wallets')
            .select('*')
            .eq('campus_admin_id', userId)
            .maybeSingle();

        if (!wallet) {
            // Create wallet if it doesn't exist
            const { data: newWallet, error: createError } = await supabaseAdmin
                .from('token_wallets')
                .insert([{ campus_admin_id: userId, balance: 0 }])
                .select()
                .single();

            if (createError) throw createError;
            wallet = newWallet;
        }

        if (error && !wallet) throw error; // If error wasn't "no row found"

        // 2. Get Transactions
        const { data: transactions, error: txError } = await supabaseAdmin
            .from('token_transactions')
            .select('*')
            .eq('wallet_id', wallet.wallet_id)
            .order('created_at', { ascending: false });

        if (txError) throw txError;

        // 3. Get Current Conversion Rates (for UI)
        const { data: settings } = await supabaseAdmin.from('token_settings').select('*').single();

        return NextResponse.json({
            wallet,
            transactions,
            rates: settings
        });

    } catch (e: any) {
        console.error("Token API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST: Actions (Buy Energy, etc.)
export async function POST(request: Request) {
    try {
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action, amount_energy, amount_tokens } = await request.json();

        // Fetch Wallet
        const { data: wallet } = await supabaseAdmin
            .from('token_wallets')
            .select('*')
            .eq('campus_admin_id', userId)
            .single();

        if (!wallet) return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });

        // Fetch Settings
        const { data: settings } = await supabaseAdmin.from('token_settings').select('*').single();

        if (action === 'BUY_ENERGY') {
            const requiredTokens = amount_energy * settings.conversion_rate_token_to_energy;

            if (wallet.balance < requiredTokens) {
                return NextResponse.json({ error: 'Insufficient token balance' }, { status: 400 });
            }

            // Perform Transaction (Burn Tokens)
            // 1. Debit Wallet
            const newBalance = Number(wallet.balance) - Number(requiredTokens);
            const { error: updateError } = await supabaseAdmin
                .from('token_wallets')
                .update({ balance: newBalance, updated_at: new Date().toISOString() })
                .eq('wallet_id', wallet.wallet_id);

            if (updateError) throw updateError;

            // 2. Log Transaction
            const { error: logError } = await supabaseAdmin
                .from('token_transactions')
                .insert([{
                    wallet_id: wallet.wallet_id,
                    type: 'BURN_PURCHASE',
                    amount: -requiredTokens,
                    energy_amount: amount_energy,
                    description: `Purchased ${amount_energy} kWh of energy`
                }]);

            if (logError) throw logError;

            return NextResponse.json({ success: true, newBalance });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
