import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, BarChart3, ShieldCheck } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

const features = [
  {
    title: 'Ultra-fast QR identity',
    description: 'Every member gets a dynamic QR card for instant, secure mess entry.',
    Icon: QrCode,
  },
  {
    title: 'Live credit telemetry',
    description: 'Balances update in real time after every scan, fully visible to students.',
    Icon: BarChart3,
  },
  {
    title: 'Admin-grade control',
    description: 'Deduct, top-up, and audit with a single, glassmorphic control surface.',
    Icon: ShieldCheck,
  },
];

const HomePage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-16 py-20 text-center">
      <div className="absolute inset-0 -z-10 m-auto h-[520px] w-[520px] rounded-full bg-brand-emerald/10 blur-[220px]" />
      <div className="relative space-y-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-emerald/25 bg-brand-emerald/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-emerald">
          MessMate 2.0
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
          Premium mess management, engineered for campus-scale operations.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-neutral-300/70 md:text-lg">
          Orchestrate check-ins, monitor credits, and streamline admin tasks with a futuristic dashboard built on emerald neon glass. Designed for fast-moving mess halls and hackathon-grade speed.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {!user && (
            <>
              <Link to="/register" className="cyber-btn">
                Launch Console
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="cyber-btn-outline"
              >
                I already have access
              </Link>
            </>
          )}
          {user && (
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="cyber-btn">
              Continue to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-surface-slate/80 p-6 text-left backdrop-blur-glass transition duration-500 hover:-translate-y-2 hover:border-brand-emerald/40">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/10 via-transparent to-accent-indigo/10 opacity-0 transition duration-500 group-hover:opacity-100" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 text-brand-emerald">
              <feature.Icon className="h-5 w-5" />
            </div>
            <h3 className="relative mt-6 text-lg font-semibold text-white">{feature.title}</h3>
            <p className="relative mt-3 text-sm leading-relaxed text-neutral-300/70">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomePage;
