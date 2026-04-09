import { Activity, BriefcaseBusiness, FileStack, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import RequestCard from '../components/RequestCard';
import StatCard from '../components/StatCard';
import { fetchDashboardStats, fetchPendingRequests } from '../services/requestService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalRequests: 0,
    deployedProjects: 0,
    pendingRequests: 0,
    approvedRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, requestsData] = await Promise.all([fetchDashboardStats(), fetchPendingRequests()]);
        setStats(statsData);
        setRecentRequests(requestsData.slice(0, 3));
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
        description="Keep client onboarding moving from request review to approved system deployment with a compact admin workflow."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Clients"
          value={loading ? '...' : stats.totalClients}
          caption="All SaaS clients currently managed from the panel"
          accent="from-sky-500 to-cyan-400"
          icon={BriefcaseBusiness}
        />
        <StatCard
          title="Total Requests"
          value={loading ? '...' : stats.totalRequests}
          caption="Builder configurations submitted across the platform"
          accent="from-brand-500 to-cyan-400"
          icon={FileStack}
        />
        <StatCard
          title="Deployed Projects"
          value={loading ? '...' : stats.deployedProjects}
          caption="Systems already mapped and logically launched"
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
          <p className="mt-2 text-sm text-slate-400">A quick read on how many submissions still need admin attention.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Pending Review</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? '...' : stats.pendingRequests}</p>
              <p className="mt-2 text-sm text-slate-500">Ready for approval and deployment assignment.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Approved Queue</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? '...' : stats.approvedRequests}</p>
              <p className="mt-2 text-sm text-slate-500">Validated requests waiting for final deployment.</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-12 gap-2">
            {[22, 34, 48, 38, 56, 62, 52, 74, 68, 83, 79, 92].map((height, index) => (
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
          <h3 className="text-lg font-semibold text-slate-100">Recent Pending Requests</h3>
          <p className="mt-2 text-sm text-slate-400">The latest client submissions that still need review.</p>

          <div className="mt-5 space-y-4">
            {!loading && !recentRequests.length ? (
              <EmptyState
                title="No pending requests"
                description="Fresh submissions will show up here as soon as clients send their UI JSON."
              />
            ) : null}

            {recentRequests.map((request) => (
              <RequestCard
                key={`${request.clientId}-${request.createdAt}`}
                request={request}
                onOpen={() => navigate(`/requests/${request.clientId}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
