from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import os

# Internal Imports
from .data_manager import SpotifyDataManager
from .logging_config import setup_logging, logger

# Initialize Logging
setup_logging()

app = FastAPI(
    title="Spotify Elite API",
    description="Backend intelligence service for Spotify 2024 Discovery Dashboard",
    version="1.0.0"
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
data_manager = SpotifyDataManager()

@app.on_event("startup")
async def startup_event():
    """Initializes data sources and ML models on service startup."""
    logger.info("Initializing system components...")
    data_manager.load_data()
    logger.info("Service operational.")

# --- Schema Definitions ---

class PredictionRequest(BaseModel):
    artist: str = Field(..., example="Taylor Swift")
    year: int = Field(2024, example=2024)
    month: int = Field(1, example=1)
    popularity: float = Field(..., example=85.0)

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
        "models_loaded": len(data_manager.models) > 0,
        "version": "1.0.0"
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
        
        # Performance-capped raw data sample
        raw_df = data_manager.sanitize_data(df.head(100))
        raw_data_list = raw_df.to_dict(orient='records')
        
        return {
            "metrics": data_manager.get_dashboard_metrics(df),
            "topTracks": data_manager.get_top_charts(n=10),
            "rawData": raw_data_list
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
    """Executes Random Forest inference for stream count projection."""
    logger.info(f"Inference request received for artist: {req.artist}")
    result = data_manager.predict_popularity(
        req.artist, req.year, req.month, req.popularity
    )
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.get("/api/ledger")
def get_ledger(limit: int = Query(2000, le=5000)):
    """Provides structured data for the Streaming Ledger UI table."""
    return data_manager.get_ledger_data(limit=limit)

@app.get("/api/top-tracks")
def get_top_tracks(
    metric: str = Query("Spotify Streams", enum=["Spotify Streams", "Spotify Popularity", "YouTube Views"]),
    n: int = 10
):
    """Retrieves leaderboards based on specified metrics."""
    return data_manager.get_top_charts(metric, n)

@app.get("/api/data")
def get_raw_data(limit: int = Query(100, le=1000)):
    """Direct access to sanitized raw dataset records."""
    if data_manager.df is None:
        return []
    sanitized_df = data_manager.sanitize_data(data_manager.df.head(limit))
    return sanitized_df.to_dict(orient='records')
