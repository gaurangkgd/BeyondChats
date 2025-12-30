import React from 'react';
import { Box, Grid, CircularProgress } from '@mui/material';
import AdBox from './AdBox';
import ArticleCard from './ArticleCard';

const ArticlesGrid = ({ loading, articles, onOpenArticle }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: { xs: 1, md: 4 } }}>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <AdBox />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Grid container spacing={4} justifyContent="center">
          {articles.map(article => (
            <Grid item key={article._id} xs={12} sm={8} md={6} lg={6} xl={5}>
              <ArticleCard article={article} onClick={() => onOpenArticle(article)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <AdBox />
      </Box>
    </Box>
  );
};

export default ArticlesGrid;
