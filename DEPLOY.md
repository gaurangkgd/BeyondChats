# Deployment guide — Render (backend) + Vercel (frontend)

This document explains step-by-step how to deploy the backend to Render and the frontend to Vercel for the BeyondChats repository.

---

## Quick checks (before you start)
- Ensure `backend/package.json` has a `start` script (it does: `node server.js`).
- Ensure the backend reads `process.env.PORT` (it does in `server.js`).
- Ensure the frontend uses a `VITE_` prefixed env var for the API base URL (e.g. `VITE_API_URL`).

---

## 1) Deploy backend to Render (Web Service)

1. Sign in to Render (render.com) and click **New** → **Web Service**.
2. Select **Connect a repository** and choose this repository (`BeyondChats`).
3. Settings to use:
   - Root: `backend` (or set path to `backend` in the dashboard)
   - Branch: `main` (or whichever branch you deploy)
   - Environment: `Node` (Node 18+ recommended)
   - Build Command: `cd backend && npm install` (Render will cache installs)
   - Start Command: `cd backend && npm start`
   - Health Check Path: `/` (optional)
4. Set environment variables (in Service → Environment → Environment Variables):
   - `MONGODB_URI` = your MongoDB connection string (Atlas or other).
   - `NODE_ENV` = `production` (optional)
   - Any other secrets (OpenAI key, etc.) if your backend needs them.
5. Create the service. Render will build & deploy automatically.
6. After deployment, copy the service URL (e.g., `https://beyondchats-backend.onrender.com`).

Notes and tips:
- If you prefer repo-driven config, keep the `render.yaml` at the repo root (already added). Render will use it if you enable "use render.yaml" when creating a service.
- If your backend uses Puppeteer or other system deps, you may need to add a Docker-based service instead of the standard Node environment.
- Check logs from the Render dashboard if something fails (Build and Live logs).

---

## 2) Deploy frontend to Vercel (Static Site)

1. Sign in to Vercel (vercel.com) and click **New Project** → **Import Git Repository** → choose `BeyondChats`.
2. Important Vercel settings for a monorepo frontend:
   - Root Directory: `client`
   - Framework Preset: leave as `Other` or select `Vite` if available
   - Install Command / Build Command: `npm install && npm run build`
   - Output Directory: `dist`
   - Production Branch: `main` (or your preferred branch)
3. Environment variables (in Project Settings → Environment Variables):
   - `VITE_API_URL` = `https://<YOUR_RENDER_BACKEND_URL>` (set this once the Render backend is live)
   - Any other client-side variables must start with `VITE_` to be exposed to the browser.
4. Deploy the project. Vercel will run the build and publish the static `dist` folder.
5. After deployment, visit the frontend URL and verify it loads and can call the API.

Notes and tips:
- You added `vercel.json` to the repo to pin build settings — Vercel respects it when importing the repo.
- If CORS errors appear, add the Vercel domain to the backend CORS whitelist or set cors() to allow your domain. Example in `backend/server.js`:

```js
// allow production frontend on Render
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
```

Set `ALLOWED_ORIGIN` to your Vercel site URL.

---

## 3) Local test and verification commands

- Start backend locally:
```bash
cd backend
npm install
npm start
```

- Build and preview frontend locally:
```bash
cd client
npm install
npm run build
npm run preview
```

Try the frontend against the local backend by setting `VITE_API_URL` in a `.env.local` inside `client/`:

```
VITE_API_URL=http://localhost:5000
```

Run the frontend dev server if you prefer live reload:

```bash
cd client
npm run dev
```

---

## 4) Post-deploy smoke tests

1. Open the backend health endpoint: `https://<BACKEND_URL>/` — should return the API summary JSON.
2. Open the frontend URL and click through the UI; open devtools to confirm API calls hit the backend URL and return 200.
3. Check Render and Vercel logs for any runtime errors.

---

## 5) Troubleshooting
- 502 / Build fails: view the build logs and copy the failing step. For Node, ensure `npm install` finishes and `start` works locally.
- CORS fails in browser: add your frontend URL to backend CORS allow list.
- Env vars missing: double-check names (Vite requires `VITE_` prefix for client-exposed variables).

---

If you want, I can:
- Add example `ALLOWED_ORIGIN` usage to `backend/server.js` (small change) and commit it.
- Walk you through creating the Render Web Service and Vercel project step-by-step while you have both dashboards open.
