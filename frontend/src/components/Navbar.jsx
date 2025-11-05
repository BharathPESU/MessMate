import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="glass-dark sticky top-0 z-50 shadow-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-messmate-primary to-messmate-secondary shadow-lg">
            <span className="text-xl font-bold text-white">M</span>
          </div>
          <span className="text-xl font-bold text-white">MessMate</span>
        </Link>
        <nav className="flex items-center gap-3">
          {user && (
            <NavLink
              to={isAdmin ? '/admin' : '/dashboard'}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-messmate-primary shadow-lg'
                    : 'text-white/80 hover:bg-white/10'
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin/scanner"
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-messmate-primary shadow-lg'
                    : 'text-white/80 hover:bg-white/10'
                }`
              }
            >
              Scanner
            </NavLink>
          )}
          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-messmate-primary shadow-lg'
                      : 'text-white/80 hover:bg-white/10'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-messmate-primary shadow-lg'
                      : 'bg-gradient-to-r from-messmate-primary to-messmate-secondary text-white shadow-lg hover:shadow-xl'
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
          {user && (
            <button
              type="button"
              onClick={logout}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
