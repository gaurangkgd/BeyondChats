import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => (
  <AppBar position="static" elevation={0} sx={{ background: 'rgba(255,255,255,0.95)', color: '#031a38', boxShadow: '0 2px 12px #e0e7ff', mb: 2 }}>
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 64 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Georgia, Times, Times New Roman, serif', letterSpacing: 1 }}>
        BeyondChats
      </Typography>
      <Box>
        <Button href="#" sx={{ color: '#031a38', fontWeight: 600, mx: 1 }}>
          Home
        </Button>
        <Button href="#about" sx={{ color: '#031a38', fontWeight: 600, mx: 1 }}>
          About Us
        </Button>
        <Button href="#contact" sx={{ color: '#031a38', fontWeight: 600, mx: 1 }}>
          Contact
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Navbar;
