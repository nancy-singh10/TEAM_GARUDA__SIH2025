"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ForecastDonut({ grid, solar, wind }: { grid: number; solar: number; wind: number }) {
  const data = [
    { name: 'Grid', value: grid },
    { name: 'Solar', value: solar },
    { name: 'Wind', value: wind },
  ];
  const COLORS = ['#e9d5ff', '#fde68a', '#bfdbfe'];

  return (
    <div className="bg-white rounded-xl shadow p-6 h-full">
      <h3 className="text-lg font-semibold mb-2">7-Day Energy Forecast</h3>
      <div className="text-sm text-slate-500 mb-4">Predicted generation based on weather patterns</div>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#e9d5ff] rounded-full"/> Grid</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#fde68a] rounded-full"/> Solar</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#bfdbfe] rounded-full"/> Wind</div>
      </div>
    </div>
  );
}
