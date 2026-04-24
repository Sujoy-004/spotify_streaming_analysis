import pandas as pd
import numpy as np
import joblib
import os
import json
from typing import List, Dict, Any, Optional
from logging_config import logger
from sklearn.base import BaseEstimator, TransformerMixin

from spotify_transformers import ArtistTargetEncoder

class SpotifyDataManager:
    """
    Sovereign Data Manager (v2.2 Production)
    Orchestrates high-integrity inference via unified ML Pipelines.
    """
    
    def __init__(self, csv_path='Most_Streamed_Spotify_Songs_2024.csv'):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.csv_path = os.path.join(os.path.dirname(self.base_dir), csv_path)
        
        self.df = None
        self.oracle = None
        self.manifold = None
        self.models_dir = os.path.join(self.base_dir, 'models')
        self.metadata = {}
        
        self.load_models()
        self.load_data()

    def load_data(self) -> bool:
        logger.info(f"Synchronizing data engine with source: {self.csv_path}")
        if not os.path.exists(self.csv_path):
            raise FileNotFoundError(f"Critical Data Source Missing: {self.csv_path}")
            
        try:
            try:
                self.df = pd.read_csv(self.csv_path, encoding='utf-8', thousands=',')
            except UnicodeDecodeError:
                self.df = pd.read_csv(self.csv_path, encoding='latin1', thousands=',')
            
            self.df = self.process_dataframe(self.df)
            return True
        except Exception as e:
            logger.error(f"Data ingestion failure: {e}")
            raise e

    def load_models(self):
        """Loads unified production pipelines. Fails loudly if missing."""
        oracle_path = os.path.join(self.models_dir, 'oracle_pipeline.joblib')
        manifold_path = os.path.join(self.models_dir, 'discovery_manifold.joblib')
        meta_path = os.path.join(self.models_dir, 'metadata.json')

        if not os.path.exists(oracle_path) or not os.path.exists(manifold_path):
            raise FileNotFoundError("Production Pipelines Missing. Run train_ml.py first.")

        self.oracle = joblib.load(oracle_path)
        self.manifold = joblib.load(manifold_path)
        
        if os.path.exists(meta_path):
            with open(meta_path, 'r') as f:
                self.metadata = json.load(f)
        
        logger.info("Intelligence Layer parity established via Unified Pipelines.")

    def process_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Sovereign Cleaning & Hallucination Removal."""
        df.columns = df.columns.str.strip()
        df = df[df['Artist'] != 'xSyborg']
        
        # Temporal extraction
        if 'Release Date' in df.columns:
            df['Release Date'] = pd.to_datetime(df['Release Date'], errors='coerce')
            df['Released Year'] = df['Release Date'].dt.year.fillna(2024).astype(int)
            df['Released Month'] = df['Release Date'].dt.month.fillna(1).astype(int)
            
        numeric_cols = ['Spotify Streams', 'YouTube Views', 'TikTok Views', 'Shazam Counts', 'Apple Music Playlist Count']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', '').str.replace('"', ''), errors='coerce').fillna(0)
        
        return df

    def get_ml_insights(self) -> List[Dict[str, Any]]:
        """Executes Manifold Inference via unified Pipeline."""
        if self.df is None: return []
        
        try:
            features = self.metadata["clustering"]["features"]
            X = self.df[features]
            
            # Extract intermediate PCA coordinates from the unified pipeline
            pca_step = self.manifold.named_steps['pca']
            scaler_step = self.manifold.named_steps['scaler']
            log_step = self.manifold.named_steps['log1p']
            
            pca_coords = pca_step.transform(scaler_step.transform(log_step.transform(X)))
            clusters = self.manifold.predict(X)
            
            clean_df = self.df.copy()
            clean_df['Cluster'] = clusters
            clean_df['pca_x'] = pca_coords[:, 0]
            clean_df['pca_y'] = pca_coords[:, 1]
            
            return clean_df[['Track', 'Artist', 'Spotify Streams', 'Cluster', 'pca_x', 'pca_y']].head(400).to_dict(orient='records')
        except Exception as e:
            logger.error(f"Manifold inference collapse: {e}")
            return []

    def predict_popularity(self, artist: str, features_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Predictive Oracle Inference with strict Unified Pipeline Parity."""
        try:
            # 1. Input Assembly (Raw format for pipeline)
            input_data = {
                'Artist': artist,
                'Released Year': features_dict.get('Released Year', 2024),
                'Released Month': features_dict.get('Released Month', 1),
                'YouTube Views': features_dict.get('YouTube Views', 0),
                'TikTok Views': features_dict.get('TikTok Views', 0),
                'Shazam Counts': features_dict.get('Shazam Counts', 0),
                'Apple Music Playlist Count': features_dict.get('Apple Music Playlist Count', 0)
            }
            
            X = pd.DataFrame([input_data])
            
            # 2. Pipeline Inference (Pre-processing + Regressor in one pass)
            prediction = self.oracle.predict(X)[0]
            
            return {
                "predicted_streams": float(prediction),
                "artist": artist,
                "confidence": f"R² {self.metadata['prediction']['r2_score']:.2f} (Unified Pipeline)"
            }
        except Exception as e:
            logger.error(f"Oracle inference failure: {e}")
            return {"error": str(e)}

    def get_dashboard_metrics(self, filtered_df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
        df = filtered_df if filtered_df is not None else self.df
        if df is None: return {}
        return {
            "total_tracks": int(len(df)),
            "unique_artists": int(df['Artist'].nunique()),
            "total_streams_bn": float(df['Spotify Streams'].sum() / 1e9),
            "clusters_found": 6,
            "model_accuracy": self.metadata.get("prediction", {}).get("r2_score", 0),
            "year_range": f"{int(df['Released Year'].min())}-{int(df['Released Year'].max())}"
        }

    def get_ledger_data(self, limit: int = 1000) -> List[Dict[str, Any]]:
        if self.df is None: return []
        # Inject clusters for UI consistency
        clusters = self.manifold.predict(self.df[self.metadata["clustering"]["features"]])
        ledger_df = self.df.head(limit).copy()
        ledger_df['Cluster'] = clusters[:limit]
        res_df = ledger_df[['Track', 'Artist', 'Spotify Streams', 'YouTube Views', 'Cluster']]
        return res_df.replace([np.inf, -np.inf], 0).fillna(0).to_dict(orient='records')
