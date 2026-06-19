import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';

export async function GET() {
    try {
        // 1. Fetch Campus Admin Data
        const { data: campusData, error: campusError } = await supabaseAdmin
            .from('campus_admin')
            .select(`
            campus_admin_id,
            campus_name,
            location,
            admin_name
            `);

        if (campusError) throw campusError;

        // 2. Fetch Campus Comparison Data (for renewable usage)
        const { data: comparisonData, error: comparisonError } = await supabaseAdmin
            .from('campus_comparison')
            .select('*');

        if (comparisonError) throw comparisonError;
        
        console.log("Comparison Data Columns: ", comparisonData?.[0] ? Object.keys(comparisonData[0]) : "Empty");

        return NextResponse.json({ campusData, comparisonData });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
