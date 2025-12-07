import { supabaseAdmin } from '@/lib/supabaseServer';
import RankingClient from './RankingClient';

// Revalidate every minute to refresh rankings
export const revalidate = 60;

async function getCampusRankings() {
    // 1. Fetch all campuses
    const { data: campuses, error } = await supabaseAdmin
        .from('campus_admin')
        .select('campus_admin_id, campus_name, location, admin_name');

    if (error) {
        console.error('Error fetching campuses:', error);
        return [];
    }

    if (!campuses || campuses.length === 0) return [];

    const campusIds = campuses.map(c => c.campus_admin_id);

    // 2. Fetch Wallets (Overall Tokens)
    const { data: wallets, error: walletError } = await supabaseAdmin
        .from('token_wallets')
        .select('wallet_id, campus_admin_id, balance')
        .in('campus_admin_id', campusIds);

    if (walletError) console.error('Error fetching wallets:', walletError);

    // Create Map for robust O(1) lookup
    // Normalize keys to string to avoid UUID type issues
    const walletMap = new Map();
    wallets?.forEach(w => {
        if (w.campus_admin_id) {
            walletMap.set(String(w.campus_admin_id).trim(), w);
        }
    });

    // 3. Fetch Monthly Reward Transactions (Monthly Tokens)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // We need wallet_ids to query transactions efficiently
    const validWalletIds = wallets?.map(w => w.wallet_id) || [];
    const monthlyStats: Record<string, number> = {};

    if (validWalletIds.length > 0) {
        const { data: transactions } = await supabaseAdmin
            .from('token_transactions')
            .select('wallet_id, amount')
            .in('wallet_id', validWalletIds)
            .eq('type', 'MINT_REWARD') // Only count earned tokens (rewards)
            .gte('created_at', firstDayOfMonth);

        // Aggregate by wallet_id
        transactions?.forEach(tx => {
            monthlyStats[tx.wallet_id] = (monthlyStats[tx.wallet_id] || 0) + (Number(tx.amount) || 0);
        });
    }

    // 4. Merge Data
    const rankedCampuses = campuses.map((campus) => {
        const cId = String(campus.campus_admin_id).trim();
        const wallet = walletMap.get(cId);

        const balance = wallet ? Number(wallet.balance) : 0;
        const monthly = wallet ? (monthlyStats[wallet?.wallet_id] || 0) : 0;

        return {
            ...campus,
            monthly_tokens: monthly,
            overall_tokens: balance,
        };
    });

    // Sort by overall tokens desc by default
    return rankedCampuses.sort((a, b) => b.overall_tokens - a.overall_tokens);
}

export default async function CampusRankingPage() {
    const rankings = await getCampusRankings();

    return <RankingClient initialRankings={rankings} />;
}
