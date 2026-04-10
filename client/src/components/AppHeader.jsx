import { ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AppHeader = () => {
  const location = useLocation();
  const { client, isAuthenticated, role, logout } = useAuth();
  const showDashboardLink = isAuthenticated && role === 'client';
  const dashboardActive = location.pathname.startsWith('/client');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link className="flex items-center gap-3" to={showDashboardLink ? '/client/dashboard' : '/'}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-xs font-bold tracking-[0.22em] text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)]">
            TK
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-slate-950">TATKAL</p>
            <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">
              {showDashboardLink ? 'Client Dashboard' : 'Platform Studio'}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {showDashboardLink ? (
            <Link
              to="/client/dashboard"
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition ${
                dashboardActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {showDashboardLink ? (
            <>
              <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-right sm:block">
                <p className="text-xs font-medium text-slate-900">{client?.name || 'Client'}</p>
                <p className="text-[11px] text-slate-500">{client?.clientId}</p>
              </div>
              <button className="button-secondary" onClick={logout} type="button">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
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
