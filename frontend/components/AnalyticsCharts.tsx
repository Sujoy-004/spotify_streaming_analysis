"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface ChartProps {
  data: any[];
  title: string;
}

export function TopTracksChart({ data, title }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center border border-dashed border-white/10 rounded-xl">
        <p className="text-spotify-lightGray text-sm">No streaming data available for this selection.</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <h3 className="font-heading text-xl font-bold mb-6 text-white">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="Track" 
            type="category" 
            tick={{ fill: '#B3B3B3', fontSize: 10 }} 
            width={100}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#282828', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
            itemStyle={{ color: '#1DB954', fontWeight: 'bold' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar dataKey="Spotify Streams" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`rgba(29, 185, 84, ${1 - index * 0.08})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DistributionChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center border border-dashed border-white/10 rounded-xl">
        <p className="text-spotify-lightGray text-sm">No content distribution metrics found.</p>
      </div>
    );
  }

  // Simple distribution grouping for the pie chart
  const explicitCount = data.filter(t => t['Explicit Track'] === 1 || t['Explicit Track'] === '1').length;
  const cleanCount = data.length - explicitCount;

  const distribution = [
    { name: 'Explicit', value: explicitCount },
    { name: 'Clean', value: cleanCount },
  ];

  const COLORS = ['#1DB954', '#282828'];

  return (
    <div className="h-[400px] w-full flex flex-col items-center">
      <h3 className="font-heading text-xl font-bold mb-6 text-white">Content Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={distribution}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {distribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#282828', border: 'none', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-4">
        {distribution.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
            <span className="text-xs text-spotify-lightGray font-medium">{d.name} ({Math.round(d.value / data.length * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
