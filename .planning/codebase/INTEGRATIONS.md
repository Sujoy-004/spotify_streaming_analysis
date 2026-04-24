# Integrations: Spotify 2024 Discovery | Elite

## Data Sources
- **Primary**: Local CSV (`Most_Streamed_Spotify_Songs_2024.csv`).
- **Fallback**: Synthetic data generation within `SpotifyDataManager` for development isolation.

## External Services
- **GitHub**: Source control and project distribution.
- **Vercel** (Planned): Target for frontend deployment.
- **FastAPI Proxy**: Internal routing via `next.config.mjs` for seamless API communication.

## ML Pipeline
- **Training**: Scikit-Learn (offline training, online inference).
- **Serialization**: `Joblib` (.joblib files in `api/models/`).
- **Input Features**: `Spotify Streams`, `YouTube Views`, `TikTok Views`, `Track Score`.
