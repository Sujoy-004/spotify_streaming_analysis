import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, CheckCircle2, TrendingUp, Activity } from 'lucide-react';

const PAGE_SIZE = 50;

const StatusPill = ({ status }: { status: string }) => {
  if (status === 'Verified') return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-900 text-teal-300 text-[10px] font-bold">
      <CheckCircle2 size={10} /> VERIFIED
    </div>
  );
  if (status === 'Emerging') return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-900 text-amber-300 text-[10px] font-bold">
      <TrendingUp size={10} /> EMERGING
    </div>
  );
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-arctic-700 text-arctic-400 text-[10px] font-bold">
      <Activity size={10} /> ACTIVE
    </div>
  );
};

const StreamingLedger = ({ data }: { data: any[] }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const processedData = useMemo(() => {
    if (!data) return [];
    
    // Sort by Streams to calculate percentiles accurately
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

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-arctic-800 border border-arctic-700 rounded-xl overflow-hidden shadow-sm"
    >
      <div className="px-4 py-3 border-b border-arctic-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white tracking-wide">Streaming Ledger</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search artists..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="bg-arctic-900 border border-arctic-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-arctic-accent w-64 pl-8"
          />
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-arctic-500" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 text-xs text-arctic-400 uppercase tracking-wider border-b border-arctic-700">Rank</th>
              <th className="px-4 py-3 text-xs text-arctic-400 uppercase tracking-wider border-b border-arctic-700">Track / Artist</th>
              <th className="px-4 py-3 text-xs text-arctic-400 uppercase tracking-wider border-b border-arctic-700">Streams</th>
              <th className="px-4 py-3 text-xs text-arctic-400 uppercase tracking-wider border-b border-arctic-700">Cluster</th>
              <th className="px-4 py-3 text-xs text-arctic-400 uppercase tracking-wider border-b border-arctic-700">Energy</th>
              <th className="px-4 py-3 text-xs text-arctic-400 uppercase tracking-wider border-b border-arctic-700">Valence</th>
              <th className="px-4 py-3 text-xs text-arctic-400 uppercase tracking-wider border-b border-arctic-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-arctic-700">
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-arctic-500">{row.Rank || (page * PAGE_SIZE + idx + 1)}</td>
                <td className="px-4 py-3">
                  <p className="text-xs font-medium text-white">{row.Track}</p>
                  <p className="text-[11px] text-white font-medium">{row.artist}</p>
                </td>
                <td className="px-4 py-3 text-arctic-400">
                  {(row.Streams / 1e6).toFixed(1)}M
                </td>
                <td className="px-4 py-3">
                   <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full bg-arctic-accent/40`} />
                      <span className="text-xs font-bold text-arctic-400">C{row.Cluster}</span>
                   </div>
                </td>
                <td className="px-4 py-3 text-arctic-400">{(row.Energy * 100).toFixed(0)}%</td>
                <td className="px-4 py-3 text-arctic-400">{(row.Valence * 100).toFixed(0)}%</td>
                <td className="px-4 py-3">
                  <StatusPill status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-arctic-700 flex items-center justify-between bg-arctic-900/50">
        <p className="text-xs text-arctic-400 font-medium uppercase tracking-wider">
          Showing {page * PAGE_SIZE + 1} to {Math.min((page + 1) * PAGE_SIZE, filteredData.length)} of {filteredData.length}
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded hover:bg-arctic-700 disabled:opacity-20 transition-colors text-arctic-400"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-bold text-white px-2">{page + 1} / {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-1.5 rounded hover:bg-arctic-700 disabled:opacity-20 transition-colors text-arctic-400"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StreamingLedger;
