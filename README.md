# BeyondChats

A small full-stack project that scrapes articles, optimizes content with an LLM-based optimizer, and presents original vs optimized articles for easy comparison.

---
## Repo Structure
```
/ (repo root)
  /backend        # Node/Express backend (server, models, routes, scripts, utils)
  /client         # React (Vite) frontend
  .env.example
  README.md
```

Make sure your `backend` folder contains:
- `server.js`
- `package.json` (or use root package.json)
- `models/`, `routes/`, `config/`, `scripts/`, `utils/`

---

## Local Setup (Windows / macOS / Linux)

Prerequisites:
- Node.js (>=16)
- npm or yarn
- MongoDB (local or Atlas) and connection string in `.env`

1) Backend

Open a terminal and run:

```bash
cd backend
npm install
# Copy example env and edit values:
cp .env.example .env
# Set the following in backend/.env:
# - MONGODB_URI (MongoDB Atlas or mongodb://localhost:27017/beyondchats)
# - GROQ_API_KEY (or other LLM key)
# - GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID (if using search)
# - ALLOWED_ORIGIN (frontend URL, e.g. https://beyond-chats-liart.vercel.app)

# Start dev server
npm run dev

# Run scraper (saves original articles to DB)
npm run scrape

# Run optimizer (creates optimized articles referencing originals)
npm run optimize
```

2) Frontend

Open a separate terminal and run:

```bash
cd client
npm install
# Start dev server (Vite)
npm run dev

# Build for production
npm run build
```

Frontend will typically run on `http://localhost:5173` (Vite default) and backend on `http://localhost:5000`.

---

## Data Flow / Architecture (quick diagram)

Overview:
- The React frontend (`/client`) requests article lists and individual articles from the Express API (`/backend`).
- The backend stores original scraped articles and generated optimized articles in MongoDB.
- Background scripts in `backend/scripts` run the scraper and optimizer to populate the DB.

ASCII diagram:

```
[Browser (User)]
  |
  |  (1) GET / (UI)  -- Vite frontend serves pages and fetches data
  v
[React Client] --fetch--> [Express API - /api/articles?isOptimized={true|false}]
                |
                | (2) Query / Read/Write
                v
              [MongoDB Atlas]

Background jobs:
- `backend/scripts/scraper.js` scrapes original articles and POSTs/creates Article documents.
- `backend/scripts/contentOptimizer.js` reads originals, calls LLM, and saves optimized versions.

Notes:
- `ALLOWED_ORIGIN` env var controls CORS on the backend and should include the frontend URL.
```

---

## What I moved / Project organization notes
- Backend files are under `/backend` (models, routes, config, scripts, utils).
- Frontend is under `/client`.

Keep utility scripts (scraper, optimizer) inside `backend/scripts` so reviewers can run them with the proper environment.

---

## Live Links
The deployed frontend and backend for this submission (replace with your live URLs if different):

- Frontend (Vercel): https://beyond-chats-liart.vercel.app
- Backend (Render): https://beyondchats-3sb0.onrender.com

How to verify original vs optimized on the live site:
- Open the frontend link and use the tabs `Original Articles` / `Optimized Articles` at the top of the page to toggle lists.
- Backend API endpoints (for direct checking):
  - Get original articles: `GET https://beyondchats-3sb0.onrender.com/api/articles?isOptimized=false&limit=10`
  - Get optimized articles: `GET https://beyondchats-3sb0.onrender.com/api/articles?isOptimized=true&limit=10`

If you don't see data on the live frontend, ensure the deployed backend's `MONGODB_URI` points to the Atlas DB containing the data and that `ALLOWED_ORIGIN` includes the frontend URL.

---

## Screenshots

### Home / Article List
![Home view](docs/screenshots/home.png.png)

### Original Article
![Original article view](docs/screenshots/article_original.png.png)

### Optimized Article
![Optimized article view](docs/screenshots/article_optimized.png.png)


## How to push this repo to GitHub (commands you run locally)

Option A — create a remote repo and push (manual remote):

```bash
# from repo root
git init                # only if not already a git repo
git add .
git commit -m "Initial commit"
# create repo on GitHub and get remote URL (e.g. git@github.com:you/BeyondChats.git)
git remote add origin <REMOTE_URL>
git branch -M main
git push -u origin main
```

Option B — create & push with GitHub CLI (recommended if you have `gh`):

```bash
gh repo create your-username/BeyondChats --public --source=. --remote=origin --push
```

Notes:
- Commit frequently and write clear messages (feature/fix/task). Reviewers expect to see development history.
## BeyondChats

A compact full-stack app that scrapes articles, generates LLM-optimized versions, and shows original vs optimized content.

### Repo layout
- `/backend` — Node/Express API, Mongoose models, scripts (`scrape`, `optimize`)
- `/client` — React (Vite) frontend

### Quick start (local)
Prereqs: Node.js (>=16), npm, MongoDB (local or Atlas).

Backend:
```bash
cd backend
npm install
cp .env.example .env    # edit MONGODB_URI, ALLOWED_ORIGIN, LLM keys
npm run dev
# optional: populate DB
npm run scrape
npm run optimize
```

Frontend:
```bash
cd client
npm install
npm run dev
```

Frontend: `http://localhost:5173`. Backend: `http://localhost:5000` (or `PORT` in `.env`).

### Architecture (short)
- React frontend calls `/api/articles` on the Express backend.
- Backend stores original and optimized articles in MongoDB.
- `backend/scripts` runs the scraper and optimizer to populate the DB.

### Deploy & verify
- Ensure deployed backend `MONGODB_URI` points to the Atlas DB with your data and `ALLOWED_ORIGIN` matches the frontend URL.
- Set frontend `VITE_API_BASE_URL` to the backend API URL and redeploy.

API checks:
- Original: `GET <BACKEND_URL>/api/articles?isOptimized=false&limit=10`
- Optimized: `GET <BACKEND_URL>/api/articles?isOptimized=true&limit=10`

Notes: Keep secrets out of source; use `.env.example` and platform env vars for production keys/URIs.


