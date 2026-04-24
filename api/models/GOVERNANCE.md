# 🏛️ Sovereign ML Governance Protocol
**Project**: Spotify 2024 Discovery | Elite
**Standard**: Mythos-GSD-Graphify v2.1
**Authority**: Lead ML Architect

This document outlines the rigorous standards applied to the Machine Learning lifecycle within this repository, designed to withstand deep technical scrutiny from senior engineering peers.

## 1. Unified Pipeline Sovereignty
We reject "split logic" where preprocessing is re-implemented in the API layer. 
- **Protocol**: All transformations (Scaling, PCA, Feature Engineering) are encapsulated within `sklearn.pipeline.Pipeline` objects.
- **Benefit**: Guarantees bit-perfect parity between Training and Inference. If the pipeline passes validation in `train_ml.py`, it is guaranteed to behave identically in `data_manager.py`.

## 2. Statistical Rigor & Stability
- **Robust Scaling**: We use `RobustScaler` and `QuantileTransformer` to mitigate the influence of extreme outliers common in power-law streaming distributions.
- **Log-Space Manifold**: Manifold clustering is performed on `np.log1p` transformed signals to ensure high-density track clusters are separated by behavioral characteristics, not just raw volume.
- **Target Encoding**: High-cardinality `Artist` features are managed via Mean Log-Stream Mapping with smoothing to prevent overfitting while capturing artist-specific baseline variance.

## 3. Leakage Mitigation (Truth-First)
- **Circular Logic Forbidden**: `Spotify Popularity` is strictly excluded from prediction features. 
- **Rationale**: Popularity is a post-hoc metric derived from streams; including it would yield high $R^2$ but zero predictive value for new releases.

## 4. Governance & Observability
- **Metadata Persistence**: Every training run generates a `metadata.json` containing:
    - Versioned feature lists.
    - Feature Importance (Gini/Gain).
    - Cross-Validation $R^2$ scores across 5 shuffled folds.
    - Precise training timestamps for provenance.

## 5. Production Readiness
- **Typed Contracts**: `api/main.py` enforces input validation via Pydantic.
- **Sanitization**: Data manager implements `NaN/Inf` guards to prevent JSON serialization collapse.
- **Environment Pinning**: All dependencies are locked in `requirements.txt`.

---
*Developed for Academic Excellence & Production Performance.*
