import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, KFold, cross_validate
from sklearn.cluster import KMeans
from sklearn.preprocessing import RobustScaler, QuantileTransformer
from sklearn.decomposition import PCA
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import joblib
import os
import xgboost as xgb
import json
import datetime
from logging_config import setup_logging, logger

setup_logging()

class SpotifyMLTrainer:
    """
    Sovereign ML Trainer implementing Production-Grade Pipelines.
    Enforces Strict Parity via unified Pipeline artifacts.
    """
    def __init__(self, data_path='../Most_Streamed_Spotify_Songs_2024.csv', models_dir='models'):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_path = os.path.join(os.path.dirname(self.base_dir), 'Most_Streamed_Spotify_Songs_2024.csv')
        self.models_dir = os.path.join(self.base_dir, models_dir)
        self.df = None
        self.metadata = {
            "version": "2.1.0-Elite",
            "trained_at": datetime.datetime.now().isoformat(),
            "prediction": {"features": [], "r2_score": 0, "feature_importance": {}},
            "clustering": {"features": [], "n_clusters": 6}
        }
        
        if not os.path.exists(self.models_dir):
            os.makedirs(self.models_dir)

    def load_and_clean(self):
        logger.info(f"Ingesting dataset from {self.data_path}")
        try:
            self.df = pd.read_csv(self.data_path, encoding='utf-8', thousands=',')
        except UnicodeDecodeError:
            self.df = pd.read_csv(self.data_path, encoding='latin1', thousands=',')
        
        self.df.columns = self.df.columns.str.strip()
        self.df = self.df[self.df['Artist'] != 'xSyborg']
        
        # Numeric Sanitization
        numeric_cols = ['Spotify Streams', 'YouTube Views', 'TikTok Views', 'Shazam Counts', 'Apple Music Playlist Count']
        for col in numeric_cols:
            if col in self.df.columns:
                self.df[col] = pd.to_numeric(self.df[col].astype(str).str.replace(',', '').str.replace('"', ''), errors='coerce').fillna(0)
        
        self.df = self.df[self.df['Spotify Streams'] > 0]
        self.df['log_streams'] = np.log1p(self.df['Spotify Streams'])
        return self.df

    def train_popularity_predictor(self):
        logger.info("Initializing XGBoost Pipeline with Target Encoding parity...")
        
        # 1. Target Encoding (In-situ for training, dictionary for inference)
        artist_map = self.df.groupby('Artist')['log_streams'].mean().to_dict()
        self.df['Artist_Enc'] = self.df['Artist'].map(artist_map)
        
        features = ['Released Year', 'Released Month', 'Artist_Enc', 'YouTube Views', 'TikTok Views', 'Shazam Counts', 'Apple Music Playlist Count']
        self.metadata["prediction"]["features"] = features
        
        X = self.df[features]
        y = self.df['log_streams']
        
        # 2. Pipeline Definition (Guarantees Parity)
        # We use RobustScaler to handle outlier-heavy streaming signals
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', RobustScaler(), features)
            ])

        model_pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', xgb.XGBRegressor(
                n_estimators=1200,
                learning_rate=0.02,
                max_depth=7,
                subsample=0.85,
                colsample_bytree=0.85,
                tree_method='hist', # Faster, production-friendly
                random_state=42
            ))
        ])

        # 3. Rigorous Cross-Validation
        kf = KFold(n_splits=5, shuffle=True, random_state=42)
        cv_results = cross_validate(model_pipeline, X, y, cv=kf, scoring='r2', return_train_score=True)
        
        mean_r2 = cv_results['test_score'].mean()
        logger.info(f"Mean CV R^2: {mean_r2:.4f}")

        # 4. Final Fit & Feature Importance
        model_pipeline.fit(X, y)
        
        # Extract importance from the regressor step
        regressor = model_pipeline.named_steps['regressor']
        importances = dict(zip(features, regressor.feature_importances_.tolist()))
        self.metadata["prediction"]["feature_importance"] = importances
        self.metadata["prediction"]["r2_score"] = float(mean_r2)

        # 5. Persist Unified Artifacts
        joblib.dump(model_pipeline, os.path.join(self.models_dir, 'oracle_pipeline.joblib'))
        joblib.dump(artist_map, os.path.join(self.models_dir, 'artist_target_encoder.joblib'))
        
        return mean_r2

    def train_discovery_clusters(self):
        logger.info("Initializing Manifold Pipeline (Clustering)...")
        
        cluster_features = ['Spotify Streams', 'YouTube Views', 'TikTok Views', 'Shazam Counts']
        self.metadata["clustering"]["features"] = cluster_features
        X = self.df[cluster_features]
        
        # Pipeline: Log1p -> RobustScaler -> PCA -> KMeans
        # Note: Log1p is handled manually before pipeline to ensure non-linear manifold
        X_log = X.apply(np.log1p)
        
        manifold_pipeline = Pipeline(steps=[
            ('scaler', RobustScaler()),
            ('pca', PCA(n_components=2)),
            ('kmeans', KMeans(n_clusters=6, random_state=42, n_init=15))
        ])
        
        manifold_pipeline.fit(X_log)
        
        # Save Artifacts
        joblib.dump(manifold_pipeline, os.path.join(self.models_dir, 'discovery_manifold.joblib'))
        
        with open(os.path.join(self.models_dir, 'metadata.json'), 'w') as f:
            json.dump(self.metadata, f, indent=2)
            
        logger.info("Manifold synthesized. Governance metadata persisted.")

if __name__ == "__main__":
    trainer = SpotifyMLTrainer()
    trainer.load_and_clean()
    trainer.train_popularity_predictor()
    trainer.train_discovery_clusters()
    logger.info("MISSION COMPLETE: Production Pipelines Stabilized.")
