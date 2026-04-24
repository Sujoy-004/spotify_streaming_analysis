# 📜 Changelog - Spotify 2024 Discovery | Elite

All notable changes to this project will be documented in this file.

## [Session 6] - 2026-04-24
### Added
- **Truth-First ML Plumbing**: Synchronized Training and Inference pipelines with bit-perfect parity.
- **Dynamic Accuracy Reporting**: Implemented `metadata.json` persistence to serve real-time $R^2$ scores to the UI.
- **Target Encoding**: Replaced bias-prone `LabelEncoder` with Artist-based **Mean Log-Stream Mapping**.
- **Leakage Mitigation**: Explicitly removed circular logic (Spotify Popularity) from the prediction feature set.
- **Log-Space Normalization**: Enforced `np.log1p` across all high-variance behavioral signals.

### Changed
- **Predictive Oracle**: Upgraded XGBoost regressor to version 2.0 with optimized hyperparameters.
- **Spectral Manifold**: Expanded feature space to include YouTube, TikTok, and Shazam signals for clustering.
- **UI Branding**: Renamed components for mathematical honesty ("R² Score" and "Spectral Manifold").

### Changed
- **Code Refactoring**: Overhauled `main.py` and `data_manager.py` with Google-style docstrings, Pydantic validation, and type hints.
- **UI Polish**: Enhanced the `Topbar`, `OraclePanel`, and `StreamingLedger` with improved typography, hover states, and branding.
- **Frontend Hook Optimization**: Refactored `useSpotifyData` for strict typing and better error propagation.

## [Session 4] - 2026-04-24
### Added
- **Hydration Synchronization**: Implemented `suppressHydrationWarning` in `layout.tsx` to resolve mismatch errors caused by external class injections.
- **Stable Identity Mapping**: Replaced `Math.random()` with stable `ENTRY_ID` logic in the Streaming Ledger to ensure hydration consistency.
- **Port Standardization**: Enforced **Port 3000** for the frontend, including automatic termination of conflicting processes on that port.

### Changed
- **Navigation Flow**: Unified the "Quiet Luxury" aesthetic across all modules.

## [Session 3] - 2026-04-23
### Added
- **Full-Stack Migration**: Decoupled legacy Streamlit logic into a **FastAPI + Next.js** architecture.
- **Quiet Luxury UI**: Implemented the **Arctic Design System** (Deep Navy/Arctic Blue) for a premium dashboard experience.
- **Predictive Oracle**: Added a Machine Learning interface in the `MLDiscovery` module for stream projections.
- **Neural Spectral Map**: Implemented Recharts-based PCA visualization for behavioral clustering.

### Fixed
- **Hook TypeError**: Resolved the `useSpotifyData is not a function` error by standardizing default exports.
- **API Proxying**: Configured `next.config.mjs` to correctly route `/api` calls to the FastAPI backend on Port 8001.

## [Session 2] - 2026-04-23
### Added
- **Exploratory Data Analysis**: Extracted cleaning and visualization logic from `research/spotify_analysis.ipynb`.
- **Project Scaffolding**: Initialized `api` and `frontend` directories with necessary dependencies.

## [Session 1] - 2026-04-23
### Initialized
- **Project Orientation**: Defined core objectives for analyzing the "Most Streamed Spotify Songs 2024" dataset.
- **Dataset Integration**: Confirmed data integrity of the primary CSV source.

---
*Maintained by Antigravity.*
