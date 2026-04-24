import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, CheckCircle2, TrendingUp, Activity } from 'lucide-react';
import { TrackRecord } from '../types';

const PAGE_SIZE = 50;

/**
 * Status indicator components for visualizing track health and performance tiers.
 */
const StatusPill = ({ status }: { status: string }) => {
  const baseClass = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase";
  
  if (status === 'Verified') return (
    <div className={`${baseClass} bg-teal-900/40 text-teal-300 border border-teal-800/50`}>
      <CheckCircle2 size={10} /> VERIFIED
    </div>
  );
  if (status === 'Emerging') return (
    <div className={`${baseClass} bg-amber-900/40 text-amber-300 border border-amber-800/50`}>
      <TrendingUp size={10} /> EMERGING
    </div>
  );
  return (
    <div className={`${baseClass} bg-arctic-700/50 text-arctic-400 border border-arctic-700`}>
      <Activity size={10} /> ACTIVE
    </div>
  );
};

interface StreamingLedgerProps {
  data: TrackRecord[];
}

/**
 * Enterprise-grade data ledger for exploring the 2024 Spotify dataset.
 * Implements server-side sorting logic and client-side pagination/filtering.
 */
const StreamingLedger = ({ data }: StreamingLedgerProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    // Sort by Streams to calculate performance percentiles accurately
    const sorted = [...data].sort((a, b) => (b.Streams || 0) - (a.Streams || 0));
    const total = sorted.length;
    
    return sorted.map((row, idx) => {
      const percentile = (idx / total) * 100;
      let status = 'Active';
      if (percentile <= 10) status = 'Verified';
      else if (percentile >= 80) status = 'Emerging';
      
      return { ...row, status };
    });
  }, [data]);

  const filteredData = useMemo(() => {
    return processedData.filter(row => 
      String(row.artist || "").toLowerCase().includes(search.toLowerCase()) ||
      String(row.Track || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [processedData, search]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-arctic-800 border border-arctic-700 rounded-xl overflow-hidden shadow-2xl"
    >
      <header className="px-4 py-4 border-b border-arctic-700 flex items-center justify-between bg-arctic-800/50 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Streaming Ledger</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search catalog by track or artist..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="bg-arctic-900 border border-arctic-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-arctic-accent w-72 pl-9 transition-all focus:ring-1 focus:ring-arctic-accent/20"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-arctic-500" />
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-arctic-900/30">
              <th className="px-5 py-4 text-[10px] text-arctic-400 uppercase font-bold tracking-widest border-b border-arctic-700">Rank</th>
              <th className="px-5 py-4 text-[10px] text-arctic-400 uppercase font-bold tracking-widest border-b border-arctic-700">Entity Profiling</th>
              <th className="px-5 py-4 text-[10px] text-arctic-400 uppercase font-bold tracking-widest border-b border-arctic-700 text-right">Streams</th>
              <th className="px-5 py-4 text-[10px] text-arctic-400 uppercase font-bold tracking-widest border-b border-arctic-700">Manifold Cluster</th>
              <th className="px-5 py-4 text-[10px] text-arctic-400 uppercase font-bold tracking-widest border-b border-arctic-700">Audio Sig</th>
              <th className="px-5 py-4 text-[10px] text-arctic-400 uppercase font-bold tracking-widest border-b border-arctic-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-arctic-700/50">
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-4 text-xs font-mono text-arctic-500 font-bold">#{row.Rank || (page * PAGE_SIZE + idx + 1)}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-arctic-accent transition-colors">{row.Track}</span>
                    <span className="text-[10px] text-arctic-400 font-medium">{row.artist}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs font-mono text-white text-right font-semibold">
                  {(row.Streams / 1e6).toFixed(1)}M
                </td>
                <td className="px-5 py-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-arctic-accent/40 shadow-inner" />
                      <span className="text-[10px] font-bold text-arctic-300 uppercase">Manifold C{row.Cluster}</span>
                   </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-bold text-arctic-500">ENG</span>
                      <span className="text-[10px] text-arctic-300 font-mono">{(row.Energy || 0 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-bold text-arctic-500">VAL</span>
                      <span className="text-[10px] text-arctic-300 font-mono">{(row.Valence || 0 * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatusPill status={(row as any).status} />
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-arctic-500 text-xs italic">
                  No records matching your localized search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="px-5 py-4 border-t border-arctic-700 flex items-center justify-between bg-arctic-900/40">
        <p className="text-[10px] text-arctic-400 font-bold uppercase tracking-widest">
          Displaying {Math.min(page * PAGE_SIZE + 1, filteredData.length)} — {Math.min((page + 1) * PAGE_SIZE, filteredData.length)} of {filteredData.length.toLocaleString()} Tracks
        </p>
        <nav className="flex items-center gap-4">
          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-arctic-400 hover:text-white disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <div className="px-3 py-1 bg-arctic-700 rounded text-[10px] font-bold text-white border border-arctic-600">
            {page + 1} / {totalPages}
          </div>
          <button 
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-arctic-400 hover:text-white disabled:opacity-20 transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </nav>
      </footer>
    </motion.div>
  );
};

export default StreamingLedger;
