import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Chip, Box } from '@mui/material';


const ArticleCard = ({ article, onClick }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 24px 0 rgba(80,80,120,0.10)',
      borderRadius: 5,
      background: article.isOptimized
        ? 'linear-gradient(90deg, #e0ffe9 0%, #e0f7fa 100%)'
        : 'linear-gradient(90deg, #f0f4ff 0%, #f0fff4 100%)',
      transition: 'box-shadow 0.3s, transform 0.2s',
      '&:hover': {
        boxShadow: '0 8px 32px 0 rgba(67,233,123,0.18)',
        transform: 'translateY(-4px) scale(1.025)',
      },
    }}
  >
    <CardActionArea onClick={onClick} sx={{ height: '100%', borderRadius: 5 }}>
      {article.imageUrl && (
        <CardMedia
          component="img"
          height="180"
          image={article.imageUrl}
          alt={article.title}
          sx={{ objectFit: 'cover', borderTopLeftRadius: 5, borderTopRightRadius: 5, transition: 'filter 0.3s', filter: 'brightness(0.98)' }}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" fontWeight={800} sx={{ color: '#1a237e', letterSpacing: 0.2 }}>
          {article.title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: '#607d8b', fontWeight: 500 }}>
          {article.description?.slice(0, 100) || 'No description'}
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
          {article.isOptimized && <Chip label="Optimized" size="small" sx={{ background: 'linear-gradient(90deg, #a8ff78 0%, #78ffd6 100%)', color: '#1b5e20', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', borderRadius: 2, px: 1.5, fontSize: '0.85rem', boxShadow: '0 2px 8px #b9f6ca' }} />}
          {article.author && <Chip label={article.author} size="small" sx={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />}
          {article.publishedDate && <Chip label={article.publishedDate} size="small" sx={{ background: '#f1f8e9', color: '#388e3c', fontWeight: 600 }} />}
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default ArticleCard;
