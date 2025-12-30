const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    contentHtml: {
      type: String,
      default: ''
    },
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  author: {
    type: String,
    trim: true,
    default: ''
  },
  publishedDate: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isOptimized: {
    type: Boolean,
    default: false
  },
  originalArticleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    default: null
  },
  references: [{
    title: String,
    url: String,
    scrapedAt: Date
  }],
  scrapedAt: {
    type: Date,
    default: Date.now
  },
  optimizedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries (url uses `unique: true` on the field, so no separate index needed)
articleSchema.index({ isOptimized: 1 });
articleSchema.index({ originalArticleId: 1 });

// Method to convert to JSON
articleSchema.methods.toJSON = function() {
  const article = this.toObject();
  return article;
};

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
