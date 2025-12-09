"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopMetricsRow from './TopMetricsRow';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BuildingLeaderboard from './BuildingLeaderboard';
import StudentEngagementWidget from './StudentEngagementWidget';

type Metrics = {
  renewable_percent: number;
  carbon_saved_kg: number;
  monthly_usage_kwh: number;
  energy_cost: number;
  trees_equivalent: number;
  km_not_driven: number;
  coal_avoided_kg: number;
  solar_kw: number;
  wind_kw: number;
  battery_percent: number;
  grid_kw: number;
};

type Building = {
  id: string;
  name: string;
  base_load: number;
  tokens: number;
};

type DashboardContentProps = {
  initialMetrics: Metrics;
  chartData: any[];
  forecastData: {
    grid: number;
    solar: number;
    wind: number;
  };
  user: any;
  buildings: Building[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

export default function DashboardContent({ initialMetrics, chartData, forecastData, user, buildings }: DashboardContentProps) {
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

  // Currency Conversion
  const costInRupees = metrics.energy_cost * 83.5;

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900 py-10 px-6 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemVariants}>
          <TopMetricsRow
            solar_kw={metrics.solar_kw}
            wind_kw={metrics.wind_kw}
            battery_percent={metrics.battery_percent}
            grid_kw={metrics.grid_kw}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Renewable Usage Card */}
          <Link href="/campusAdmin/renewable-usage" className="block h-full">
            <div className={`h-full bg-white dark:bg-slate-800 rounded-xl p-5 shadow border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${statusBg} ${statusBorder} relative group overflow-hidden flex flex-col justify-between`}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-orange-600/0 group-hover:from-amber-400/5 group-hover:to-orange-600/5 transition-all duration-300" />
              <div>
                <div className={`text-sm font-medium ${statusText} flex justify-between items-center mb-2`}>
                  Renewable Usage
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:translate-x-1 group-hover:ml-0" />
                </div>
                <div className={`text-2xl font-bold text-${theme}-800 dark:text-${theme}-300`}>
                  {renewable.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="h-2 bg-white/60 dark:bg-slate-800/60 rounded-full mt-3 overflow-hidden">
                  <div style={{ width: `${Math.min(100, renewable)}%` }} className={`h-2 transition-all duration-1000 ${barColor}`} />
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  {activeCount === 3 ? "Above campus average" : "Below target efficiency"}
                </div>
              </div>
            </div>
          </Link>

          {/* Carbon Saved Card */}
          <Link href="/campusAdmin/carbon-saved" className="block h-full">
            <div className="h-full bg-sky-50 dark:bg-sky-900/20 rounded-xl p-5 shadow border border-sky-100 dark:border-sky-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/0 to-blue-600/0 group-hover:from-sky-400/5 group-hover:to-blue-600/5 transition-all duration-300" />
              <div>
                <div className="text-sm text-sky-700 dark:text-sky-400 font-medium flex justify-between items-center mb-2">
                  Carbon Saved
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:translate-x-1 group-hover:ml-0" />
                </div>
                <div className="text-2xl font-bold text-sky-800 dark:text-sky-300">
                  {metrics.carbon_saved_kg.toFixed(2)} kg
                </div>
              </div>
              <div>
                <div className="h-2 mt-3 w-full" />
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">This month</div>
              </div>
            </div>
          </Link>

          {/* Sustainability Impact Card */}
          <Link href="/campusAdmin/sustainability" className="block h-full">
            <div className={`h-full bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 shadow border border-emerald-100 dark:border-emerald-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer group relative overflow-hidden flex flex-col justify-between`}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-teal-600/0 group-hover:from-emerald-400/5 group-hover:to-teal-600/5 transition-all duration-300" />
              <div>
                <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium flex justify-between items-center mb-2">
                  Sustainability Impact
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:translate-x-1 group-hover:ml-0" />
                </div>
                <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  {metrics.trees_equivalent} Trees
                </div>
              </div>
              <div>
                <div className="h-2 mt-3 w-full" />
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">Offset equivalent</div>
              </div>
            </div>
          </Link>

          {/* Energy Cost Card */}
          <Link href="/campusAdmin/energy-cost" className="block h-full">
            <div className="h-full bg-violet-50 dark:bg-violet-900/20 rounded-xl p-5 shadow border border-violet-100 dark:border-violet-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-400/0 to-purple-600/0 group-hover:from-violet-400/5 group-hover:to-purple-600/5 transition-all duration-300" />
              <div>
                <div className="text-sm text-violet-700 dark:text-violet-400 font-medium flex justify-between items-center mb-2">
                  Energy Cost
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:translate-x-1 group-hover:ml-0" />
                </div>
                <div className="text-2xl font-bold text-violet-800 dark:text-violet-300">
                  ₹{costInRupees.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="h-2 mt-3 w-full" />
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">Savings from renewables</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 h-full">
          <BuildingLeaderboard buildings={buildings} />
          <StudentEngagementWidget campus_id={user?.campus_admin_id} />
        </div>

      </div>
    </motion.main>
  );
}
