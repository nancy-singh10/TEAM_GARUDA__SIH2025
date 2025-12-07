import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Fetch Campuses
        const { data: campuses, error: cError } = await supabaseAdmin
            .from('campus_admin')
            .select('campus_admin_id, campus_name');

        if (cError) return NextResponse.json({ error: "Campus fetch failed", details: cError });

        const campusIds = campuses.map(c => c.campus_admin_id);

        // 2. Fetch Wallets
        const { data: wallets, error: wError } = await supabaseAdmin
            .from('token_wallets')
            .select('wallet_id, campus_admin_id, balance')
            .in('campus_admin_id', campusIds);

        if (wError) return NextResponse.json({ error: "Wallet fetch failed", details: wError });

        // 3. Match Logic Debug
        const sampleMatches = campuses.slice(0, 5).map(c => {
            const match = wallets?.find(w => w.campus_admin_id === c.campus_admin_id);
            return {
                campus: c.campus_name,
                c_id: c.campus_admin_id,
                found_wallet: !!match,
                wallet_bal: match?.balance
            };
        });

        return NextResponse.json({
            campusCount: campuses.length,
            walletCount: wallets?.length || 0,
            sampleMatches,
            firstWallet: wallets?.[0]
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
