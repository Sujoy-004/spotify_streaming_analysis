# Conventions: Spotify 2024 Discovery | Elite

## Backend (Python/FastAPI)
- **Docstrings**: Google-style mandatory for all functions/classes.
- **Logging**: Use `logging_config` module; never use `print()`.
- **Validation**: Strict Pydantic models for all request/response bodies.
- **Type Hints**: Mandatory for all function signatures.
- **Naming**: `snake_case` for variables/functions; `PascalCase` for classes.

## Frontend (Next.js/TypeScript)
- **Typing**: Strict TypeScript. No `any` allowed. Use `frontend/types/index.ts`.
- **Components**: Functional components with explicit prop interfaces.
- **Hooks**: Centralize API/State logic in custom hooks.
- **Styling**: Tailwind CSS with "Arctic" design system tokens.
- **Formatting**: ESLint + Prettier defaults.

## Project Management
- **Changelog**: Session-based updates in `CHANGELOG.md`.
- **Architecture**: Keep research separate from production code.
