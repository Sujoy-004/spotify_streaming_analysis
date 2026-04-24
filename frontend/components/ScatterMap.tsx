import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';
import { motion } from 'framer-motion';
import { ClusterPoint } from '../types';

const CLUSTER_COLORS: { [key: number]: string } = {
  0: "#1D9E75",
  1: "#7F77DD",
  2: "#D85A30",
  3: "#BA7517",
  4: "#378ADD",
  5: "#888780"
};

/**
 * High-fidelity tooltip for the neural manifold visualization.
 */
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ClusterPoint;
    return (
      <div className="bg-arctic-900 p-3 border border-arctic-700 rounded-lg shadow-2xl text-[11px] backdrop-blur-md bg-opacity-95">
        <p className="font-bold text-white mb-1 leading-tight">{data.Track}</p>
        <p className="text-arctic-400 font-medium">{data.artist}</p>
        <div className="mt-2 pt-2 border-t border-arctic-800 flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full shadow-inner" 
            style={{ backgroundColor: CLUSTER_COLORS[data.cluster] || CLUSTER_COLORS[data.Cluster] || '#ccc' }} 
          />
          <span className="font-semibold text-arctic-300 uppercase tracking-tighter">
            Cluster {data.cluster ?? data.Cluster}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface ScatterMapProps {
  data: ClusterPoint[];
  onPointClick: (artist: string) => void;
}

/**
 * Orchestrates the 2D manifold visualization of high-dimensional track features.
 * Optimized for recruiter-level performance and visual fidelity.
 */
const ScatterMap = ({ data, onPointClick }: ScatterMapProps) => {
  const plotData = Array.isArray(data) ? data.slice(0, 2000) : [];

  if (!plotData.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-arctic-800 border border-arctic-700 rounded-xl h-[500px] p-6 flex flex-col items-center justify-center text-center"
      >
        <p className="text-sm text-arctic-400 font-medium">Synchronizing Neural Manifold...</p>
        <p className="text-xs text-arctic-500 mt-2">Connecting to Spotify Intelligence Layer on Port 8001</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-arctic-800 border border-arctic-700 rounded-xl overflow-hidden h-[500px] flex flex-col shadow-lg hover:border-arctic-600 transition-colors"
    >
      <header className="px-4 py-3 border-b border-arctic-700 flex items-center justify-between bg-arctic-800/50">
        <h3 className="text-sm font-semibold text-white tracking-wide">Neural Spectral Manifold</h3>
        <span className="px-2 py-0.5 bg-arctic-700 text-[10px] text-arctic-300 rounded uppercase font-bold tracking-widest">
          N={plotData.length} Records
        </span>
      </header>

      <div className="flex-1 w-full px-4 py-2 bg-arctic-900/10">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" hide domain={['auto', 'auto']} />
            <YAxis type="number" dataKey="y" hide domain={['auto', 'auto']} />
            <ZAxis type="number" range={[55, 55]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            <Scatter 
              name="Discovery Map" 
              data={plotData} 
              onClick={(e) => onPointClick(e.payload.artist)}
              className="cursor-crosshair focus:outline-none"
            >
              {plotData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CLUSTER_COLORS[entry.cluster] || CLUSTER_COLORS[entry.Cluster] || "#8884d8"} 
                  fillOpacity={0.75}
                  className="hover:fill-white hover:fill-opacity-100 transition-all duration-200"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <footer className="px-4 py-3 border-t border-arctic-700 flex gap-4 flex-wrap bg-arctic-900/30">
        {Object.entries(CLUSTER_COLORS).map(([cluster, color]) => (
          <div key={cluster} className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-bold text-arctic-400 uppercase tracking-widest">Cluster {cluster}</span>
          </div>
        ))}
      </footer>
    </motion.div>
  );
};

export default ScatterMap;
