"use client";

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';

interface PerformanceData {
  name: string;
  Consumption: number;
  'Solar Gen': number;
  'Wind Gen': number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
        <XAxis 
          dataKey="name" 
          stroke="#888888"
          fontSize={12}
        />
        <YAxis 
          stroke="#888888"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: "#161b22", border: "1px solid #30363d" }}
          labelStyle={{ color: "#ffffff" }}
        />
        <Legend 
          wrapperStyle={{ color: "#ffffff" }}
          iconType="circle"
        />
        
        {/* Consumption Line */}
        <Line 
          type="monotone" 
          dataKey="Consumption" 
          stroke="#F97316" // Orange
          strokeWidth={2}
          dot={false}
        />

        {/* Solar Gen Area */}
        <Area 
          type="monotone" 
          dataKey="Solar Gen" 
          stackId="1" 
          stroke="#22C55E" // Green
          fill="#22C55E" 
          fillOpacity={0.6}
        />
        
        {/* Wind Gen Area */}
        <Area 
          type="monotone" 
          dataKey="Wind Gen" 
          stackId="1" 
          stroke="#3B82F6" // Blue
          fill="#3B82F6" 
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}