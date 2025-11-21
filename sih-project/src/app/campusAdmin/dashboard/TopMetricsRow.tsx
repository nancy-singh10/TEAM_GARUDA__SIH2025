"use client";

import React from 'react';

type Props = {
  solar_kw: number;
  wind_kw: number;
  battery_percent: number;
  grid_kw: number;
};

export default function TopMetricsRow({ solar_kw, wind_kw, battery_percent, grid_kw }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 shadow border border-yellow-100 dark:border-yellow-800">
        <div className="text-sm text-amber-700 dark:text-amber-400">Solar Generation</div>
        <div className="text-3xl font-semibold text-amber-800 dark:text-amber-300 mt-3">{solar_kw} kW</div>
        <div className="text-xs text-amber-600 dark:text-amber-500 mt-2">+12% from yesterday</div>
      </div>

      <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-6 shadow border border-sky-100 dark:border-sky-800">
        <div className="text-sm text-sky-700 dark:text-sky-400">Wind Generation</div>
        <div className="text-3xl font-semibold text-sky-800 dark:text-sky-300 mt-3">{wind_kw} kW</div>
        <div className="text-xs text-sky-600 dark:text-sky-500 mt-2">Wind speed: 6.2 m/s</div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 shadow border border-emerald-100 dark:border-emerald-800">
        <div className="text-sm text-emerald-700 dark:text-emerald-400">Battery Status</div>
        <div className="text-3xl font-semibold text-emerald-800 dark:text-emerald-300 mt-3">{battery_percent}%</div>
        <div className="w-full bg-white/60 dark:bg-slate-800/60 rounded-full h-3 mt-4 overflow-hidden">
          <div style={{ width: `${battery_percent}%` }} className="h-3 bg-emerald-600 dark:bg-emerald-500" />
        </div>
      </div>

      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-6 shadow border border-violet-100 dark:border-violet-800">
        <div className="text-sm text-violet-700 dark:text-violet-400">Grid Exchange</div>
        <div className="text-3xl font-semibold text-violet-800 dark:text-violet-300 mt-3">{grid_kw} kW</div>
        <div className="text-xs text-violet-600 dark:text-violet-500 mt-2">Importing from grid</div>
      </div>
    </div>
  );
}
