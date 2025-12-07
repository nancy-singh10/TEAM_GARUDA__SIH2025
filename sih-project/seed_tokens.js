const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3ZkY290amluZ25wZWhhdWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NjM0ODIsImV4cCI6MjA3ODQzOTQ4Mn0.pZVEwm-z3qvXLTu9a7Av3fxwLIVhCc_wqBnBUlXy0_s";

console.log("Initializing Supabase Client...");
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTokens() {
    console.log("Fetching Campus Admins...");
    const { data: campuses, error: campusError } = await supabase
        .from('campus_admin')
        .select('campus_admin_id, campus_name');

    if (campusError) {
        console.error("Error fetching campuses:", campusError);
        return;
    }

    console.log(`Found ${campuses.length} campuses. Updating wallets...`);

    for (const campus of campuses) {
        const randomBalance = Math.floor(Math.random() * 501); // 0 to 500
        console.log(`Processing ${campus.campus_name}...`);

        // Check if wallet exists
        const { data: wallet, error: fetchError } = await supabase
            .from('token_wallets')
            .select('wallet_id')
            .eq('campus_admin_id', campus.campus_admin_id)
            .maybeSingle();

        if (fetchError) {
            console.error("Error checking wallet:", fetchError);
            continue;
        }

        if (wallet) {
            // Update
            const { error } = await supabase
                .from('token_wallets')
                .update({ balance: randomBalance })
                .eq('wallet_id', wallet.wallet_id);

            if (error) console.error(`Failed to update ${campus.campus_name}:`, error.message);
            else console.log(`Updated ${campus.campus_name}: ${randomBalance} TKN`);
        } else {
            // Insert
            const { error } = await supabase
                .from('token_wallets')
                .insert([{ campus_admin_id: campus.campus_admin_id, balance: randomBalance }]);

            if (error) console.error(`Failed to create wallet for ${campus.campus_name}:`, error.message);
            else console.log(`Created wallet for ${campus.campus_name}: ${randomBalance} TKN`);
        }
    }
    console.log("Seeding complete.");
}

seedTokens();
