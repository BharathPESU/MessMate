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
    <section className="relative flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-emerald/10 via-transparent to-accent-indigo/10" />
      <div className="glass-card relative z-10 w-full max-w-lg rounded-3xl border border-white/10 p-10 shadow-emerald">
        <div className="mb-8 text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-emerald/30 bg-brand-emerald/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-brand-emerald">
            Secure access
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-white">Welcome back to MessMate</h1>
          <p className="mt-2 text-sm text-neutral-300/70">
            Sign in with your email and password to manage credits or scan meals from the futuristic mess console.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
            <label htmlFor="email" className="text-xs uppercase tracking-[0.3em] text-neutral-300/60">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formState.email}
              onChange={handleChange}
              className="cyber-input"
              placeholder="you@college.edu"
            />
          </div>

          <div className="space-y-2 text-left">
            <label htmlFor="password" className="text-xs uppercase tracking-[0.3em] text-neutral-300/60">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formState.password}
              onChange={handleChange}
              className="cyber-input"
              placeholder="Enter your secret passcode"
            />
          </div>

          {error && (
            <div className="status-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cyber-btn w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Signing you in…' : 'Access MessMate'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-300/60">
          New here?{' '}
          <Link to="/register" className="text-brand-emerald transition hover:text-brand-emerald/80">
            Create an account
          </Link>
        </p>
      </div>
      <div className="absolute -right-24 hidden h-80 w-80 rounded-full bg-brand-emerald/20 blur-[160px] md:block" />
      <div className="absolute -left-24 bottom-0 hidden h-80 w-80 rounded-full bg-accent-indigo/20 blur-[160px] md:block" />
    </section>
  );
};

export default LoginPage;
