import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = () => (
  <Box sx={{ mb: 2, position: 'relative' }}>
    <Typography
      variant="h3"
      align="center"
      fontWeight={500}
      gutterBottom
      sx={{
        fontFamily: 'Georgia, serif',
        background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: { xs: '2.2rem', md: '3rem' }
      }}
    >
      BeyondChats Articles
    </Typography>

    <Typography align="center" sx={{ color: '#388e3c', mb: 3, fontWeight: 500 }}>
      Discover insights, trends, and expert opinions in AI & chatbots.
    </Typography>
  </Box>
);

export default Header;
