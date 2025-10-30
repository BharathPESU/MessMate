import apiClient from './apiClient.js';

export const scanAndDeduct = async (payload) => {
  const { data } = await apiClient.post('/admin/scan', payload);
  return data;
};

export const listUsers = async () => {
  const { data } = await apiClient.get('/admin/users');
  return data;
};

export const adjustCredits = async (payload) => {
  const { data } = await apiClient.put('/admin/credits', payload);
  return data;
};

export const fetchUserTransactions = async (userId) => {
  const { data } = await apiClient.get(`/admin/transactions/${userId}`);
  return data;
};
