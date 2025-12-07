import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Test connection first
        const { data: campuses, error: campusError } = await supabaseAdmin
            .from('campus_admin')
            .select('campus_admin_id, campus_name');

        if (campusError) {
            return NextResponse.json({
                success: false,
                error: "Connection failed",
                details: campusError.message
            }, { status: 200 }); // Return 200 to see error in tool output
        }

        let logs = [];

        for (const campus of campuses) {
            const randomBalance = Math.floor(Math.random() * 501); // 0 to 500

            // Check wallet
            const { data: wallet } = await supabaseAdmin
                .from('token_wallets')
                .select('wallet_id')
                .eq('campus_admin_id', campus.campus_admin_id)
                .maybeSingle();

            if (wallet) {
                const { error } = await supabaseAdmin
                    .from('token_wallets')
                    .update({ balance: randomBalance })
                    .eq('wallet_id', wallet.wallet_id);

                if (error) logs.push(`Failed to update ${campus.campus_name}: ${error.message}`);
                else logs.push(`Updated ${campus.campus_name}: ${randomBalance}`);
            } else {
                const { error } = await supabaseAdmin
                    .from('token_wallets')
                    .insert([{ campus_admin_id: campus.campus_admin_id, balance: randomBalance }]);

                if (error) logs.push(`Failed to create ${campus.campus_name}: ${error.message}`);
                else logs.push(`Created ${campus.campus_name}: ${randomBalance}`);
            }
        }

        return NextResponse.json({ success: true, count: campuses.length, logs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 200 });
    }
}
