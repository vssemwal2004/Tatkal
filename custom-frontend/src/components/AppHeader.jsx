import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [{ label: 'Track My Project', to: '/track' }];

const AppHeader = () => {
  const location = useLocation();
  const { isAuthenticated, client, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link className="flex items-center gap-3" to="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-aurora-400/30 bg-aurora-500/10 text-sm font-bold text-aurora-300">
            TK
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-wide text-white">TATKAL</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Client Builder Suite</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 sm:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <Link
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? 'bg-white/12 text-white'
                    : 'text-slate-300 hover:bg-white/6 hover:text-white'
                }`}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <>
              <Link
                className={`rounded-full px-4 py-2 text-sm transition ${
                  location.pathname === '/dashboard'
                    ? 'bg-white/12 text-white'
                    : 'text-slate-300 hover:bg-white/6 hover:text-white'
                }`}
                to="/dashboard"
              >
                Client Panel
              </Link>
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
                {client?.name}
              </span>
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/6 hover:text-white"
                onClick={logout}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
              <Link
                className={`rounded-full px-4 py-2 text-sm transition ${
                  location.pathname === '/login' || location.pathname === '/register'
                  ? 'bg-white/12 text-white'
                  : 'text-slate-300 hover:bg-white/6 hover:text-white'
              }`}
              to="/login"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
