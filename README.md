# Joey's, Meal Planning

A warm meal-planning app with real AI recipes and saved family memory.

## Quick start

```bash
# Install everything (frontend + backend)
npm run install:all

# Add your Anthropic API key
cp server/.env.example server/.env
# then edit server/.env and paste your key

# Start both servers together
npm run dev
```

- Frontend runs on http://localhost:5173
- Backend runs on http://localhost:4000

Open http://localhost:5173 in your browser.

## How it works

- **Frontend:** Vite + React — the whole UI
- **Backend:** Express + SQLite — auth, household, meal plans, feedback
- **AI:** Anthropic Claude — generates recipes and weekly plans via the backend

## Scripts

- `npm run dev` — runs both frontend and backend together
- `npm run dev:web` — frontend only
- `npm run dev:api` — backend only
- `npm run build` — builds frontend for production
- `npm run install:all` — installs dependencies for both

## Requirements

- Node.js 18+
- An Anthropic API key from https://console.anthropic.com
