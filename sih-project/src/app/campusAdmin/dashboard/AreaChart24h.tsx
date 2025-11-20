"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Point = {
  time: string;
  consumption: number;
  solar: number;
  wind: number;
};

export default function AreaChart24h({ data }: { data: Point[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Energy Generation & Demand (24h)</h3>
      <div className="text-sm text-slate-500 mb-4">Real-time monitoring of campus energy flow</div>
      <div className="w-full h-[360px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" debounce={200}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bfdbfe" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bbf7d0" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#bbf7d0" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="consumption" stroke="#fb923c" fillOpacity={0} dot={false} />
            <Area type="monotone" dataKey="solar" stroke="#10b981" fill="url(#colorSolar)" dot={false} />
            <Area type="monotone" dataKey="wind" stroke="#60a5fa" fill="url(#colorWind)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
