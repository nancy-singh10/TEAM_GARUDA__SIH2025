export const dynamic = 'force-dynamic';
import Link from 'next/link';
import supabaseAdmin from '../../../lib/supabaseServer';
import SessionGreeting from './SessionGreeting';
import TopMetricsRow from './TopMetricsRow';
import AreaChart24h from './AreaChart24h';
import ForecastDonut from './ForecastDonut';
import EnergyMix from './EnergyMix';
import SimulateButton from './SimulateButton';
import { generateEnergyData } from '@/lib/energyUtils';

type Metrics = {
  renewable_percent: number;
  carbon_saved_kg: number;
  monthly_usage_kwh: number;
  energy_cost: number;
  trees_equivalent?: number;
  miles_not_driven?: number;
  coal_avoided_lbs?: number;
  solar_kw?: number;
  wind_kw?: number;
  battery_percent?: number;
  grid_kw?: number;
};

async function fetchMetrics(): Promise<Metrics> {
  try {
    // Query latest campus_analysis row (latest metrics)
    const { data: analysisData, error: analysisError } = await supabaseAdmin
      .from('campus_analysis')
      .select('*')
      .order('analysis_id', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Query latest campus_comparison row (comparison & renewable percent)
    const { data: comparisonData, error: comparisonError } = await supabaseAdmin
      .from('campus_comparison')
      .select('*')
      .order('comparison_id', { ascending: false })
      .limit(1)
      .maybeSingle();

    // If both queries failed, return fallbacks
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

    // Map columns from your schema to dashboard metrics.
    // Adjust these keys if your column names are different.
    const renewable_percent = Number(comparisonData?.renewable_energy_usage ?? comparisonData?.renewable_energy_u ?? comparisonData?.renewable_energy ?? 82.61);
    const carbon_saved_kg = Number(analysisData?.savings ?? analysisData?.carbon_saved_kg ?? 125.4);
    const monthly_usage_kwh = Number(analysisData?.consumption ?? analysisData?.consumption_kwh ?? 850);
    const energy_cost = Number(analysisData?.cost ?? 127.5);
    const trees_equivalent = Number(comparisonData?.trees_saved ?? comparisonData?.trees_saved_count ?? comparisonData?.trees_saved ?? 6);
    const coal_avoided_lbs = Number(comparisonData?.coal_avoided_lbs ?? 56.4);
    
    // Extract capacity/current values for the generator
    const solar_kw = Number(analysisData?.energy_solar ?? analysisData?.solar_kw ?? 47.4);
    const wind_kw = Number(analysisData?.energy_wind ?? analysisData?.wind_kw ?? 34.1);
    const battery_percent = Number(analysisData?.battery_percent ?? 75);
    // Calculate grid usage if not present (Consumption - (Solar + Wind))
    const grid_kw = Number(analysisData?.grid_kw ?? Math.max(0, monthly_usage_kwh - (solar_kw + wind_kw) * 24 * 30 / 1000)); // Rough fallback or 16

    // miles_not_driven is not stored in schema screenshots; leave undefined or derive later
    return {
      renewable_percent: isNaN(renewable_percent) ? 82.61 : renewable_percent,
      carbon_saved_kg: isNaN(carbon_saved_kg) ? 125.4 : carbon_saved_kg,
      monthly_usage_kwh: isNaN(monthly_usage_kwh) ? 850 : monthly_usage_kwh,
      energy_cost: isNaN(energy_cost) ? 127.5 : energy_cost,
      trees_equivalent: isNaN(trees_equivalent) ? 6 : trees_equivalent,
      miles_not_driven: undefined,
      coal_avoided_lbs: isNaN(coal_avoided_lbs) ? 56.4 : coal_avoided_lbs,
      solar_kw,
      wind_kw,
      battery_percent,
      grid_kw
    };
  } catch (err) {
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
}

export default async function CampusAdminDashboard() {
  const m = await fetchMetrics();

  const renewable = Number(m.renewable_percent ?? 0);
  const renewableFrac = Math.max(0, Math.min(100, renewable)) / 100;

  // Generate dynamic data based on fetched metrics
  const peakSolar = Number(m.solar_kw ?? 47.4);
  const peakWind = Number(m.wind_kw ?? 34.1);
  const batteryStart = Number(m.battery_percent ?? 75);
  
  // Use the generator function
  const data = generateEnergyData(
    0,           // minSolar
    peakSolar,   // maxSolar
    peakWind * 0.2, // minWind
    peakWind,    // maxWind
    batteryStart // batteryPercentage
  );

  // Forecast donut values (simple proportional values)
  const forecastSolar = peakSolar;
  const forecastWind = peakWind;
  const forecastGrid = Math.max(1, Math.round((m.monthly_usage_kwh ?? 850) / 30 / 24));

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Energy Dashboard</h1>
            <SessionGreeting />
          </div>
          <div className="flex items-center gap-3">
            <SimulateButton />
            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">{renewable.toFixed(2)}% Renewable</div>
            <a
  href="/api/export-report"
  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16l4-5m-4 5l-4-5m4 5V4m8 12v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4"
    />
  </svg>
  Export Report
</a>
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">Logout</Link>
          </div>
        </div>

        <TopMetricsRow
          solar_kw={Number((m as any).solar_kw ?? 47.4)}
          wind_kw={Number((m as any).wind_kw ?? 34.1)}
          battery_percent={Number((m as any).battery_percent ?? 75)}
          grid_kw={Number((m as any).grid_kw ?? 16)}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-emerald-50 rounded-xl p-5 shadow">
            <div className="text-sm text-emerald-700 font-medium">Renewable Usage</div>
            <div className="text-2xl font-bold text-emerald-800 mt-2">{renewable.toFixed(6)}%</div>
            <div className="h-2 bg-white/60 rounded-full mt-3 overflow-hidden">
              <div style={{ width: `${renewable}%` }} className="h-2 bg-emerald-600" />
            </div>
            <div className="text-xs text-slate-600 mt-2">Above campus average</div>
          </div>

          <div className="bg-sky-50 rounded-xl p-5 shadow">
            <div className="text-sm text-sky-700 font-medium">Carbon Saved</div>
            <div className="text-2xl font-bold text-sky-800 mt-2">{m.carbon_saved_kg} kg</div>
            <div className="text-xs text-slate-600 mt-2">This month</div>
          </div>

          <div className="bg-amber-50 rounded-xl p-5 shadow">
            <div className="text-sm text-amber-700 font-medium">Monthly Usage</div>
            <div className="text-2xl font-bold text-amber-800 mt-2">{m.monthly_usage_kwh} kWh</div>
            <div className="text-xs text-slate-600 mt-2">{Math.round((Math.random()-0.5)*20)}% change vs last month</div>
          </div>

          <div className="bg-violet-50 rounded-xl p-5 shadow">
            <div className="text-sm text-violet-700 font-medium">Energy Cost</div>
            <div className="text-2xl font-bold text-violet-800 mt-2">${m.energy_cost}</div>
            <div className="text-xs text-slate-600 mt-2">Savings from renewables</div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <EnergyMix renewablePercent={Number(m.renewable_percent ?? 82.61)} rank={6} rankTotal={25} />
              </div>
              <div>
                <div className="bg-white rounded-xl shadow p-6 h-full">
                  <h3 className="text-lg font-semibold mb-3">Sustainability Impact</h3>
                  <div className="text-sm text-slate-500 mb-4">Your contribution to campus sustainability</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Trees Equivalent</div>
                      <div className="font-semibold text-emerald-700">{m.trees_equivalent}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Miles Not Driven</div>
                      <div className="font-semibold text-sky-700">{m.miles_not_driven ?? 300} mi</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Coal Avoided</div>
                      <div className="font-semibold text-amber-700">{m.coal_avoided_lbs} lbs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <AreaChart24h data={data} />
            </div>
          </div>

          <div>
            <ForecastDonut grid={forecastGrid} solar={forecastSolar} wind={forecastWind} />
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Smart Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">Battery optimization <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded ml-2">High Impact</span></div>
                <div className="text-sm text-slate-500">Battery at optimal level. Consider partial discharge during peak hours.</div>
                <div className="text-sm text-emerald-600 mt-1">Potential savings: $45/month</div>
              </div>
              <button className="px-3 py-1 bg-white border rounded">Optimize Schedule</button>
            </div>

            <div className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">Load balancing opportunity <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded ml-2">Medium Impact</span></div>
                <div className="text-sm text-slate-500">Consider shifting non-critical loads to match generation patterns.</div>
                <div className="text-sm text-emerald-600 mt-1">Potential savings: $32/month</div>
              </div>
              <button className="px-3 py-1 bg-white border rounded">Shift Loads</button>
            </div>

            <div className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">Shift workshop loads to 2–4 PM <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded ml-2">Medium Impact</span></div>
                <div className="text-sm text-slate-500">Solar generation peaks during these hours. Move energy-intensive operations here.</div>
                <div className="text-sm text-emerald-600 mt-1">Potential savings: $56/month</div>
              </div>
              <button className="px-3 py-1 bg-white border rounded">Schedule Loads</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

