import axios from 'axios';

// Get base URL for the API
const getApiUrl = () => {
  return 'https://occupied-mighty-excerpt-promote.trycloudflare.com';
};

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const state = localStorage.getItem('alwar-auth-storage');
    if (state) {
      try {
        const parsedState = JSON.parse(state);
        const token = parsedState?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Error parsing auth state:', e);
      }
    }
  }
  return config;
});
