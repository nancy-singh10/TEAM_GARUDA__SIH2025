
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { generateEnergyData } from '@/lib/energyUtils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      minSolar = 0, 
      maxSolar = 50, 
      minWind = 5, 
      maxWind = 40, 
      batteryStart = 75 
    } = body;

    // 0. Get a valid campus_admin_id
    // Since this is a simulation, we'll try to use the one from body, or fallback to the first one in DB
    let targetCampusId = body.campus_id;

    if (!targetCampusId) {
        const { data: firstCampus } = await supabaseAdmin
            .from('campus_admin')
            .select('campus_admin_id')
            .limit(1)
            .maybeSingle();
        
        if (firstCampus) {
            targetCampusId = firstCampus.campus_admin_id;
        } else {
             return NextResponse.json({ error: 'No campus_admin found in database. Please sign up first.' }, { status: 404 });
        }
    }

    // 1. Generate the 24h data
    const timeSeriesData = generateEnergyData(minSolar, maxSolar, minWind, maxWind, batteryStart);

    // 2. Calculate aggregates to update the 'campus_analysis' table
    // We'll take the averages or peaks to represent the "current state" or "daily summary"
    const avgSolar = timeSeriesData.reduce((acc, curr) => acc + curr.solar, 0) / 24;
    const avgWind = timeSeriesData.reduce((acc, curr) => acc + curr.wind, 0) / 24;
    const totalConsumption = timeSeriesData.reduce((acc, curr) => acc + curr.consumption, 0);
    const currentBattery = timeSeriesData[new Date().getHours()]?.battery || batteryStart;
    
    // Calculate savings (Mock calculation: Renewable / Total * CostFactor)
    const totalRenewable = timeSeriesData.reduce((acc, curr) => acc + curr.solar + curr.wind, 0);
    const renewablePercent = (totalRenewable / (totalRenewable + totalConsumption)) * 100; // Rough estimate
    const carbonSaved = totalRenewable * 0.4; // 0.4 kg per kWh
    
    // 3. Update Supabase
    // We need to find the analysis_id for this campus. 
    // Assuming 1-to-1 relation or just updating the latest entry.
    
    // First, check if an entry exists
    const { data: existing } = await supabaseAdmin
      .from('campus_analysis')
      .select('analysis_id')
      .eq('campus_admin_id', targetCampusId)
      .order('analysis_id', { ascending: false })
      .limit(1)
      .maybeSingle();

    let error;
    
    const payload = {
      campus_admin_id: targetCampusId,
      energy_solar: parseFloat(avgSolar.toFixed(2)), // Storing average/peak as the "kw" capacity or current reading
      energy_wind: parseFloat(avgWind.toFixed(2)),
      consumption: parseFloat(totalConsumption.toFixed(2)),
      battery_percent: Math.round(currentBattery), // Must be integer
      savings: parseFloat(carbonSaved.toFixed(2)),
      cost: parseFloat((totalConsumption * 0.15).toFixed(2)), // $0.15 per kWh
      // grid_kw: parseFloat(Math.max(0, totalConsumption - totalRenewable).toFixed(2)) // Net grid usage - REMOVED as not in schema
    };

    if (existing) {
      const res = await supabaseAdmin
        .from('campus_analysis')
        .update(payload)
        .eq('analysis_id', existing.analysis_id);
      error = res.error;
    } else {
      const res = await supabaseAdmin
        .from('campus_analysis')
        .insert([payload]);
      error = res.error;
    }

    if (error) {
      console.error("Supabase Update Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also update comparison table for renewable percentage
    // Note: campus_comparison likely uses campus_id as FK to campus_admin too.
    // If the column is named 'campus_id' in comparison table but refers to campus_admin_id, we use targetCampusId.
    await supabaseAdmin.from('campus_comparison').upsert({
        campus_id: targetCampusId,
        renewable_energy_usage: parseFloat(renewablePercent.toFixed(2)),
        trees_saved: Math.floor(carbonSaved / 20), // Rough calc
        coal_avoided_lbs: parseFloat((carbonSaved * 2.2).toFixed(2))
    }, { onConflict: 'campus_id' });

    return NextResponse.json({ success: true, data: timeSeriesData });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
