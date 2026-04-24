# Contributing to Spotify 2024 Discovery

First off, thank you for considering contributing to this project! It's people like you that make it a great tool for the community.

## Development Workflow

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Local Setup
1. Clone the repository
2. Set up the backend:
   ```bash
   cd api
   pip install -r requirements.txt
   python main.py
   ```
3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Coding Standards

### Backend (FastAPI)
- Use Google-style docstrings for all functions and classes.
- Ensure all endpoints have proper Pydantic request/response models.
- Use `logging` instead of `print` for all operational messages.
- Maintain a clean separation between data logic (`data_manager.py`) and API routing (`main.py`).

### Frontend (Next.js)
- Use TypeScript for all components and hooks. Avoid `any`.
- Follow the component-based architecture in the `components/` directory.
- Use Tailwind CSS for all styling, following the established "Arctic" design system.
- Ensure all components are responsive and accessible.

## Pull Request Process
1. Create a feature branch from `main`.
2. Ensure your code follows the established style.
3. Update the `CHANGELOG.md` with your changes.
4. Submit a PR with a clear description of the problem and solution.

---
*Maintained with excellence.*
