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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Energy Generation & Demand (24h)</h3>
      <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">Real-time monitoring of campus energy ecosystem (GARUDA)</div>
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
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={{ stroke: '#cbd5e1' }} />
            <YAxis tick={{ fill: '#94a3b8' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={{ stroke: '#cbd5e1' }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: '#1e293b'
              }}
              itemStyle={{ color: '#1e293b' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area type="monotone" dataKey="consumption" stroke="#fb923c" fillOpacity={0} dot={false} strokeWidth={2} />
            <Area type="monotone" dataKey="solar" stroke="#10b981" fill="url(#colorSolar)" dot={false} strokeWidth={2} />
            <Area type="monotone" dataKey="wind" stroke="#60a5fa" fill="url(#colorWind)" dot={false} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
