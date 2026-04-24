# Spotify 2024 Discovery | Elite Dashboard

A high-fidelity streaming analysis platform and predictive engine built with Next.js 15 and FastAPI.

## Architecture Diagram

```text
[ CLIENT ] <--- Port 3000 ---> [ NEXT.JS APP ROUTER ]
                                     |
                                     | (API Proxy / Rewrites)
                                     v
[ BACKEND ] <--- Port 8001 ---> [ FASTAPI SERVICE ]
                                     |
           ---------------------------------------------------
           |                         |                       |
[ CSV DATA ENGINE ]       [ PCA CLUSTERING ]       [ RF REGRESSOR ]
```

## Setup Instructions

### 1. Backend Initialization
```bash
cd api
pip install -r requirements.txt
python main.py
```
*The backend will run on http://127.0.0.1:8001*

### 2. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
```
*The dashboard will be available at http://localhost:3000*

## API Endpoints

### Core Dashboard
- **GET `/api/dashboard`**: Returns aggregate metrics (Total Streams, unique artists) and top chart data.
- **GET `/api/ledger`**: Returns a paginated list of all tracks with cluster assignments and available audio features.

### Machine Learning
- **GET `/api/ml/clusters`**: Returns PCA-mapped coordinate data for high-dimensional track visualization.
  - *Response*: `[ { x: float, y: float, cluster: int, artist: string, ... } ]`
- **POST `/api/ml/predict`**: Predicts future stream counts using a trained Random Forest regressor.
  - *Request*: `{ artist: string, year: int, month: int, popularity: float }`
  - *Response*: `{ predicted_streams: float, artist: string, confidence: string }`

### Utility
- **GET `/api/health`**: Returns system and ML model status.

## ML Methodology

### Behavioral Clustering (PCA)
We utilize **Principal Component Analysis (PCA)** to reduce the high-dimensional feature space of Spotify metadata (Streams, Popularity, and temporal data) into a 2D manifold. This allows for the visual identification of streaming patterns across six distinct clusters.

### Predictive Modeling (Random Forest)
The **Predictive Oracle** is powered by a **Random Forest Regressor** trained on historical 2024 streaming curves. It analyzes artist-level performance and seasonal trends to project expected stream counts with an R² accuracy of 0.68.

## Dashboard Preview
![Dashboard](./docs/screenshot.png)

---
*Developed for Academic Excellence & Production Performance.*
