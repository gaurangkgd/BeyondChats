const axios = require('axios');
const cheerio = require('cheerio');

class GoogleSearcher {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    this.useCustomSearch = this.apiKey && this.searchEngineId;
  }

  /**
   * Search Google using Custom Search API (if configured) or scraping
   */
  async search(query, numResults = 2) {
    if (this.useCustomSearch) {
      return await this.searchWithAPI(query, numResults);
    } else {
      return await this.searchWithScraping(query, numResults);
    }
  }

  /**
   * Google Custom Search API method
   */
  async searchWithAPI(query, numResults) {
    try {
      const url = 'https://www.googleapis.com/customsearch/v1';
      const response = await axios.get(url, {
        params: {
          key: this.apiKey,
          cx: this.searchEngineId,
          q: query,
          num: numResults
        }
      });

      if (!response.data.items) {
        return [];
      }

      return response.data.items.map(item => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet
      }));
    } catch (error) {
      console.error('Google API search error:', error.message);
      // Fallback to scraping if API fails
      return await this.searchWithScraping(query, numResults);
    }
  }

  /**
   * Fallback: Scrape Google search results
   */
  async searchWithScraping(query, numResults) {
    try {
      console.log('   Using Google scraping...');
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const results = [];

      // Parse Google search results
      $('div.g, div[data-sokoban-container]').each((i, elem) => {
        if (results.length >= numResults) return false;

        const $elem = $(elem);
        const linkElem = $elem.find('a[href^="http"]').first();
        const titleElem = $elem.find('h3').first();
        const snippetElem = $elem.find('div[data-sncf], div.VwiC3b, div[style*="-webkit-line-clamp"]').first();

        const url = linkElem.attr('href');
        const title = titleElem.text().trim();
        const snippet = snippetElem.text().trim();

        // Filter out non-article URLs (Google, YouTube, social media)
        if (url && title && !this.isExcludedDomain(url)) {
          results.push({
            title,
            url,
            snippet
          });
        }
      });

      if (results.length === 0) {
        console.log('   Google scraping failed, trying DuckDuckGo...');
        return await this.searchWithDuckDuckGo(query, numResults);
      }

      return results;
    } catch (error) {
      console.error('   Google scraping error:', error.message);
      // Fallback to DuckDuckGo
      return await this.searchWithDuckDuckGo(query, numResults);
    }
  }

  /**
   * DuckDuckGo search (easier to scrape, no captcha)
   */
  async searchWithDuckDuckGo(query, numResults) {
    try {
      console.log('   Using DuckDuckGo search...');
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const results = [];

      // Parse DuckDuckGo results
      $('.result').each((i, elem) => {
        if (results.length >= numResults) return false;

        const $elem = $(elem);
        const linkElem = $elem.find('.result__a').first();
        const snippetElem = $elem.find('.result__snippet').first();

        const url = linkElem.attr('href');
        const title = linkElem.text().trim();
        const snippet = snippetElem.text().trim();

        if (url && title && !this.isExcludedDomain(url)) {
          results.push({
            title,
            url,
            snippet
          });
        }
      });

      console.log(`   Found ${results.length} results from DuckDuckGo`);
      return results;
    } catch (error) {
      console.error('   DuckDuckGo search error:', error.message);
      return [];
    }
  }

  /**
   * Check if URL should be excluded (not a blog/article)
   */
  isExcludedDomain(url) {
    const excludedDomains = [
      'google.com',
      'youtube.com',
      'facebook.com',
      'twitter.com',
      'instagram.com',
      'linkedin.com',
      'pinterest.com',
      'reddit.com',
      'wikipedia.org'
    ];

    return excludedDomains.some(domain => url.includes(domain));
  }

  /**
   * Filter results to only include blog/article pages
   */
  filterArticles(results) {
    const articleKeywords = ['blog', 'article', 'post', 'news', 'guide', 'tutorial'];
    
    return results.filter(result => {
      const urlLower = result.url.toLowerCase();
      return articleKeywords.some(keyword => urlLower.includes(keyword));
    });
  }
}

module.exports = GoogleSearcher;
