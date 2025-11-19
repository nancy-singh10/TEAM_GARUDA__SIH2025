import { NextResponse } from 'next/server';
// Returns aggregated metrics and small timeseries for the dashboard.
// Tries to query Supabase; if missing or misconfigured it falls back to demo values.
export async function GET() {
  // Demo values
  const demo = {
    solar: 47.4,
    wind: 34.1,
    batteryPercent: 75,
    grid: 16.0,
    renewablePct: 96.4,
    performanceData: [
      { name: '00:00', Consumption: 30, 'Solar Gen': 0, 'Wind Gen': 28 },
      { name: '04:00', Consumption: 32, 'Solar Gen': 0, 'Wind Gen': 30 },
      { name: '08:00', Consumption: 28, 'Solar Gen': 10, 'Wind Gen': 32 },
      { name: '12:00', Consumption: 55, 'Solar Gen': 48, 'Wind Gen': 20 },
      { name: '16:00', Consumption: 95, 'Solar Gen': 25, 'Wind Gen': 35 },
      { name: '20:00', Consumption: 110, 'Solar Gen': 5, 'Wind Gen': 30 },
      { name: '23:00', Consumption: 60, 'Solar Gen': 0, 'Wind Gen': 28 },
    ],
    generationBreakdown: [
      { name: 'Solar', value: 47400, fill: '#FDE68A' },
      { name: 'Wind', value: 34100, fill: '#BFDBFE' },
      { name: 'Grid', value: 16000, fill: '#E9D5FF' },
    ],
  };

  // If Supabase is not configured, attempt dynamic import and fall back on demo values
  try {
    let supabaseAdmin: any | null = null;
    try {
      const mod = await import('../../../../lib/supabaseServer');
      supabaseAdmin = mod?.default ?? null;
    } catch (importErr) {
      // failed to import supabase server client (likely missing env or file)
      return NextResponse.json(demo);
    }

    if (!supabaseAdmin) return NextResponse.json(demo);

    // 1) Latest scalar metrics from a hypothetical `state_metrics` table
    const { data: metrics, error: metricsError } = await supabaseAdmin
      .from('state_metrics')
      .select('metric, value')
      .order('updated_at', { ascending: false });

    if (metricsError || !metrics) {
      // Table might not exist — return demo
      return NextResponse.json(demo);
    }

    // Map metrics by name if table exists
    const mapped: any = {};
    for (const row of metrics as any[]) {
      mapped[row.metric] = row.value;
    }

    // 2) Small timeseries for charts from a hypothetical `energy_readings` table
    const { data: series, error: seriesError } = await supabaseAdmin
      .from('energy_readings')
      .select('timestamp, type, value')
      .order('timestamp', { ascending: true })
      .limit(100);

    if (seriesError || !series) {
      // Return partial response built from metrics (if available) or demo
      const resp = {
        solar: mapped.solar ?? demo.solar,
        wind: mapped.wind ?? demo.wind,
        batteryPercent: mapped.battery ?? demo.batteryPercent,
        grid: mapped.grid ?? demo.grid,
        renewablePct: mapped.renewable_pct ?? demo.renewablePct,
        performanceData: demo.performanceData,
        generationBreakdown: demo.generationBreakdown,
      };
      return NextResponse.json(resp);
    }

    // Convert series into simple performanceData by grouping into buckets
    const buckets: Record<string, any> = {};
    for (const row of series as any[]) {
      const d = new Date(row.timestamp);
      const hour = String(d.getHours()).padStart(2, '0') + ':00';
      if (!buckets[hour]) buckets[hour] = { name: hour, Consumption: 0, 'Solar Gen': 0, 'Wind Gen': 0 };
      if (row.type === 'consumption') buckets[hour].Consumption += row.value;
      if (row.type === 'solar') buckets[hour]['Solar Gen'] += row.value;
      if (row.type === 'wind') buckets[hour]['Wind Gen'] += row.value;
    }

    const performanceData = Object.values(buckets).slice(-7);

    const response = {
      solar: mapped.solar ?? demo.solar,
      wind: mapped.wind ?? demo.wind,
      batteryPercent: mapped.battery ?? demo.batteryPercent,
      grid: mapped.grid ?? demo.grid,
      renewablePct: mapped.renewable_pct ?? demo.renewablePct,
      performanceData: performanceData.length ? performanceData : demo.performanceData,
      generationBreakdown: demo.generationBreakdown,
    };

    return NextResponse.json(response);
  } catch (err) {
    // If anything goes wrong (missing env, missing tables), return demo
    return NextResponse.json(demo);
  }
}
