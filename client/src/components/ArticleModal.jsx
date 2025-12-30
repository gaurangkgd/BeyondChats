import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Box, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Modern gradient backgrounds and animation helpers
const gradientBg = 'linear-gradient(135deg, #e0e7ff 0%, #f0fff4 100%)';
const optimizedGradient = 'linear-gradient(90deg, #a8ff78 0%, #78ffd6 100%)';
const fadeIn = {
  animation: 'fadeInModal 0.7s cubic-bezier(0.4,0,0.2,1)'
};

// Add keyframes for fade-in animation
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes fadeInModal {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
`;
if (!document.head.querySelector('#modal-fadein-keyframes')) {
  styleSheet.id = 'modal-fadein-keyframes';
  document.head.appendChild(styleSheet);
}

// Helper to wrap icon row in a div for styling
function postProcessIconRow(html) {
  // Try to find the icon row by common patterns (e.g., a row of social icons)
  // This is a simple heuristic: look for a row of 5+ inline SVGs or images in a single <div>
  // Remove icon row divs (social icons) and any svg/img inside them
  let cleaned = html.replace(/<div[^>]*class=["']?icon-row["']?[^>]*>[\s\S]*?<\/div>/gi, '');
  // Remove any leftover svg or img social icons (if not inside icon-row)
  cleaned = cleaned.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
  cleaned = cleaned.replace(/<img[^>]*src=[^>]*social[^>]*>/gi, '');
  // Remove any div with a style containing background (the black box), even if empty, with a single child, or just text
  cleaned = cleaned.replace(/<div[^>]*style=[^>]*background[^>]*>[\s\S]*?<\/div>/gi, '');
  // Remove any div with only a single child, only whitespace, or only a text node (including &nbsp;)
  cleaned = cleaned.replace(/<div[^>]*>\s*(<[^>]+>\s*)*(&nbsp;|\s|\.|,|!|\?|:|;)*<\/div>/gi, '');
  // Remove any div or span containing only a number (e.g., 97)
  cleaned = cleaned.replace(/<div[^>]*>\s*\d+\s*<\/div>/gi, '');
  cleaned = cleaned.replace(/<span[^>]*>\s*\d+\s*<\/span>/gi, '');
    // Convert markdown headings (##, ###, etc.) to styled divs for better UI
    cleaned = cleaned.replace(/(^|\n)(#+)\s*(.*)/g, (match, p1, p2, p3) => {
      if (p3.trim()) {
        const level = p2.length;
        let fontSize = '1.5rem';
        let color = '#388e3c';
        let margin = '32px 0 12px 0';
        if (level === 3) { fontSize = '1.2rem'; margin = '24px 0 8px 0'; }
        if (level > 3) { fontSize = '1rem'; margin = '16px 0 6px 0'; }
        return `${p1}<div style="font-weight:700;font-size:${fontSize};color:${color};margin:${margin};line-height:1.3;">${p3.trim()}</div>`;
      }
      return '';
    });
  return cleaned;
}

// Helper: Convert plain text with hashtags, **bold**, *italic*, images, and lists to HTML
function formatArticleContent(text) {
  if (!text) return '';
  let html = text;
  // Remove hashtags from the main text, but collect them
  const hashtags = [...html.matchAll(/#(\w+)/g)].map(m => m[1]);
  // Remove hashtags at start of line, after whitespace, after punctuation, or at end of line
  html = html.replace(/(^|\s|[.,;:!?()\[\]{}"'\n])#\w+\b/g, '$1');
  // Remove hashtags that are the only thing on a line
  html = html.replace(/^#\w+\b$/gm, '');
  // Remove any extra spaces left by hashtag removal
  html = html.replace(/ +/g, ' ').replace(/\n +/g, '\n').trim();
  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  // Italic (*text* or _text_)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  // Images ![alt](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" style="max-width:100%;margin:16px 0;border-radius:6px;box-shadow:0 2px 12px #b3e5fc;" />');
  // Unordered lists: lines starting with - or *
  html = html.replace(/(?:^|\n)([-*]) (.*?)(?=\n[-* ]|\n\n|$)/gs, (match, bullet, item) => `<ul><li>${item.trim()}</li></ul>`);
  // Ordered lists: lines starting with 1. 2. etc.
  html = html.replace(/(?:^|\n)(\d+)\. (.*?)(?=\n\d+\. |\n\n|$)/gs, (match, num, item) => `<ol><li>${item.trim()}</li></ol>`);
  // Paragraphs: double newlines to <p>
  html = html.replace(/\n{2,}/g, '</p><p>');
  html = `<p>${html}</p>`;
  // Remove empty <p></p>
  html = html.replace(/<p>\s*<\/p>/g, '');
  return { html, hashtags };
}

// Strip leading markdown hash markers (e.g., '## Heading') from any text nodes inside HTML
function stripLeadingHashMarkers(html) {
  if (!html) return html;
  try {
    const container = document.createElement('div');
    container.innerHTML = html;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    let node = walker.nextNode();
    while (node) {
      // Remove leading hashes at start of text node or after newline
      node.nodeValue = node.nodeValue.replace(/(^|\n)\s*#{1,6}\s*/g, '$1');
      node = walker.nextNode();
    }
    return container.innerHTML;
  } catch (e) {
    return html;
  }
}

const ArticleModal = ({ article, onClose }) => {
  if (!article) return null;
  // Process the HTML to add icon-row class if needed
  let processedHtml = article.contentHtml ? postProcessIconRow(article.contentHtml) : null;
  // Remove any leading markdown hash markers from processed HTML text nodes
  if (processedHtml) processedHtml = stripLeadingHashMarkers(processedHtml);
  // If no HTML, format the plain content
  let formatted = null;
  if (!processedHtml && article.content) {
    formatted = formatArticleContent(article.content);
    // ensure formatted HTML also has no leading markdown hash markers
    if (formatted && formatted.html) formatted.html = stripLeadingHashMarkers(formatted.html);
  }
  return (
    <Dialog open={!!article} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(120deg, #e0e7ff 0%, #f0fff4 100%, #e0fff7 100%)',
          boxShadow: '0 8px 40px 0 rgba(80,80,120,0.18)',
          borderRadius: 6,
          overflow: 'visible',
          ...fadeIn,
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 0,
          background: 'linear-gradient(90deg, #f0fff4 0%, #e0e7ff 100%)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: '0 2px 12px 0 rgba(80,200,120,0.06)',
          minHeight: 72,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 0.2, color: '#1a237e', textShadow: '0 2px 8px #e3f2fd' }}>
            {article.title}
          </Typography>
          {article.isOptimized && (
            <Chip label="Optimized" size="small"
              sx={{
                fontWeight: 700,
                ml: 1,
                background: optimizedGradient,
                color: '#1b5e20',
                boxShadow: '0 2px 8px #b9f6ca',
                letterSpacing: 1,
                textTransform: 'uppercase',
                borderRadius: 2,
                px: 1.5,
                fontSize: '0.95rem',
              }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} sx={{
          color: '#1a237e',
          transition: 'color 0.2s',
          '&:hover': { color: '#43a047', background: '#e8f5e9' },
        }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 3, px: 4 }}>
        {processedHtml ? (
          <Box
            sx={{
              borderRadius: 5,
              boxShadow: '0 4px 24px 0 rgba(80,80,120,0.10)',
              border: article.isOptimized
                ? '2.5px solid #43a047'
                : '2.5px solid #1a237e22',
              background: article.isOptimized
                ? 'linear-gradient(90deg, #e0ffe9 0%, #e0f7fa 100%)'
                : 'linear-gradient(90deg, #f0f4ff 0%, #f0fff4 100%)',
              p: 4,
              mb: 2,
              mt: 1,
              transition: 'box-shadow 0.3s, border 0.3s',
              '&:hover': {
                boxShadow: article.isOptimized
                  ? '0 8px 32px 0 rgba(67,233,123,0.18)'
                  : '0 8px 32px 0 rgba(80,80,120,0.13)',
                borderColor: article.isOptimized ? '#1b5e20' : '#1a237e44',
              },
              '& img, & svg': {
                maxWidth: '100%',
                maxHeight: 400,
                height: 'auto',
                width: 'auto',
                borderRadius: 3,
                my: 2,
                boxShadow: '0 2px 12px #b3e5fc',
                transition: 'box-shadow 0.3s',
                '&:hover': { boxShadow: '0 6px 24px #4fc3f7' },
              },
              '& h1, & h2, & h3, & h4': {
                fontWeight: 800,
                mt: 3,
                mb: 1,
                color: article.isOptimized ? '#1b5e20' : '#1a237e',
                letterSpacing: 0.5,
                textShadow: '0 2px 8px #e3f2fd',
                transition: 'color 0.2s',
              },
              '& p': { mb: 2, lineHeight: 1.7, color: '#263238', fontSize: '1.08rem' },
              '& ul, & ol': { pl: 3, mb: 2, color: '#263238' },
              '& strong, & b': { fontWeight: 700, color: '#1a237e' },
              '& em, & i': { fontStyle: 'italic', color: '#388e3c' },
              '& blockquote': {
                fontStyle: 'italic',
                borderLeft: '4px solid #b2dfdb',
                pl: 2,
                color: '#607d8b',
                my: 2,
                background: 'linear-gradient(90deg, #e0f7fa 0%, #f1f8e9 100%)',
                borderRadius: 2,
                fontSize: '1.05rem',
              },
              '& code': {
                fontFamily: 'monospace',
                background: '#f5f5f5',
                px: 0.7,
                borderRadius: 1.5,
                color: '#1a237e',
                fontSize: '0.98em',
              },
              '& a': {
                color: '#1976d2',
                textDecoration: 'underline',
                fontWeight: 600,
                transition: 'color 0.2s',
                '&:hover': { color: '#43a047', textDecoration: 'underline wavy' },
              },
              '& .icon-row': { display: 'none' },
            }}
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        ) : formatted ? (
          <>
            <Box
              sx={{
                borderRadius: 5,
                boxShadow: '0 4px 24px 0 rgba(80,80,120,0.10)',
                border: article.isOptimized
                  ? '2.5px solid #43a047'
                  : '2.5px solid #1a237e22',
                background: article.isOptimized
                  ? 'linear-gradient(90deg, #e0ffe9 0%, #e0f7fa 100%)'
                  : 'linear-gradient(90deg, #f0f4ff 0%, #f0fff4 100%)',
                p: 4,
                mb: 2,
                mt: 1,
                transition: 'box-shadow 0.3s, border 0.3s',
                '&:hover': {
                  boxShadow: article.isOptimized
                    ? '0 8px 32px 0 rgba(67,233,123,0.18)'
                    : '0 8px 32px 0 rgba(80,80,120,0.13)',
                  borderColor: article.isOptimized ? '#1b5e20' : '#1a237e44',
                },
                '& img, & svg': {
                  maxWidth: '100%',
                  maxHeight: 400,
                  height: 'auto',
                  width: 'auto',
                  borderRadius: 3,
                  my: 2,
                  boxShadow: '0 2px 12px #b3e5fc',
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: '0 6px 24px #4fc3f7' },
                },
                '& ul, & ol': { pl: 3, mb: 2, color: '#263238' },
                '& strong, & b': { fontWeight: 700, color: '#1a237e' },
                '& em, & i': { fontStyle: 'italic', color: '#388e3c' },
              }}
              dangerouslySetInnerHTML={{ __html: formatted.html }}
            />
            {formatted.hashtags && formatted.hashtags.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formatted.hashtags.map(tag => (
                  <Chip key={tag} label={`#${tag}`} size="small" sx={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />
                ))}
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No content available.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;