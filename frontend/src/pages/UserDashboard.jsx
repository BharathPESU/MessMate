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
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      <section className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Meal credits overview</h2>
          <p className="mt-4 text-5xl font-bold text-messmate-primary">{user.credits}</p>
          <p className="mt-2 text-sm text-slate-500">
            Present this QR code at the mess counter to redeem a meal.
          </p>
          <div className="mt-4 inline-flex items-center gap-6">
            <div>
              <p className="text-xs uppercase text-slate-500">Name</p>
              <p className="text-base font-medium text-slate-700">{user.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Roll</p>
              <p className="text-base font-medium text-slate-700">{user.rollNumber}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <QRGenerator value={user.qrCodeData} label="Your unique QR code" />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-slate-800">Recent transactions</h2>
        {loading ? (
          <Loader message="Loading transactions..." />
        ) : error ? (
          <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No transactions recorded yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {transactions.map((trx) => (
                  <tr key={trx._id}>
                    <td className="px-4 py-3">
                      {new Date(trx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 capitalize">{trx.actionType}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {trx.amount > 0 ? `+${trx.amount}` : trx.amount}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">{trx.balanceAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
