from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
try:
    from .data_manager import SpotifyDataManager
except ImportError:
    from data_manager import SpotifyDataManager
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title="Spotify Elite API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

data_manager = SpotifyDataManager()
data_manager.load_data()

@app.get("/api/health")
def health_check():
    return {
        "status": "ok", 
        "models_loaded": len(data_manager.models) > 0
    }

@app.get("/api/dashboard")
def get_dashboard_data(year: Optional[int] = None):
    df = data_manager.df
    if year:
        df = df[df['Released Year'] == year]
    
    # Ensure rawData is present and limited for performance
    raw_df = data_manager.sanitize_data(df.head(100))
    raw_data_list = raw_df.to_dict(orient='records')
    
    return {
        "metrics": data_manager.get_dashboard_metrics(df),
        "topTracks": data_manager.get_top_charts(n=10),
        "rawData": raw_data_list
    }

class PredictionRequest(BaseModel):
    artist: str
    year: int
    month: int
    popularity: float

@app.get("/api/ml/clusters")
def get_clusters():
    """Returns PCA-mapped clusters for discovery visualization"""
    return data_manager.get_ml_insights()

@app.post("/api/ml/predict")
def predict_popularity(req: PredictionRequest):
    """Predicts song streams using the trained regressor"""
    return data_manager.predict_popularity(
        req.artist, req.year, req.month, req.popularity
    )

@app.get("/api/ledger")
def get_ledger(limit: int = 2000):
    """Returns data for the Streaming Ledger table"""
    return data_manager.get_ledger_data(limit=limit)

@app.get("/api/top-tracks")
def get_top_tracks(metric: str = "Spotify Streams", n: int = 10):
    return data_manager.get_top_charts(metric, n)

@app.get("/api/data")
def get_raw_data(limit: int = 100):
    if data_manager.df is None:
        return []
    sanitized_df = data_manager.sanitize_data(data_manager.df.head(limit))
    return sanitized_df.to_dict(orient='records')
