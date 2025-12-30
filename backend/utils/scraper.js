const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');

class BeyondChatsScraper {
    // Fetch full content from article detail page
    async fetchFullContent(articleUrl) {
      try {
        const $ = await this.fetchPage(articleUrl);
        if (!$) return { text: '', html: '' };
        // Try common selectors for main content
        let content = '';
        let contentHtml = '';
        const selectors = [
          '.article-content', '.post-content', '.blog-content', '.entry-content',
          'article .content', 'article', '.main-content', '.content', '.post', '.blog-post', '.article-body'
        ];
        for (const sel of selectors) {
          const elem = $(sel).first();
          if (elem.length && elem.text().trim().length > 100) {
            content = elem.text().trim();
            // Fix image sources in HTML
            elem.find('img').each((i, img) => {
              const $img = $(img);
              if ($img.attr('data-src')) $img.attr('src', $img.attr('data-src'));
              if ($img.attr('data-lazy-src')) $img.attr('src', $img.attr('data-lazy-src'));
            });
            contentHtml = elem.html();
            break;
          }
        }
        // Fallback: get all paragraphs
        if (!content) {
          // Fix image sources in fallback too
          $('img').each((i, img) => {
            const $img = $(img);
            if ($img.attr('data-src')) $img.attr('src', $img.attr('data-src'));
            if ($img.attr('data-lazy-src')) $img.attr('src', $img.attr('data-lazy-src'));
          });
          content = $('p').map((i, el) => $(el).text().trim()).get().join('\n\n');
          contentHtml = $('p').map((i, el) => $.html(el)).get().join('');
        }
        return { text: content, html: contentHtml };
      } catch (error) {
        console.error('Error fetching full content:', error.message);
        return { text: '', html: '' };
      }
    }
  constructor() {
    this.baseUrl = process.env.BEYONDCHATS_URL || 'https://beyondchats.com/blogs/';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
  }

  async fetchPage(url) {
    try {
      const response = await axios.get(url, { 
        headers: this.headers,
        timeout: 10000 
      });
      return cheerio.load(response.data);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message);
      return null;
    }
  }

  async findLastPage() {
    try {
      const $ = await this.fetchPage(this.baseUrl);
      if (!$) return 1;

      // Try to find pagination
      const paginationLinks = $('a.page-link, .pagination a, a[href*="page="]');
      let maxPage = 1;

      paginationLinks.each((i, elem) => {
        const href = $(elem).attr('href');
        const text = $(elem).text().trim();
        
        // Try to extract page number from href
        if (href) {
          const pageMatch = href.match(/page=(\d+)/);
          if (pageMatch) {
            maxPage = Math.max(maxPage, parseInt(pageMatch[1]));
          }
        }
        
        // Try to extract from text
        const pageNum = parseInt(text);
        if (!isNaN(pageNum)) {
          maxPage = Math.max(maxPage, pageNum);
        }
      });

      console.log(`📄 Last page found: ${maxPage}`);
      return maxPage;
    } catch (error) {
      console.error('Error finding last page:', error.message);
      return 1;
    }
  }

  extractArticleData($, articleElement) {
    const data = {};

    try {
      // Extract title and URL
      const titleLink = $(articleElement).find('h1 a, h2 a, h3 a, h4 a, a.title, .title a').first();
      if (titleLink.length) {
        data.title = titleLink.text().trim();
        let url = titleLink.attr('href');
        if (url) {
          data.url = url.startsWith('http') ? url : `https://beyondchats.com${url}`;
        }
      } else {
        // Fallback: find any link
        const anyLink = $(articleElement).find('a[href*="blog"], a[href*="article"]').first();
        if (anyLink.length) {
          data.title = anyLink.text().trim() || $(articleElement).find('h1, h2, h3, h4').first().text().trim();
          let url = anyLink.attr('href');
          data.url = url.startsWith('http') ? url : `https://beyondchats.com${url}`;
        }
      }

      // Extract author
      const authorElem = $(articleElement).find('.author, [class*="author"], .by-line, [class*="byline"]').first();
      if (authorElem.length) {
        data.author = authorElem.text().trim().replace(/^by\s+/i, '');
      }

      // Extract date
      const dateElem = $(articleElement).find('time, .date, [class*="date"], [class*="publish"]').first();
      if (dateElem.length) {
        data.publishedDate = dateElem.text().trim() || dateElem.attr('datetime');
      }

      // Extract description
      const descElem = $(articleElement).find('p, .excerpt, .description, [class*="excerpt"]').first();
      if (descElem.length) {
        data.description = descElem.text().trim();
      }

      // Extract image
      const imgElem = $(articleElement).find('img').first();
      if (imgElem.length) {
        let imgUrl = imgElem.attr('src') || imgElem.attr('data-src') || imgElem.attr('data-lazy-src');
        if (imgUrl && !imgUrl.startsWith('http')) {
          imgUrl = `https://beyondchats.com${imgUrl}`;
        }
        data.imageUrl = imgUrl;
      }

    } catch (error) {
      console.error('Error extracting article data:', error.message);
    }

    return data;
  }

  async scrapeLastPage(numArticles = 5) {
    try {
      console.log('🚀 Starting BeyondChats scraper...');
      
      const lastPage = await this.findLastPage();
      const lastPageUrl = lastPage > 1 ? `${this.baseUrl}?page=${lastPage}` : this.baseUrl;
      
      console.log(`📡 Fetching articles from: ${lastPageUrl}`);
      
      const $ = await this.fetchPage(lastPageUrl);
      if (!$) {
        throw new Error('Failed to load page');
      }

      // Try multiple selectors for articles
      let articles = $('article').toArray();
      if (articles.length === 0) {
        articles = $('.blog-post, .post, .article-item, .card').toArray();
      }
      if (articles.length === 0) {
        articles = $('[class*="blog"], [class*="post"], [class*="article"]').toArray();
      }

      console.log(`✅ Found ${articles.length} article elements`);

      const scrapedArticles = [];
      for (let i = 0; i < Math.min(articles.length, numArticles); i++) {
        const articleData = this.extractArticleData($, articles[i]);
        if (articleData.title && articleData.url) {
          // Fetch full content from detail page (both text and html)
          const contentObj = await this.fetchFullContent(articleData.url);
          articleData.content = contentObj.text;
          articleData.contentHtml = contentObj.html;
          scrapedArticles.push(articleData);
        }
      }

      console.log(`📚 Successfully scraped ${scrapedArticles.length} articles`);
      return scrapedArticles;

    } catch (error) {
      console.error('❌ Scraping error:', error.message);
      throw error;
    }
  }

  async saveToDatabase(articles) {
    let savedCount = 0;
    let skippedCount = 0;

    for (const articleData of articles) {
      try {
        // Check if article already exists
        const existing = await Article.findOne({ url: articleData.url });
        if (existing) {
          console.log(`⏭️  Skipped (already exists): ${articleData.title}`);
          skippedCount++;
          continue;
        }

        // Create new article
        const article = new Article({
          title: articleData.title,
          url: articleData.url,
          author: articleData.author || '',
          publishedDate: articleData.publishedDate || '',
          description: articleData.description || '',
          imageUrl: articleData.imageUrl || '',
          content: articleData.content || '',
          contentHtml: articleData.contentHtml || '',
          isOptimized: false
        });

        await article.save();
        savedCount++;
        console.log(`✅ Saved: ${article.title}`);

      } catch (error) {
        console.error(`❌ Error saving article:`, error.message);
      }
    }

    return { saved: savedCount, skipped: skippedCount };
  }
}

module.exports = BeyondChatsScraper;
