"use client";

import React from 'react';

export default function EnergyMix({ rank = 6, rankTotal = 25, renewablePercent }: { rank?: number; rankTotal?: number; renewablePercent?: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Campus Rank</h3>
        <div className="flex items-center justify-center w-36 h-36 rounded-full bg-emerald-50 border border-emerald-100 mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-700">#{rank}</div>
            <div className="text-sm text-slate-500">of {rankTotal}</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-emerald-600">Top performers: higher rank = better</div>
        {renewablePercent !== undefined && (
            <div className="mt-2 text-xs text-slate-400">Renewable: {renewablePercent.toFixed(1)}%</div>
        )}
      </div>
    </div>
  );
}
