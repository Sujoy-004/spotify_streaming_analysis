# 🌌 Plan: ML & Data Integrity Refactor
**Target**: `spotify_streaming_analysis`
**Authority**: Lead Architect

## Phase 1: Data Integrity & Cleansing
- [ ] Implement **Sovereign Deduplication**: Use ISRC as unique key; resolve "xSyborg" hallucination.
- [ ] Feature Extraction: Normalize and clean multi-platform metrics (YouTube, TikTok, Shazam).
- [ ] Export sanitized baseline dataset.

## Phase 2: Intelligence Layer Upgrade (XGBoost)
- [ ] Install production-grade ML dependencies (`xgboost`, `scikit-learn`).
- [ ] **Predictive Oracle 2.0**:
    - Implement `XGBRegressor` with `log1p` target scaling.
    - Feature set expansion: Include multi-platform signals.
- [ ] **Spectral Manifold 2.0**:
    - Move from 2D PCA to **Multi-Feature Behavioral Clustering**.
    - Implement K-Means (Elbow optimized) on cross-platform signals.

## Phase 3: Dashboard Realignment
- [ ] **Honest UI Branding**: 
    - Rename "Neural Spectral Manifold" -> "Spectral Manifold (PCA)".
    - Rename "Accuracy" -> "R² Score".
- [ ] **Feature Engineering UI**: Display actual signal sources (YouTube views, Shazam counts).
- [ ] **Ledger Integrity**: Implement server-side sorting and remove fake "Verified" badges for unvalidated rows.

---
*GSD Protocol Engaged. Rebuilding for Excellence.*
