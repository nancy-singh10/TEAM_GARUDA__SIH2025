// app/api/wind-data/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Find the latest date with data
    const { data: latestHourly } = await supabase
      .from('wind_hourly_readings')
      .select('record_date')
      .order('record_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latestHourly) {
      return NextResponse.json({ error: "No wind data found" }, { status: 404 });
    }

    const targetDate = latestHourly.record_date;

    // 2. Fetch System Config
    const { data: configData } = await supabase.from('wind_system_config').select('*').single();

    // 3. Fetch Daily Summary
    const { data: todaySummary } = await supabase
      .from('wind_daily_summary')
      .select('*')
      .eq('record_date', targetDate)
      .maybeSingle();

    // 4. Fetch Hourly Readings
    const { data: hourlyReadings } = await supabase
      .from('wind_hourly_readings')
      .select('*')
      .eq('record_date', targetDate)
      .order('record_time', { ascending: true });

    // 5. Fetch 7-Day Forecast (Last 7 available days)
    const { data: rawForecastData } = await supabase
      .from('wind_daily_summary')
      .select('*')
      .order('record_date', { ascending: false })
      .limit(7);

    const forecastData = (rawForecastData || []).sort((a, b) => 
      new Date(a.record_date).getTime() - new Date(b.record_date).getTime()
    );

    // --- Data Mapping ---
    // Get "Current Output" (Last available hourly reading)
    const currentGeneration = hourlyReadings && hourlyReadings.length > 0 
      ? Number(hourlyReadings[hourlyReadings.length - 1].actual_generation_kw) 
      : 0;

    return NextResponse.json({
      windData: {
        current: currentGeneration,
        peak: Number(todaySummary?.peak_generation_kw || 0),
        today: Number(todaySummary?.total_generation_kwh || 0),
        capacity: Number(configData?.system_capacity_kw || 150),
        windSpeed: Number(configData?.avg_wind_speed_ms || 0),
        turbines: Number(configData?.active_turbines || 0),
        predictionAccuracy: Number(todaySummary?.prediction_accuracy || 0),
      },
      hourlyGeneration: (hourlyReadings || []).map(r => ({
        hour: r.record_time.substring(0, 5), // "06:00"
        generation: Number(r.actual_generation_kw),
        speed: Number(r.wind_speed_ms)
      })),
      predictionVsActual: (hourlyReadings || []).map(r => ({
        hour: r.record_time.substring(0, 5),
        predicted: Number(r.predicted_generation_kw),
        actual: Number(r.actual_generation_kw),
        speed: Number(r.wind_speed_ms)
      })),
      speedVsProduction: (hourlyReadings || []).map(r => ({
        speed: Number(r.wind_speed_ms),
        production: Number(r.actual_generation_kw)
      })),
      weeklyForecast: await Promise.all((forecastData || []).map(async (day, i) => {
         const { data: h } = await supabase
            .from('wind_hourly_readings')
            .select('*')
            .eq('record_date', day.record_date)
            .order('record_time');
            
         return {
           day: i,
           date: new Date(day.record_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
           dayName: new Date(day.record_date).toLocaleDateString('en-US', { weekday: 'long' }),
           total: Number(day.total_generation_kwh),
           peak: Number(day.peak_generation_kw),
           weather: day.weather_condition,
           avgSpeed: Number(day.avg_wind_speed_ms),
           hourly: (h || []).map(x => ({ 
             hour: x.record_time.substring(0,5), 
             prediction: Number(x.predicted_generation_kw), 
             speed: Number(x.wind_speed_ms) 
           }))
         };
      }))
    });

  } catch (error) {
    console.error("Wind API Error", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}