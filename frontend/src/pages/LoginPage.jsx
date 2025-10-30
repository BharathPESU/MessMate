import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/userApi.js';
import useAuth from '../hooks/useAuth.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user } = await login(formState);
      setUser(user);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-slate-800">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-500">
        Sign in to manage your meal credits.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-600">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formState.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-messmate-secondary focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-600">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formState.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-messmate-secondary focus:outline-none focus:ring"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-messmate-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-messmate-secondary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{' '}
        <Link to="/register" className="text-messmate-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
