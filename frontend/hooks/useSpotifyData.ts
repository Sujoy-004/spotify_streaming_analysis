"use client";

import { useState, useEffect } from 'react';

export default function useSpotifyData() {
  const [data, setData] = useState<any>(null);
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ledgerLoading, setLedgerLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClusters = async () => {
    try {
      const response = await fetch('/api/ml/clusters');
      if (!response.ok) throw new Error('Failed to fetch clusters');
      return await response.json();
    } catch (err: any) {
      console.error(err);
      return [];
    }
  };

  const fetchLedger = async () => {
    try {
      setLedgerLoading(true);
      const response = await fetch('/api/ledger');
      if (!response.ok) throw new Error('Failed to fetch ledger');
      const result = await response.json();
      setLedgerData(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLedgerLoading(false);
    }
  };

  const predictPopularity = async (artistName: string) => {
    try {
      const payload = {
        artist: artistName,
        year: 2024,
        month: 1,
        popularity: 80.0
      };

      const response = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Prediction failed');
      return await response.json();
    } catch (err: any) {
      console.error(err);
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchData();
    fetchLedger();
  }, []);

  return { 
    data, 
    dashboardData: data,
    ledgerData,
    loading, 
    ledgerLoading,
    error, 
    refetch: fetchData,
    fetchClusters,
    fetchLedger,
    predictPopularity
  };
}

