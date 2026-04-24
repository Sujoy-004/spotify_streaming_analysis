# Structure: Spotify 2024 Discovery | Elite

## Directory Map

```text
root/
├── api/                   # Intelligence Layer (Backend)
│   ├── models/            # Serialized ML artifacts (PCA, Random Forest)
│   ├── data_manager.py    # Core business & ML logic
│   ├── main.py            # API routing & orchestration
│   ├── logging_config.py  # Structured logging definitions
│   └── requirements.txt   # Backend dependencies
├── frontend/              # Experience Layer (Frontend)
│   ├── app/               # Next.js App Router (Pages & Layout)
│   ├── components/        # Specialized UI modules (Recharts, Oracle)
│   ├── hooks/             # Custom state & data sync logic
│   └── types/             # Strict TypeScript interfaces
├── research/              # R&D Assets (Jupyter Notebooks)
├── docs/                  # Documentation & Screenshots
├── .planning/             # Architectural & GSD State (Internal)
└── Most_Streamed_Spotify_Songs_2024.csv # Source Dataset
```

## Key Modules
- `api/data_manager.py`: The single source of truth for data processing.
- `frontend/hooks/useSpotifyData.ts`: The bridge between UI and Intelligence.
- `frontend/components/ScatterMap.tsx`: High-fidelity manifold visualization.
