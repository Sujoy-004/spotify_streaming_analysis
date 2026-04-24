import pandas as pd
import numpy as np
import joblib
import os
import json
from typing import List, Dict, Any, Optional
from logging_config import logger

class SpotifyDataManager:
    """
    Sovereign Data Manager (v2.1 Elite)
    Orchestrates the lifecycle of the Spotify 2024 dataset and unified ML Pipelines.
    """
    
    def __init__(self, csv_path='Most_Streamed_Spotify_Songs_2024.csv'):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.csv_path = os.path.join(os.path.dirname(self.base_dir), csv_path)
        
        self.df = None
        self.models = {}
        self.models_dir = os.path.join(self.base_dir, 'models')
        self.metadata = {"prediction": {"r2_score": 0.0, "features": []}, "clustering": {"features": []}}
        
        self.load_models()

    def load_data(self) -> bool:
        logger.info(f"Synchronizing data engine with source: {self.csv_path}")
        if os.path.exists(self.csv_path):
            try:
                try:
                    self.df = pd.read_csv(self.csv_path, encoding='utf-8', thousands=',')
                except UnicodeDecodeError:
                    self.df = pd.read_csv(self.csv_path, encoding='latin1', thousands=',')
                
                self.df = self.process_dataframe(self.df)
                return True
            except Exception as e:
                logger.error(f"Data ingestion failure: {e}")
        
        self.df = self.create_sample_data()
        self.df = self.process_dataframe(self.df)
        return False

    def load_models(self):
        """
        Synchronizes the Intelligence Layer. 
        Prioritizes Unified Pipelines (v2.1) over legacy atomic artifacts.
        """
        try:
            # Check for Unified Pipelines first (A+ Standard)
            pipeline_files = {
                'oracle': 'oracle_pipeline.joblib',
                'manifold': 'discovery_manifold.joblib',
                'artist_map': 'artist_target_encoder.joblib'
            }
            
            for key, filename in pipeline_files.items():
                path = os.path.join(self.models_dir, filename)
                if os.path.exists(path):
                    self.models[key] = joblib.load(path)
                    logger.info(f"Unified Pipeline loaded: {key}")
            
            # Fallback for Legacy Atomic Models
            if 'oracle' not in self.models:
                legacy_path = os.path.join(self.models_dir, 'popularity_regressor.joblib')
                if os.path.exists(legacy_path):
                    self.models['legacy_regressor'] = joblib.load(legacy_path)

            meta_path = os.path.join(self.models_dir, 'metadata.json')
            if os.path.exists(meta_path):
                with open(meta_path, 'r') as f:
                    self.metadata = json.load(f)

            logger.info("Intelligence Layer parity established.")
        except Exception as e:
            logger.error(f"Intelligence Layer synchronization collapse: {e}")

    def process_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Sovereign Cleaning & Hallucination Removal."""
        df.columns = df.columns.str.strip()
        df = df[df['Artist'] != 'xSyborg']
        
        # Numeric coercion with fallback guards
        numeric_cols = ['Spotify Streams', 'YouTube Views', 'TikTok Views', 'Shazam Counts', 'Apple Music Playlist Count']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', '').str.replace('"', ''), errors='coerce').fillna(0)
        
        # Temporal extraction
        if 'Released Year' not in df.columns:
            df['Released Year'] = 2024
        if 'Released Month' not in df.columns:
            df['Released Month'] = 1
            
        return df

    def get_ml_insights(self) -> List[Dict[str, Any]]:
        """Executes Manifold Inference via unified Pipeline."""
        if self.df is None or 'manifold' not in self.models:
            return []
        
        try:
            features = self.metadata["clustering"]["features"]
            X_log = self.df[features].apply(np.log1p)
            
            # Pipeline handles scaling, PCA, and KMeans in one pass
            pipeline = self.models['manifold']
            pca_coords = pipeline.named_steps['pca'].transform(pipeline.named_steps['scaler'].transform(X_log))
            clusters = pipeline.named_steps['kmeans'].predict(pipeline.named_steps['scaler'].transform(X_log))
            
            clean_df = self.df.copy()
            clean_df['Cluster'] = clusters
            clean_df['pca_x'] = pca_coords[:, 0]
            clean_df['pca_y'] = pca_coords[:, 1]
            
            return clean_df[['Track', 'Artist', 'Spotify Streams', 'Cluster', 'pca_x', 'pca_y']].head(300).to_dict(orient='records')
        except Exception as e:
            logger.error(f"Manifold inference collapse: {e}")
            return []

    def predict_popularity(self, artist: str, features_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Predictive Oracle Inference with strict Feature Parity."""
        if 'oracle' not in self.models or 'artist_map' not in self.models:
            return {"error": "Oracle offline. Re-run training."}

        try:
            # 1. Target Encoding (Dynamic Mapping)
            artist_enc = self.models['artist_map'].get(artist, np.mean(list(self.models['artist_map'].values())))
            
            # 2. Input Assembly
            input_data = {
                'Released Year': features_dict.get('Released Year', 2024),
                'Released Month': features_dict.get('Released Month', 1),
                'Artist_Enc': artist_enc,
                'YouTube Views': features_dict.get('YouTube Views', 0),
                'TikTok Views': features_dict.get('TikTok Views', 0),
                'Shazam Counts': features_dict.get('Shazam Counts', 0),
                'Apple Music Playlist Count': features_dict.get('Apple Music Playlist Count', 0)
            }
            
            ordered_features = self.metadata["prediction"]["features"]
            X = pd.DataFrame([input_data])[ordered_features]
            
            # 3. Pipeline Inference (Pre-processing + Regressor)
            log_prediction = self.models['oracle'].predict(X)[0]
            prediction = np.expm1(log_prediction)
            
            return {
                "predicted_streams": float(prediction),
                "artist": artist,
                "confidence": f"R² {self.metadata['prediction']['r2_score']:.2f} (Sovereign Pipeline)"
            }
        except Exception as e:
            logger.error(f"Oracle inference failure: {e}")
            return {"error": str(e)}

    def sanitize_data(self, data: Any) -> Any:
        if isinstance(data, pd.DataFrame):
            return data.replace([np.inf, -np.inf], np.nan).fillna(0)
        return data

    def get_dashboard_metrics(self, filtered_df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
        df = filtered_df if filtered_df is not None else self.df
        if df is None: return {}
        metrics = {
            "total_tracks": int(len(df)),
            "unique_artists": int(df['Artist'].nunique()) if 'Artist' in df.columns else 0,
            "total_streams_bn": float(df['Spotify Streams'].sum() / 1e9) if 'Spotify Streams' in df.columns else 0,
            "clusters_found": 6,
            "model_accuracy": self.metadata["prediction"]["r2_score"],
            "year_range": f"{int(df['Released Year'].min())}-{int(df['Released Year'].max())}" if 'Released Year' in df.columns else "2024"
        }
        return metrics

    def get_ledger_data(self, limit: int = 2000) -> List[Dict[str, Any]]:
        if self.df is None: return []
        ledger_df = self.df.head(limit).copy()
        # Add basic cluster for UI consistency if manifold isn't loaded
        ledger_df['Cluster'] = 0
        res_df = ledger_df[['Track', 'Artist', 'Spotify Streams', 'YouTube Views', 'Spotify Popularity', 'Cluster']]
        return self.sanitize_data(res_df).to_dict(orient='records')

    def get_top_charts(self, metric: str = 'Spotify Streams', n: int = 10) -> List[Dict[str, Any]]:
        if self.df is None or metric not in self.df.columns: return []
        top_data = self.df.nlargest(n, metric)
        return top_data[['Track', 'Artist', metric]].to_dict(orient='records')
