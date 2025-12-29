# Phase 2: Content Optimization with AI

Complete! Now articles can be optimized using Google search + LLM.

## 🎯 What Phase 2 Does:

1. ✅ Fetches articles from your API
2. ✅ Searches article title on Google
3. ✅ Scrapes top 2 ranking articles
4. ✅ Uses OpenAI to optimize content
5. ✅ Publishes optimized version with citations
6. ✅ Links back to original article

---

## 🔧 Setup

### 1. Get Groq API Key (Required) - FREE!

1. Go to https://console.groq.com/keys
2. Create account / Sign in with Google
3. Click "Create API Key"
4. Copy your API key

**Why Groq?**
- ⚡ 10x faster than OpenAI
- 🆓 Generous free tier
- 🎯 High quality (uses Llama 3.3 70B)

### 2. Add to `.env` file:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Google Search (Optional)

**Option A: Use Google scraping** (Free, no setup needed)
- Already works out of the box!

**Option B: Use Google Custom Search API** (More reliable)
1. Go to https://developers.google.com/custom-search
2. Create a Custom Search Engine
3. Get API Key and Search Engine ID
4. Add to `.env`:

```env
GOOGLE_API_KEY=your_api_key
GOOGLE_SEARCH_ENGINE_ID=your_cx_id
```

---

## 🚀 Usage

### Make sure server is running:
```bash
npm start
```

### Option 1: Optimize All Articles
```bash
npm run optimize
```

This will:
- Find all non-optimized articles
- Process each one automatically
- Create optimized versions

### Option 2: Optimize Specific Article
```bash
node scripts/contentOptimizer.js ARTICLE_ID
```

Replace `ARTICLE_ID` with actual MongoDB ID from your database.

---

## 📊 What Gets Created:

For each original article, it creates:

**Optimized Article:**
- ✅ Better formatting (headings, structure)
- ✅ Enhanced content quality
- ✅ SEO optimized
- ✅ Similar style to top-ranking articles
- ✅ Citations at bottom
- ✅ Linked to original article

**Fields:**
- `isOptimized: true`
- `originalArticleId: [original_article_id]`
- `references: [array of source articles]`

---

## 🧪 Testing Phase 2

### 1. Make sure you have articles:
```bash
npm run scrape
```

### 2. Start server:
```bash
npm start
```

### 3. Run optimizer:
```bash
npm run optimize
```

### 4. Check results:
```bash
# Get all optimized articles
curl "http://localhost:5000/api/articles?isOptimized=true"

# Get original articles
curl "http://localhost:5000/api/articles?isOptimized=false"
```

---

## 🔍 Pipeline Flow:

```
Original Article
      ↓
Search Google for title
      ↓
Get top 2 results
      ↓
Scrape their content
      ↓
Send to OpenAI (GPT-4)
      ↓
Generate optimized version
      ↓
Add citations
      ↓
Publish via API
      ↓
Optimized Article ✨
```

---

## ⚙️ Files Created:

- `utils/googleSearch.js` - Google search (API + scraping)
- `utils/articleScraper.js` - Extract article content
- `utils/contentOptimizer.js` - OpenAI integration
- `scripts/contentOptimizer.js` - Main pipeline script

---

## 💡 Tips:

1. **OpenAI Cost**: Uses `gpt-4o-mini` (cheap model)
   - ~$0.01 per article
   - Can switch to `gpt-3.5-turbo` for even cheaper

2. **Rate Limits**: 
   - 5 second delay between articles
   - Prevents API throttling

3. **Google Scraping**:
   - Works without API keys
   - Falls back automatically if API fails

---

## ✅ Phase 2 Complete!

Ready for Phase 3 (React Frontend)? Let me know! 🚀
