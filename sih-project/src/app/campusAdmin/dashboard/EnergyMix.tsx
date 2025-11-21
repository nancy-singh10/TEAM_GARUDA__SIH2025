"use client";

import React from 'react';

export default function EnergyMix({ rank = 6, rankTotal = 25, renewablePercent }: { rank?: number; rankTotal?: number; renewablePercent?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex items-center justify-center border border-slate-100 dark:border-slate-700 h-full">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Campus Rank</h3>
        <div className="flex items-center justify-center w-36 h-36 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">#{rank}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">of {rankTotal}</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">Top performers: higher rank = better</div>
        {renewablePercent !== undefined && (
            <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">Renewable: {renewablePercent.toFixed(1)}%</div>
        )}
      </div>
    </div>
  );
}
