# Architecture: Spotify 2024 Discovery | Elite

## Overview
The system follows a decoupled **Client-Server** architecture, separating the high-performance ML inference backend from the reactive data visualization frontend.

## Components

### 1. Intelligence Layer (Backend)
- **Data Engine**: `SpotifyDataManager` handles stateful data loading, fallback logic (synthetic data generation), and ML model orchestration.
- **REST API**: FastAPI provides high-speed endpoints for dashboard synchronization (`/api/dashboard`), manifold discovery (`/api/ml/clusters`), and predictive inference (`/api/ml/predict`).
- **Middleware**: Environment-aware CORS configuration for secure cross-origin communication.

### 2. Experience Layer (Frontend)
- **Dashboard Hub**: Next.js App Router serves as the primary orchestration point.
- **State Management**: Specialized React hooks (`useSpotifyData`) handle data fetching and real-time UI synchronization.
- **Predictive Oracle**: A stateful UI component that communicates with the Random Forest inference engine.

## Data Flow
1. User interacts with the **Predictive Oracle** or **Manifold**.
2. Frontend issues an async request to the **FastAPI proxy**.
3. **SpotifyDataManager** processes request, potentially running ML inference.
4. Response is validated via **Pydantic** and sent to frontend.
5. **Recharts/Framer Motion** update the UI with cinematic transitions.
