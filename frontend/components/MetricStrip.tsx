import React from 'react';
import { motion } from 'framer-motion';
import { SpotifyMetrics } from '../types';

interface MetricCardProps {
  label: string;
  value: string | number;
  loading?: boolean;
}

/**
 * Atomic metric card component for displaying key performance indicators.
 */
const MetricCard = ({ label, value, loading }: MetricCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="bg-arctic-800 border border-arctic-700 rounded-xl p-4 flex flex-col hover:border-arctic-600 transition-colors"
  >
    <span className="text-xs text-arctic-400 uppercase tracking-widest mb-1 font-semibold">{label}</span>
    {loading ? (
      <div className="h-7 w-24 bg-arctic-700 animate-pulse rounded mt-1" />
    ) : (
      <span className="text-2xl font-medium text-white tracking-tight">{value}</span>
    )}
  </motion.div>
);

interface MetricStripProps {
  metrics?: SpotifyMetrics;
  loading: boolean;
}

/**
 * Orchestrates the display of aggregate KPIs across the dashboard header.
 */
const MetricStrip = ({ metrics, loading }: MetricStripProps) => {
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
