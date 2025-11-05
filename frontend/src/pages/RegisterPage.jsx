import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { register } from '../api/userApi.js';
import useAuth from '../hooks/useAuth.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    password: ''
  });
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
      const { user } = await register(formState);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-emerald/12 via-transparent to-accent-indigo/12" />
      <div className="glass-card relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 p-10 shadow-emerald">
        <div className="mb-10 text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-emerald/30 bg-brand-emerald/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-brand-emerald">
            Create account
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Join MessMate&apos;s futuristic mess network</h1>
          <p className="mt-2 text-sm text-neutral-300/70">
            Generate your QR identity and start tracking credits in a glassmorphic dashboard designed for modern campuses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs uppercase tracking-[0.3em] text-neutral-300/60">
              Full name
            </label>
            <input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              className="cyber-input"
              placeholder="Ada Lovelace"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-[0.3em] text-neutral-300/60">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              required
              className="cyber-input"
              placeholder="you@college.edu"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-xs uppercase tracking-[0.3em] text-neutral-300/60">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              required
              className="cyber-input"
              placeholder="(+91) 98765 43210"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="rollNumber" className="text-xs uppercase tracking-[0.3em] text-neutral-300/60">
              Roll number
            </label>
            <input
              id="rollNumber"
              name="rollNumber"
              value={formState.rollNumber}
              onChange={handleChange}
              required
              className="cyber-input"
              placeholder="CS23B042"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="password" className="text-xs uppercase tracking-[0.3em] text-neutral-300/60">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              required
              className="cyber-input"
              placeholder="Create a strong passphrase"
            />
          </div>

          {error && (
            <div className="status-error md:col-span-2">
              {error}
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="cyber-btn w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? 'Generating your badge…' : (
                <span className="inline-flex items-center gap-2">
                  Activate MessMate
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-neutral-300/60">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-emerald transition hover:text-brand-emerald/80">
            Sign in
          </Link>
        </p>
      </div>
      <div className="absolute -top-20 left-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-emerald/20 blur-[160px]" />
      <div className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-accent-purple/15 blur-[180px]" />
    </section>
  );
};

export default RegisterPage;
