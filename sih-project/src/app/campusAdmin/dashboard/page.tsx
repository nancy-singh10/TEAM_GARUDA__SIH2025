export const dynamic = 'force-dynamic';
import supabaseAdmin from '../../../lib/supabaseServer';
import { cookies } from 'next/headers';
import { generateEnergyData } from '@/lib/energyUtils';
import DashboardContent from './DashboardContent';

// 1. User Type Definition
// Matches your Supabase 'campus_admin' table schema exactly
export type CampusUser = {
  campus_admin_id: string;
  username: string;
  admin_name: string;
  email: string;
  campus_name: string;
  location: string;
  
  // Energy Configuration Fields (Numeric)
  campus_load_min: number;
  campus_load_max: number;
  solar_capacity: number;
  wind_capacity: number;
  battery_capacity: number;
  max_grid_limit: number;
};

// 2. Metrics Type Definition
type Metrics = {
  renewable_percent: number;
  carbon_saved_kg: number;
  monthly_usage_kwh: number;
  energy_cost: number;
  trees_equivalent: number;
  km_not_driven: number;   // Metric Unit (km)
  coal_avoided_kg: number; // Metric Unit (kg)
  solar_kw: number;
  wind_kw: number;
  battery_percent: number;
  grid_kw: number;
};

// 3. Fetch User Profile
async function fetchUserProfile() {
  try {
    const cookieStore = await cookies();
    const campusCookie = cookieStore.get('campus_admin_id');
    
    // If no cookie, return null (User is not authenticated)
    if (!campusCookie) {
      console.log("No auth cookie found. Please log in.");
      return null; 
    }

    const adminId = campusCookie.value;
    console.log("Fetching profile for Cookie ID:", adminId);

    const { data: user, error } = await supabaseAdmin
      .from('campus_admin')
      .select('*')
      .eq('campus_admin_id', adminId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }
    
    return user as CampusUser;
  } catch (err) {
    console.error('Profile fetch failed:', err);
    return null;
  }
}

// 4. Fetch Energy Metrics
async function fetchMetrics(): Promise<Metrics> {
  try {
    // Query latest analysis (Real-time data)
    const { data: analysisData } = await supabaseAdmin
      .from('campus_analysis')
      .select('*')
      .order('analysis_id', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Query latest comparison (Sustainability data)
    const { data: comparisonData } = await supabaseAdmin
      .from('campus_comparison')
      .select('*')
      .order('comparison_id', { ascending: false })
      .limit(1)
      .maybeSingle();

    // --- Data Parsing & Defaults ---
    const renewable_percent = Number(comparisonData?.renewable_energy_usage ?? 82.61);
    const carbon_saved_kg = Number(analysisData?.savings ?? 125.4);
    const monthly_usage_kwh = Number(analysisData?.consumption ?? 850);
    const energy_cost = Number(analysisData?.cost ?? 127.5);
    const trees_equivalent = Number(comparisonData?.trees_saved ?? 6);
    
    // --- Unit Conversions ---
    // Coal: Convert Lbs (Database) -> Kg (Display) | 1 lb = 0.453592 kg
    const coal_lbs = Number(comparisonData?.coal_avoided_lbs ?? 56.4);
    const coal_avoided_kg = coal_lbs * 0.453592; 

    // Drive: Convert Miles (Default) -> Km (Display) | 1 mi = 1.60934 km
    const miles_driven = 300; 
    const km_not_driven = miles_driven * 1.60934;

    const solar_kw = Number(analysisData?.energy_solar ?? 47.4);
    const wind_kw = Number(analysisData?.energy_wind ?? 34.1);
    const battery_percent = Number(analysisData?.battery_percent ?? 75);
    const grid_kw = Number(analysisData?.grid_kw ?? Math.max(0, monthly_usage_kwh - (solar_kw + wind_kw) * 24 * 30 / 1000));

    return {
      renewable_percent: isNaN(renewable_percent) ? 82.61 : renewable_percent,
      carbon_saved_kg: isNaN(carbon_saved_kg) ? 125.4 : carbon_saved_kg,
      monthly_usage_kwh: isNaN(monthly_usage_kwh) ? 850 : monthly_usage_kwh,
      energy_cost: isNaN(energy_cost) ? 127.5 : energy_cost,
      trees_equivalent: isNaN(trees_equivalent) ? 6 : trees_equivalent,
      km_not_driven, 
      coal_avoided_kg,
      solar_kw,
      wind_kw,
      battery_percent,
      grid_kw
    };
  } catch (err) {
    // Fallback defaults (Metric units)
    return {
      renewable_percent: 82.61,
      carbon_saved_kg: 125.4,
      monthly_usage_kwh: 850,
      energy_cost: 127.5,
      trees_equivalent: 6,
      km_not_driven: 482.8, // ~300 miles
      coal_avoided_kg: 25.5, // ~56 lbs
      solar_kw: 47.4,
      wind_kw: 34.1,
      battery_percent: 75,
      grid_kw: 16
    };
  }
}

export default async function CampusAdminDashboard() {
  // Fetch Metrics and User Profile in parallel for performance
  const [m, user] = await Promise.all([
    fetchMetrics(),
    fetchUserProfile()
  ]);

  // Generate dynamic chart data based on live metrics
  const peakSolar = Number(m.solar_kw ?? 47.4);
  const peakWind = Number(m.wind_kw ?? 34.1);
  const batteryStart = Number(m.battery_percent ?? 75);
  
  const data = generateEnergyData(
    0, peakSolar, peakWind * 0.2, peakWind, batteryStart
  );

  const forecastSolar = peakSolar;
  const forecastWind = peakWind;
  const forecastGrid = Math.max(1, Math.round((m.monthly_usage_kwh ?? 850) / 30 / 24));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Content Component with User Profile Data Passed Down */}
      <DashboardContent 
        initialMetrics={m}
        chartData={data}
        forecastData={{
          grid: forecastGrid,
          solar: forecastSolar,
          wind: forecastWind
        }}
        user={user} 
      />
    </div>
  );
}