import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Find the latest date with data (Logic handles the Dec 7 cut-off)
    const { data: latestHourly } = await supabase
      .from('grid_hourly_readings')
      .select('record_date')
      .order('record_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latestHourly) {
      return NextResponse.json({ error: "No grid data found" }, { status: 404 });
    }

    const targetDate = latestHourly.record_date;

    // 2. Fetch Daily Summary
    const { data: summary } = await supabase
      .from('grid_daily_summary')
      .select('*')
      .eq('record_date', targetDate)
      .maybeSingle();

    // 3. Fetch Hourly Data
    const { data: hourly } = await supabase
      .from('grid_hourly_readings')
      .select('*')
      .eq('record_date', targetDate)
      .order('record_time', { ascending: true });

    // --- Transformation ---
    
    // Calculate current values from the last hourly reading
    const currentImport = hourly && hourly.length > 0 ? Number(hourly[hourly.length - 1].import_kw) : 0;
    const currentExport = hourly && hourly.length > 0 ? Number(hourly[hourly.length - 1].export_kw) : 0;
    
    // Determine status string
    const status = currentImport > currentExport ? "importing" : "exporting";

    // A. Grid Stats (Top Cards)
    const gridStats = {
      current: currentImport > 0 ? currentImport : currentExport, // Show whichever is active
      status: status,
      peakImport: Number(summary?.peak_import_kw || 0),
      peakExport: Number(summary?.peak_export_kw || 0),
      cost: Number(summary?.net_energy_cost || 0),
    };

    // B. Demand/Supply Chart
    const demandSupplyData = (hourly || []).map(r => ({
      hour: formatTime(r.record_time),
      demand: Number(r.demand_kw),
      supply: Number(r.supply_kw)
    }));

    // C. Hourly Flow (Import/Export Pattern)
    const hourlyFlow = (hourly || []).map(r => {
      const imp = Number(r.import_kw);
      const exp = Number(r.export_kw);
      const net = imp > 0 ? -imp : exp; // Negative for import, Positive for export logic in your UI
      
      return {
        hour: formatTime(r.record_time),
        import: imp,
        export: exp,
        net: net
      };
    });

    // D. Forecast Data (Derived from actuals for demo purposes)
    const forecastData = (hourly || []).map((r, i) => ({
      hour: parseInt(r.record_time.split(':')[0]), // Extract hour number
      actual: Number(r.demand_kw),
      baseline: Number(r.baseline_demand_kw),
      forecast: Number(r.forecast_demand_kw)
    }));

    return NextResponse.json({
      gridStats,
      demandSupplyData,
      hourlyFlow,
      forecastData
    });

  } catch (error) {
    console.error("Grid API Error", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// Helper to format "15:00:00" -> "3 PM"
function formatTime(timeStr: string) {
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12} ${ampm}`;
}