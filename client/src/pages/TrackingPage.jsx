import { Link2, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getRememberedTrackingId, rememberTrackingId } from '../services/builderStorage';
import { trackProject } from '../services/designService';

const TrackingPage = () => {
  const location = useLocation();
  const { client } = useAuth();
  const queryClientId = new URLSearchParams(location.search).get('clientId') || '';
  const rememberedId = getRememberedTrackingId();
  const defaultClientId = queryClientId || rememberedId || client?.clientId || '';
  const [lookupId, setLookupId] = useState(defaultClientId);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(Boolean(defaultClientId));
  const [error, setError] = useState('');

  const loadProject = async (clientId) => {
    if (!clientId) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await trackProject(clientId);
      setProjectData(data);
      rememberTrackingId(clientId);
    } catch (requestError) {
      setProjectData(null);
      setError(requestError.response?.data?.message || 'Unable to load project status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (defaultClientId) {
      loadProject(defaultClientId);
    }
  }, [defaultClientId]);

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="client-shell">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className="client-card p-5">
            <p className="client-section-title">Track My Project</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">Monitor review and deployment progress.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use your client ID to check the latest project status, generated package link, and credentials once
              deployment is complete.
            </p>

            <label className="mt-6 block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Client ID</span>
              <input
                className="field-base"
                onChange={(event) => setLookupId(event.target.value)}
                placeholder="client_1712680000000"
                value={lookupId}
              />
            </label>

            <button className="button-primary mt-5 w-full" onClick={() => loadProject(lookupId)} type="button">
              {loading ? 'Loading...' : 'Check Status'}
            </button>

            {error ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
          </section>

          <section className="space-y-4">
            {projectData ? (
              <>
                <div className="client-card p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="client-section-title">Current Status</p>
                      <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                        {projectData.summary?.projectName || 'Untitled Platform'}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {projectData.summary?.businessType || 'travel'} platform in the TATKAL deployment workflow.
                      </p>
                    </div>
                    <StatusBadge value={projectData.status} />
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <InfoCard label="Business Type" value={projectData.summary?.businessType || 'travel'} />
                    <InfoCard label="Build Mode" value={projectData.summary?.mode || 'frontend-backend'} />
                    <InfoCard label="Completed Steps" value={`${projectData.summary?.completedSteps || 0} / 5`} />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="client-card p-5">
                    <p className="client-section-title">Project Summary</p>
                    <div className="mt-4 space-y-3">
                      <SummaryRow label="Login fields" value={formatFields(projectData.summary?.loginFields || {})} />
                      <SummaryRow label="Status" value={projectData.status} />
                      <SummaryRow label="Last update" value={formatDate(projectData.updatedAt)} />
                    </div>
                  </div>

                  <div className="client-card p-5">
                    <p className="client-section-title">Deployment Access</p>
                    <div className="mt-4 space-y-3">
                      <AccessCard icon={Link2} label="Deployment URL" value={projectData.url || 'Pending deployment'} />
                      <AccessCard icon={ShieldCheck} label="Username" value={projectData.credentials?.username || 'Unavailable'} />
                      <AccessCard icon={Sparkles} label="Password" value={projectData.credentials?.password || 'Unavailable'} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="client-card p-10 text-center">
                <p className="client-section-title">No Project Loaded</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Status details will appear here.</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  Submit a design from the builder or enter an existing client ID to see the latest deployment progress.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
    <p className="mt-2 text-sm font-semibold text-slate-950 capitalize">{value}</p>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-950">{value}</span>
  </div>
);

const AccessCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center gap-2 text-slate-500">
      <Icon className="h-4 w-4 text-brand-600" />
      <span className="text-[11px] uppercase tracking-[0.2em]">{label}</span>
    </div>
    <p className="mt-2 break-all font-mono text-sm text-slate-950">{value}</p>
  </div>
);

const formatFields = (fields) =>
  Object.entries(fields)
    .filter(([, enabled]) => enabled)
    .map(([field]) => field)
    .join(', ') || 'No visible fields';

const formatDate = (value) => {
  if (!value) {
    return 'Not available';
  }

  return new Date(value).toLocaleString();
};

export default TrackingPage;
