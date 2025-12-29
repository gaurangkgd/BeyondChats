const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const BeyondChatsScraper = require('../utils/scraper');

// @route   GET /api/articles
// @desc    Get all articles with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional filters
    const filter = {};
    if (req.query.isOptimized !== undefined) {
      filter.isOptimized = req.query.isOptimized === 'true';
    }

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('originalArticleId', 'title url');

    const total = await Article.countDocuments(filter);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching articles',
      error: error.message 
    });
  }
});

// @route   GET /api/articles/:id
// @desc    Get single article by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('originalArticleId', 'title url');

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article not found' 
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching article',
      error: error.message 
    });
  }
});

// @route   POST /api/articles
// @desc    Create new article
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, url, author, publishedDate, description, content, imageUrl } = req.body;

    // Validate required fields
    if (!title || !url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and URL are required' 
      });
    }

    // Check for duplicate URL
    const existing = await Article.findOne({ url });
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: 'Article with this URL already exists' 
      });
    }

    // Create new article
    const article = new Article({
      title,
      url,
      author: author || '',
      publishedDate: publishedDate || '',
      description: description || '',
      content: content || '',
      imageUrl: imageUrl || '',
      isOptimized: false
    });

    await article.save();

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating article',
      error: error.message 
    });
  }
});

// @route   PUT /api/articles/:id
// @desc    Update article
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article not found' 
      });
    }

    // Update fields
    const allowedUpdates = [
      'title', 'url', 'author', 'publishedDate', 
      'description', 'content', 'imageUrl', 
      'isOptimized', 'references'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        article[field] = req.body[field];
      }
    });

    await article.save();

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: article
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating article',
      error: error.message 
    });
  }
});

// @route   DELETE /api/articles/:id
// @desc    Delete article
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article not found' 
      });
    }

    await article.deleteOne();

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting article',
      error: error.message 
    });
  }
});

// @route   POST /api/articles/scrape
// @desc    Trigger scraping of BeyondChats articles
// @access  Public
router.post('/scrape', async (req, res) => {
  try {
    const scraper = new BeyondChatsScraper();
    
    const articles = await scraper.scrapeLastPage(5);
    
    if (articles.length === 0) {
      return res.json({
        success: true,
        message: 'No articles found to scrape',
        data: { saved: 0, skipped: 0 }
      });
    }

    const result = await scraper.saveToDatabase(articles);

    res.json({
      success: true,
      message: `Scraping complete: ${result.saved} new articles saved`,
      data: result
    });
  } catch (error) {
    console.error('Scrape error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during scraping',
      error: error.message 
    });
  }
});

module.exports = router;
