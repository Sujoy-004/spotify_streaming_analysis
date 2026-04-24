from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import os

# Internal Imports
from data_manager import SpotifyDataManager
from logging_config import setup_logging, logger

# Initialize Logging
setup_logging()

app = FastAPI(
    title="Spotify Elite API",
    description="Backend intelligence service for Spotify 2024 Discovery Dashboard",
    version="2.2.0"
)

# Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# Security Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Infrastructure
# Fails loudly on startup if models are missing
data_manager = SpotifyDataManager()

# --- Schema Definitions ---

class PredictionRequest(BaseModel):
    artist: str = Field(..., example="Taylor Swift")
    year: int = Field(2024, example=2024)
    month: int = Field(1, example=1)
    youtube_views: float = Field(0, example=100000000)
    tiktok_views: float = Field(0, example=50000000)
    shazam_counts: float = Field(0, example=1000000)
    apple_music_playlists: float = Field(0, example=500)

class HealthResponse(BaseModel):
    status: str
    models_loaded: bool
    version: str

# --- Endpoints ---

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """Verifies service health and ML model availability."""
    return {
        "status": "online", 
        "models_loaded": data_manager.oracle is not None and data_manager.manifold is not None,
        "version": "2.2.0"
    }

@app.get("/api/dashboard")
def get_dashboard_data(year: Optional[int] = Query(None, description="Filter by release year")):
    """Retrieves high-level metrics and top chart data for the dashboard landing."""
    try:
        df = data_manager.df
        if df is None:
            raise HTTPException(status_code=503, detail="Data engine not initialized")
            
        if year:
            df = df[df['Released Year'] == year]
        
        return {
            "metrics": data_manager.get_dashboard_metrics(df),
            "topTracks": data_manager.get_top_charts(n=10)
        }
    except Exception as e:
        logger.error(f"Dashboard data retrieval failed: {e}")
        raise HTTPException(status_code=500, detail="Internal data engine error")

@app.get("/api/ml/clusters")
def get_clusters():
    """Returns PCA-mapped clusters for discovery visualization manifold."""
    return data_manager.get_ml_insights()

@app.post("/api/ml/predict")
def predict_popularity(req: PredictionRequest):
    """Executes XGBoost inference via unified pipeline."""
    logger.info(f"Inference request received for artist: {req.artist}")
    result = data_manager.predict_popularity(
        req.artist, 
        {
            'Released Year': req.year,
            'Released Month': req.month,
            'YouTube Views': req.youtube_views,
            'TikTok Views': req.tiktok_views,
            'Shazam Counts': req.shazam_counts,
            'Apple Music Playlist Count': req.apple_music_playlists
        }
    )
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.get("/api/ledger")
def get_ledger(limit: int = Query(1000, le=5000)):
    """Provides structured data for the Streaming Ledger UI table."""
    return data_manager.get_ledger_data(limit=limit)

@app.get("/api/top-tracks")
def get_top_tracks(
    metric: str = Query("Spotify Streams", enum=["Spotify Streams", "YouTube Views"]),
    n: int = 10
):
    """Retrieves leaderboards based on specified metrics."""
    return data_manager.get_top_charts(metric, n)
