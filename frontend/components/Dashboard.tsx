'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Brain, 
  Database, 
  Search, 
  Settings, 
  TrendingUp, 
  Zap,
  ChevronRight,
  Info,
  Clock,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import useSpotifyData from '../hooks/useSpotifyData';
import MLDiscovery from './MLDiscovery';

const Dashboard = () => {
  const { dashboardData, loading, error } = useSpotifyData();
  const [activeModule, setActiveModule] = useState<'intelligence' | 'metrics' | 'raw'>('intelligence');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0B0F1A]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border border-arctic-accent/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-16 h-16 border-t border-arctic-accent rounded-full shadow-[0_0_15px_rgba(56,189,248,0.4)]"
          />
        </div>
        <div className="text-center">
          <h2 className="text-white text-sm font-medium tracking-[0.2em] uppercase mb-2">Neural Synchronization</h2>
          <p className="text-arctic-600 text-[10px] tracking-widest uppercase animate-pulse italic">Accessing high-fidelity streaming nodes...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0B0F1A] text-white">
      <div className="glass-panel p-8 max-w-md text-center border-red-500/20">
        <Activity className="text-red-500 mx-auto mb-4 w-12 h-12 opacity-50" />
        <h2 className="text-xl font-bold mb-2 tracking-tight">Architectural Fault Detected</h2>
        <p className="text-arctic-500 text-sm leading-relaxed mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs hover:bg-white/10 transition-colors uppercase tracking-widest"
        >
          Initialize System Reset
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-arctic-400 flex overflow-hidden font-sans selection:bg-arctic-accent/30 selection:text-white">
      {/* Sidebar - Precision Navigation */}
      <nav className="w-20 lg:w-72 border-r border-white/5 flex flex-col bg-[#0D121F]/80 backdrop-blur-3xl z-50">
        <div className="p-8 flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-arctic-accent to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-12 h-12 bg-[#161B2A] rounded-xl flex items-center justify-center border border-white/10 transition-transform group-hover:scale-105">
              <Zap className="text-arctic-accent w-6 h-6 shadow-glow" />
            </div>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-white font-bold tracking-tight text-lg">ANTIGRAVITY</h1>
            <p className="text-[10px] text-arctic-600 font-bold uppercase tracking-widest">Elite Analytics</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-8 space-y-3">
          <NavItem 
            icon={<Brain size={18} />} 
            label="Neural Discovery" 
            active={activeModule === 'intelligence'} 
            onClick={() => setActiveModule('intelligence')} 
          />
          <NavItem 
            icon={<TrendingUp size={18} />} 
            label="Global Equilibrium" 
            active={activeModule === 'metrics'} 
            onClick={() => setActiveModule('metrics')} 
          />
          <NavItem 
            icon={<Layers size={18} />} 
            label="Streaming Ledger" 
            active={activeModule === 'raw'} 
            onClick={() => setActiveModule('raw')} 
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="hidden lg:block bg-white/[0.02] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Activity size={48} className="text-arctic-accent" />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-1.5 h-1.5 bg-arctic-accent rounded-full animate-pulse shadow-glow" />
                 <span className="text-[10px] uppercase tracking-widest text-arctic-500 font-bold">System Status</span>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between items-center">
                   <p className="text-[11px] text-arctic-400">ML Engine</p>
                   <p className="text-[10px] text-arctic-accent font-mono">NOMINAL</p>
                 </div>
                 <div className="flex justify-between items-center">
                   <p className="text-[11px] text-arctic-400">Data Node</p>
                   <p className="text-[10px] text-arctic-accent font-mono">SYNCED</p>
                 </div>
                 <div className="pt-2">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div animate={{ width: '85%' }} className="h-full bg-arctic-accent/50" />
                    </div>
                 </div>
               </div>
             </div>
          </div>
          <NavItem icon={<Settings size={18} />} label="System Config" onClick={() => {}} />
        </div>
      </nav>

      {/* Main Command Center */}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        {/* Cinematic Background Elements */}
        <div className="fixed top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-arctic-accent/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[40%] bg-blue-900/10 blur-[100px] rounded-full" />
        </div>

        {/* Global Header */}
        <header className="sticky top-0 h-24 border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl z-40 px-12 flex items-center justify-between">
          <div className="flex items-center gap-6 bg-white/[0.03] px-6 py-3 rounded-full border border-white/5 w-full max-w-xl group focus-within:border-arctic-accent/30 transition-all">
            <Search size={18} className="text-arctic-600 group-focus-within:text-arctic-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Query streaming manifold..." 
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-arctic-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-white/5 rounded text-[10px] text-arctic-700 border border-white/5">
              <span className="font-mono">⌘</span> K
            </div>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="text-right hidden xl:block">
                <p className="text-[10px] uppercase text-arctic-600 font-bold tracking-[0.2em] mb-1">Temporal Sync</p>
                <div className="flex items-center gap-2 text-xs text-arctic-300 font-mono">
                  <Clock size={12} className="text-arctic-accent" />
                  <span>2024.Q4_REALTIME</span>
                </div>
             </div>
             <div className="h-10 w-px bg-white/5 hidden md:block" />
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden bg-white/[0.02]">
                   <Activity size={20} className="text-arctic-accent group-hover:scale-110 transition-transform" />
                   <div className="absolute inset-0 bg-arctic-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </div>
          </div>
        </header>

        {/* Workspace Canvas */}
        <div className="p-12 max-w-[1800px] mx-auto">
          <AnimatePresence mode="wait">
            {activeModule === 'intelligence' && (
              <motion.div
                key="intelligence"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-12 flex justify-between items-end">
                   <div>
                      <h2 className="text-4xl font-bold text-white tracking-tighter mb-2">Neural Discovery</h2>
                      <p className="text-arctic-500 font-medium tracking-tight">Interrogating behavioral clusters and predictive streaming models.</p>
                   </div>
                   <div className="flex gap-3">
                      <button className="glass-btn px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 border border-white/5 hover:border-arctic-accent/20 transition-all">
                        <Filter size={14} /> Refine Manifold
                      </button>
                   </div>
                </div>
                <MLDiscovery />
              </motion.div>
            )}

            {activeModule === 'metrics' && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  <MetricCard 
                    label="Neural Volume" 
                    value={dashboardData?.metrics?.total_tracks} 
                    unit="Active Nodes" 
                    trend="+12.4%" 
                  />
                  <MetricCard 
                    label="Artist Entities" 
                    value={dashboardData?.metrics?.unique_artists} 
                    unit="Verified Nodes" 
                    trend="+4.2%" 
                  />
                  <MetricCard 
                    label="Projected Streams" 
                    value={dashboardData?.metrics?.total_streams_bn?.toFixed(1)} 
                    unit="Billion Units" 
                    trend="+8.9%" 
                  />
                  <MetricCard 
                    label="Temporal Range" 
                    value={dashboardData?.metrics?.year_range} 
                    unit="Epoch Years" 
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 glass-panel p-10">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-4">
                        <div className="p-2 bg-arctic-accent/10 rounded-lg">
                          <TrendingUp className="text-arctic-accent w-6 h-6" />
                        </div>
                        Global Performance Tier
                      </h3>
                      <button className="text-xs font-bold text-arctic-500 uppercase tracking-widest hover:text-white transition-colors">View All Nodes</button>
                    </div>
                    
                    <div className="space-y-4">
                      {dashboardData?.topTracks?.map((track: any, i: number) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={i} 
                          className="group bg-white/[0.015] hover:bg-white/[0.04] p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:border-arctic-accent/10 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-6">
                            <span className="text-3xl font-mono text-arctic-800 group-hover:text-arctic-accent/40 transition-colors w-12 tracking-tighter">
                              {(i+1).toString().padStart(2, '0')}
                            </span>
                            <div>
                              <p className="text-white font-bold text-lg tracking-tight mb-0.5 group-hover:text-arctic-accent transition-colors">{track.Track}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-arctic-600 font-medium">{track.Artist}</span>
                                <div className="w-1 h-1 bg-arctic-800 rounded-full" />
                                <span className="text-[10px] text-arctic-700 uppercase font-bold">Node ID: {i+100}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-8">
                            <div className="hidden md:block">
                               <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${100 - i * 8}%` }}
                                    className="h-full bg-gradient-to-r from-arctic-accent/20 to-arctic-accent" 
                                  />
                               </div>
                            </div>
                            <div>
                              <p className="text-white font-mono text-lg font-bold">{(track['Spotify Streams'] / 1e6).toFixed(1)}M</p>
                              <p className="text-[10px] uppercase text-arctic-700 font-bold tracking-widest">Spectral Intensity</p>
                            </div>
                            <ArrowUpRight className="text-arctic-800 group-hover:text-arctic-accent transition-colors" size={20} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                     <div className="glass-panel p-8 bg-gradient-to-br from-white/[0.02] to-transparent">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                          <Info size={16} className="text-arctic-accent" />
                          Node Intelligence
                        </h4>
                        <div className="space-y-6">
                           <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                              <p className="text-[10px] uppercase text-arctic-600 font-bold mb-2">Dominant Cluster</p>
                              <p className="text-white text-sm font-medium">High-Velocity Electronic</p>
                              <div className="mt-3 flex gap-1">
                                 {[1,2,3,4,5].map(j => <div key={j} className="h-1 flex-1 bg-arctic-accent/30 rounded-full" />)}
                              </div>
                           </div>
                           <p className="text-xs text-arctic-500 leading-relaxed italic">
                             "The spectral analysis suggests a convergence of rhythmic precision and acoustic variance within the Q4 manifold. Adjusting neural weights."
                           </p>
                           <button className="w-full py-3 bg-arctic-accent/10 border border-arctic-accent/20 rounded-xl text-arctic-accent text-xs font-bold uppercase tracking-widest hover:bg-arctic-accent/20 transition-all">
                             Recalibrate Model
                           </button>
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeModule === 'raw' && (
              <motion.div
                key="raw"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel overflow-hidden border-white/5"
              >
                <div className="p-10 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                   <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Spectral Ledger</h2>
                      <p className="text-[10px] text-arctic-600 uppercase tracking-[0.2em] font-bold mt-1">Registry: index_main_spotify_2024.db</p>
                   </div>
                   <div className="flex gap-4">
                      <button className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-arctic-400 border border-white/5 hover:bg-white/10">Export Dataset</button>
                      <button className="px-4 py-2 bg-arctic-accent rounded-lg text-[10px] font-bold uppercase tracking-widest text-arctic-900 shadow-glow">Audit Ledger</button>
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="text-arctic-600 font-bold uppercase text-[10px] tracking-[0.15em] border-b border-white/5">
                        <th className="p-8">Node Identity</th>
                        <th className="p-8 text-center">Entity</th>
                        <th className="p-8 text-right">Intensity</th>
                        <th className="p-8 text-right">Manifold</th>
                        <th className="p-8 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {dashboardData?.rawData?.map((track: any, i: number) => (
                        <tr key={i} className="hover:bg-white/[0.03] transition-colors group cursor-crosshair">
                          <td className="p-8">
                            <div>
                               <p className="text-white font-bold group-hover:text-arctic-accent transition-colors">{track.Track}</p>
                               <p className="text-[10px] text-arctic-700 font-mono mt-1 uppercase tracking-widest">
                                 ENTRY_ID_{i + 1000}
                               </p>
                            </div>
                          </td>

                          <td className="p-8 text-center">
                            <span className="text-arctic-400 font-medium">{track.Artist}</span>
                          </td>
                          <td className="p-8 text-right font-mono text-white">
                            {(track['Spotify Streams'] / 1e6).toFixed(1)}M
                          </td>
                          <td className="p-8 text-right">
                             <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-arctic-600 uppercase">Region_{track.cluster || 'ALPHA'}</span>
                                <div className="flex gap-1 mt-1">
                                   {[1,2,3].map(k => <div key={k} className="w-1.5 h-1.5 rounded-full bg-arctic-accent/20" />)}
                                </div>
                             </div>
                          </td>
                          <td className="p-8 text-center">
                            <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold text-arctic-500 uppercase tracking-widest border border-white/5 group-hover:border-arctic-accent/30 group-hover:text-arctic-accent transition-all">
                              VERIFIED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
      active 
      ? 'text-arctic-accent bg-arctic-accent/[0.03]' 
      : 'text-arctic-600 hover:text-arctic-300 hover:bg-white/[0.02]'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="activeTab" 
        className="absolute left-0 w-1 h-6 bg-arctic-accent rounded-r-full shadow-glow" 
      />
    )}
    <div className={`transition-all duration-500 ${active ? 'scale-110 shadow-glow' : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'}`}>{icon}</div>
    <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">{label}</span>
    {active && <ChevronRight className="hidden lg:block ml-auto w-4 h-4 opacity-50" />}
  </button>
);

const MetricCard = ({ label, value, unit, trend }: any) => (
  <div className="glass-panel p-10 relative overflow-hidden group cursor-pointer">
    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
      <Zap size={64} className="text-arctic-accent" />
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <p className="text-[10px] uppercase font-bold text-arctic-600 tracking-[0.2em]">{label}</p>
        {trend && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-arctic-accent bg-arctic-accent/10 px-2 py-0.5 rounded-full border border-arctic-accent/20">
            <TrendingUp size={10} /> {trend}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-white tracking-tighter group-hover:text-arctic-accent transition-colors duration-500">{value || '--'}</span>
        <span className="text-[10px] text-arctic-700 font-bold uppercase tracking-widest">{unit}</span>
      </div>
      <div className="mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-arctic-accent/20 to-arctic-accent shadow-glow"
        />
      </div>
    </div>
  </div>
);

export default Dashboard;
