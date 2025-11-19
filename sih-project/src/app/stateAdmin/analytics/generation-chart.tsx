"use client";

import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  Legend
} from 'recharts';

interface GenerationData {
  name: string;
  value: number;
  fill: string;
}

interface GenerationChartProps {
  data: GenerationData[];
}

export default function GenerationChart({ data }: GenerationChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip 
          contentStyle={{ backgroundColor: "#161b22", border: "1px solid #30363d" }}
        />
        <Legend 
          wrapperStyle={{ color: "#ffffff", bottom: 0 }}
          iconType="circle"
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60} // This makes it a donut chart
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}