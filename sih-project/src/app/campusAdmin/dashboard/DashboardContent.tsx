"use client";

import React, { useState } from 'react';
import TopMetricsRow from './TopMetricsRow';
import AreaChart24h from './AreaChart24h';
import ForecastDonut from './ForecastDonut';
import EnergyMix from './EnergyMix';

// Updated type to match page.tsx
type Metrics = {
  renewable_percent: number;
  carbon_saved_kg: number;
  monthly_usage_kwh: number;
  energy_cost: number;
  trees_equivalent: number;
  km_not_driven: number; // Metric
  coal_avoided_kg: number; // Metric
  solar_kw: number;
  wind_kw: number;
  battery_percent: number;
  grid_kw: number;
};

type DashboardContentProps = {
  initialMetrics: Metrics;
  chartData: any[];
  forecastData: {
    grid: number;
    solar: number;
    wind: number;
  };
};

export default function DashboardContent({ initialMetrics, chartData, forecastData }: DashboardContentProps) {
  const [optimizations, setOptimizations] = useState<Set<string>>(new Set());

  const handleOptimize = (id: string) => {
    setOptimizations(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const activeCount = optimizations.size;
  const totalSteps = 3;
  const progress = activeCount / totalSteps; 

  // Base metrics (Bad state)
  const baseMetrics = {
    ...initialMetrics,
    renewable_percent: Math.max(12.5, initialMetrics.renewable_percent - 50),
    carbon_saved_kg: Math.max(20, initialMetrics.carbon_saved_kg * 0.3),
    monthly_usage_kwh: initialMetrics.monthly_usage_kwh * 1.2, 
    energy_cost: initialMetrics.energy_cost * 1.4, 
    trees_equivalent: Math.max(1, Math.floor(initialMetrics.trees_equivalent * 0.2)),
    km_not_driven: Math.max(50, Math.floor(initialMetrics.km_not_driven * 0.3)),
    coal_avoided_kg: Math.max(10, Math.floor(initialMetrics.coal_avoided_kg * 0.25)),
  };

  // Interpolation logic
  const interpolate = (start: number, end: number) => start + (end - start) * progress;

  const metrics = {
    ...initialMetrics,
    renewable_percent: interpolate(baseMetrics.renewable_percent, initialMetrics.renewable_percent),
    carbon_saved_kg: interpolate(baseMetrics.carbon_saved_kg, initialMetrics.carbon_saved_kg),
    monthly_usage_kwh: interpolate(baseMetrics.monthly_usage_kwh, initialMetrics.monthly_usage_kwh),
    energy_cost: interpolate(baseMetrics.energy_cost, initialMetrics.energy_cost),
    trees_equivalent: Math.floor(interpolate(baseMetrics.trees_equivalent, initialMetrics.trees_equivalent)),
    km_not_driven: Math.floor(interpolate(baseMetrics.km_not_driven, initialMetrics.km_not_driven)),
    coal_avoided_kg: Math.floor(interpolate(baseMetrics.coal_avoided_kg, initialMetrics.coal_avoided_kg)),
  };

  const renewable = metrics.renewable_percent;
  
  // Theme logic
  let theme = "amber";
  if (activeCount === 3) theme = "emerald";
  else if (activeCount > 0) theme = "blue";

  const statusText = `text-${theme}-700 dark:text-${theme}-400`;
  const statusBg = `bg-${theme}-50 dark:bg-${theme}-900/20`;
  const statusBorder = `border-${theme}-100 dark:border-${theme}-800`;
  const barColor = `bg-${theme}-600 dark:bg-${theme}-500`;

  // Currency Conversion: Assuming DB value is USD, convert to INR for display
  const costInRupees = metrics.energy_cost * 83.5; 

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900 py-10 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <TopMetricsRow
          solar_kw={metrics.solar_kw}
          wind_kw={metrics.wind_kw}
          battery_percent={metrics.battery_percent}
          grid_kw={metrics.grid_kw}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Renewable Usage Card */}
          <div className={`rounded-xl p-5 shadow border transition-all duration-500 ${statusBg} ${statusBorder}`}>
            <div className={`text-sm font-medium ${statusText}`}>Renewable Usage</div>
            <div className={`text-2xl font-bold mt-2 text-${theme}-800 dark:text-${theme}-300`}>
              {/* TRUNCATED TO 2 DECIMALS */}
              {renewable.toFixed(2)}%
            </div>
            <div className="h-2 bg-white/60 dark:bg-slate-800/60 rounded-full mt-3 overflow-hidden">
              <div style={{ width: `${Math.min(100, renewable)}%` }} className={`h-2 transition-all duration-1000 ${barColor}`} />
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              {activeCount === 3 ? "Above campus average" : "Below target efficiency"}
            </div>
          </div>

          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-5 shadow border border-sky-100 dark:border-sky-800">
            <div className="text-sm text-sky-700 dark:text-sky-400 font-medium">Carbon Saved</div>
            <div className="text-2xl font-bold text-sky-800 dark:text-sky-300 mt-2">
              {metrics.carbon_saved_kg.toFixed(2)} kg
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">This month</div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 shadow border border-amber-100 dark:border-amber-800">
            <div className="text-sm text-amber-700 dark:text-amber-400 font-medium">Monthly Usage</div>
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-300 mt-2">
              {metrics.monthly_usage_kwh.toFixed(0)} kWh
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">{activeCount === 3 ? "-12% vs last month" : "+5% vs last month"}</div>
          </div>

          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-5 shadow border border-violet-100 dark:border-violet-800">
            <div className="text-sm text-violet-700 dark:text-violet-400 font-medium">Energy Cost</div>
            <div className="text-2xl font-bold text-violet-800 dark:text-violet-300 mt-2">
              {/* CONVERTED TO RS AND TRUNCATED */}
              ₹{costInRupees.toFixed(2)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">Savings from renewables</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <EnergyMix renewablePercent={metrics.renewable_percent} rank={activeCount === 3 ? 6 : 18} rankTotal={25} />
              </div>
              <div>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 h-full border border-slate-100 dark:border-slate-700">
                  <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">Sustainability Impact</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">Your contribution to campus sustainability</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-700 dark:text-slate-300">Trees Equivalent</div>
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400">{metrics.trees_equivalent}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-700 dark:text-slate-300">Driving Avoided</div>
                      {/* UNIT CONVERTED TO KM */}
                      <div className="font-semibold text-sky-700 dark:text-sky-400">{metrics.km_not_driven} km</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-700 dark:text-slate-300">Coal Avoided</div>
                      {/* UNIT CONVERTED TO KG */}
                      <div className="font-semibold text-amber-700 dark:text-amber-400">{metrics.coal_avoided_kg} kg</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <AreaChart24h data={chartData} />
            </div>
          </div>

          <div>
            <ForecastDonut grid={forecastData.grid} solar={forecastData.solar} wind={forecastData.wind} />
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Smart Recommendations</h3>
          <div className="space-y-4">
            <div className={`p-4 rounded shadow flex justify-between items-center border transition-colors duration-300 ${optimizations.has('battery') ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Battery optimization <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded ml-2">High Impact</span></div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Battery at optimal level. Consider partial discharge during peak hours.</div>
                {/* DOLLARS TO RS CONVERSION (Approx 45 * 83.5) */}
                <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Potential savings: ₹3,750/month</div>
              </div>
              <button 
                onClick={() => handleOptimize('battery')}
                disabled={optimizations.has('battery')}
                className={`px-3 py-1 rounded transition-colors ${optimizations.has('battery') ? 'bg-emerald-200 text-emerald-800 cursor-default' : 'bg-white dark:bg-slate-700 border dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
              >
                {optimizations.has('battery') ? 'Active' : 'Optimize Schedule'}
              </button>
            </div>

            <div className={`p-4 rounded shadow flex justify-between items-center border transition-colors duration-300 ${optimizations.has('load') ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Load balancing opportunity <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded ml-2">Medium Impact</span></div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Consider shifting non-critical loads to match generation patterns.</div>
                {/* DOLLARS TO RS CONVERSION (Approx 32 * 83.5) */}
                <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Potential savings: ₹2,670/month</div>
              </div>
              <button 
                onClick={() => handleOptimize('load')}
                disabled={optimizations.has('load')}
                className={`px-3 py-1 rounded transition-colors ${optimizations.has('load') ? 'bg-emerald-200 text-emerald-800 cursor-default' : 'bg-white dark:bg-slate-700 border dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
              >
                {optimizations.has('load') ? 'Active' : 'Shift Loads'}
              </button>
            </div>

            <div className={`p-4 rounded shadow flex justify-between items-center border transition-colors duration-300 ${optimizations.has('workshop') ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Shift workshop loads to 2–4 PM <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded ml-2">Medium Impact</span></div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Solar generation peaks during these hours. Move energy-intensive operations here.</div>
                {/* DOLLARS TO RS CONVERSION (Approx 56 * 83.5) */}
                <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Potential savings: ₹4,675/month</div>
              </div>
              <button 
                onClick={() => handleOptimize('workshop')}
                disabled={optimizations.has('workshop')}
                className={`px-3 py-1 rounded transition-colors ${optimizations.has('workshop') ? 'bg-emerald-200 text-emerald-800 cursor-default' : 'bg-white dark:bg-slate-700 border dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
              >
                {optimizations.has('workshop') ? 'Active' : 'Schedule Loads'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}