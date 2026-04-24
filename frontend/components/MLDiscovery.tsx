'use client';

import React, { useState, useEffect } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { motion } from 'framer-motion';
import { Brain, Cpu, Sparkles, Send, ShieldCheck, Microscope, Zap } from 'lucide-react';
import useSpotifyData from '../hooks/useSpotifyData';

const MLDiscovery = () => {
  const { fetchClusters, predictPopularity } = useSpotifyData();
  const [clusters, setClusters] = useState([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [artistInput, setArtistInput] = useState('');

  useEffect(() => {
    const loadClusters = async () => {
      try {
        const data = await fetchClusters();
        setClusters(data || []);
      } catch (err) {
        console.error("Failed to load clusters", err);
      }
    };
    loadClusters();
  }, []);

  const handlePredict = async () => {
    if (!artistInput) return;
    setLoading(true);
    try {
      const result = await predictPopularity(artistInput);
      setPrediction(result);
    } catch (err) {
      console.error("Prediction failed", err);
    } finally {
      setLoading(false);
    }
  };

  const CLUSTER_COLORS = [
    '#38BDF8', // Arctic Blue
    '#818CF8', // Indigo
    '#64FFDA', // Teal
    '#F472B6', // Pink
    '#FBBF24'  // Amber
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Neural Spectral Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* The Manifold Visualization */}
        <div className="lg:col-span-3 glass-panel p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000">
            <Microscope size={200} className="text-arctic-accent" />
          </div>
          
          <div className="mb-10 relative z-10">
            <div className="flex items-center gap-4 mb-3">
               <div className="p-2 bg-arctic-accent/10 rounded-lg border border-arctic-accent/20">
                 <Sparkles size={20} className="text-arctic-accent" />
               </div>
               <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                 <Layers className="w-5 h-5 text-teal-400" />
                 Spectral Manifold (PCA)
               </h2>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Visualizing the high-dimensional convergence of Spotify, YouTube, and TikTok signals across 6 behavioral clusters.
            </p>
          </div>

          <div className="h-[500px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" dataKey="pca_x" name="Inertia X" hide />
                <YAxis type="number" dataKey="pca_y" name="Inertia Y" hide />
                <ZAxis type="number" range={[50, 600]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: 'rgba(56, 189, 248, 0.2)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0B0F1A]/95 backdrop-blur-xl p-5 border border-arctic-accent/30 shadow-glow rounded-2xl">
                          <p className="text-white font-bold tracking-tight text-base mb-1">{data.Track}</p>
                          <p className="text-xs text-arctic-accent font-medium mb-3">{data.Artist}</p>
                          <div className="pt-2 border-t border-white/5 space-y-1.5">
                             <div className="flex justify-between items-center gap-6">
                                <span className="text-[10px] text-arctic-700 uppercase font-bold tracking-widest">Region</span>
                                <span className="text-[10px] text-white font-mono bg-arctic-accent/10 px-2 py-0.5 rounded">NODE_{data.cluster || '0'}</span>
                             </div>
                             <div className="flex justify-between items-center gap-6">
                                <span className="text-[10px] text-arctic-700 uppercase font-bold tracking-widest">Intensity</span>
                                <span className="text-[10px] text-arctic-accent font-mono">{(data['Spotify Streams'] / 1e6).toFixed(1)}M</span>
                             </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Tracks" data={clusters}>
                  {clusters.map((entry: any, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CLUSTER_COLORS[entry.cluster % CLUSTER_COLORS.length]} 
                      fillOpacity={0.4}
                      stroke={CLUSTER_COLORS[entry.cluster % CLUSTER_COLORS.length]}
                      strokeWidth={1}
                      className="hover:fill-opacity-100 hover:stroke-opacity-100 transition-all cursor-pointer"
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 relative z-10 border-t border-white/5 pt-8">
            {['High Velocity', 'Steady Growth', 'Experimental', 'Niche Viral', 'Legacy Mainstream'].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shadow-glow" style={{ backgroundColor: CLUSTER_COLORS[i] }} />
                <span className="text-[10px] uppercase font-bold text-arctic-500 tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Oracle Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="glass-panel p-8 border-arctic-accent/10 bg-gradient-to-br from-white/[0.02] to-transparent h-full flex flex-col">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-arctic-accent/5 flex items-center justify-center border border-arctic-accent/20 relative group">
                   <Brain size={24} className="text-arctic-accent group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-arctic-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                   <h3 className="text-white font-bold tracking-tight text-lg">Predictive Oracle</h3>
                   <p className="text-[10px] uppercase text-arctic-600 font-bold tracking-[0.2em]">Core Model: RF_SPECTRAL_V1.4</p>
                </div>
             </div>

             <div className="space-y-6 flex-1">
                <p className="text-xs text-arctic-500 leading-relaxed font-medium">
                  Interrogate the neural core with artist identities to project streaming intensities across the 2024 manifold.
                </p>

                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Enter Artist Identity..."
                    value={artistInput}
                    onChange={(e) => setArtistInput(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-5 text-sm text-white outline-none focus:border-arctic-accent/30 focus:bg-white/[0.04] transition-all placeholder-arctic-800"
                  />
                  <button 
                    onClick={handlePredict}
                    disabled={loading || !artistInput}
                    className="absolute right-3 top-3 p-2 bg-arctic-accent text-arctic-900 rounded-xl hover:shadow-glow hover:scale-105 transition-all disabled:opacity-20 disabled:scale-100"
                  >
                    <Send size={20} />
                  </button>
                </div>

                <div className="min-h-[180px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01] p-8 text-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-arctic-accent/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   {loading ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <Cpu className="text-arctic-accent animate-spin-slow w-8 h-8" />
                          <div className="absolute inset-0 bg-arctic-accent/20 blur-lg rounded-full" />
                        </div>
                        <p className="text-[10px] text-arctic-500 uppercase tracking-[0.3em] font-bold animate-pulse">Synthesizing Probability...</p>
                      </div>
                   ) : prediction ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full relative z-10"
                      >
                         <p className="text-[10px] uppercase text-arctic-700 font-bold tracking-[0.2em] mb-3">Projected Intensity</p>
                         <div className="flex items-baseline justify-center gap-2 mb-6">
                           <span className="text-5xl font-bold text-white tracking-tighter">{(prediction.predicted_streams / 1e6).toFixed(1)}</span>
                           <span className="text-xs text-arctic-500 font-bold uppercase tracking-widest">Million Units</span>
                         </div>
                         <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-arctic-accent bg-arctic-accent/5 py-2 px-4 rounded-full border border-arctic-accent/10">
                            <ShieldCheck size={14} /> 
                            <span className="uppercase tracking-widest">CONFIDENCE: {prediction.confidence}</span>
                         </div>
                      </motion.div>
                   ) : (
                      <div className="flex flex-col items-center gap-4 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                         <Zap size={32} className="text-arctic-accent/40" />
                         <p className="text-[10px] text-arctic-700 font-bold uppercase tracking-[0.2em]">Awaiting Input Signal</p>
                      </div>
                   )}
                </div>
             </div>

             <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 mb-4">
                   <Microscope size={16} className="text-arctic-accent opacity-50" />
                   <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Manifold Insight</h4>
                </div>
                <p className="text-[11px] text-arctic-500 leading-relaxed font-medium">
                   Current spectral drift indicates an <span className="text-arctic-accent">8.2% variance</span> in acoustic clusters. Recommendation: Re-bias weights for Q4 streaming cycles.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLDiscovery;
