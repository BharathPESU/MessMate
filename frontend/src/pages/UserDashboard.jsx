import { useEffect, useState } from 'react';
import { fetchTransactions } from '../api/userApi.js';
import useAuth from '../hooks/useAuth.js';
import Loader from '../components/Loader.jsx';
import QRGenerator from '../components/QRGenerator.jsx';

const UserDashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const { transactions: data } = await fetchTransactions();
        setTransactions(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (!user) {
    return <Loader message="Fetching your account..." />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Hi {user.name.split(' ')[0]},</h1>
        <p className="mt-1 text-lg text-white/70">Have a great day</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Credits Card */}
        <div className="glass-dark rounded-3xl p-6 shadow-2xl lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-white/90">Meal Credits</h2>
              <div className="mt-6 flex items-baseline gap-2">
                <p className="text-6xl font-bold text-white">{user.credits}</p>
                <span className="text-xl text-white/60">credits</span>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Present your QR code at the mess counter to redeem meals
              </p>
              <div className="mt-6 flex gap-4">
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-white/50">Name</p>
                  <p className="mt-1 font-medium text-white">{user.name}</p>
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-white/50">Roll</p>
                  <p className="mt-1 font-medium text-white">{user.rollNumber}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <QRGenerator value={user.qrCodeData} label="Your QR Code" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-dark rounded-3xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white/90">Account Stats</h3>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-gradient-to-br from-messmate-primary to-messmate-secondary p-4">
              <p className="text-sm text-white/80">Total Transactions</p>
              <p className="mt-1 text-3xl font-bold text-white">{transactions.length}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-sm text-white/60">Member Since</p>
              <p className="mt-1 text-sm font-medium text-white">
                {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="glass-dark rounded-3xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white/90">Recent Transactions</h2>
        {loading ? (
          <Loader message="Loading transactions..." />
        ) : error ? (
          <div className="mt-4 rounded-xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>
        ) : transactions.length === 0 ? (
          <p className="mt-4 text-sm text-white/50">No transactions yet</p>
        ) : (
          <div className="mt-4 space-y-2">
            {transactions.slice(0, 5).map((trx) => (
              <div
                key={trx._id}
                className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    trx.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <span className="text-lg">{trx.amount > 0 ? '↑' : '↓'}</span>
                  </div>
                  <div>
                    <p className="font-medium capitalize text-white">{trx.actionType}</p>
                    <p className="text-xs text-white/50">
                      {new Date(trx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    trx.amount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trx.amount > 0 ? '+' : ''}{trx.amount}
                  </p>
                  <p className="text-xs text-white/50">Balance: {trx.balanceAfter}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
