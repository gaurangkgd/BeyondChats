const axios = require('axios');
const cheerio = require('cheerio');

class ArticleScraper {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    };
  }

  /**
   * Scrape main content from an article URL
   */
  async scrapeArticle(url) {
    try {
      console.log(`📄 Scraping: ${url}`);

      const response = await axios.get(url, {
        headers: this.headers,
        timeout: 15000,
        maxRedirects: 5
      });

      const $ = cheerio.load(response.data);

      // Remove unwanted elements
      $('script, style, nav, header, footer, aside, .advertisement, .ads, .social-share, .comments').remove();

      const article = {
        url,
        title: this.extractTitle($),
        content: this.extractContent($),
        author: this.extractAuthor($),
        publishedDate: this.extractDate($),
        scrapedAt: new Date()
      };

      console.log(`✅ Scraped: ${article.title.substring(0, 50)}...`);
      return article;

    } catch (error) {
      console.error(`❌ Error scraping ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Extract article title
   */
  extractTitle($) {
    const selectors = [
      'h1',
      'article h1',
      '.article-title',
      '.post-title',
      '[class*="title"]',
      'meta[property="og:title"]',
      'title'
    ];

    for (const selector of selectors) {
      const elem = $(selector).first();
      if (elem.length) {
        const title = selector.includes('meta') 
          ? elem.attr('content') 
          : elem.text().trim();
        if (title && title.length > 10) {
          return title;
        }
      }
    }

    return 'Untitled Article';
  }

  /**
   * Extract main article content
   */
  extractContent($) {
    const contentSelectors = [
      'article',
      '[class*="article-content"]',
      '[class*="post-content"]',
      '[class*="entry-content"]',
      '[class*="main-content"]',
      '.content',
      'main',
      '[role="main"]'
    ];

    let content = '';

    // Try each selector
    for (const selector of contentSelectors) {
      const elem = $(selector).first();
      if (elem.length) {
        // Get all paragraphs within the content area
        const paragraphs = elem.find('p').map((i, el) => {
          return $(el).text().trim();
        }).get();

        content = paragraphs.join('\n\n');
        
        if (content.length > 200) {
          break;
        }
      }
    }

    // Fallback: Get all paragraphs
    if (content.length < 200) {
      content = $('p').map((i, el) => $(el).text().trim())
        .get()
        .filter(p => p.length > 50)
        .join('\n\n');
    }

    // Clean up content
    content = this.cleanContent(content);

    return content;
  }

  /**
   * Extract author name
   */
  extractAuthor($) {
    const selectors = [
      '[class*="author"] a',
      '[class*="author"]',
      '[rel="author"]',
      '.by-line',
      '[class*="byline"]',
      'meta[name="author"]',
      'meta[property="article:author"]'
    ];

    for (const selector of selectors) {
      const elem = $(selector).first();
      if (elem.length) {
        const author = selector.includes('meta') 
          ? elem.attr('content') 
          : elem.text().trim();
        if (author && author.length > 2 && author.length < 100) {
          return author.replace(/^by\s+/i, '');
        }
      }
    }

    return '';
  }

  /**
   * Extract publication date
   */
  extractDate($) {
    const selectors = [
      'time[datetime]',
      '[class*="date"]',
      '[class*="published"]',
      'meta[property="article:published_time"]',
      'meta[name="date"]'
    ];

    for (const selector of selectors) {
      const elem = $(selector).first();
      if (elem.length) {
        const date = elem.attr('datetime') || elem.attr('content') || elem.text().trim();
        if (date) {
          return date;
        }
      }
    }

    return '';
  }

  /**
   * Clean and normalize content
   */
  cleanContent(content) {
    return content
      .replace(/\s+/g, ' ')           // Multiple spaces to single
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double
      .replace(/\t/g, ' ')             // Tabs to spaces
      .trim();
  }

  /**
   * Scrape multiple articles
   */
  async scrapeMultiple(urls) {
    const results = [];
    
    for (const url of urls) {
      const article = await this.scrapeArticle(url);
      if (article && article.content.length > 200) {
        results.push(article);
      }
      
      // Small delay to be respectful
      await this.delay(1000);
    }

    return results;
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = ArticleScraper;
