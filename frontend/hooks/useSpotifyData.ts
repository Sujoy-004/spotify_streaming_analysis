"use client";

import { useState, useEffect } from 'react';
import { DashboardData, TrackRecord, ClusterPoint, PredictionResult } from '../types';

/**
 * Custom hook for managing Spotify dashboard state and API interactions.
 * Centralizes data fetching logic for metrics, clusters, and predictive modeling.
 */
export default function useSpotifyData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [ledgerData, setLedgerData] = useState<TrackRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ledgerLoading, setLedgerLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard synchronization data');
      const result: DashboardData = await response.json();
      setDashboardData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClusters = async (): Promise<ClusterPoint[]> => {
    try {
      const response = await fetch('/api/ml/clusters');
      if (!response.ok) throw new Error('Failed to fetch manifold clusters');
      return await response.json();
    } catch (err: any) {
      console.error("[Intelligence Error]:", err);
      return [];
    }
  };

  const fetchLedger = async () => {
    try {
      setLedgerLoading(true);
      const response = await fetch('/api/ledger');
      if (!response.ok) throw new Error('Failed to synchronize streaming ledger');
      const result: TrackRecord[] = await response.json();
      setLedgerData(result);
    } catch (err: any) {
      console.error("[Ledger Error]:", err);
    } finally {
      setLedgerLoading(false);
    }
  };

  const predictPopularity = async (artistName: string): Promise<PredictionResult> => {
    try {
      const payload = {
        artist: artistName,
        year: 2024,
        month: 1,
        popularity: 80.0 // Baseline average for 2024 projections
      };

      const response = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Predictive inference failed');
      return await response.json();
    } catch (err: any) {
      console.error("[Oracle Error]:", err);
      return { 
        predicted_streams: 0, 
        artist: artistName, 
        confidence: "N/A", 
        error: err.message 
      };
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchLedger();
  }, []);

  return { 
    dashboardData,
    ledgerData,
    loading, 
    ledgerLoading,
    error, 
    refetch: fetchDashboard,
    fetchClusters,
    fetchLedger,
    predictPopularity
  };
}
