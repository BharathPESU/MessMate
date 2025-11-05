import { useEffect, useState } from 'react';
import { adjustCredits, fetchUserTransactions, listUsers } from '../api/adminApi.js';
import Loader from '../components/Loader.jsx';

const LegacyDashboard = () => {
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
      <div className="status-error">
        {error}
      </div>
    );
  }

  return (
    <div className="relative grid gap-6 py-8 lg:grid-cols-3">
      <section className="glass-card neon-border rounded-3xl p-6 shadow-cyber lg:col-span-1 animate-float">
        <h2 className="text-xl font-semibold font-orbitron text-neon-green">Users</h2>
        <p className="mt-2 text-sm text-neon-light/70 font-rajdhani tracking-wide">Select a user to manage credits.</p>
        <ul className="mt-6 space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {users.map((user) => (
            <li key={user._id}>
              <button
                type="button"
                onClick={() => selectUser(user)}
                className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left text-sm transition-all duration-300 ${
                  selectedUser?._id === user._id
                    ? 'border-neon-green bg-neon-green/10 shadow-neon'
                    : 'glass-dark border-neon-green/20 hover:border-neon-green/50 hover:bg-white/10'
                }`}
              >
                <span>
                  <span className="block font-medium font-rajdhani text-neon-light">{user.name}</span>
                  <span className="text-xs text-neon-cyan/70 font-rajdhani mt-1">{user.rollNumber}</span>
                </span>
                <span className="rounded-full bg-gradient-to-br from-neon-emerald to-neon-cyan px-3 py-1 text-xs font-bold font-orbitron text-cyber-black shadow-neon">
                  {user.credits}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass-card neon-border space-y-6 rounded-3xl p-8 shadow-cyber lg:col-span-2">
        {selectedUser ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold font-orbitron neon-glow">{selectedUser.name}</h2>
                <p className="text-sm text-neon-cyan/70 font-rajdhani tracking-wide mt-1">Credits balance: {selectedUser.credits}</p>
              </div>
            </div>

            <form onSubmit={handleAdjust} className="grid gap-4 glass-dark rounded-xl border border-neon-green/20 p-6 md:grid-cols-4">
              <div className="md:col-span-1">
                <label className="text-xs font-medium uppercase font-rajdhani tracking-wider text-neon-cyan">Amount</label>
                <input
                  type="number"
                  required
                  value={adjustState.amount}
                  onChange={(event) => setAdjustState((prev) => ({ ...prev, amount: event.target.value }))}
                  className="cyber-input mt-2 w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium uppercase font-rajdhani tracking-wider text-neon-cyan">Notes</label>
                <input
                  type="text"
                  value={adjustState.notes}
                  onChange={(event) => setAdjustState((prev) => ({ ...prev, notes: event.target.value }))}
                  className="cyber-input mt-2 w-full"
                  placeholder="Optional notes"
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="cyber-btn w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adjustLoading ? 'Updating...' : 'Apply'}
                </button>
              </div>
            </form>

            <div>
              <h3 className="text-sm font-semibold uppercase font-rajdhani tracking-wider text-neon-green">Recent activity</h3>
              {loadingTransactions ? (
                <Loader message="Fetching transaction history..." />
              ) : transactions.length === 0 ? (
                <p className="mt-4 text-sm text-neon-light/50 font-rajdhani">No transactions recorded for this user.</p>
              ) : (
                <div className="mt-4 overflow-hidden rounded-xl border border-neon-green/20">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neon-green/10 text-sm">
                      <thead className="glass-dark text-left text-xs uppercase font-rajdhani tracking-wider text-neon-cyan">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Action</th>
                          <th className="px-4 py-3">Notes</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                          <th className="px-4 py-3 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neon-green/10 bg-cyber-black/30 text-neon-light font-rajdhani">
                        {transactions.map((trx) => (
                          <tr key={trx._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-xs">{new Date(trx.createdAt).toLocaleString()}</td>
                            <td className="px-4 py-3 capitalize">{trx.actionType}</td>
                            <td className="px-4 py-3 text-neon-light/60">{trx.notes || '-'}</td>
                            <td className={`px-4 py-3 text-right font-bold font-orbitron ${trx.amount > 0 ? 'text-neon-green' : 'text-red-400'}`}>
                              {trx.amount > 0 ? `+${trx.amount}` : trx.amount}
                            </td>
                            <td className="px-4 py-3 text-right text-neon-cyan/70">{trx.balanceAfter}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-neon-light/50 font-rajdhani">Select a user to view details.</p>
        )}
      </section>
    </div>
  );
};

export default LegacyDashboard;
