
import { cookies } from 'next/headers';
import supabaseAdmin from '@/lib/supabaseServer';
import StoreContent from './StoreContent';

export const dynamic = 'force-dynamic';

async function fetchWalletBalance(campusAdminId: string) {
    try {
        let { data, error } = await supabaseAdmin
            .from('token_wallets')
            .select('balance')
            .eq('campus_admin_id', campusAdminId)
            .single();

        if (error) {
            // PGRST116 means no rows found, which is expected for a new admin
            if (error.code === 'PGRST116') {
                console.log(`No wallet found for admin ${campusAdminId}. Creating a default wallet.`);
                // Create a default wallet
                const { data: newWallet, error: insertError } = await supabaseAdmin
                    .from('token_wallets')
                    .insert({ campus_admin_id: campusAdminId, balance: 0 })
                    .select('balance')
                    .single();
                
                if (insertError) {
                    console.error('Failed to create wallet:', insertError);
                    return 0;
                }
                return Number(newWallet.balance);
            }
            
            console.error('Error fetching wallet:', JSON.stringify(error));
            return 0;
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
