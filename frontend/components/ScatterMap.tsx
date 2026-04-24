import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const CLUSTER_COLORS: { [key: number]: string } = {
  0: "#1D9E75",
  1: "#7F77DD",
  2: "#D85A30",
  3: "#BA7517",
  4: "#378ADD",
  5: "#888780"
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-arctic-900 p-3 border border-arctic-700 rounded-lg shadow-xl text-[11px]">
        <p className="font-bold text-white">{data.Track}</p>
        <p className="text-arctic-400">{data.artist}</p>
        <div className="mt-1 flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: CLUSTER_COLORS[data.Cluster] || '#ccc' }} 
          />
          <span className="font-medium text-arctic-400">Cluster {data.Cluster}</span>
        </div>
      </div>
    );
  }
  return null;
};

const ScatterMap = ({ data, onPointClick }: { data: any[], onPointClick: (artist: string) => void }) => {
  // Defensive array handling and performance capping
  const plotData = Array.isArray(data) ? data.slice(0, 2000) : [];

  if (!plotData.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-arctic-800 border border-arctic-700 rounded-xl h-[500px] p-6 flex flex-col items-center justify-center text-center shadow-sm"
      >
        <p className="text-xs text-arctic-400">No discovery data available. Ensure backend is running on Port 8001.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-arctic-800 border border-arctic-700 rounded-xl overflow-hidden h-[500px] flex flex-col"
    >
      <div className="px-4 py-3 border-b border-arctic-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white tracking-wide">Neural Spectral Manifold</h3>
        <span className="text-xs text-arctic-400">N=2000 Records</span>
      </div>

      <div className="flex-1 w-full px-4 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" hide domain={['auto', 'auto']} stroke="#94a3b8" />
            <YAxis type="number" dataKey="y" hide domain={['auto', 'auto']} stroke="#94a3b8" />
            <ZAxis type="number" range={[60, 60]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeDasharray: '3 3' }} />
            <Scatter 
              name="Discovery Map" 
              data={plotData} 
              onClick={(e) => onPointClick(e.payload.artist)}
              className="cursor-pointer"
            >
              {plotData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CLUSTER_COLORS[entry.Cluster] || "#8884d8"} 
                  fillOpacity={0.7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="px-4 py-3 border-t border-arctic-700 flex gap-4 flex-wrap bg-arctic-900/50">
        {Object.entries(CLUSTER_COLORS).map(([cluster, color]) => (
          <div key={cluster} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-medium text-arctic-400 uppercase tracking-widest">Cluster {cluster}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ScatterMap;
