"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ForecastDonut({ grid, solar, wind }: { grid: number; solar: number; wind: number }) {
  const data = [
    { name: 'Grid', value: grid },
    { name: 'Solar', value: solar },
    { name: 'Wind', value: wind },
  ];
  const COLORS = ['#e9d5ff', '#fde68a', '#bfdbfe'];
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 h-full border border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">7-Day Energy Forecast</h3>
      <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">Predicted generation based on weather patterns</div>
      <div className="w-full h-[240px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" debounce={200}>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => {
                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return [`${value} kWh (${percent}%)`, 'Energy'];
              }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: '#1e293b'
              }}
              itemStyle={{ color: '#1e293b' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 bg-[#e9d5ff] rounded-full"/> Grid</div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 bg-[#fde68a] rounded-full"/> Solar</div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 bg-[#bfdbfe] rounded-full"/> Wind</div>
      </div>
    </div>
  );
}
