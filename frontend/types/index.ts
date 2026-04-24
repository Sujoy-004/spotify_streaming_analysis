export interface SpotifyMetrics {
  total_tracks: number;
  unique_artists: number;
  total_streams_bn: number;
  clusters_found: number;
  model_accuracy: number;
  year_range: string;
}

export interface TrackRecord {
  Track: string;
  artist: string;
  Streams: number;
  Rank: number;
  Cluster: number;
  Danceability?: number;
  Energy?: number;
  Valence?: number;
}

export interface ClusterPoint {
  x: number;
  y: number;
  cluster: number;
  artist: string;
  Track: string;
  [key: string]: any;
}

export interface PredictionResult {
  predicted_streams: number;
  artist: string;
  confidence: string;
  error?: string;
}

export interface DashboardData {
  metrics: SpotifyMetrics;
  topTracks: any[];
  rawData: any[];
}
