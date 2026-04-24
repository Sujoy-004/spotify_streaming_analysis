# 🌌 Plan: ML Plumbing & Parity Refactor
**Target**: `spotify_streaming_analysis`
**Authority**: Lead Architect

## Phase 1: High-Fidelity ML Pipeline (Parity)
- [x] **Advanced Feature Engineering**:
    - Implement **Target Encoding** for `Artist` (Mean Log-Streams).
    - Remove `Spotify Popularity` from prediction features (Leakage Mitigation).
    - Incorporate `YouTube Views`, `TikTok Views`, `Shazam Counts` consistently.
- [x] **Unified Scaling Protocol**:
    - Ensure `np.log1p` is applied to all behavioral signals in both Training and Inference.
- [x] **Metadata Persistence**:
    - Save $R^2$ score and exact feature lists to `api/models/metadata.json`.

## Phase 2: Production Inference Alignment
- [x] **Data Manager Refactor**:
    - Replace hardcoded metrics with dynamic loads from `metadata.json`.
    - Fix dimension mismatch by pulling feature list from metadata.
    - Synchronize log-scaling for real-time inference.

## Phase 3: Project Governance & Documentation
- [x] Update `CHANGELOG.md` with the "Truth-First" refactor details.
- [x] Update `README.md` to reflect production-grade ML standards.
- [x] Audit `_brain` for legacy context and update with new architectural notes.

---
*Status: MISSION COMPLETE. Plumbing is sound.*
