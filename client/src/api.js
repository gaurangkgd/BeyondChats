import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const fetchArticles = async (isOptimized = false) => {
  const res = await axios.get(`${API_BASE_URL}/articles`, {
    params: { isOptimized: String(isOptimized), limit: 100 }
  });
  return res.data.data;
};

export const fetchArticleById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/articles/${id}`);
  return res.data.data;
};

export default {
  fetchArticles,
  fetchArticleById
};
