import { ArrowRight, LayoutDashboard, LogOut, Waypoints } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Builder', to: '/client/builder-entry', match: '/client' },
  { icon: Waypoints, label: 'Track', to: '/client/track', match: '/client/track' }
];

const AppHeader = () => {
  const location = useLocation();
  const { client, isAuthenticated, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link className="flex items-center gap-3" to="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-aurora-400/30 bg-aurora-500/10 text-xs font-bold tracking-[0.22em] text-aurora-300">
            TK
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-white">TATKAL</p>
            <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">Client Studio</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {isAuthenticated && role === 'client'
            ? navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.match);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                      isActive
                        ? 'border-aurora-400/40 bg-aurora-500/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })
            : null}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated && role === 'client' ? (
            <>
              <div className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right sm:block">
                <p className="text-xs font-medium text-white">{client?.name || 'Client'}</p>
                <p className="text-[11px] text-slate-500">{client?.clientId}</p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
                onClick={logout}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="button-primary">
              <span>Login</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
