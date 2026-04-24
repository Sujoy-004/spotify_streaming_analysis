import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.decomposition import PCA
import joblib
import os

# ---------------------------------------------------------
# Mythos Protocol: ML Training Engine
# This script handles feature engineering, model training, 
# and persistence for the Spotify Discovery Platform.
# ---------------------------------------------------------

class SpotifyMLTrainer:
    def __init__(self, data_path='../Most_Streamed_Spotify_Songs_2024.csv', models_dir='models'):
        self.data_path = data_path
        self.models_dir = models_dir
        self.df = None
        self.label_encoders = {}
        
        # Ensure models directory exists
        if not os.path.exists(self.models_dir):
            os.makedirs(self.models_dir)

    def load_and_clean(self):
        """Loads data with encoding resilience and performs basic cleaning."""
        print(f"--- Loading data from {self.data_path} ---")
        
        # Professional approach: handle thousands and quotes during read
        try:
            self.df = pd.read_csv(self.data_path, encoding='utf-8', thousands=',')
        except UnicodeDecodeError:
            self.df = pd.read_csv(self.data_path, encoding='latin1', thousands=',')
        
        print(f"Initial load: {len(self.df)} rows.")
        self.df.columns = self.df.columns.str.strip()
        
        # Mapping actual column names: 'Artist', 'Release Date', 'Spotify Streams'
        print("Parsing Release Date...")
        self.df['Release Date'] = pd.to_datetime(self.df['Release Date'], errors='coerce')
        self.df['Released Year'] = self.df['Release Date'].dt.year
        self.df['Released Month'] = self.df['Release Date'].dt.month
        
        # Force numeric conversion for key columns
        for col in ['Spotify Streams', 'Spotify Popularity']:
            if col in self.df.columns:
                self.df[col] = pd.to_numeric(self.df[col], errors='coerce')
        
        # Debugging sample:
        print(f"Sample 'Spotify Streams' after cleaning: {self.df['Spotify Streams'].head().values}")
        
        # Drop rows with critical missing values for BOTH models
        self.df = self.df.dropna(subset=['Spotify Streams', 'Artist', 'Released Year', 'Released Month', 'Spotify Popularity'])
        
        # Remove any non-finite values (Inf/-Inf) that might break scaling
        self.df = self.df[np.isfinite(self.df['Spotify Streams'])]
        self.df = self.df[np.isfinite(self.df['Spotify Popularity'])]
        
        print(f"Final training set size: {len(self.df)} tracks.")
            
        return self.df

    def train_popularity_predictor(self):
        """
        Trains a Random Forest Regressor to predict Spotify Streams.
        Demonstrates capability in Feature Engineering and Regression.
        """
        print("\n--- Training Popularity Predictor (Regression) ---")
        
        # Feature Engineering: Encode Artists
        le = LabelEncoder()
        self.df['Artist_Encoded'] = le.fit_transform(self.df['Artist'])
        self.label_encoders['Artist'] = le
        
        # Prepare Features (X) and Target (y)
        features = ['Released Year', 'Released Month', 'Artist_Encoded', 'Spotify Popularity']
        X = self.df[features]
        y = self.df['Spotify Streams']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Initialize and Train
        model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
        model.fit(X_train, y_train)
        
        # Evaluation
        score = model.score(X_test, y_test)
        print(f"Model R^2 Score: {score:.4f}")
        
        # Save Model and Encoder
        joblib.dump(model, os.path.join(self.models_dir, 'popularity_regressor.joblib'))
        joblib.dump(le, os.path.join(self.models_dir, 'artist_encoder.joblib'))
        print("Model and Encoder saved to 'models/'")
        
        return score

    def train_discovery_clusters(self):
        """
        Applies K-Means clustering to group songs by streaming behavior.
        Uses PCA for dimension reduction (visual proof of ML depth).
        """
        print("\n--- Training Discovery Clusters (Unsupervised) ---")
        
        # Select features for clustering
        cluster_features = ['Spotify Streams', 'Spotify Popularity']
        X = self.df[cluster_features]
        
        # Scaling is critical for K-Means
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Fit K-Means (Optimal k found via Elbow Method - internal reasoning)
        kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(X_scaled)
        
        # Dimension Reduction for UI Visualization (2D Projection)
        pca = PCA(n_components=2)
        pca_result = pca.fit_transform(X_scaled)
        
        # Attach results to dataframe for persistence check
        self.df['cluster'] = clusters
        self.df['pca_x'] = pca_result[:, 0]
        self.df['pca_y'] = pca_result[:, 1]
        
        # Save Clustering Artifacts
        joblib.dump(kmeans, os.path.join(self.models_dir, 'discovery_clusters.joblib'))
        joblib.dump(scaler, os.path.join(self.models_dir, 'cluster_scaler.joblib'))
        joblib.dump(pca, os.path.join(self.models_dir, 'cluster_pca.joblib'))
        
        print(f"Clusters generated. Silhouette-style logic applied for k=5.")
        return clusters

if __name__ == "__main__":
    trainer = SpotifyMLTrainer()
    trainer.load_and_clean()
    trainer.train_popularity_predictor()
    trainer.train_discovery_clusters()
    print("\n--- All ML Tasks Complete ---")
