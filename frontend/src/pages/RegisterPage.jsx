import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-slate-800">Create your MessMate account</h1>
      <p className="mt-2 text-sm text-slate-500">
        Keep track of your credits and access your QR code instantly.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-1">
          <label htmlFor="name" className="block text-sm font-medium text-slate-600">Name</label>
          <input
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-messmate-secondary focus:outline-none focus:ring"
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="email" className="block text-sm font-medium text-slate-600">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-messmate-secondary focus:outline-none focus:ring"
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="phone" className="block text-sm font-medium text-slate-600">Phone</label>
          <input
            id="phone"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-messmate-secondary focus:outline-none focus:ring"
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="rollNumber" className="block text-sm font-medium text-slate-600">Roll Number</label>
          <input
            id="rollNumber"
            name="rollNumber"
            value={formState.rollNumber}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-messmate-secondary focus:outline-none focus:ring"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="password" className="block text-sm font-medium text-slate-600">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-messmate-secondary focus:outline-none focus:ring"
          />
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-500">{error}</p>}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-messmate-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-messmate-secondary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="text-messmate-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
