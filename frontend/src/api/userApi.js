import apiClient, { setAuthToken } from './apiClient.js';

export const register = async (payload) => {
  const { data } = await apiClient.post('/users/register', payload);
  setAuthToken(data.token);
  return data;
};

export const login = async (payload) => {
  const { data } = await apiClient.post('/users/login', payload);
  setAuthToken(data.token);
  return data;
};

export const fetchProfile = async () => {
  const { data } = await apiClient.get('/users/profile');
  return data;
};

export const fetchTransactions = async () => {
  const { data } = await apiClient.get('/users/transactions');
  return data;
};

export const logout = () => {
  setAuthToken(null);
};
