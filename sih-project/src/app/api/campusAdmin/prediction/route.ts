
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetDateStr = searchParams.get('date');

    if (!targetDateStr) {
        return NextResponse.json({ error: 'Date required' }, { status: 400 });
    }

    try {
        const targetDate = new Date(targetDateStr);
        const day = targetDate.getDate();
        const month = targetDate.getMonth() + 1;
        const year = targetDate.getFullYear();

        // Call the Python ML API
        const mlApiResponse = await fetch('http://localhost:8000/predict/day', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                year: year,
                month: month,
                day: day
            }),
        });

        if (!mlApiResponse.ok) {
            const errorDetails = await mlApiResponse.text();
            throw new Error(`ML API Failed: ${mlApiResponse.status} ${errorDetails}`);
        }

        const hourlyPredictions = await mlApiResponse.json();

        // console.log(hourlyPredictions);

        // Aggregate hourly predictions to get daily totals
        let totalSolar = 0;
        let totalWind = 0;

        // Arbitrary factors to convert raw ML outputs (SRAD, WS) to likely Energy units (kWh) for the campus
        // These factors can be tuned to match realistic campus consumption/generation scales
        const SOLAR_FACTOR = 0.1; // Example conversion
        const WIND_FACTOR = 2.0; // Example conversion (Wind power relates to cube of speed usually, but linear approx for now or simple sum)

        interface HourlyPrediction {
            Predicted_SRAD: number;
            Predicted_WS: number;
            Predicted_TM: number;
            Predicted_HU: number;
            Hour: number;
        }

        (hourlyPredictions as HourlyPrediction[]).forEach(p => {
            // Simple accumulation logic
            // SRAD is usually W/m^2. Assuming some panel area.
            // If SRAD is negative (shouldn't be), clip to 0
            const solarVal = Math.max(0, p.Predicted_SRAD);
            totalSolar += solarVal * SOLAR_FACTOR;

            // Wind Speed (m/s). Power ~ v^3 usually. 
            // Simplified: if wind > cut-in speed (e.g. 2), add generation
            const ws = p.Predicted_WS;
            if (ws > 0) {
                totalWind += (ws * WIND_FACTOR);
                // Or a rough cubic: totalWind += (Math.pow(ws, 3) * 0.05);
            }
        });

        const costSaved = (totalSolar + totalWind) * 8; // Assuming 8 Rs/kWh

        return NextResponse.json({
            solar: totalSolar,
            wind: totalWind,
            costSaved: costSaved,
            source: 'ML_RandomForest',
            hourlyData: hourlyPredictions // Passing this through in case we want to chart it later
        });

    } catch (e: any) {
        console.error("Prediction Route Error:", e);
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}

