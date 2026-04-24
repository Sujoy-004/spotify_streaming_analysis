import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.decomposition import PCA
from data_manager import SpotifyDataManager
from logging_config import setup_logging, logger

def train_intelligence_layer():
    """
    Executes Phase 1 Data Hygiene and Trains the Spotify Discovery Intelligence Layer.
    Implements ISRC deduplication, log-scaling, and PCA manifold training.
    """
    setup_logging()
    logger.info("Starting Elite Model Training Protocol (Phase 1)...")

    # 1. Initialize Data Manager for Hygiene Logic
    dm = SpotifyDataManager()
    
    # 2. Ingest and Clean Data
    # Deduplication and Coercion happen inside process_dataframe
    success = dm.load_data()
    if not success:
        logger.error("Data load failed. Cannot train on synthetic data for Elite status.")
        return

    df = dm.df
    
    # 3. Feature Selection & Engineering
    # We use log-scaling for the target to handle the superstar effect
    target_col = 'Spotify Streams'
    df['log_streams'] = np.log1p(df[target_col])
    
    # Features for the Regressor
    # Using Year, Month, Popularity and encoded Artist
    reg_features = ['Released Year', 'Released Month', 'Spotify Popularity']
    
    # 4. Artist Encoding
    le = LabelEncoder()
    artist_col = 'artist'
    df['artist_enc'] = le.fit_transform(df[artist_col])
    
    # 5. Train Regressor (Random Forest)
    # Log-scaled target handles outliers
    logger.info("Training Log-Scaled Random Forest Regressor...")
    X_reg = df[reg_features + ['artist_enc']]
    y_reg = df['log_streams']
    
    regressor = RandomForestRegressor(n_estimators=100, random_state=42)
    regressor.fit(X_reg, y_reg)
    
    # 6. Train Clustering Manifold (PCA)
    logger.info("Training PCA Neural Manifold...")
    cluster_features = ['Spotify Streams', 'Spotify Popularity']
    X_cluster = df[cluster_features]
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_cluster)
    
    # We'll use 6 clusters for discovery segmentation
    from sklearn.cluster import KMeans
    kmeans = KMeans(n_clusters=6, random_state=42, n_init='auto')
    kmeans.fit(X_scaled)
    
    pca = PCA(n_components=2)
    pca.fit(X_scaled)

    # 7. Persist Artifacts
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(regressor, os.path.join(models_dir, 'popularity_regressor.joblib'))
    joblib.dump(le, os.path.join(models_dir, 'artist_encoder.joblib'))
    joblib.dump(kmeans, os.path.join(models_dir, 'discovery_clusters.joblib'))
    joblib.dump(scaler, os.path.join(models_dir, 'cluster_scaler.joblib'))
    joblib.dump(pca, os.path.join(models_dir, 'cluster_pca.joblib'))
    
    logger.info(f"Phase 1 Complete. Models persisted to {models_dir}")
    logger.info(f"Training R² Score (Log Space): {regressor.score(X_reg, y_reg):.4f}")

if __name__ == "__main__":
    train_intelligence_layer()
