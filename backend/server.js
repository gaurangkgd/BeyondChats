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
app.use(cors());
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
