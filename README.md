# BeyondChats

A small full-stack project that scrapes articles, optimizes content, and presents original vs optimized articles.

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
# create .env (copy .env.example)
# set MONGODB_URI and any keys
node server.js
# or if package.json has a script:
# npm run start
```

2) Frontend

Open a separate terminal and run:

```bash
cd client
npm install
npm run dev
# or build: npm run build
```

Frontend will typically run on `http://localhost:5173` (Vite default) and backend on `http://localhost:5000`.

---

## Data Flow / Architecture (quick diagram)

Simple data flow:

Frontend (React) --> Backend (Express API) --> MongoDB

ASCII diagram:

```
[User Browser]
    |
    | HTTP (clicks / open article)
    v
[React Client] --fetch--> [Express API - /api/articles] --query--> [MongoDB]
                          |
                          +-- trigger scrapers/optimizers (scripts)
```

---

## What I moved / Project organization notes
- Backend files are under `/backend` (models, routes, config, scripts, utils).
- Frontend is under `/client`.

Keep utility scripts (scraper, optimizer) inside `backend/scripts` so reviewers can run them with the proper environment.

---

## Live Link
Please provide a live frontend URL here (Netlify/Vercel/GitHub Pages). Example:

- Frontend: https://your-frontend.example.com

(Include both original and optimized article links so reviewers can compare.)

---

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

If you'd like, I can:
- Create a GitHub repo and push (I can provide the exact commands — I cannot run them on your machine)
- Add a short architecture PNG/SVG (I can generate an ASCII or Mermaid diagram)
- Update `PHASE1_README.md` or create a `SUBMISSION.md` with a checklist you can tick off

Tell me which of these you'd like next.
