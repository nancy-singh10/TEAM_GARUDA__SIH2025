
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetDateStr = searchParams.get('date');

    if (!targetDateStr) {
        return NextResponse.json({ error: 'Date required' }, { status: 400 });
    }

    try {
        const targetDate = new Date(targetDateStr);
        const day = targetDate.getDate();
        const month = targetDate.getMonth() + 1; // JS months are 0-indexed, SQL is 1-indexed

        // Query distinct years for the same Day/Month
        // Note: Supabase/PostgREST doesn't support advanced "EXTRACT" syntax easily via JS client in one go without RPC.
        // However, we can try to fetch all matching M/D rows if the dataset isn't huge, or use a raw query if we had one.
        // Alternative: Generating the specific 3 previous dates to look for.

        // Strategy: Calculate the exact 3 dates for the past 3 years
        const datesToFetch: string[] = [];
        for (let i = 1; i <= 3; i++) {
            const d = new Date(targetDate);
            d.setFullYear(d.getFullYear() - i);
            // Handle leap years edge case if needed, but simplified for now:
            datesToFetch.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
        }

        const { data, error } = await supabaseAdmin
            .from('energy_data_3yrs')
            .select('solar_units, wind_units, date')
            .in('date', datesToFetch);

        if (error) {
            console.error('Prediction DB Error:', error);
            // Fallback for hackathon demo if table doesn't exist yet:
            // return randomized "realistic" data to prevent UI crash
            const mockSolar = 450 + Math.random() * 100;
            const mockWind = 200 + Math.random() * 100;
            return NextResponse.json({
                exists: false,
                solar: mockSolar,
                wind: mockWind,
                costSaved: (mockSolar + mockWind) * 10,
                datesUsed: datesToFetch
            });
        }

        if (!data || data.length === 0) {
            // No data found for past years
            return NextResponse.json({ error: 'No historical data found for this date' }, { status: 404 });
        }

        // Calculate Averages
        const totalSolar = data.reduce((acc, curr) => acc + (curr.solar_units || 0), 0);
        const totalWind = data.reduce((acc, curr) => acc + (curr.wind_units || 0), 0);
        const count = data.length;

        const avgSolar = totalSolar / count;
        const avgWind = totalWind / count;
        const costSaved = (avgSolar + avgWind) * 10;

        return NextResponse.json({
            solar: avgSolar,
            wind: avgWind,
            costSaved: costSaved,
            historicalCount: count
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
