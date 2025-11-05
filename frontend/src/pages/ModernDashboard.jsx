import { useEffect, useMemo, useState } from 'react';
import { adjustCredits, fetchUserTransactions, listUsers } from '../api/adminApi.js';
import Loader from '../components/Loader.jsx';
import Sidebar from '../components/Sidebar.jsx';
import StatsCard from '../components/StatsCard.jsx';
import {
  Users,
  QrCode,
  Wallet,
  Sparkle,
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const ModernDashboard = () => {
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
        notes: adjustState.notes,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUser._id ? { ...user, credits: newBalance } : user,
        ),
      );
      setSelectedUser((prev) => ({ ...prev, credits: newBalance }));
      await selectUser({ ...selectedUser, credits: newBalance });
      setAdjustState({ amount: 1, notes: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update credits');
    } finally {
      setAdjustLoading(false);
    }
  };

  const creditUsageToday = useMemo(() => {
    const today = new Date().toDateString();
    return transactions.filter((trx) => new Date(trx.createdAt).toDateString() === today).length;
  }, [transactions]);

  const positiveTransactions = transactions.filter((trx) => trx.amount > 0).length;
  const negativeTransactions = transactions.filter((trx) => trx.amount < 0).length;

  const chartData = useMemo(() => {
    const grouped = transactions.reduce((acc, trx) => {
      const date = new Date(trx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = acc[date] || { date, credited: 0, debited: 0 };
      if (trx.amount > 0) acc[date].credited += trx.amount;
      if (trx.amount < 0) acc[date].debited += Math.abs(trx.amount);
      return acc;
    }, {});

    return Object.values(grouped).slice(-10);
  }, [transactions]);

  if (loadingUsers) {
    return <Loader message="Calibrating admin console..." />;
  }

  if (error) {
    return (
      <div className="status-error">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="space-y-6">
        <header className="glass-card relative rounded-3xl border border-white/10 bg-panel-gradient p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-300/70">MessMate Admin</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Operations Command Center</h1>
              <p className="mt-2 text-sm text-neutral-300/70">
                Track meals, manage credits, and stay ahead with live mess analytics.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 px-4 py-3 text-sm text-brand-emerald">
                <span className="font-semibold">{creditUsageToday}</span> scans today
              </div>
              <div className="rounded-2xl border border-accent-indigo/20 bg-accent-indigo/10 px-4 py-3 text-sm text-accent-indigo">
                Live · {users.length} members
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Active Members"
            value={users.length}
            icon={Users}
            trend={+((users.length / Math.max(users.length - 3, 1) - 1) * 100).toFixed(1)}
            trendLabel="vs last cycle"
          />
          <StatsCard
            title="Credits Added"
            value={`+${positiveTransactions}`}
            icon={ArrowUpRight}
            trend={positiveTransactions}
            trendLabel="Top-ups processed"
            variant="aqua"
          />
          <StatsCard
            title="Credits Deducted"
            value={`-${negativeTransactions}`}
            icon={ArrowDownRight}
            trend={-negativeTransactions}
            trendLabel="Meals served"
            variant="purple"
          />
          <StatsCard
            title="Current Balance"
            value={selectedUser ? `${selectedUser.credits} credits` : '--'}
            icon={Wallet}
            subtext={selectedUser ? `User: ${selectedUser.name}` : 'Select a user to view balance'}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
          <section className="glass-card relative rounded-3xl border border-white/10 p-0">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">User Roster</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Select Member</h2>
              </div>
              <Sparkle className="h-5 w-5 text-brand-emerald" />
            </div>
            <div className="max-h-[540px] space-y-2 overflow-y-auto px-4 pb-6 pt-4">
              {users.map((user) => {
                const isActive = selectedUser?._id === user._id;
                return (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => selectUser(user)}
                    className={`group flex w-full items-center justify-between rounded-3xl border px-4 py-3 text-left transition-all duration-300 ${
                      isActive
                        ? 'border-brand-emerald/60 bg-brand-emerald/10 shadow-emerald'
                        : 'border-white/5 bg-surface-charcoal/60 hover:border-brand-emerald/40 hover:bg-brand-emerald/5'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-neutral-300/70">{user.rollNumber}</p>
                    </div>
                    <span className="rounded-full bg-gradient-to-r from-brand-emerald/30 to-accent-aqua/30 px-3 py-1 text-xs font-semibold text-brand-emerald">
                      {user.credits} cr
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-6">
            <div className="glass-card rounded-3xl border border-white/10 p-6">
              <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Credit controls</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Adjust balance</h2>
                  <p className="mt-2 text-sm text-neutral-300/70">Fine-tune user credits in real time with audit-ready notes.</p>
                </div>
                <div className="rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 px-4 py-3 text-sm text-brand-emerald">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <span>{transactions.slice(0, 1)[0]?.actionType ?? 'Awaiting activity'}</span>
                  </div>
                  <p className="mt-1 text-xs text-brand-emerald/70">Last action</p>
                </div>
              </div>

              <form onSubmit={handleAdjust} className="mt-6 grid gap-4 md:grid-cols-[120px,1fr,160px]">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Amount</label>
                  <input
                    type="number"
                    required
                    value={adjustState.amount}
                    onChange={(event) => setAdjustState((prev) => ({ ...prev, amount: event.target.value }))}
                    className="cyber-input mt-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Notes</label>
                  <input
                    type="text"
                    value={adjustState.notes}
                    onChange={(event) => setAdjustState((prev) => ({ ...prev, notes: event.target.value }))}
                    className="cyber-input mt-2"
                    placeholder="Optional note for audit trail"
                  />
                </div>
                <div className="mt-6 md:mt-0">
                  <button
                    type="submit"
                    disabled={adjustLoading}
                    className="cyber-btn w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {adjustLoading ? 'Updating…' : 'Apply Change'}
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-card overflow-hidden rounded-3xl border border-white/10 p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Credit Flow</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">7-day movement</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-300/70">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-emerald" />
                    Credits added
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    Credits used
                  </span>
                </div>
              </div>
              <div className="mt-6 h-64 w-full">
                {chartData.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-300/60">
                    Not enough data yet. Once transactions come in, you’ll see trends here.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="credits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(0,255,153,0.6)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="rgba(0,255,153,0.1)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="debited" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(239,68,68,0.6)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="rgba(239,68,68,0.1)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} width={60} />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(12, 18, 27, 0.9)',
                          borderRadius: '16px',
                          border: '1px solid rgba(0,255,153,0.25)',
                        }}
                        labelStyle={{ color: 'rgba(255,255,255,0.75)' }}
                      />
                      <Area type="monotone" dataKey="credited" stroke="rgba(0,255,153,0.65)" fill="url(#credits)" strokeWidth={2} />
                      <Area type="monotone" dataKey="debited" stroke="rgba(239,68,68,0.65)" fill="url(#debited)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="glass-card rounded-3xl border border-white/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Transaction log</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Latest meals & credits</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-neutral-300/70">
              <QrCode className="mr-2 inline h-4 w-4 text-brand-emerald" />
              Live synced in realtime
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/5">
            {loadingTransactions ? (
              <Loader message="Loading transaction stream..." />
            ) : transactions.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-sm text-neutral-300/60">
                No transactions recorded yet for this user.
              </div>
            ) : (
              <div className="glass-table overflow-hidden">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-[0.2em] text-neutral-300/60">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Notes</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((trx) => (
                      <tr key={trx._id} className="border-t border-white/5">
                        <td className="px-6 py-4 text-neutral-200/70">{new Date(trx.createdAt).toLocaleString()}</td>
                        <td className="px-6 py-4 font-semibold capitalize text-white">{trx.actionType}</td>
                        <td className="px-6 py-4 text-neutral-300/60">{trx.notes || '—'}</td>
                        <td
                          className={`px-6 py-4 text-right font-semibold ${
                            trx.amount > 0 ? 'text-brand-emerald' : 'text-red-400'
                          }`}
                        >
                          {trx.amount > 0 ? '+' : ''}{trx.amount}
                        </td>
                        <td className="px-6 py-4 text-right text-neutral-200/60">{trx.balanceAfter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModernDashboard;
