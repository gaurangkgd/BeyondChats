import React from 'react';
import { Box, Typography, Link, Button, Grid } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => (
  <Box sx={{
    background: '#031a38',
    color: '#bfc9db',
    pt: 6,
    pb: 2,
    px: { xs: 2, md: 8 },
    width: '100vw',
    position: 'relative',
    left: 0,
    boxSizing: 'border-box',
  }}>
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} md={2}>
        <Typography fontWeight={700} sx={{ color: '#fff', mb: 2 }}>BEYONDCHATS</Typography>
        <Box>
          <Link href="#" underline="none" color="inherit" display="block" sx={{ mb: 1 }}>Why BeyondChats</Link>
          <Link href="#" underline="none" color="inherit" display="block" sx={{ mb: 1 }}>About Us</Link>
          <Link href="#" underline="none" color="inherit" display="block">Contact Us</Link>
        </Box>
      </Grid>
      <Grid item xs={12} md={2}>
        <Typography fontWeight={700} sx={{ color: '#bfc9db', mb: 2 }}>PRODUCTS</Typography>
        <Box>
          <Link href="#" underline="none" color="inherit" display="block" sx={{ mb: 1 }}>Pricing</Link>
          <Link href="#" underline="none" color="inherit" display="block" sx={{ mb: 1 }}>Features</Link>
          <Link href="#" underline="none" color="inherit" display="block">Integrations</Link>
        </Box>
      </Grid>
      <Grid item xs={12} md={2}>
        <Typography fontWeight={700} sx={{ color: '#bfc9db', mb: 2 }}>RESOURCES</Typography>
        <Box>
          <Link href="#" underline="none" color="inherit" display="block" sx={{ mb: 1 }}>Blogs</Link>
          <Link href="#" underline="none" color="inherit" display="block" sx={{ mb: 1 }}>Case studies</Link>
          <Link href="#" underline="none" color="inherit" display="block" sx={{ mb: 1 }}>Success stories</Link>
          <Link href="#" underline="none" color="inherit" display="block">FAQs</Link>
        </Box>
      </Grid>
      <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
        <Button variant="contained" sx={{ mb: 2, background: '#fff', color: '#031a38', fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px #0a2540' }}>
          Start your free trial
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkedInIcon fontSize="small" />
            <Link href="#" underline="none" color="inherit">LinkedIn</Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InstagramIcon fontSize="small" />
            <Link href="#" underline="none" color="inherit">Instagram</Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TwitterIcon fontSize="small" />
            <Link href="#" underline="none" color="inherit">Twitter</Link>
          </Box>
        </Box>
      </Grid>
    </Grid>
    <Box sx={{ borderTop: '1px solid #22304a', mt: 5, pt: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, md: 0 } }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: '#031a38', fontWeight: 900, fontSize: 28, lineHeight: 1 }}>
            
          </Typography>
        </Box>
        <Typography sx={{ color: '#bfc9db', ml: 1 }}>
          BeyondChats 2025. All rights reserved.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-end' } }}>
        <Link href="#" underline="none" color="inherit">Data Security & Privacy Policy</Link>
        <Link href="#" underline="none" color="inherit">Terms and Conditions</Link>
        <Link href="#" underline="none" color="inherit">Refund Policy</Link>
      </Box>
    </Box>
  </Box>
);

export default Footer;
