import React from 'react';
import { Box, Typography } from '@mui/material';

const AdBox = ({ text = 'Your ad here' }) => (
  <Box
    sx={{
      width: 180,
      minHeight: 380,
      background: 'linear-gradient(135deg, #e3eafe 0%, #e6fff6 100%)',
      borderRadius: 32,
      boxShadow: '0 4px 32px 0 rgba(80,120,200,0.10)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      pt: 4,
      pb: 2,
      mx: 'auto',
      my: 2,
    }}
  >
    <Typography variant="h6" sx={{ color: '#388e3c', fontWeight: 700, mb: 2 }}>
      Ad
    </Typography>
    <Typography variant="body1" sx={{ color: '#1976d2', fontWeight: 400 }}>
      {text}
    </Typography>
  </Box>
);

export default AdBox;
