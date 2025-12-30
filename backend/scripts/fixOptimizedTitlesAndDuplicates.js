// fixOptimizedTitlesAndDuplicates.js
const mongoose = require('mongoose');
const Article = require('./models/Article');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beyondchats');

  // 1. Fix titles: remove duplicate (Optimized)
  const articles = await Article.find({ isOptimized: true });
  let fixedTitles = 0;
  for (const article of articles) {
    // Remove all (Optimized) and add only one at the end
    const baseTitle = article.title.replace(/(\s*\(Optimized\))+$/i, '');
    const newTitle = baseTitle + ' (Optimized)';
    if (article.title !== newTitle) {
      article.title = newTitle;
      await article.save();
      fixedTitles++;
    }
  }

  // 2. Remove duplicate optimized articles (keep latest by createdAt)
  const allOptimized = await Article.find({ isOptimized: true }).sort({ createdAt: -1 });
  const seen = new Set();
  let removed = 0;
  for (const article of allOptimized) {
    // Use base title (without (Optimized)) as key
    const baseTitle = article.title.replace(/\s*\(Optimized\)$/i, '').trim();
    if (seen.has(baseTitle)) {
      await Article.deleteOne({ _id: article._id });
      removed++;
    } else {
      seen.add(baseTitle);
    }
  }

  console.log(`Fixed titles: ${fixedTitles}`);
  console.log(`Removed duplicate optimized articles: ${removed}`);
  await mongoose.disconnect();
}

run();
