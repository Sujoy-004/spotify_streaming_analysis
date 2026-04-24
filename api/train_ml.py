import pandas as pd
import numpy as np
from sklearn.model_selection import KFold, cross_validate
from sklearn.cluster import KMeans
from sklearn.preprocessing import RobustScaler, FunctionTransformer
from sklearn.decomposition import PCA
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer, TransformedTargetRegressor
from sklearn.base import BaseEstimator, TransformerMixin
import joblib
import os
import xgboost as xgb
import json
import datetime
from logging_config import setup_logging, logger

setup_logging()

from spotify_transformers import ArtistTargetEncoder

class SpotifyMLTrainer:
    """
    Sovereign ML Trainer (v2.2 Production).
    Produces unified joblib pipelines for 100% inference parity.
    """
    def __init__(self, data_path='../Most_Streamed_Spotify_Songs_2024.csv', models_dir='models'):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_path = os.path.join(os.path.dirname(self.base_dir), 'Most_Streamed_Spotify_Songs_2024.csv')
        self.models_dir = os.path.join(self.base_dir, models_dir)
        self.df = None
        self.metadata = {
            "version": "2.2.0-Production",
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
        
        if 'Release Date' in self.df.columns:
            self.df['Release Date'] = pd.to_datetime(self.df['Release Date'], errors='coerce')
            self.df['Released Year'] = self.df['Release Date'].dt.year.fillna(2024).astype(int)
            self.df['Released Month'] = self.df['Release Date'].dt.month.fillna(1).astype(int)
        
        if 'Released Year' not in self.df.columns:
            self.df['Released Year'] = 2024
        if 'Released Month' not in self.df.columns:
            self.df['Released Month'] = 1
            
        numeric_cols = ['Spotify Streams', 'YouTube Views', 'TikTok Views', 'Shazam Counts', 'Apple Music Playlist Count']
        for col in numeric_cols:
            if col in self.df.columns:
                self.df[col] = pd.to_numeric(self.df[col].astype(str).str.replace(',', '').str.replace('"', ''), errors='coerce').fillna(0)
        
        self.df = self.df[self.df['Spotify Streams'] > 0]
        return self.df

    def train_popularity_predictor(self):
        logger.info("Synthesizing Unified Oracle Pipeline...")
        
        raw_features = ['Artist', 'Released Year', 'Released Month', 'YouTube Views', 'TikTok Views', 'Shazam Counts', 'Apple Music Playlist Count']
        self.metadata["prediction"]["features"] = raw_features
        
        X = self.df[raw_features]
        y = self.df['Spotify Streams']

        num_features = ['Released Year', 'Released Month', 'YouTube Views', 'TikTok Views', 'Shazam Counts', 'Apple Music Playlist Count']
        
        # Preprocessor: Num -> [Log1p, Scaler], Cat -> [TargetEncoder]
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', Pipeline([
                    ('log1p', FunctionTransformer(np.log1p)),
                    ('scaler', RobustScaler())
                ]), num_features),
                ('cat', ArtistTargetEncoder(), ['Artist'])
            ])

        oracle_model = xgb.XGBRegressor(
            n_estimators=1000,
            learning_rate=0.03,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            tree_method='hist',
            random_state=42
        )

        full_pipeline = TransformedTargetRegressor(
            regressor=Pipeline([
                ('preprocessor', preprocessor),
                ('regressor', oracle_model)
            ]),
            func=np.log1p,
            inverse_func=np.expm1,
            check_inverse=False
        )

        kf = KFold(n_splits=5, shuffle=True, random_state=42)
        cv_results = cross_validate(full_pipeline, X, y, cv=kf, scoring='r2')
        mean_r2 = cv_results['test_score'].mean()
        logger.info(f"Mean CV R^2: {mean_r2:.4f}")

        full_pipeline.fit(X, y)
        
        regressor_step = full_pipeline.regressor_.named_steps['regressor']
        importance_vals = regressor_step.feature_importances_
        processed_feature_order = num_features + ['Artist']
        importances = dict(zip(processed_feature_order, importance_vals.tolist()))
        
        self.metadata["prediction"]["feature_importance"] = importances
        self.metadata["prediction"]["r2_score"] = float(mean_r2)

        joblib.dump(full_pipeline, os.path.join(self.models_dir, 'oracle_pipeline.joblib'))
        return mean_r2

    def train_discovery_clusters(self):
        logger.info("Synthesizing Unified Discovery Manifold...")
        
        cluster_features = ['Spotify Streams', 'YouTube Views', 'TikTok Views', 'Shazam Counts']
        self.metadata["clustering"]["features"] = cluster_features
        X = self.df[cluster_features]
        
        manifold_pipeline = Pipeline(steps=[
            ('log1p', FunctionTransformer(np.log1p)),
            ('scaler', RobustScaler()),
            ('pca', PCA(n_components=2)),
            ('kmeans', KMeans(n_clusters=6, random_state=42, n_init=15))
        ])
        
        manifold_pipeline.fit(X)
        
        joblib.dump(manifold_pipeline, os.path.join(self.models_dir, 'discovery_manifold.joblib'))
        
        with open(os.path.join(self.models_dir, 'metadata.json'), 'w') as f:
            json.dump(self.metadata, f, indent=2)
            
        logger.info("Manifold synthesized and metadata persisted.")

if __name__ == "__main__":
    trainer = SpotifyMLTrainer()
    trainer.load_and_clean()
    trainer.train_popularity_predictor()
    trainer.train_discovery_clusters()
    
    logger.info("Executing Post-Training Validation Loop...")
    
    oracle = joblib.load(os.path.join(trainer.models_dir, 'oracle_pipeline.joblib'))
    sample_input = pd.DataFrame([{
        'Artist': 'Taylor Swift',
        'Released Year': 2024,
        'Released Month': 4,
        'YouTube Views': 10000000,
        'TikTok Views': 5000000,
        'Shazam Counts': 200000,
        'Apple Music Playlist Count': 150
    }])
    prediction = oracle.predict(sample_input)[0]
    logger.info(f"Validation Prediction: {prediction:.2f} streams")
    
    manifold = joblib.load(os.path.join(trainer.models_dir, 'discovery_manifold.joblib'))
    sample_cluster_input = pd.DataFrame([{
        'Spotify Streams': 100000000,
        'YouTube Views': 50000000,
        'TikTok Views': 20000000,
        'Shazam Counts': 1000000
    }])
    pca_step = manifold.named_steps['pca']
    scaler_step = manifold.named_steps['scaler']
    log_step = manifold.named_steps['log1p']
    
    pca_coords = pca_step.transform(scaler_step.transform(log_step.transform(sample_cluster_input)))
    cluster = manifold.predict(sample_cluster_input)[0]
    logger.info(f"Validation Manifold: Cluster {cluster} at Coordinates {pca_coords[0]}")
    
    logger.info("MISSION COMPLETE: Ready for Production Execution.")
