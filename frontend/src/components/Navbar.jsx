import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="bg-messmate-primary text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-semibold">MessMate</Link>
        <nav className="flex items-center gap-4 text-sm">
          {user && (
            <NavLink
              to={isAdmin ? '/admin' : '/dashboard'}
              className={({ isActive }) =>
                `rounded px-3 py-1 transition ${isActive ? 'bg-white text-messmate-primary' : 'hover:bg-messmate-secondary/80'}`
              }
            >
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin/scanner"
              className={({ isActive }) =>
                `rounded px-3 py-1 transition ${isActive ? 'bg-white text-messmate-primary' : 'hover:bg-messmate-secondary/80'}`
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
                  `rounded px-3 py-1 transition ${isActive ? 'bg-white text-messmate-primary' : 'hover:bg-messmate-secondary/80'}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded px-3 py-1 transition ${isActive ? 'bg-white text-messmate-primary' : 'hover:bg-messmate-secondary/80'}`
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
              className="rounded bg-white px-3 py-1 text-messmate-primary transition hover:bg-slate-100"
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
