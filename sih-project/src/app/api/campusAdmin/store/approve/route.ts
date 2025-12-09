
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, campusAdminId } = body;

        // 1. Fetch the request to get item cost and details
        const { data: reqData, error: reqError } = await supabaseAdmin
            .from('block_requests')
            .select(`
                *,
                store_items (
                    token_cost,
                    name
                )
            `)
            .eq('id', requestId)
            .single();

        if (reqError || !reqData) {
            throw new Error('Request not found');
        }

        if (reqData.status !== 'PENDING') {
            throw new Error('Request is not pending');
        }

        const cost = reqData.store_items.token_cost;
        const itemName = reqData.store_items.name;

        // 2. Check Wallet Balance
        const { data: wallet, error: walletError } = await supabaseAdmin
            .from('token_wallets')
            .select('*')
            .eq('campus_admin_id', campusAdminId)
            .single();

        if (walletError || !wallet) {
            throw new Error('Wallet not found');
        }

        // Balance check removed as per requirement - allowing negative balance
        // if (wallet.balance < cost) {
        //     return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
        // }

        // 3. Process Transaction (Deduct tokens)
        const { error: txError } = await supabaseAdmin
            .from('token_transactions')
            .insert({
                wallet_id: wallet.wallet_id,
                type: 'BURN_PURCHASE',
                amount: -cost,
                description: `Purchased ${itemName} for ${reqData.block_identifier}`
            });

        if (txError) throw txError;

        // 4. Update Wallet Balance
        const { error: updateWalletError } = await supabaseAdmin
            .from('token_wallets')
            .update({ balance: wallet.balance - cost })
            .eq('wallet_id', wallet.wallet_id);

        if (updateWalletError) throw updateWalletError;

        // 5. Update Request Status
        const { data: updatedReq, error: updateReqError } = await supabaseAdmin
            .from('block_requests')
            .update({
                status: 'APPROVED',
                approved_at: new Date().toISOString()
            })
            .eq('id', requestId)
            .select()
            .single();

        if (updateReqError) throw updateReqError;

        return NextResponse.json({ success: true, request: updatedReq });

    } catch (e: any) {
        console.error("Store Approve Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
