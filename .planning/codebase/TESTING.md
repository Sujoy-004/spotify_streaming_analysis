# Testing: Spotify 2024 Discovery | Elite

## Backend Validation
- **Schema**: Pydantic validation on all incoming API payloads.
- **Data Integrity**: `SpotifyDataManager` validates CSV schema and data types on startup.
- **Model Health**: Accuracy metrics reported in the `/api/dashboard` health check.

## Frontend Verification
- **Strict Typing**: TypeScript compile-time checks ensure data consistency between API and UI.
- **Hydration**: Specialized hydration checks for Recharts and dynamic components.
- **Responsive Audit**: Verified for desktop and localized viewport scales.

## Manual QA Protocols
1. **Connectivity**: Verify FastAPI is responsive on Port 8001.
2. **Inference**: Enter a known artist in the Oracle to verify Random Forest response.
3. **Visualization**: Click a point on the Manifold to verify data synchronization with the Oracle.
