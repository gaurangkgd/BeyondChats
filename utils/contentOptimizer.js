const OpenAI = require('openai');

class ContentOptimizer {
  constructor() {
    // Initialize Groq API (compatible with OpenAI SDK)
    this.openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    });
    // Groq models: llama-3.3-70b-versatile, llama-3.1-70b-versatile, mixtral-8x7b-32768, gemma2-9b-it
    this.model = 'llama-3.3-70b-versatile'; // Fast and high quality
  }

  /**
   * Optimize article content based on reference articles
   */
  async optimizeContent(originalArticle, referenceArticles) {
    try {
      console.log(`🤖 Optimizing: ${originalArticle.title}`);

      const prompt = this.buildPrompt(originalArticle, referenceArticles);
      
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert content writer and SEO specialist. Your task is to optimize articles to match the style, formatting, and quality of top-ranking articles while maintaining accuracy and originality.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      });

      const optimizedContent = response.choices[0].message.content.trim();
      
      console.log(`✅ Optimization complete`);
      
      return optimizedContent;

    } catch (error) {
      console.error('❌ OpenAI API error:', error.message);
      throw error;
    }
  }

  /**
   * Build prompt for LLM
   */
  buildPrompt(originalArticle, referenceArticles) {
    const refContents = referenceArticles.map((ref, idx) => {
      return `
### Reference Article ${idx + 1}: ${ref.title}
URL: ${ref.url}

Content Preview:
${ref.content.substring(0, 2000)}...
`;
    }).join('\n\n---\n');

    return `
# Task: Optimize Article Content

## Original Article
**Title:** ${originalArticle.title}
**Description:** ${originalArticle.description || 'No description'}

**Original Content:**
${originalArticle.content || originalArticle.description || 'No content available'}

---

## Top-Ranking Reference Articles

${refContents}

---

## Instructions

Analyze the reference articles and optimize the original article to:

1. **Match the formatting style** of top-ranking articles (headings, structure, paragraphs)
2. **Improve content quality** by incorporating insights from reference articles
3. **Maintain SEO best practices** (keywords, readability, structure)
4. **Keep the core message** of the original article
5. **Add proper sections** like Introduction, Main Points, Conclusion
6. **Use clear headings** (H2, H3) similar to reference articles
7. **Keep it engaging** and easy to read

**Output Requirements:**
- Write a complete, well-structured article
- Use markdown formatting (##, ###, **bold**, etc.)
- Length: 800-1500 words
- Professional and informative tone
- Include an engaging introduction and conclusion
- Do NOT include meta information, just the article content

Generate the optimized article now:
`;
  }

  /**
   * Test API connection
   */
  async testConnection() {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: 'Say "API Connected"' }],
        max_tokens: 10
      });
      
      console.log('✅ Groq API connected successfully');
      return true;
    } catch (error) {
      console.error('❌ OpenAI API connection failed:', error.message);
      return false;
    }
  }
}

module.exports = ContentOptimizer;
