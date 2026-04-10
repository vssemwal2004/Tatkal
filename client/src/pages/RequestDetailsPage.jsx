import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import JsonSection from '../components/JsonSection';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { deploySystem } from '../services/deployService';
import { approveRequest, deleteRequest, exportClientZip, fetchRequestDetails } from '../services/requestService';

const RequestDetailsPage = () => {
  const { clientId } = useParams();
  const [details, setDetails] = useState(null);
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadDetails = async () => {
    const data = await fetchRequestDetails(clientId);
    setDetails(data);
    setDeploymentResult(data?.deployment || null);
    return data;
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadDetails();
      } catch (err) {
        setFeedback({
          type: 'error',
          message: err.response?.data?.message || 'Unable to load request details.'
        });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [clientId]);

  const sectionData = useMemo(() => {
    const config = details?.design?.config || {};
    const sections = details?.sections || {};

    return {
      loginPage: sections.loginPage || config.loginPage || config.login || {},
      dashboard: sections.dashboard || config.dashboard || {},
      seatSelection: sections.seatSelection || config.seatSelection || config.seat || {},
      payment: sections.payment || config.payment || {},
      history: sections.history || config.history || {}
    };
  }, [details]);

  const status = details?.design?.status;
  const isApproved = status === 'approved';
  const isDeployed = status === 'deployed';
  const canDownloadPackage = isApproved || isDeployed;

  const downloadProjectPackage = async () => {
    const zipBlob = await exportClientZip(clientId);
    const zipUrl = window.URL.createObjectURL(zipBlob);
    const anchor = document.createElement('a');
    anchor.href = zipUrl;
    anchor.download = `${clientId}-frontend.zip`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(zipUrl);
  };

  const onApprove = async () => {
    setProcessing(true);
    setFeedback({ type: '', message: '' });

    try {
      await approveRequest(clientId);
      await downloadProjectPackage();
      await loadDetails();

      setFeedback({
        type: 'success',
        message: 'Request approved and frontend template ZIP downloaded.'
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Approval failed.' });
    } finally {
      setProcessing(false);
    }
  };

  const onDeploy = async () => {
    setProcessing(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await deploySystem({ clientId });
      setDeploymentResult(response.deployment || null);
      await loadDetails();
      setFeedback({ type: 'success', message: response.message || 'Deployment completed successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Deployment failed.' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading request details...</p>;
  }

  if (!details) {
    return (
      <section className="space-y-4">
        {feedback.message ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm ${
              feedback.type === 'error'
                ? 'border border-red-400/20 bg-red-500/10 text-red-200'
                : 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
            }`}
          >
            {feedback.message}
          </p>
        ) : null}
        <p className="text-red-300">No details found for this request.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6 fade-rise">
      <PageHeader
        eyebrow="Request Inspection"
        title={details.client?.name || 'Unknown Client'}
        description="Review the submitted configuration package, validate the intended booking flow, and move it into deployment."
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-3xl p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={details.client?.businessType || 'travel'} />
            <StatusBadge value={details.design?.status || 'pending'} />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Client ID</p>
              <p className="mt-3 text-sm font-medium text-slate-900">{clientId}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Request Created</p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                {details.design?.createdAt ? new Date(details.design.createdAt).toLocaleString() : 'Unavailable'}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Deployed At</p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                {details.deployment?.deployedAt
                  ? new Date(details.deployment.deployedAt).toLocaleString()
                  : 'Not deployed'}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <h3 className="text-lg font-semibold text-slate-900">Deployment Controls</h3>
          <p className="mt-2 text-sm text-slate-400">
            Approve the request to unlock the frontend template ZIP download, then optionally generate internal deployment
            access for this client.
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={processing || isApproved || isDeployed}
                onClick={onApprove}
                className="secondary-button border-sky-400/40 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApproved || isDeployed ? 'Approved' : 'Approve'}
              </button>
              <button
                type="button"
                disabled={processing || !canDownloadPackage}
                onClick={async () => {
                  setProcessing(true);
                  setFeedback({ type: '', message: '' });

                  try {
                    await downloadProjectPackage();
                    setFeedback({
                      type: 'success',
                      message: 'Frontend template ZIP downloaded successfully.'
                    });
                  } catch (err) {
                    setFeedback({
                      type: 'error',
                      message: err.response?.data?.message || 'Unable to download the project ZIP.'
                    });
                  } finally {
                    setProcessing(false);
                  }
                }}
                className="secondary-button border-emerald-400/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Download ZIP
              </button>
              <button
                type="button"
                disabled={processing || isDeployed || !isApproved}
                onClick={onDeploy}
                className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeployed ? 'Deployed' : 'Deploy'}
              </button>
            </div>

            {deploymentResult?.url ? (
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                <p className="font-medium text-slate-900">Generated deployment access</p>
                <p className="mt-3">URL: {deploymentResult.url}</p>
                <p className="mt-1">Username: {deploymentResult.username}</p>
                <p className="mt-1">Password: {deploymentResult.password}</p>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                Deploying this request will create `/site/{clientId}` plus a generated username and password.
              </div>
            )}

            <button
              type="button"
              disabled={processing}
              onClick={async () => {
                const confirmed = window.confirm(
                  `Delete all saved requests for client ${clientId}? This cannot be undone.`
                );

                if (!confirmed) {
                  return;
                }

                setProcessing(true);
                setFeedback({ type: '', message: '' });

                try {
                  const response = await deleteRequest(clientId);
                  setDetails(null);
                  setFeedback({
                    type: 'success',
                    message: response.message || 'Request deleted successfully.'
                  });
                } catch (err) {
                  setFeedback({
                    type: 'error',
                    message: err.response?.data?.message || 'Unable to delete the request.'
                  });
                } finally {
                  setProcessing(false);
                }
              }}
              className="secondary-button border-red-400/40 bg-red-500/10 text-red-200 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Delete Request
            </button>
          </div>
        </div>
      </div>

      {feedback.message ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm ${
            feedback.type === 'error'
              ? 'border border-red-400/20 bg-red-500/10 text-red-200'
              : 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <JsonSection title="Login Page Config" data={sectionData.loginPage} />
        <JsonSection title="Dashboard Config" data={sectionData.dashboard} />
        <JsonSection title="Seat Selection Config" data={sectionData.seatSelection} />
        <JsonSection title="Payment Config" data={sectionData.payment} />
        <JsonSection title="History Config" data={sectionData.history} />
      </div>

      <JsonSection title="Full Builder Configuration" data={details.design?.config || {}} />
    </section>
  );
};

export default RequestDetailsPage;
