import { useEffect, useMemo, useState } from 'react';
import { fetchTransactions } from '../api/userApi.js';
import useAuth from '../hooks/useAuth.js';
import Loader from '../components/Loader.jsx';
import QRGenerator from '../components/QRGenerator.jsx';
import StatsCard from '../components/StatsCard.jsx';
import { ArrowDownRight, ArrowUpRight, CalendarDays, Sparkles } from 'lucide-react';

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

  const creditsAdded = useMemo(() => transactions.filter((trx) => trx.amount > 0).length, [transactions]);
  const creditsUsed = useMemo(() => transactions.filter((trx) => trx.amount < 0).length, [transactions]);
  const lastTransaction = transactions[0];

  if (!user) {
    return <Loader message="Fetching your account..." />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-10">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-panel-gradient p-6 text-left shadow-inner-glow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-300/60">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{user.name.split(' ')[0]}, you&apos;re ready to check in.</h1>
            <p className="mt-2 text-sm text-neutral-300/70">Present your neon badge to redeem meals instantly. MessMate keeps your credits synced in real time.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-brand-emerald/25 bg-brand-emerald/10 px-4 py-3 text-sm text-brand-emerald">
              <ArrowUpRight className="mr-2 inline h-4 w-4" />
              {creditsAdded} top-ups
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-300/70">
              <Sparkles className="mr-2 inline h-4 w-4 text-brand-emerald" />
              {transactions.length} total scans
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="glass-card relative overflow-hidden rounded-3xl border border-white/10 p-8">
          <div className="absolute right-8 top-8 rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-brand-emerald">
            Active balance
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <div className="text-left">
              <h2 className="text-sm uppercase tracking-[0.35em] text-neutral-300/60">Meal credits</h2>
              <div className="mt-6 flex items-baseline gap-3">
                <p className="text-6xl font-semibold text-white md:text-7xl">{user.credits}</p>
                <span className="text-sm uppercase tracking-[0.3em] text-neutral-300/50">Credits</span>
              </div>
              <p className="mt-6 text-sm text-neutral-300/70">
                Present this badge to redeem meals. You can top up anytime from the admin console.
              </p>
              <div className="mt-8 grid gap-4 text-sm md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-neutral-300/60">Name</p>
                  <p className="mt-3 text-base text-white">{user.name}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-neutral-300/60">Roll</p>
                  <p className="mt-3 text-base text-white">{user.rollNumber}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <QRGenerator value={user.qrCodeData} label="Neon access pass" />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <StatsCard
            title="Total transactions"
            value={transactions.length}
            trend={transactions.length ? Math.min(creditsAdded - creditsUsed, 99) : 0}
            trendLabel="Overall activity"
            icon={CalendarDays}
          />
          <StatsCard
            title="Credits added"
            value={`+${creditsAdded}`}
            trend={creditsAdded}
            trendLabel="Top-ups tracked"
            icon={ArrowUpRight}
            variant="aqua"
          />
          <StatsCard
            title="Credits used"
            value={`-${creditsUsed}`}
            trend={-creditsUsed}
            trendLabel="Meals redeemed"
            icon={ArrowDownRight}
            variant="purple"
          />
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-white/10 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent transactions</h2>
            <p className="text-sm text-neutral-300/60">Live synced history of all credit activity tied to your badge.</p>
          </div>
          {lastTransaction && (
            <div className="rounded-full border border-brand-emerald/30 bg-brand-emerald/10 px-4 py-2 text-xs text-brand-emerald">
              Last activity · {new Date(lastTransaction.createdAt).toLocaleString()}
            </div>
          )}
        </div>
        {loading ? (
          <Loader message="Loading transactions..." />
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
        ) : transactions.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-300/60">No transactions yet</p>
        ) : (
          <div className="mt-6 space-y-3">
            {transactions.slice(0, 5).map((trx) => (
              <div
                key={trx._id}
                className="flex items-center justify-between rounded-3xl border border-white/5 bg-surface-steel/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-emerald/40 hover:bg-brand-emerald/5"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                      trx.amount > 0
                        ? 'border-brand-emerald/60 bg-brand-emerald/15 text-brand-emerald'
                        : 'border-red-400/60 bg-red-500/15 text-red-300'
                    }`}
                  >
                    {trx.amount > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-semibold capitalize text-white">{trx.actionType}</p>
                    <p className="mt-1 text-xs text-neutral-300/60">
                      {new Date(trx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      trx.amount > 0 ? 'text-brand-emerald' : 'text-red-400'
                    }`}
                  >
                    {trx.amount > 0 ? '+' : ''}
                    {trx.amount}
                  </p>
                  <p className="mt-1 text-xs text-neutral-300/60">Balance: {trx.balanceAfter}</p>
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
