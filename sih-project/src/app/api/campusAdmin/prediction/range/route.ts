
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    if (!dateStr) {
        return NextResponse.json({ error: 'Date required' }, { status: 400 });
    }

    try {
        const targetDate = new Date(dateStr);
        // Calculate start date: 3 days before
        const startDate = new Date(targetDate);
        startDate.setDate(targetDate.getDate() - 3);

        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth() + 1;
        const startDay = startDate.getDate();

        // 6 days total: -3, -2, -1, 0, +1, +2
        const DAYS_COUNT = 6;

        // Call Python API
        const mlResponse = await fetch('http://localhost:8000/predict/range', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                start_year: startYear,
                start_month: startMonth,
                start_day: startDay,
                days_count: DAYS_COUNT
            })
        });

        if (!mlResponse.ok) {
            const errText = await mlResponse.text();
            throw new Error(`Backend API Error: ${mlResponse.status} ${errText}`);
        }

        const data = await mlResponse.json();

        // Apply factors to match frontend units (kWh approximations)
        // Matches the logic in existing route.ts
        const SOLAR_FACTOR = 0.1;
        const WIND_FACTOR = 2.0;

        const processedData = data.map((d: any) => ({
            date: d.date,
            solar: d.total_solar * SOLAR_FACTOR,
            wind: d.total_wind * WIND_FACTOR
        }));

        return NextResponse.json(processedData);

    } catch (error: any) {
        console.error("Range Prediction Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
