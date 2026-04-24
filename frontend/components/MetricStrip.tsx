import React from 'react';
import { motion } from 'framer-motion';

interface MetricProps {
  label: string;
  value: string | number;
  loading?: boolean;
}

const MetricCard = ({ label, value, loading }: MetricProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="bg-arctic-800 border border-arctic-700 rounded-xl p-4 flex flex-col"
  >
    <span className="text-xs text-arctic-400 uppercase tracking-widest mb-1">{label}</span>
    {loading ? (
      <div className="h-7 w-24 bg-arctic-700 animate-pulse rounded" />
    ) : (
      <span className="text-2xl font-medium text-white">{value}</span>
    )}
  </motion.div>
);

const MetricStrip = ({ metrics, loading }: { metrics: any, loading: boolean }) => {
  return (
    <>
      <MetricCard 
        label="Total Artists" 
        value={metrics?.unique_artists?.toLocaleString() || "0"} 
        loading={loading}
      />
      <MetricCard 
        label="Total Streams" 
        value={`${metrics?.total_streams_bn?.toFixed(1) || "0"}B`} 
        loading={loading}
      />
      <MetricCard 
        label="Clusters Found" 
        value={metrics?.clusters_found || "0"} 
        loading={loading}
      />
      <MetricCard 
        label="Model Accuracy" 
        value={`${Math.round((metrics?.model_accuracy || 0) * 100)}%`} 
        loading={loading}
      />
    </>
  );
};

export default MetricStrip;
