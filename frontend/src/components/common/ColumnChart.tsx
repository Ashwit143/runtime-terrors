import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type ImpactMetric = 'diverted' | 'co2' | 'saved';

export interface StreamImpactData {
  stream: string;
  diverted: number; // Tonnes
  co2: number;      // tCO2e
  saved: number;    // INR (Lakhs)
}

interface ColumnChartProps {
  data?: StreamImpactData[];
  metric?: ImpactMetric;
  height?: number;
}

const metricConfig: Record<ImpactMetric, { label: string; unit: string; color: string }> = {
  diverted: {
    label: 'Waste Diverted',
    unit: 't',
    color: '#1769AA', // Brand Blue
  },
  co2: {
    label: 'CO₂e Avoided',
    unit: 't',
    color: '#20A464', // Brand Green
  },
  saved: {
    label: 'Estimated Cost Saved',
    unit: '₹ Lakh',
    color: '#C99A3E', // Muted Gold
  },
};

// Default high-precision breakdown data aligned with Indian industrial streams
const defaultStreamData: StreamImpactData[] = [
  { stream: 'PET & Polymers', diverted: 480, co2: 384, saved: 14.4 },
  { stream: 'Cotton & Yarn', diverted: 320, co2: 288, saved: 8.0 },
  { stream: 'Aluminium Scrap', diverted: 850, co2: 1105, saved: 42.5 },
  { stream: 'Paddy Straw & Agro', diverted: 1200, co2: 960, saved: 12.0 },
  { stream: 'Steel Slag & Swarf', diverted: 620, co2: 496, saved: 18.6 },
  { stream: 'Spent Solvents', diverted: 180, co2: 234, saved: 9.9 },
];

export function ColumnChart({
  data = defaultStreamData,
  metric = 'diverted',
  height = 300,
}: ColumnChartProps) {
  const current = metricConfig[metric];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 16, right: 16, left: -8, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#D9E1E7"
          />
          <XAxis
            dataKey="stream"
            tickLine={false}
            axisLine={{ stroke: '#BAC7D5' }}
            tick={{ fill: '#667085', fontSize: 11, fontFamily: 'var(--font-sans)' }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tick={{ fill: '#667085', fontSize: 11, fontFamily: 'var(--font-sans)' }}
          />
          <Tooltip
            cursor={{ fill: '#EFF2F4' }}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #BAC7D5',
              borderRadius: 6,
              fontSize: 12,
              color: '#17202A',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 4px 12px rgba(16, 42, 67, 0.08)',
            }}
            formatter={(value: any) => [
              `${Number(value).toLocaleString()} ${current.unit}`,
              current.label,
            ]}
          />
          <Bar
            dataKey={metric}
            fill={current.color}
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
