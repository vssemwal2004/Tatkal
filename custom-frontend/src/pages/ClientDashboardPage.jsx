import { Link } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';

const ClientDashboardPage = () => {
  const { client } = useAuth();

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.28em] text-aurora-300">Client Dashboard</p>
          <h1 className="mt-4 font-display text-5xl font-bold text-white">
            Welcome back, {client?.name || 'Client'}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            This is your builder entry point. Start a new platform design or track the project you already submitted.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link className="tatkal-shell rounded-[32px] p-8 transition hover:-translate-y-1" to="/design-entry">
            <p className="text-xs uppercase tracking-[0.24em] text-flame-400">Primary Action</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-white">Design New Platform</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Launch the guided configuration builder for travel or event booking products.
            </p>
          </Link>

          <Link className="tatkal-shell rounded-[32px] p-8 transition hover:-translate-y-1" to="/track">
            <p className="text-xs uppercase tracking-[0.24em] text-aurora-300">Project Status</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-white">Track My Project</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Review submission status, config summary, and upcoming admin updates in one place.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboardPage;
