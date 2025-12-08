import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseServer';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const campus_id = cookieStore.get('campus_admin_id')?.value;

        if (!campus_id) {
            return NextResponse.json({ error: 'Unauthorized: No campus_id cookie' }, { status: 401 });
        }

        console.log(`Seeding history data for campus: ${campus_id}`);

        // 1. Seed Hourly Energy Readings (Last 24 hours + forecast 12h)
        const readings = [];
        const now = new Date();
        now.setMinutes(0, 0, 0);

        // Generate for last 30 hours to be safe
        for (let i = -30; i <= 10; i++) {
            const time = new Date(now);
            time.setHours(now.getHours() + i);

            const hour = time.getHours();

            // Simulation Logic (Parabolic Solar)
            let solar = 0;
            if (hour >= 6 && hour <= 18) {
                const curve = Math.sin(((hour - 6) / 12) * Math.PI);
                solar = 45 * curve * (0.8 + Math.random() * 0.4); // Max ~45kW
            }

            // Wind (Random + Gusts)
            let wind = 20 + Math.random() * 15;
            if (hour > 18 || hour < 5) wind += 10; // Night wind

            // Consumption (Day peak)
            let consumption = 30 + Math.random() * 5;
            if (hour >= 9 && hour <= 17) consumption += 40; // Work hours
            if (hour > 18 && hour < 23) consumption += 20; // Evening

            readings.push({
                campus_id,
                timestamp: time.toISOString(),
                solar_output: parseFloat(Math.max(0, solar).toFixed(2)),
                wind_output: parseFloat(wind.toFixed(2)),
                grid_usage: parseFloat(Math.max(0, consumption - solar - wind).toFixed(2)),
                consumption: parseFloat(consumption.toFixed(2)),
                battery_level: parseFloat((70 + Math.sin(i * 0.2) * 20).toFixed(2)) // Oscillate 50-90%
            });
        }

        const { error: readingError } = await supabaseAdmin
            .from('energy_readings')
            .upsert(readings, { onConflict: 'campus_id, timestamp' as any }); // Requires constraint if using upsert purely, but simple insert is fine for seed

        // 2. Seed Monthly Aggregates (Last 6 months)
        const aggregates = [];
        const months = ['2024-06-01', '2024-07-01', '2024-08-01', '2024-09-01', '2024-10-01', '2024-11-01'];

        for (const dateStr of months) {
            aggregates.push({
                campus_id,
                billing_period: dateStr,
                total_bill: Math.floor(20000 + Math.random() * 5000),
                savings_achieved: Math.floor(4000 + Math.random() * 1500),
                carbon_saved_kg: Math.floor(100 + Math.random() * 50),
                savings_target: 5000,
                carbon_target: 140
            });
        }

        const { error: aggError } = await supabaseAdmin
            .from('monthly_aggregates')
            .upsert(aggregates); // Assuming no unique constraint yet, might duplicate if run twice without cleanup

        if (readingError || aggError) {
            console.error("Seed Error:", readingError, aggError);
            return NextResponse.json({ error: 'Failed to seed tables', details: { readingError, aggError } }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Seeded 40 hourly readings and 6 monthly aggregates' });

    } catch (error) {
        console.error('Seed Exception:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
