# BeyondChats - Article Scraper & AI Optimizer

A full-stack web application that scrapes blog articles, optimizes them using AI, and displays original vs optimized versions for comparison.

## 🎯 What This Project Does

This project is divided into **3 phases**:

### Phase 1: Scraping & CRUD API ✅
- Scrapes the 5 oldest articles from [BeyondChats blogs](https://beyondchats.com/blogs/)
- Stores articles in MongoDB database
- Provides complete CRUD API endpoints

### Phase 2: AI Content Optimization ✅
- Searches article titles on Google
- Scrapes top 2 ranking articles from search results
- Uses AI (Groq/Llama) to optimize original articles
- Creates enhanced versions with better formatting and SEO
- Adds citations to reference articles

### Phase 3: React Frontend ✅
- Beautiful, responsive UI built with React and Material-UI
- Displays original and optimized articles side-by-side
- Tab-based navigation to switch between views
- Modal view for detailed article reading

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd BeyondChats

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
cd backend
# Copy the example (if exists) or create new .env file
```

Add these variables to `backend/.env`:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database (MongoDB Atlas or local)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
# OR for local: mongodb://localhost:27017/beyondchats

# CORS - Frontend URL (IMPORTANT!)
ALLOWED_ORIGIN=http://localhost:5173

# Source URL
BEYONDCHATS_URL=https://beyondchats.com/blogs/

# AI Optimization (Phase 2) - Get free key from https://console.groq.com
GROQ_API_KEY=gsk_your_groq_api_key_here

# Google Search (Optional - for better search results)
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# API Base URL (for scripts)
API_BASE_URL=http://localhost:5001
```

### 3. Start the Backend

```bash
cd backend
npm start
# Server runs on http://localhost:5001
```

### 4. Populate Database (Optional)

In a new terminal:

```bash
cd backend
# Scrape original articles
npm run scrape

# Optimize articles with AI (requires GROQ_API_KEY)
npm run optimize
```

### 5. Start the Frontend

In another terminal:

```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### 6. View the Application

Open your browser and navigate to: **http://localhost:5173**

- Click **"ORIGINAL ARTICLES"** tab to see scraped articles
- Click **"OPTIMIZED ARTICLES"** tab to see AI-optimized versions
- Click any article card to view full content in a modal

---

## 📁 Project Structure

```
BeyondChats/
├── backend/                 # Node.js/Express Backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   └── Article.js      # Article database schema
│   ├── routes/
│   │   └── articles.js    # API routes (CRUD operations)
│   ├── scripts/
│   │   ├── scraper.js      # Scrape articles from BeyondChats
│   │   └── contentOptimizer.js  # AI optimization pipeline
│   ├── utils/
│   │   ├── scraper.js      # Scraper utility class
│   │   ├── googleSearch.js # Google search functionality
│   │   ├── articleScraper.js # Scrape article content
│   │   └── contentOptimizer.js # AI/LLM integration
│   ├── server.js           # Express server entry point
│   ├── package.json
│   └── .env               # Environment variables (create this)
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── ArticleModal.jsx
│   │   │   ├── ArticlesGrid.jsx
│   │   │   ├── TabControls.jsx
│   │   │   └── ...
│   │   ├── api.js         # API client functions
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── vite.config.js
│
└── README.md              # This file
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:5001/api/articles`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/articles` | Get all articles (with pagination) |
| `GET` | `/api/articles/:id` | Get single article by ID |
| `POST` | `/api/articles` | Create new article |
| `PUT` | `/api/articles/:id` | Update article |
| `DELETE` | `/api/articles/:id` | Delete article |
| `POST` | `/api/articles/scrape` | Trigger scraping of BeyondChats |

### Query Parameters

- `?page=1` - Page number (default: 1)
- `?limit=10` - Items per page (default: 10)
- `?isOptimized=true` - Filter optimized articles
- `?isOptimized=false` - Filter original articles

### Example Requests

```bash
# Get all original articles
curl http://localhost:5001/api/articles?isOptimized=false

# Get optimized articles
curl http://localhost:5001/api/articles?isOptimized=true

# Get single article
curl http://localhost:5001/api/articles/ARTICLE_ID

# Trigger scraping
curl -X POST http://localhost:5001/api/articles/scrape
```

---

## 🛠️ Available Scripts

### Backend Scripts

```bash
cd backend

npm start          # Start production server
npm run dev        # Start development server (with auto-reload)
npm run scrape     # Scrape articles from BeyondChats
npm run optimize   # Optimize all articles with AI
```

### Frontend Scripts

```bash
cd client

npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Browser       │
│  (User)         │
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│  React Frontend  │  ← http://localhost:5173
│   (Vite)         │
└────────┬────────┘
         │
         │ API Calls
         │ (fetch articles)
         ▼
┌─────────────────┐
│  Express API     │  ← http://localhost:5001
│   (Backend)      │
└────────┬────────┘
         │
         │ Query/Write
         ▼
┌─────────────────┐
│   MongoDB        │
│   (Database)     │
└─────────────────┘

Background Jobs:
┌─────────────────┐
│  Scraper Script  │ → Scrapes BeyondChats → Saves to DB
└─────────────────┘

┌─────────────────┐
│ Optimizer Script│ → Google Search → AI Optimization → Saves to DB
└─────────────────┘
```

---

## 🔑 Getting API Keys

### Groq API Key (Required for Phase 2)

1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key and add to `backend/.env` as `GROQ_API_KEY`

**Why Groq?**
- ⚡ 10x faster than OpenAI
- 🆓 Generous free tier
- 🎯 High quality (Llama 3.3 70B model)

### Google Custom Search API (Optional)

For more reliable search results:

1. Go to [Google Custom Search](https://developers.google.com/custom-search)
2. Create a Custom Search Engine
3. Get API Key and Search Engine ID
4. Add to `backend/.env`:
   - `GOOGLE_API_KEY`
   - `GOOGLE_SEARCH_ENGINE_ID`

**Note:** The app works without this - it uses web scraping as a fallback.

---

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. Make sure `ALLOWED_ORIGIN` in `backend/.env` matches your frontend URL:
   ```env
   ALLOWED_ORIGIN=http://localhost:5173
   ```
2. Restart the backend server after changing `.env`

### Port Already in Use

If port 5001 is already in use:

```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID_NUMBER> /F

# macOS/Linux
lsof -ti:5001 | xargs kill -9
```

Or change the port in `backend/.env`:
```env
PORT=5002
```

### No Articles Showing

1. Make sure the backend server is running
2. Check if articles exist in database:
   ```bash
   curl http://localhost:5001/api/articles
   ```
3. If no articles, run the scraper:
   ```bash
   cd backend
   npm run scrape
   ```

### MongoDB Connection Error

1. Verify your `MONGODB_URI` in `backend/.env` is correct
2. For MongoDB Atlas: Check your IP whitelist
3. Test connection:
   ```bash
   # Should show "✅ MongoDB Connected"
   cd backend
   npm start
   ```

---

## 📸 Screenshots

### Home / Article List
![Home view](docs/screenshots/home.png.png)

### Original Article
![Original article view](docs/screenshots/article_original.png.png)

### Optimized Article
![Optimized article view](docs/screenshots/article_optimized.png.png)

---

## 🌐 Deployment

### Backend (Render/Railway/Heroku)

1. Set environment variables in your hosting platform
2. Make sure `ALLOWED_ORIGIN` includes your frontend URL
3. Deploy from `backend` folder

### Frontend (Vercel/Netlify)

1. Set `VITE_API_BASE_URL` to your backend URL
2. Deploy from `client` folder

### Example Live URLs

- Frontend: https://beyond-chats-liart.vercel.app
- Backend: https://beyondchats-3sb0.onrender.com

---

## 📝 License

MIT

---

## 🤝 Contributing

This is an internship project. For questions or issues, please open an issue on GitHub.

---

## ✅ Project Checklist

- [x] Phase 1: Scraping & CRUD API
- [x] Phase 2: AI Content Optimization
- [x] Phase 3: React Frontend
- [x] Responsive Design
- [x] Error Handling
- [x] Documentation

**Project Status: ✅ Complete**
