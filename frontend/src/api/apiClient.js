import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('messmate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('messmate_token', token);
  } else {
    localStorage.removeItem('messmate_token');
  }
};

export default apiClient;
