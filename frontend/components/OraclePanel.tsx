import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, AlertCircle } from 'lucide-react';

const formatStreams = (val: number) => {
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
  return val.toLocaleString();
};

const OraclePanel = ({ initialArtist, onPredict }: { initialArtist?: string, onPredict: (name: string) => Promise<any> }) => {
  const [artist, setArtist] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialArtist) {
      setArtist(initialArtist);
      handlePredict(initialArtist);
    }
  }, [initialArtist]);

  const handlePredict = async (name: string) => {
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const res = await onPredict(name);
      if (res.error) {
        setError("Artist not in dataset");
        setResult(null);
      } else {
        setResult(res);
      }
    } catch (err) {
      setError("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-arctic-800 border border-arctic-700 rounded-xl overflow-hidden w-[320px] flex flex-col h-full"
    >
      <div className="px-4 py-3 border-b border-arctic-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-arctic-accent" />
          <h3 className="text-sm font-medium text-white tracking-wide">Predictive Oracle</h3>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6">
        <div className="relative">
          <input 
            type="text" 
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist name..."
            className="w-full bg-arctic-900 border border-arctic-700 rounded-lg px-3 py-2 text-sm text-white placeholder-arctic-500 focus:outline-none focus:border-arctic-accent mb-3 pl-9"
            onKeyDown={(e) => e.key === 'Enter' && handlePredict(artist)}
          />
          <Search size={14} className="absolute left-3 top-[13px] text-arctic-500" />
          <button 
            onClick={() => handlePredict(artist)}
            disabled={loading}
            className="w-full bg-arctic-accent text-arctic-900 font-medium text-sm rounded-lg py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Consulting...' : 'Predict Streams'}
          </button>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="space-y-4">
              <div className="h-20 w-full bg-arctic-900/50 animate-pulse rounded-xl" />
              <div className="h-4 w-1/2 bg-arctic-900/50 animate-pulse rounded" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 text-red-400 rounded-lg text-xs border border-red-900/50">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          ) : result ? (
            <AnimatePresence mode="wait">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-arctic-400 tracking-widest">Expected Streams</span>
                  <p className="text-3xl font-medium tracking-tighter text-white mt-1">
                    {formatStreams(result.predicted_streams)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-arctic-400 tracking-widest">Confidence</span>
                    <span className="text-[10px] font-medium text-white">68%</span>
                  </div>
                  <div className="h-1.5 w-full bg-arctic-900 rounded-full overflow-hidden">
                    <div className="h-full bg-arctic-accent rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div className="pt-4 border-t border-arctic-700 flex items-center justify-between">
                  <span className="text-xs font-medium text-arctic-400">Cluster Assignment</span>
                  <span className="text-xs font-bold text-white px-2 py-0.5 bg-arctic-700 rounded">C{result.cluster || '0'}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-xs text-arctic-500">Enter an artist name to generate AI projections based on 2024 trends.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OraclePanel;
