require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articles');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Configure CORS to accept the exact request origin when it matches allowed origins.
// `ALLOWED_ORIGIN` may be a single origin or a comma-separated list. Trailing
// slashes are ignored when matching so `https://site.app` and
// `https://site.app/` are treated the same.
const allowedOriginEnv = process.env.ALLOWED_ORIGIN || process.env.BEYONDCHATS_URL || '*';
const allowedOrigins = String(allowedOriginEnv)
  .split(',')
  .map(s => s.trim().replace(/\/+$|\/$/g, ''));

app.use(cors({
  origin: (origin, callback) => {
    // Allow tools/servers (no origin) such as curl/Postman
    if (!origin) return callback(null, true);
    
    const normalizedReqOrigin = origin.replace(/\/+$/g, '');
    
    // Allow all origins if '*' is specified
    if (allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    // Check exact match
    if (allowedOrigins.includes(normalizedReqOrigin)) {
      return callback(null, true);
    }
    
    // Allow all Vercel deployments (production and preview)
    // Pattern: https://*.vercel.app or https://*-*.vercel.app
    if (normalizedReqOrigin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (normalizedReqOrigin.includes('localhost') || normalizedReqOrigin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Reject if no match
    console.warn(`CORS blocked origin: ${normalizedReqOrigin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'BeyondChats Article API',
    version: '1.0.0',
    endpoints: {
      'GET /api/articles': 'Get all articles (with pagination)',
      'GET /api/articles/:id': 'Get single article',
      'POST /api/articles': 'Create new article',
      'PUT /api/articles/:id': 'Update article',
      'DELETE /api/articles/:id': 'Delete article',
      'POST /api/articles/scrape': 'Trigger scraping'
    }
  });
});

app.use('/api/articles', articleRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log(`📚 Docs: http://localhost:${PORT}\n`);
});

module.exports = app;
