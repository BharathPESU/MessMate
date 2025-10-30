import { useEffect, useMemo, useState } from 'react';
import { fetchProfile, logout as logoutApi } from '../api/userApi.js';
import AuthContext from './AuthContext.js';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('messmate_token');
    if (!token) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const { user: profile } = await fetchProfile();
        setUser(profile);
      } catch (error) {
        console.warn('Failed to load profile', error);
        logoutApi();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const value = useMemo(() => ({
    user,
    isAdmin: user?.role === 'admin',
    loading,
    setUser,
    logout: () => {
      logoutApi();
      setUser(null);
    }
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
