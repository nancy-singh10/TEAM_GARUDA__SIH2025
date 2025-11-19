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
      <div className="bg-yellow-50 rounded-xl p-6 shadow">
        <div className="text-sm text-amber-700">Solar Generation</div>
        <div className="text-3xl font-semibold text-amber-800 mt-3">{solar_kw} kW</div>
        <div className="text-xs text-amber-600 mt-2">+12% from yesterday</div>
      </div>

      <div className="bg-sky-50 rounded-xl p-6 shadow">
        <div className="text-sm text-sky-700">Wind Generation</div>
        <div className="text-3xl font-semibold text-sky-800 mt-3">{wind_kw} kW</div>
        <div className="text-xs text-sky-600 mt-2">Wind speed: 6.2 m/s</div>
      </div>

      <div className="bg-emerald-50 rounded-xl p-6 shadow">
        <div className="text-sm text-emerald-700">Battery Status</div>
        <div className="text-3xl font-semibold text-emerald-800 mt-3">{battery_percent}%</div>
        <div className="w-full bg-white/60 rounded-full h-3 mt-4 overflow-hidden">
          <div style={{ width: `${battery_percent}%` }} className="h-3 bg-emerald-600" />
        </div>
      </div>

      <div className="bg-violet-50 rounded-xl p-6 shadow">
        <div className="text-sm text-violet-700">Grid Exchange</div>
        <div className="text-3xl font-semibold text-violet-800 mt-3">{grid_kw} kW</div>
        <div className="text-xs text-violet-600 mt-2">Importing from grid</div>
      </div>
    </div>
  );
}
