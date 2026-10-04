import axios from 'axios';

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://alwarfurniture.in/api';
};

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for auth token if needed
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const storageString = localStorage.getItem('alwar-auth-storage');
    if (storageString) {
      try {
        const authData = JSON.parse(storageString);
        const token = authData?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to parse auth token', e);
      }
    }
  }
  return config;
});
