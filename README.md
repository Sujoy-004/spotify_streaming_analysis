# Spotify Stream Prediction Dashboard

Predicting 2024 Spotify track performance using XGBoost and unified machine learning pipelines.
*Forecasts Spotify streams and groups tracks by engagement patterns.*

## 📺 How it works (Demo)
1.  **User Input**: Enter an artist name, release month, and social metrics (YouTube Views, TikTok Views, Shazam Counts).
2.  **Live Prediction**: The system processes these inputs through a unified pipeline to return a predicted Spotify stream count.
3.  **Segment Mapping**: The track is assigned to one of 6 clusters based on cross-platform metrics and plotted on an interactive 2D map.

## ⚙️ System Flow
**Input** (Raw Metrics) → **Unified Pipeline** (Log Scaling + Artist Target Encoding) → **XGBoost Engine** → **Stream Forecast**

## 🛠️ Tech Stack
*   **Machine Learning**: XGBoost, Scikit-Learn, Joblib
*   **Backend**: FastAPI, Pydantic
*   **Frontend**: Next.js 15, Tailwind CSS, Shadcn/UI

## 🧠 Machine Learning Approach
*   **Model**: XGBoost Regressor trained on 2024 streaming data.
*   **Unification**: Single-object Scikit-Learn pipelines ensure training logic and live inference logic are identical.
*   **Data Handling**: Custom transformers handle the skew of streaming counts (via log1p) and high-cardinality strings (artist names).
*   **Parity Verification**: The script `verify_parity.py` proves that the live API results match training outputs exactly.

## 📂 Project Structure
*   `api/`: FastAPI server and model orchestration.
*   `frontend/`: Next.js 15 dashboard UI.
*   `research/`: Data analysis and model experimentation notebooks.
*   `api/models/`: Production pipeline artifacts (`.joblib`).

## ⚡ Setup and Run

### 1. Backend
```bash
cd api
pip install -r requirements.txt
python train_ml.py   # Train and save unified pipelines
uvicorn main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Sample Result

**Prediction:**
*   **Input**: Taylor Swift, May Release, 50M YouTube Views, 30M TikTok Views.
*   **Output**: `202,623,408` Predicted Spotify Streams.

**Clustering:**
*   **Output**: Track assigned to Cluster 0 (based on engagement patterns).

## 📈 Why this project matters
*   **Zero Drift**: Eliminates "it worked in my notebook" errors by deploying a single, serialized pipeline for all preprocessing and inference.
*   **Real-World Preprocessing**: Correctly handles non-linear relationships and outlier-heavy data typical of the music industry.
*   **Full-Stack Integrity**: Demonstrates a complete engineering lifecycle: from raw CSV cleaning to an interactive dashboard.
