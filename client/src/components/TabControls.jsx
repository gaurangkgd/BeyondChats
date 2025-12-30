import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const TabControls = ({ tab, onChange }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
    <Tabs
      value={tab}
      onChange={onChange}
      centered
      TabIndicatorProps={{
        style: {
          background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
          height: 4
        }
      }}
    >
      <Tab label="Original Articles" />
      <Tab label="Optimized Articles" />
    </Tabs>
  </Box>
);

export default TabControls;
