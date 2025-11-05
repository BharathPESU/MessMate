import { Link, NavLink } from 'react-router-dom';
import { LogOut, QrCode, Shield } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="top-0 z-40 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-surface-slate/70 px-6 py-4 backdrop-blur-2xl shadow-inner-glow">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-emerald/30 bg-gradient-to-br from-brand-emerald/20 to-accent-aqua/20 shadow-emerald">
            <span className="text-xl font-semibold text-white">MM</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-300/60">MessMate</p>
            <p className="-mt-1 font-poppins text-lg font-semibold text-white">Smart Mess Control</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          {user && (
            <NavLink
              to={isAdmin ? '/admin' : '/dashboard'}
              className={({ isActive }) =>
                `sidebar-link hidden md:flex rounded-full border border-transparent px-5 py-2.5 ${
                  isActive ? 'active border-brand-emerald/40' : 'hover:border-brand-emerald/30'
                }`
              }
            >
              <Shield className="h-4 w-4" />
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin/scanner"
              className={({ isActive }) =>
                `sidebar-link hidden md:flex rounded-full border border-transparent px-5 py-2.5 ${
                  isActive ? 'active border-brand-emerald/40' : 'hover:border-brand-emerald/30'
                }`
              }
            >
              <QrCode className="h-4 w-4" />
              Scanner
            </NavLink>
          )}
          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `sidebar-link rounded-full border border-transparent px-5 py-2.5 ${
                    isActive ? 'active border-brand-emerald/40' : 'hover:border-brand-emerald/30'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink to="/register" className="cyber-btn hidden text-xs md:inline-flex">
                Join Beta
              </NavLink>
            </>
          )}
          {user && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-200 transition hover:bg-red-400/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
