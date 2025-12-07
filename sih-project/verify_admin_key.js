
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3ZkY290amluZ25wZWhhdWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg2MzQ4MiwiZXhwIjoyMDc4NDM5NDgyfQ.S9nmEfjtwr-ihSTgmFI64Y30umZ3VqHpqrcOxd8Him8";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function verifyAdmin() {
    console.log('Testing Supabase Admin Client (JS)...');
    try {
        const { data, error } = await supabaseAdmin
            .from('campus_admin')
            .select('*')
            .limit(5);

        if (error) {
            console.error('Admin Client Error:', error);
        } else {
            console.log('Admin Client Success. Data:', JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

verifyAdmin();
