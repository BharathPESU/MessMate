import { useEffect, useState } from 'react';
import { adjustCredits, fetchUserTransactions, listUsers } from '../api/adminApi.js';
import Loader from '../components/Loader.jsx';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState('');
  const [adjustState, setAdjustState] = useState({ amount: 1, notes: '' });
  const [adjustLoading, setAdjustLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { users: data } = await listUsers();
        setUsers(data);
        if (data.length > 0) {
          selectUser(data[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const selectUser = async (user) => {
    setSelectedUser(user);
    setTransactions([]);
    if (!user) return;
    setLoadingTransactions(true);
    try {
      const { transactions: data } = await fetchUserTransactions(user._id);
      setTransactions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleAdjust = async (event) => {
    event.preventDefault();
    if (!selectedUser) return;

    setAdjustLoading(true);
    setError('');

    try {
      const { newBalance } = await adjustCredits({
        userId: selectedUser._id,
        amount: Number(adjustState.amount),
        notes: adjustState.notes
      });

      setUsers((prev) => prev.map((user) =>
        user._id === selectedUser._id ? { ...user, credits: newBalance } : user
      ));
      setSelectedUser((prev) => ({ ...prev, credits: newBalance }));
      await selectUser({ ...selectedUser, credits: newBalance });
      setAdjustState({ amount: 1, notes: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update credits');
    } finally {
      setAdjustLoading(false);
    }
  };

  if (loadingUsers) {
    return <Loader message="Loading mess overview..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 py-8 lg:grid-cols-3">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow lg:col-span-1">
        <h2 className="text-lg font-semibold text-slate-800">Users</h2>
        <p className="mt-1 text-sm text-slate-500">Select a user to manage credits.</p>
        <ul className="mt-4 space-y-2">
          {users.map((user) => (
            <li key={user._id}>
              <button
                type="button"
                onClick={() => selectUser(user)}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm shadow-sm transition ${
                  selectedUser?._id === user._id
                    ? 'border-messmate-secondary bg-messmate-secondary/10 text-messmate-primary'
                    : 'border-slate-200 bg-white hover:border-messmate-secondary/70'
                }`}
              >
                <span>
                  <span className="block font-medium text-slate-700">{user.name}</span>
                  <span className="text-xs text-slate-500">{user.rollNumber}</span>
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  {user.credits}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow lg:col-span-2">
        {selectedUser ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{selectedUser.name}</h2>
                <p className="text-sm text-slate-500">Credits balance: {selectedUser.credits}</p>
              </div>
            </div>

            <form onSubmit={handleAdjust} className="grid gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4 md:grid-cols-4">
              <div className="md:col-span-1">
                <label className="text-xs font-medium uppercase text-slate-500">Amount</label>
                <input
                  type="number"
                  required
                  value={adjustState.amount}
                  onChange={(event) => setAdjustState((prev) => ({ ...prev, amount: event.target.value }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-messmate-secondary focus:outline-none focus:ring"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium uppercase text-slate-500">Notes</label>
                <input
                  type="text"
                  value={adjustState.notes}
                  onChange={(event) => setAdjustState((prev) => ({ ...prev, notes: event.target.value }))}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-messmate-secondary focus:outline-none focus:ring"
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="w-full rounded bg-messmate-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-messmate-secondary disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {adjustLoading ? 'Updating...' : 'Apply'}
                </button>
              </div>
            </form>

            <div>
              <h3 className="text-sm font-semibold uppercase text-slate-500">Recent activity</h3>
              {loadingTransactions ? (
                <Loader message="Fetching transaction history..." />
              ) : transactions.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">No transactions recorded for this user.</p>
              ) : (
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-100">
                  <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3">Notes</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                      {transactions.map((trx) => (
                        <tr key={trx._id}>
                          <td className="px-4 py-3">{new Date(trx.createdAt).toLocaleString()}</td>
                          <td className="px-4 py-3 capitalize">{trx.actionType}</td>
                          <td className="px-4 py-3 text-slate-500">{trx.notes || '-'}</td>
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
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">Select a user to view details.</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
