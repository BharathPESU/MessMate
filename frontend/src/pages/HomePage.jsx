import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const HomePage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 py-16 text-center">
      <div className="space-y-4">
        <span className="rounded-full bg-messmate-secondary/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-messmate-primary">Smart Mess Management</span>
        <h1 className="text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
          Manage meal credits seamlessly with MessMate
        </h1>
        <p className="text-lg text-slate-500 md:text-xl">
          QR-powered check-ins, instant balance updates, and a streamlined experience for students and mess admins.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        {!user && (
          <>
            <Link
              to="/register"
              className="rounded-lg bg-messmate-primary px-5 py-3 font-medium text-white shadow hover:bg-messmate-secondary"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-messmate-primary px-5 py-3 font-medium text-messmate-primary hover:border-messmate-secondary hover:text-messmate-secondary"
            >
              I already have an account
            </Link>
          </>
        )}
        {user && (
          <Link
            to={isAdmin ? '/admin' : '/dashboard'}
            className="rounded-lg bg-messmate-primary px-5 py-3 font-medium text-white shadow hover:bg-messmate-secondary"
          >
            Go to dashboard
          </Link>
        )}
      </div>
      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg md:grid-cols-3">
        {[
          {
            title: 'QR identity',
            description: 'Every student receives a secure QR code for faster mess access.'
          },
          {
            title: 'Live credit tracking',
            description: 'Balances update instantly after every scan and are visible to students.'
          },
          {
            title: 'Admin controls',
            description: 'Scan, deduct, and recharge credits with an intuitive control center.'
          }
        ].map((feature) => (
          <div key={feature.title} className="space-y-2 text-left">
            <h3 className="text-lg font-semibold text-slate-800">{feature.title}</h3>
            <p className="text-sm text-slate-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
