import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getRememberedTrackingId, rememberTrackingId } from '../services/clientService';
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
      setError(requestError.message);
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
            <h1 className="mt-4 font-display text-4xl font-bold text-white">Check your platform status</h1>
            <p className="mt-4 leading-7 text-slate-300">
              Review your latest submission status, config summary, and admin-side placeholders. Your project ID is prefilled from the logged-in client account.
            </p>

            <label className="mt-8 block space-y-2">
              <span className="text-sm font-medium text-slate-200">Project ID</span>
              <input
                className="field-base"
                onChange={(event) => setLookupId(event.target.value)}
                placeholder="tatkal-ab12cd34"
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
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current status</p>
                      <h2 className="mt-3 font-display text-4xl font-bold text-white">
                        {projectData.project.summary.projectName}
                      </h2>
                      <p className="mt-2 text-slate-300">
                        {projectData.client.businessType} platform for {projectData.client.name}
                      </p>
                    </div>
                    <StatusBadge status={projectData.project.status} />
                  </div>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <InfoCard label="Business Type" value={projectData.project.summary.businessType} />
                    <InfoCard label="Build Mode" value={projectData.project.summary.mode} />
                    <InfoCard label="Completed Steps" value={`${projectData.project.summary.completedSteps} / 5`} />
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="tatkal-shell rounded-[34px] p-7">
                    <p className="text-xs uppercase tracking-[0.24em] text-flame-400">Submitted design summary</p>
                    <div className="mt-6 space-y-4">
                      <SummaryRow label="Login fields" value={formatFields(projectData.project.summary.loginFields)} />
                      <SummaryRow label="Accent color" value={projectData.project.summary.accentColor} />
                      <SummaryRow label="History layout" value={projectData.project.summary.historyLayout} />
                      <SummaryRow
                        label="Submission date"
                        value={formatDate(projectData.project.submittedAt || projectData.project.updatedAt)}
                      />
                    </div>
                  </div>

                  <div className="tatkal-shell rounded-[34px] p-7">
                    <p className="text-xs uppercase tracking-[0.24em] text-aurora-300">Admin updates</p>
                    <div className="mt-6 space-y-4">
                      {projectData.updates.map((update) => (
                        <div className="rounded-[24px] border border-white/8 bg-white/5 p-4" key={update.title}>
                          <p className="text-sm font-semibold text-white">{update.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{update.body}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                            {update.at ? formatDate(update.at) : 'Waiting for admin update'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="tatkal-shell rounded-[34px] p-10 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">No project loaded</p>
                <h2 className="mt-4 font-display text-3xl font-bold text-white">Your project summary will appear here</h2>
                <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
                  Submit a design from the builder or enter an existing project ID to view status, summary, and future admin updates.
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
