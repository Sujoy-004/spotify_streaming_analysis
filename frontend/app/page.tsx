"use client";

import React, { useState, useEffect } from 'react';
import useSpotifyData from '../hooks/useSpotifyData';
import Topbar from '../components/Topbar';
import MetricStrip from '../components/MetricStrip';
import ScatterMap from '../components/ScatterMap';
import OraclePanel from '../components/OraclePanel';
import StreamingLedger from '../components/StreamingLedger';

export default function Home() {
  const { data, ledgerData, loading, ledgerLoading, fetchClusters, predictPopularity } = useSpotifyData();
  const [clusters, setClusters] = useState<any[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | undefined>();

  useEffect(() => {
    const loadClusters = async () => {
      const res = await fetchClusters();
      setClusters(res);
    };
    loadClusters();
  }, []);

  const handlePointClick = (artist: string) => {
    setSelectedArtist(artist);
    // This will trigger the useEffect inside OraclePanel
  };

  return (
    <div className="min-h-screen bg-arctic-900 text-white p-6">
      <div className="flex items-center justify-between border-b border-arctic-700 pb-4 mb-6">
        <Topbar />
      </div>
      
      <main className="flex flex-col">
        {/* Metric Strip */}
        <section id="metrics" className="grid grid-cols-4 gap-4 mb-6">
          <MetricStrip metrics={data?.metrics} loading={loading} />
        </section>

        {/* Main Grid: Discovery & Oracle */}
        <section id="discovery" className="grid grid-cols-[1fr_320px] gap-4 mb-4">
          <ScatterMap data={clusters} onPointClick={handlePointClick} />
          <OraclePanel 
            initialArtist={selectedArtist} 
            onPredict={predictPopularity} 
          />
        </section>

        {/* Bottom: Streaming Ledger */}
        <section id="ledger">
          <StreamingLedger data={ledgerData} />
        </section>
      </main>
    </div>
  );
}
