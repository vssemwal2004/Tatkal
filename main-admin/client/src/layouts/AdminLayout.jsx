import { LogOut, Menu } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const getPageMeta = (pathname) => {
  if (pathname.startsWith('/requests/')) {
    return {
      title: 'Request Details',
      description: 'Inspect the full UI configuration, approve requests, and simulate deployment.'
    };
  }

  const pageMap = {
    '/': {
      title: 'Dashboard',
      description: 'Monitor client onboarding, incoming design requests, and deployment progress.'
    },
    '/requests': {
      title: 'Requests',
      description: 'Review pending builder submissions and move them through approval.'
    },
    '/management': {
      title: 'Management',
      description: 'Track every SaaS client, current status, and deployment readiness.'
    },
    '/deployments': {
      title: 'Deployments',
      description: 'Audit simulated launches and assigned system types across clients.'
    },
    '/settings': {
      title: 'Settings',
      description: 'Keep environment setup, admin access, and deployment rules aligned.'
    }
  };

  return pageMap[pathname] || pageMap['/'];
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageMeta = useMemo(() => getPageMeta(location.pathname), [location.pathname]);

  return (
    <div className="min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="px-4 py-5 sm:px-6 md:ml-32 md:px-6 lg:ml-36">
        <header className="glass-card mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-4 sm:p-5">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Admin Panel</p>
                <h1 className="text-xl font-semibold text-slate-100">{pageMeta.title}</h1>
              </div>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">{pageMeta.description}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:border-red-400/40 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout ({user?.email})</span>
            <span className="sm:hidden">Logout</span>
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
