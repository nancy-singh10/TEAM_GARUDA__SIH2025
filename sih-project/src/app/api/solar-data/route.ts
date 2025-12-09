import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zgkvdcotjingnpehauew.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch Today's Simulation Logs
    // We assume the "current" simulation day is whatever is in the logs for the latest date.
    // If auto-pilot resets daily, we just take all records currently in the table.

    const { data: simulationLogs, error } = await supabase
      .from('digital_twin_simulation_logs')
      .select('*')
      .order('simulation_time', { ascending: true });

    if (error) throw error;

    if (!simulationLogs || simulationLogs.length === 0) {
      // Return empty/default structure if no simulation is running
      return NextResponse.json({
        solarData: {
          current: 0,
          peak: 0,
          today: 0,
          capacity: 200,
          efficiency: 87.3,
          panels: 180,
          predictionAccuracy: 92.4,
        },
        hourlyGeneration: [],
        predictionVsActual: [],
        tempVsProduction: [],
        weeklyForecast: []
      });
    }

    // 2. Process Data
    const latestLog = simulationLogs[simulationLogs.length - 1];
    const currentSolar = Number(latestLog.solar_capacity || 0);

    // Calculate Today's Total and Peak
    let totalSolarKwh = 0;
    let peakSolarKw = 0;

    // Helper to format time (06:00:00 -> 6 AM)
    const formatTime = (timeStr: string) => {
      const date = new Date(`2000-01-01T${timeStr}`);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    };

    // Hourly Generation Array
    const hourlyGeneration = simulationLogs.map(log => {
      const generation = Number(log.solar_capacity);
      totalSolarKwh += generation;
      if (generation > peakSolarKw) peakSolarKw = generation;

      return {
        hour: formatTime(log.simulation_time), // "6 AM"
        generation: generation
      };
    });

    // Prediction vs Actual
    const predictionVsActual = simulationLogs.map(log => {
      const gen = Number(log.solar_capacity);
      return {
        hour: formatTime(log.simulation_time),
        predicted: gen,
        actual: gen,
        temp: 25 + (Math.random() * 5)
      };
    });

    // Temp vs Production
    const tempVsProduction = simulationLogs.map(log => ({
      temp: 25 + (Math.random() * 5),
      production: Number(log.solar_capacity)
    }));

    // Weekly Forecast (Mocking it based on today's performance to avoid empty UI)
    // In a real app, this would query historical tables.
    const weeklyForecast = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        day: i,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        total: Math.round(totalSolarKwh * (0.8 + Math.random() * 0.4)), // Variance
        peak: Math.round(peakSolarKw * (0.9 + Math.random() * 0.2)),
        weather: Math.random() > 0.5 ? "Sunny" : "Partly Cloudy",
        temp: 30,
        hourly: hourlyGeneration.map(h => ({
          hour: h.hour,
          prediction: Math.round(h.generation * (0.8 + Math.random() * 0.4)),
          temp: 30
        }))
      };
    });

    return NextResponse.json({
      solarData: {
        current: currentSolar,
        peak: peakSolarKw,
        today: Math.round(totalSolarKwh),
        capacity: 900, // Matches capacities.solar in frontend
        efficiency: 87.3,
        panels: 180,
        predictionAccuracy: 95.1,
      },
      hourlyGeneration,
      predictionVsActual,
      tempVsProduction,
      weeklyForecast
    });

  } catch (error) {
    console.error("API Error", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}