'use client';

import React from 'react';
import { Sun, Wind, Battery, Zap } from 'lucide-react';
import Link from 'next/link';

type TopMetricsProps = {
  solar_kw: number;
  wind_kw: number;
  battery_percent: number;
  grid_kw: number;
};

export default function TopMetricsRow({ solar_kw, wind_kw, battery_percent, grid_kw }: TopMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      
      {/* 1. Solar Generation -> Links to /campusAdmin/dview/solar */}
      <Link href="/campusAdmin/dview/solar" className="block group">
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 shadow-sm border border-amber-100 dark:border-amber-800 h-full transition-transform duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-amber-700 dark:text-amber-400">Solar Generation</div>
            <Sun className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
            {solar_kw.toFixed(2)} kW
          </div>
          <div className="text-xs text-amber-600/80 dark:text-amber-400 mt-2">
            +12% from yesterday
          </div>
        </div>
      </Link>

      {/* 2. Wind Generation -> Links to /campusAdmin/dview/wind */}
      <Link href="/campusAdmin/dview/wind" className="block group">
        <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-5 shadow-sm border border-sky-100 dark:border-sky-800 h-full transition-transform duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-sky-700 dark:text-sky-400">Wind Generation</div>
            <Wind className="w-5 h-5 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-sky-800 dark:text-sky-300">
            {wind_kw.toFixed(2)} kW
          </div>
          <div className="text-xs text-sky-600/80 dark:text-sky-400 mt-2">
            Wind speed: 6.2 m/s
          </div>
        </div>
      </Link>

      {/* 3. Battery Status -> Links to /campusAdmin/dview/battery */}
      <Link href="/campusAdmin/dview/battery" className="block group">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 shadow-sm border border-emerald-100 dark:border-emerald-800 h-full transition-transform duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Battery Status</div>
            <Battery className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
            {battery_percent.toFixed(0)}%
          </div>
          <div className="w-full bg-emerald-200 dark:bg-emerald-900 rounded-full h-2 mt-3">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${battery_percent}%` }}
            />
          </div>
        </div>
      </Link>

      {/* 4. Grid Exchange -> Links to /campusAdmin/dview/grid */}
      <Link href="/campusAdmin/dview/grid" className="block group">
        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-5 shadow-sm border border-violet-100 dark:border-violet-800 h-full transition-transform duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-violet-700 dark:text-violet-400">Grid Exchange</div>
            <Zap className="w-5 h-5 text-violet-500" />
          </div>
          {/* TRUNCATED TO 2 DECIMAL PLACES HERE */}
          <div className="text-2xl font-bold text-violet-800 dark:text-violet-300">
            {grid_kw.toFixed(2)} kW
          </div>
          <div className="text-xs text-violet-600/80 dark:text-violet-400 mt-2">
            Importing from grid
          </div>
        </div>
      </Link>

    </div>
  );
}