import { Activity, BriefcaseBusiness, FileStack, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import RequestCard from '../components/RequestCard';
import StatCard from '../components/StatCard';
import { fetchDashboardStats } from '../services/requestService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalRequests: 0,
    deployedProjects: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const statsData = await fetchDashboardStats();
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError(err.response?.data?.message || 'Unable to load dashboard data right now.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <section className="space-y-6 fade-rise">
      <PageHeader
        eyebrow="Mission Control"
        title="TATKAL SaaS Control Center"
        description="Keep client onboarding moving from request review to approved deployment with a compact admin workflow."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={loading ? '...' : stats.totalClients}
          caption="Businesses managed from the platform"
          accent="from-sky-500 to-cyan-400"
          icon={BriefcaseBusiness}
        />
        <StatCard
          title="Total Requests"
          value={loading ? '...' : stats.totalRequests}
          caption="Stored design requests across all clients"
          accent="from-brand-500 to-cyan-400"
          icon={FileStack}
        />
        <StatCard
          title="Pending Requests"
          value={loading ? '...' : stats.pendingRequests}
          caption="Submissions that still need review"
          accent="from-amber-500 to-orange-400"
          icon={Activity}
        />
        <StatCard
          title="Deployed Projects"
          value={loading ? '...' : stats.deployedProjects}
          caption="Client systems already deployed"
          accent="from-emerald-500 to-teal-400"
          icon={Rocket}
        />
      </div>

      {error ? <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-300" />
            <h3 className="text-lg font-semibold text-slate-100">Request Pipeline</h3>
          </div>
          <p className="mt-2 text-sm text-slate-400">A quick read on the queue from pending review through approved rollout.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Pending Review</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? '...' : stats.pendingRequests}</p>
              <p className="mt-2 text-sm text-slate-500">Waiting for approval inside the admin queue.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Approved Queue</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? '...' : stats.approvedRequests}</p>
              <p className="mt-2 text-sm text-slate-500">Ready for deployment and credential generation.</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-12 gap-2">
            {[24, 32, 45, 36, 54, 60, 50, 72, 66, 82, 74, 90].map((height, index) => (
              <div key={index} className="col-span-1 flex items-end">
                <div
                  style={{ height: `${height}%` }}
                  className="h-28 w-full rounded-full bg-gradient-to-t from-cyan-500/30 via-brand-500/55 to-cyan-300/90"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-slate-100">Recent Activity</h3>
          <p className="mt-2 text-sm text-slate-400">The latest client submissions flowing through the admin panel.</p>

          <div className="mt-5 space-y-4">
            {!loading && !stats.recentActivity.length ? (
              <EmptyState
                title="No request activity yet"
                description="Fresh submissions will show up here as soon as clients send their UI JSON."
              />
            ) : null}

            {stats.recentActivity.map((request) => (
              <RequestCard
                key={`${request.clientId}-${request.createdAt}`}
                request={request}
                onOpen={() => navigate(`/admin/requests/${request.clientId}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
