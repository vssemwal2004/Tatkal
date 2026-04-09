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

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="tatkal-shell rounded-[34px] p-7">
            <p className="text-xs uppercase tracking-[0.28em] text-aurora-300">Track My Project</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Check your platform status.</h1>
            <p className="mt-4 leading-7 text-slate-300">
              Review your latest submission status, configuration summary, deployment URL, and generated credentials once the platform goes live.
            </p>

            <label className="mt-8 block space-y-2">
              <span className="text-sm font-medium text-slate-200">Client ID</span>
              <input
                className="field-base"
                onChange={(event) => setLookupId(event.target.value)}
                placeholder="client_1712680000000"
                value={lookupId}
              />
            </label>

            <button className="button-primary mt-6 w-full" onClick={() => loadProject(lookupId)} type="button">
              {loading ? 'Loading...' : 'Track Project'}
            </button>

            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          </div>

          <div className="space-y-6">
            {projectData ? (
              <>
                <div className="tatkal-shell rounded-[34px] p-7">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current Status</p>
                      <h2 className="mt-3 text-4xl font-bold text-white">{projectData.summary?.projectName || 'Untitled Platform'}</h2>
                      <p className="mt-2 text-slate-300">{projectData.summary?.businessType || 'travel'} platform deployment workflow</p>
                    </div>
                    <StatusBadge value={projectData.status} />
                  </div>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <InfoCard label="Business Type" value={projectData.summary?.businessType || 'travel'} />
                    <InfoCard label="Build Mode" value={projectData.summary?.mode || 'frontend-backend'} />
                    <InfoCard label="Completed Steps" value={`${projectData.summary?.completedSteps || 0} / 5`} />
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="tatkal-shell rounded-[34px] p-7">
                    <p className="text-xs uppercase tracking-[0.24em] text-flame-400">Submitted Design Summary</p>
                    <div className="mt-6 space-y-4">
                      <SummaryRow label="Login fields" value={formatFields(projectData.summary?.loginFields || {})} />
                      <SummaryRow label="Status" value={projectData.status} />
                      <SummaryRow label="Deployment URL" value={projectData.url || 'Pending deployment'} />
                      <SummaryRow label="Last update" value={formatDate(projectData.updatedAt)} />
                    </div>
                  </div>

                  <div className="tatkal-shell rounded-[34px] p-7">
                    <p className="text-xs uppercase tracking-[0.24em] text-aurora-300">Deployment Access</p>
                    <div className="mt-6 space-y-4">
                      <AccessCard label="Username" value={projectData.credentials?.username || 'Unavailable'} />
                      <AccessCard label="Password" value={projectData.credentials?.password || 'Unavailable'} />
                      <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                        <p className="text-sm text-slate-300">
                          Credentials are only revealed after the admin deploys the project.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="tatkal-shell rounded-[34px] p-10 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">No Project Loaded</p>
                <h2 className="mt-4 text-3xl font-bold text-white">Your project summary will appear here.</h2>
                <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
                  Submit a design from the builder or enter an existing client ID to view status, summary, and deployment details.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
    <p className="mt-2 text-lg font-semibold text-white">{value}</p>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-[20px] border border-white/8 bg-white/5 px-4 py-4">
    <span className="text-sm text-slate-300">{label}</span>
    <span className="text-sm font-semibold text-white">{value}</span>
  </div>
);

const AccessCard = ({ label, value }) => (
  <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
    <p className="mt-2 break-all font-mono text-sm text-white">{value}</p>
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
