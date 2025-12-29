# BeyondChats - MERN Stack Article Scraper & Optimizer

Complete 3-phase project for scraping, optimizing, and displaying blog articles.

## 🎯 Project Overview

- **Phase 1**: Scrape BeyondChats articles + CRUD API ✅
- **Phase 2**: Google search + LLM optimization (Coming next)
- **Phase 3**: React frontend (Coming next)

---

## 📁 Project Structure

```
BeyondChats/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   └── Article.js            # Article schema
├── routes/
│   └── articles.js           # API routes
├── scripts/
│   └── scraper.js            # Standalone scraper
├── utils/
│   └── scraper.js            # Scraper class
├── server.js                 # Express server
├── package.json
├── .env.example
└── README.md
```

---

## 🚀 Phase 1: Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
copy .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/beyondchats
BEYONDCHATS_URL=https://beyondchats.com/blogs/
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (cloud):
- Update `MONGODB_URI` in `.env` with your Atlas connection string

### 4. Run the Server

```bash
npm start
# or for development with auto-restart:
npm run dev
```

Server runs at: `http://localhost:5000`

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/articles
```

### 1️⃣ Get All Articles
```http
GET /api/articles?page=1&limit=10
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `isOptimized` (optional) - Filter by optimization status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Article Title",
      "url": "https://...",
      "author": "Author Name",
      "publishedDate": "2025-01-01",
      "description": "...",
      "content": "...",
      "imageUrl": "...",
      "isOptimized": false,
      "references": [],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### 2️⃣ Get Single Article
```http
GET /api/articles/:id
```

### 3️⃣ Create Article
```http
POST /api/articles
Content-Type: application/json

{
  "title": "Article Title",
  "url": "https://example.com/article",
  "author": "Author Name",
  "publishedDate": "2025-01-01",
  "description": "Article description",
  "content": "Full article content",
  "imageUrl": "https://example.com/image.jpg"
}
```

### 4️⃣ Update Article
```http
PUT /api/articles/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### 5️⃣ Delete Article
```http
DELETE /api/articles/:id
```

### 6️⃣ Trigger Scraping
```http
POST /api/articles/scrape
```

Scrapes 5 oldest articles from BeyondChats and saves to database.

---

## 🕷️ Running the Scraper

### Option 1: Via API
```bash
curl -X POST http://localhost:5000/api/articles/scrape
```

### Option 2: Standalone Script
```bash
npm run scrape
```

---

## 🧪 Testing the API

### Using curl (Windows)

**Get all articles:**
```bash
curl http://localhost:5000/api/articles
```

**Create article:**
```bash
curl -X POST http://localhost:5000/api/articles ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Test Article\",\"url\":\"https://example.com/test\"}"
```

**Trigger scraping:**
```bash
curl -X POST http://localhost:5000/api/articles/scrape
```

---

## 💾 Database Schema

**Article Model:**

```javascript
{
  title: String (required),
  url: String (required, unique),
  author: String,
  publishedDate: String,
  description: String,
  content: String,
  imageUrl: String,
  isOptimized: Boolean (default: false),
  originalArticleId: ObjectId (reference to original article),
  references: [{
    title: String,
    url: String,
    scrapedAt: Date
  }],
  scrapedAt: Date,
  optimizedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🔧 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run scrape     # Run scraper script
npm run optimize   # Run content optimizer (Phase 2)
```

---

## ✅ Phase 1 Complete!

- [x] Node.js + Express server
- [x] MongoDB + Mongoose
- [x] Article model
- [x] Web scraper (Axios + Cheerio)
- [x] Complete CRUD API
- [x] Error handling
- [x] Duplicate prevention

**Ready to test Phase 1!** 🎉

---

## 📝 License

MIT
