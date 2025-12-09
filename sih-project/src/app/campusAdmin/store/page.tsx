
import { cookies } from 'next/headers';
import supabaseAdmin from '@/lib/supabaseServer';
import StoreContent from './StoreContent';

export const dynamic = 'force-dynamic';

async function fetchWalletBalance(campusAdminId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('token_wallets')
            .select('balance')
            .eq('campus_admin_id', campusAdminId)
            .single();

        if (error) {
            console.error('Error fetching wallet:', error);
            return 0; // Default or maybe create one if missing?
        }
        return Number(data.balance);
    } catch (err) {
        console.error('Wallet fetch failed:', err);
        return 0;
    }
}

export default async function StorePage() {
    const cookieStore = await cookies();
    const campusCookie = cookieStore.get('campus_admin_id');

    if (!campusCookie) {
        return (
            <div className="flex items-center justify-center min-h-screen text-slate-500">
                Please log in to access the store.
            </div>
        );
    }

    const campusAdminId = campusCookie.value;
    const balance = await fetchWalletBalance(campusAdminId);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <StoreContent
                campusAdminId={campusAdminId}
                initialBalance={balance}
            />
        </div>
    );
}
