require('dotenv').config();
const axios = require('axios');
const GoogleSearcher = require('../utils/googleSearch');
const ArticleScraper = require('../utils/articleScraper');
const ContentOptimizer = require('../utils/contentOptimizer');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

class ContentOptimizerPipeline {
  constructor() {
    this.googleSearcher = new GoogleSearcher();
    this.articleScraper = new ArticleScraper();
    this.contentOptimizer = new ContentOptimizer();
  }

  /**
   * Main pipeline: Fetch, Search, Scrape, Optimize, Publish
   */
  async optimizeArticle(articleId) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🚀 Starting Optimization Pipeline`);
      console.log(`${'='.repeat(60)}\n`);

      // Step 1: Fetch original article from API
      console.log('📥 Step 1: Fetching original article...');
      const originalArticle = await this.fetchArticle(articleId);
      console.log(`✅ Fetched: ${originalArticle.title}\n`);

      // Step 2: Search Google for article title
      console.log('🔍 Step 2: Searching Google...');
      const searchResults = await this.googleSearcher.search(originalArticle.title, 5);
      
      if (searchResults.length === 0) {
        throw new Error('No Google search results found');
      }
      
      console.log(`✅ Found ${searchResults.length} search results`);
      searchResults.forEach((result, idx) => {
        console.log(`   ${idx + 1}. ${result.title.substring(0, 60)}...`);
      });
      console.log('');

      // Step 3: Scrape content from top 2 results
      console.log('📄 Step 3: Scraping reference articles...');
      const topUrls = searchResults.slice(0, 2).map(r => r.url);
      const referenceArticles = await this.articleScraper.scrapeMultiple(topUrls);
      
      if (referenceArticles.length === 0) {
        throw new Error('Failed to scrape reference articles');
      }
      
      console.log(`✅ Scraped ${referenceArticles.length} reference articles\n`);

      // Step 4: Optimize content with LLM
      console.log('🤖 Step 4: Optimizing content with AI...');
      const optimizedContent = await this.contentOptimizer.optimizeContent(
        originalArticle,
        referenceArticles
      );
      console.log(`✅ Content optimized (${optimizedContent.length} characters)\n`);

      // Step 5: Add citations
      console.log('📚 Step 5: Adding citations...');
      const contentWithCitations = this.addCitations(optimizedContent, referenceArticles);
      console.log(`✅ Citations added\n`);

      // Step 6: Publish optimized article
      console.log('📤 Step 6: Publishing optimized article...');
      const newArticle = await this.publishOptimizedArticle(
        originalArticle,
        contentWithCitations,
        referenceArticles
      );
      console.log(`✅ Published: ${newArticle._id}\n`);

      console.log(`${'='.repeat(60)}`);
      console.log(`✨ Optimization Complete!`);
      console.log(`${'='.repeat(60)}\n`);

      return newArticle;

    } catch (error) {
      console.error('\n❌ Optimization failed:', error.message);
      throw error;
    }
  }

  /**
   * Optimize all non-optimized articles
   */
  async optimizeAll() {
    try {
      console.log('\n🌟 Starting Batch Optimization\n');

      // Fetch all original articles (not optimized)
      const response = await axios.get(`${API_BASE_URL}/api/articles`, {
        params: { isOptimized: 'false', limit: 100 }
      });

      const articles = response.data.data;
      
      if (articles.length === 0) {
        console.log('ℹ️  No articles to optimize');
        return;
      }

      console.log(`📚 Found ${articles.length} articles to optimize\n`);

      const results = {
        success: [],
        failed: []
      };

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        console.log(`\n[${i + 1}/${articles.length}] Processing: ${article.title}`);
        
        try {
          const optimized = await this.optimizeArticle(article._id);
          results.success.push({ id: article._id, title: article.title });
          
          // Delay between articles to avoid rate limits
          if (i < articles.length - 1) {
            console.log('\n⏳ Waiting 5 seconds before next article...\n');
            await this.delay(5000);
          }
        } catch (error) {
          console.error(`❌ Failed: ${error.message}`);
          results.failed.push({ id: article._id, title: article.title, error: error.message });
        }
      }

      // Summary
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📊 Batch Optimization Summary`);
      console.log(`${'='.repeat(60)}`);
      console.log(`✅ Successful: ${results.success.length}`);
      console.log(`❌ Failed: ${results.failed.length}`);
      console.log(`${'='.repeat(60)}\n`);

      return results;

    } catch (error) {
      console.error('❌ Batch optimization failed:', error.message);
      throw error;
    }
  }

  /**
   * Fetch article from API
   */
  async fetchArticle(articleId) {
    const response = await axios.get(`${API_BASE_URL}/api/articles/${articleId}`);
    return response.data.data;
  }

  /**
   * Add citations to content
   */
  addCitations(content, references) {
    const citations = `

---

## References

This article was optimized based on insights from the following sources:

${references.map((ref, idx) => `
${idx + 1}. **${ref.title}**  
   ${ref.url}  
   ${ref.author ? `Author: ${ref.author}` : ''}  
   ${ref.publishedDate ? `Published: ${ref.publishedDate}` : ''}
`).join('\n')}

---

*This content has been enhanced and optimized for better readability and SEO performance.*
`;

    return content + citations;
  }

  /**
   * Publish optimized article via API
   */
  async publishOptimizedArticle(originalArticle, optimizedContent, references) {
    const payload = {
      title: `${originalArticle.title} (Optimized)`,
      url: `${originalArticle.url}-optimized`,
      author: originalArticle.author,
      publishedDate: originalArticle.publishedDate,
      description: originalArticle.description,
      content: optimizedContent,
      imageUrl: originalArticle.imageUrl,
      isOptimized: true,
      originalArticleId: originalArticle._id,
      references: references.map(ref => ({
        title: ref.title,
        url: ref.url,
        scrapedAt: ref.scrapedAt
      }))
    };

    const response = await axios.post(`${API_BASE_URL}/api/articles`, payload);
    return response.data.data;
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const pipeline = new ContentOptimizerPipeline();

  if (args.length === 0) {
    // Optimize all articles
    console.log('🔄 Mode: Optimize All Articles');
    await pipeline.optimizeAll();
  } else {
    // Optimize specific article by ID
    const articleId = args[0];
    console.log(`🔄 Mode: Optimize Single Article (${articleId})`);
    await pipeline.optimizeArticle(articleId);
  }

  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = ContentOptimizerPipeline;
