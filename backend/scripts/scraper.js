require('dotenv').config();
const mongoose = require('mongoose');
const BeyondChatsScraper = require('../utils/scraper');
const connectDB = require('../config/db');

async function runScraper() {
  try {
    // Connect to database
    await connectDB();

    // Create scraper instance
    const scraper = new BeyondChatsScraper();

    // Scrape articles
    console.log('\n=== Starting Web Scraping ===\n');
    const articles = await scraper.scrapeLastPage(5);

    if (articles.length === 0) {
      console.log('⚠️  No articles found to scrape');
      process.exit(0);
    }

    console.log(`\n📋 Scraped ${articles.length} articles:`);
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
    });

    // Save to database
    console.log('\n💾 Saving to database...');
    const result = await scraper.saveToDatabase(articles);

    console.log(`\n✨ Scraping Complete!`);
    console.log(`   - Saved: ${result.saved} new articles`);
    console.log(`   - Skipped: ${result.skipped} duplicates\n`);

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Scraper failed:', error.message);
    process.exit(1);
  }
}

// Run the scraper
runScraper();
