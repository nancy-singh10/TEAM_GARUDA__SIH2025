// app/api/export-report/route.ts
import supabaseAdmin from "../../../lib/supabaseServer";
import * as XLSX from "xlsx";

// Recreate the minimal mapping logic you have in the dashboard
async function fetchMetricsForExport() {
  try {
    // latest campus_analysis
    const { data: analysisData, error: analysisError } = await supabaseAdmin
      .from("campus_analysis")
      .select("*")
      .order("analysis_id", { ascending: false })
      .limit(1)
      .maybeSingle();

    // latest campus_comparison
    const { data: comparisonData, error: comparisonError } = await supabaseAdmin
      .from("campus_comparison")
      .select("*")
      .order("comparison_id", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Fallbacks if missing
    if ((analysisError && !analysisData) && (comparisonError && !comparisonData)) {
      return {
        renewable_percent: 82.61,
        carbon_saved_kg: 125.4,
        monthly_usage_kwh: 850,
        energy_cost: 127.5,
        trees_equivalent: 6,
        miles_not_driven: 300,
        coal_avoided_lbs: 56.4,
        solar_kw: 47.4,
        wind_kw: 34.1,
        battery_percent: 75,
        grid_kw: 16
      };
    }

    // map columns with safe fallbacks (same mapping logic as your page)
    const renewable_percent = Number(comparisonData?.renewable_energy_usage ?? comparisonData?.renewable_energy_u ?? comparisonData?.renewable_energy ?? 82.61);
    const carbon_saved_kg = Number(analysisData?.savings ?? analysisData?.carbon_saved_kg ?? 125.4);
    const monthly_usage_kwh = Number(analysisData?.consumption ?? analysisData?.consumption_kwh ?? 850);
    const energy_cost = Number(analysisData?.cost ?? 127.5);
    const trees_equivalent = Number(comparisonData?.trees_saved ?? comparisonData?.trees_saved_count ?? comparisonData?.trees_saved ?? 6);
    const coal_avoided_lbs = Number(comparisonData?.coal_avoided_lbs ?? 56.4);

    return {
      renewable_percent: isNaN(renewable_percent) ? 82.61 : renewable_percent,
      carbon_saved_kg: isNaN(carbon_saved_kg) ? 125.4 : carbon_saved_kg,
      monthly_usage_kwh: isNaN(monthly_usage_kwh) ? 850 : monthly_usage_kwh,
      energy_cost: isNaN(energy_cost) ? 127.5 : energy_cost,
      trees_equivalent: isNaN(trees_equivalent) ? 6 : trees_equivalent,
      miles_not_driven: undefined,
      coal_avoided_lbs: isNaN(coal_avoided_lbs) ? 56.4 : coal_avoided_lbs,
      // optional additional fields used by your dashboard synthetic series:
      solar_kw: Number((analysisData as any)?.solar_kw ?? (comparisonData as any)?.solar_kw ?? 47.4),
      wind_kw: Number((analysisData as any)?.wind_kw ?? (comparisonData as any)?.wind_kw ?? 34.1),
      battery_percent: Number((analysisData as any)?.battery_percent ?? 75),
      grid_kw: Number((analysisData as any)?.grid_kw ?? 16),
    };
  } catch (err) {
    console.error("export fetchMetrics error:", err);
    return {
      renewable_percent: 82.61,
      carbon_saved_kg: 125.4,
      monthly_usage_kwh: 850,
      energy_cost: 127.5,
      trees_equivalent: 6,
      miles_not_driven: 300,
      coal_avoided_lbs: 56.4,
      solar_kw: 47.4,
      wind_kw: 34.1,
      battery_percent: 75,
      grid_kw: 16,
    };
  }
}

// Build the 24h synthetic timeseries (copy of your dashboard logic)
function build24hSeries(m: any) {
  const hours = Array.from({ length: 24 }).map((_, i) => i);
  const peakSolar = Number(m.solar_kw ?? 47.4);
  const peakWind = Number(m.wind_kw ?? 34.1);
  const avgConsumption = (m.monthly_usage_kwh ?? 850) / 30 / 24;

  const data = hours.map((h) => {
    const solarFactor = Math.max(0, Math.exp(-Math.pow((h - 12) / 4, 2)));
    const solar = Math.round(peakSolar * solarFactor * 10) / 10;

    const windFactor = 0.5 + 0.5 * Math.sin((h / 24) * Math.PI * 2 + 1);
    const wind = Math.round(peakWind * windFactor * 10) / 10;

    const consumption = Math.round((avgConsumption + 20 * Math.exp(-Math.pow((h - 19) / 5, 2))) * 10) / 10;

    return {
      time: `${h.toString().padStart(2, "0")}:00`,
      consumption,
      solar,
      wind,
    };
  });

  return data;
}

// App Router API: handle GET -> return xlsx
export async function GET() {
  const metrics = await fetchMetricsForExport();
  const series = build24hSeries(metrics);

  // Workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary / metrics (as key/value rows)
  const summaryAoa = [
    ["Metric", "Value"],
    ["Renewable %", metrics.renewable_percent],
    ["Carbon Saved (kg)", metrics.carbon_saved_kg],
    ["Monthly Usage (kWh)", metrics.monthly_usage_kwh],
    ["Energy Cost ($)", metrics.energy_cost],
    ["Trees Equivalent", metrics.trees_equivalent ?? "—"],
    ["Miles Not Driven (mi)", metrics.miles_not_driven ?? "—"],
    ["Coal Avoided (lbs)", metrics.coal_avoided_lbs],
    ["Solar (peak kW)", metrics.solar_kw],
    ["Wind (peak kW)", metrics.wind_kw],
    ["Battery %", metrics.battery_percent],
    ["Grid (kW)", metrics.grid_kw],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoa);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // Sheet 2: 24h timeseries (as table)
  const rows24 = [["Time", "Consumption (kW)", "Solar (kW)", "Wind (kW)"], ...series.map(r => [r.time, r.consumption, r.solar, r.wind])];
  const ws24 = XLSX.utils.aoa_to_sheet(rows24);
  XLSX.utils.book_append_sheet(wb, ws24, "24h Series");

  // Optionally: add more sheets (Forecast, Energy Mix) if you want

  // Create buffer
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="dashboard_report.xlsx"`,
    },
  });
}
