import Footer from './components/Footer';
import Navbar from './components/Navbar';
import React, { useState, useEffect } from 'react';
import { Container, Box, CssBaseline } from '@mui/material';

import Header from './components/Header';
import TabControls from './components/TabControls';
import ArticlesGrid from './components/ArticlesGrid';
import ArticleModal from './components/ArticleModal';
import api from './api';
import './App.css';

function App() {
  const [tab, setTab] = useState(0);
  const [originalArticles, setOriginalArticles] = useState([]);
  const [optimizedArticles, setOptimizedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [orig, opt] = await Promise.all([
          api.fetchArticles(false),
          api.fetchArticles(true)
        ]);
        setOriginalArticles(orig);
        setOptimizedArticles(opt);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleTabChange = (_, newValue) => setTab(newValue);
  const handleOpenArticle = article => setSelectedArticle(article);
  const handleCloseArticle = () => setSelectedArticle(null);

  const articlesToShow =
    tab === 0
      ? originalArticles.filter(
          a => !a.isOptimized && !/(optimized)/i.test(a.title)
        )
      : optimizedArticles.filter(a => a.isOptimized);

  return (
    <>
      <CssBaseline />
      <Navbar />

      {/* Background */}
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          background:
            'linear-gradient(135deg, #e0e7ff 0%, #f0fff4 60%, #e0fff7 100%)',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: -1
        }}
      />

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Header />

        {/* Tabs */}
        <TabControls tab={tab} onChange={handleTabChange} />

        {/* Articles / Content */}
        <ArticlesGrid loading={loading} articles={articlesToShow} onOpenArticle={handleOpenArticle} />

        {/* Modal */}
        <ArticleModal
          open={Boolean(selectedArticle)}
          article={selectedArticle}
          onClose={handleCloseArticle}
        />
      </Container>
      <Footer />
    </>
  );
}

export default App;
