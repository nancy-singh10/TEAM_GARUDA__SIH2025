export const dynamic = 'force-dynamic';
import supabaseAdmin from '../../../lib/supabaseServer';
import { generateEnergyData } from '@/lib/energyUtils';
import DashboardContent from './DashboardContent';

type Metrics = {
  renewable_percent: number;
  carbon_saved_kg: number;
  monthly_usage_kwh: number;
  energy_cost: number;
  trees_equivalent: number;
  miles_not_driven: number;
  coal_avoided_lbs: number;
  solar_kw: number;
  wind_kw: number;
  battery_percent: number;
  grid_kw: number;
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
    const renewable_percent = Number(comparisonData?.renewable_energy_usage ?? comparisonData?.renewable_energy_u ?? comparisonData?.renewable_energy ?? 82.61);
    const carbon_saved_kg = Number(analysisData?.savings ?? analysisData?.carbon_saved_kg ?? 125.4);
    const monthly_usage_kwh = Number(analysisData?.consumption ?? analysisData?.consumption_kwh ?? 850);
    const energy_cost = Number(analysisData?.cost ?? 127.5);
    const trees_equivalent = Number(comparisonData?.trees_saved ?? comparisonData?.trees_saved_count ?? comparisonData?.trees_saved ?? 6);
    const coal_avoided_lbs = Number(comparisonData?.coal_avoided_lbs ?? 56.4);
    
    const solar_kw = Number(analysisData?.energy_solar ?? analysisData?.solar_kw ?? 47.4);
    const wind_kw = Number(analysisData?.energy_wind ?? analysisData?.wind_kw ?? 34.1);
    const battery_percent = Number(analysisData?.battery_percent ?? 75);
    const grid_kw = Number(analysisData?.grid_kw ?? Math.max(0, monthly_usage_kwh - (solar_kw + wind_kw) * 24 * 30 / 1000));

    return {
      renewable_percent: isNaN(renewable_percent) ? 82.61 : renewable_percent,
      carbon_saved_kg: isNaN(carbon_saved_kg) ? 125.4 : carbon_saved_kg,
      monthly_usage_kwh: isNaN(monthly_usage_kwh) ? 850 : monthly_usage_kwh,
      energy_cost: isNaN(energy_cost) ? 127.5 : energy_cost,
      trees_equivalent: isNaN(trees_equivalent) ? 6 : trees_equivalent,
      miles_not_driven: 300, // Default as it's not in schema
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

  // Generate dynamic data based on fetched metrics
  const peakSolar = Number(m.solar_kw ?? 47.4);
  const peakWind = Number(m.wind_kw ?? 34.1);
  const batteryStart = Number(m.battery_percent ?? 75);
  
  const data = generateEnergyData(
    0,           // minSolar
    peakSolar,   // maxSolar
    peakWind * 0.2, // minWind
    peakWind,    // maxWind
    batteryStart // batteryPercentage
  );

  // Forecast donut values
  const forecastSolar = peakSolar;
  const forecastWind = peakWind;
  const forecastGrid = Math.max(1, Math.round((m.monthly_usage_kwh ?? 850) / 30 / 24));

  return (
    <DashboardContent 
      initialMetrics={m}
      chartData={data}
      forecastData={{
        grid: forecastGrid,
        solar: forecastSolar,
        wind: forecastWind
      }}
    />
  );
}

