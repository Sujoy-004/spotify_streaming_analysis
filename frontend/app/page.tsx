"use client";

import React, { useState, useEffect } from 'react';
import useSpotifyData from '../hooks/useSpotifyData';
import Topbar from '../components/Topbar';
import MetricStrip from '../components/MetricStrip';
import ScatterMap from '../components/ScatterMap';
import OraclePanel from '../components/OraclePanel';
import StreamingLedger from '../components/StreamingLedger';
import { ClusterPoint } from '../types';

/**
 * Main Entry Point: Spotify 2024 Discovery Dashboard.
 * Orchestrates the full-stack intelligence suite with a focused 'Quiet Luxury' design system.
 */
export default function Home() {
  const { 
    dashboardData, 
    ledgerData, 
    loading, 
    fetchClusters, 
    predictPopularity 
  } = useSpotifyData();
  
  const [clusters, setClusters] = useState<ClusterPoint[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | undefined>();

  // Initialize high-dimensional manifold data
  useEffect(() => {
    const loadClusters = async () => {
      const res = await fetchClusters();
      setClusters(res);
    };
    loadClusters();
  }, []);

  /**
   * Synchronizes the manifold selection with the Predictive Oracle input.
   */
  const handlePointClick = (artist: string) => {
    setSelectedArtist(artist);
  };

  return (
    <div className="min-h-screen bg-arctic-900 text-white p-8 selection:bg-arctic-accent selection:text-arctic-900">
      {/* Global Header */}
      <header className="flex items-center justify-between border-b border-arctic-700 pb-6 mb-8">
        <Topbar />
      </header>
      
      <main className="flex flex-col max-w-[1400px] mx-auto">
        {/* Metric Intelligence Strip */}
        <section id="metrics" className="grid grid-cols-4 gap-6 mb-8">
          <MetricStrip metrics={dashboardData?.metrics} loading={loading} />
        </section>
        
        {/* Advanced Discovery & Prediction Grid */}
        <div className="grid grid-cols-[1fr_320px] gap-6 mb-8">
          <section id="discovery">
            <ScatterMap data={clusters} onPointClick={handlePointClick} />
          </section>
          
          <aside id="oracle">
            <OraclePanel 
              initialArtist={selectedArtist} 
              onPredict={predictPopularity} 
            />
          </aside>
        </div>

        {/* Streaming Data Ledger */}
        <section id="ledger">
          <StreamingLedger data={ledgerData} />
        </section>
      </main>

      {/* Footer / System Context */}
      <footer className="mt-12 pt-8 border-t border-arctic-800 flex items-center justify-between opacity-30 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-bold uppercase tracking-widest text-arctic-500">
          Engineered for Production Performance & Academic Excellence
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-arctic-500">
          © 2024 Spotify Discovery | Architecture v1.0.0
        </p>
      </footer>
    </div>
  );
}
