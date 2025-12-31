# BeyondChats

A small full-stack project that scrapes articles, optimizes content with an LLM-based optimizer, and presents original vs optimized articles for easy comparison.

---

## ✅ Submission Checklist
- [ ] Project completeness (features implemented)
- [ ] Clear `README.md` and setup docs (this file)
- [ ] UI/UX polished and responsive
- [ ] Live link to frontend (deployed)
- [ ] Code quality: linting and organized structure

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
- Make sure `README.md` is at repo root and repository is public.

---

## Tips for a strong submission
- Add a short video or GIF showing original → optimized flow.
- Ensure the frontend displays both original and optimized versions clearly.
- Add a `LIVE_LINK` in this README and in `PHASE1_README.md` if required.
- If you use environment secrets for production (OpenAI keys, DB URIs), do NOT commit them—use environment variables and `.env.example`.

---

