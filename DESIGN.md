# Design System: Spotify 2024 Discovery | Elite
**Project ID:** Elite-Intelligence-S24

## 1. Visual Theme & Atmosphere
The "Arctic" design system is built on a philosophy of **"Quiet Luxury"** and **"Cinematic Analytics."** It utilizes a deep, nocturnal palette with high-contrast teal accents to create an environment that feels premium, professional, and mathematically precise. The density is balanced—minimalist enough to be readable, but data-rich enough for professional analysis.

## 2. Color Palette & Roles
- **Arctic Deep (Arctic-900: #0f172a)**: The foundation. Used for the main background to create depth.
- **Panel Surface (Arctic-800: #1e293b)**: Secondary surface color for cards and containers.
- **Glass Border (Arctic-700: #334155)**: Defined strokes for component boundaries.
- **Arctic Accent (Teal: #2dd4bf)**: Used for primary data points, progress bars, and active states.
- **Error/Alert (Red: #991b1b)**: Subtle, high-contrast red for predictive failures.

## 3. Typography Rules
- **Primary Typeface**: Inter / System Sans-serif.
- **Headers**: Tracking-tight, semi-bold for hierarchy.
- **Data Labels**: Uppercase, tracking-widest, bold for semantic clarity.
- **Numbers**: Monospaced variants (where available) for tabular alignment.

## 4. Component Stylings
* **Metric Cards**: Subtly rounded (rounded-xl) with sharp, precise borders. Hover transitions include border-glow effects.
* **Manifold Map**: Transparent background with desaturated grid lines (#334155) to keep focus on cluster centroids.
* **Status Pills**: Heavy-desaturated backgrounds with vibrant text for a modern "tag" aesthetic.

## 5. Layout Principles
- **Grid Hierarchy**: Prioritizes the visualization (Manifold) as the primary focal point, supported by the Predictive Oracle (Side Panel) and the Ledger (Footer).
- **Whitespace**: Generous internal padding (p-8) to ensure the dark theme feels expansive rather than claustrophobic.
- **Transitions**: Whisper-soft Framer Motion entries (opacity/y-offset) to ensure a fluid user experience.
