# Concerns: Spotify 2024 Discovery | Elite

## Technical Debt
- **Data Persistence**: Currently dependent on local CSV. Future migration to PostgreSQL/Supabase is recommended for scalability.
- **Worker Offloading**: ML inference is synchronous. As user load increases, heavy tasks should move to a Celery/Redis worker.

## Risk Assessment
- **Model Drift**: Random Forest predictions are locked to the 2024 training set. Periodic re-training is required as new 2025 data emerges.
- **Port Conflicts**: Dashboard relies on Port 3000 and 8001; environment checks are implemented but system-level overlaps may occur.

## Scalability
- **Manifold Performance**: Recharts performance may degrade beyond 5,000 points. Potential need for Canvas-based rendering (PixiJS/Three.js) if dataset expands significantly.
