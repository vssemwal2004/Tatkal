import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import JsonSection from '../components/JsonSection';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { deploySystem } from '../services/deployService';
import { approveRequest, fetchRequestDetails } from '../services/requestService';

const RequestDetailsPage = () => {
  const { clientId } = useParams();
  const [details, setDetails] = useState(null);
  const [systemType, setSystemType] = useState('travel');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadDetails = async () => {
    const data = await fetchRequestDetails(clientId);
    setDetails(data);
    setSystemType(data?.design?.systemType || data?.client?.businessType || 'travel');

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

  const onApprove = async () => {
    setProcessing(true);
    setFeedback({ type: '', message: '' });

    try {
      await approveRequest(clientId);
      await loadDetails();
      setFeedback({ type: 'success', message: 'Request approved successfully.' });
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
      const response = await deploySystem({ clientId, systemType });
      await loadDetails();
      setFeedback({ type: 'success', message: response.message || 'Deployment simulated successfully.' });
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
    return <p className="text-red-300">No details found for this request.</p>;
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
            {details.design?.systemType ? <StatusBadge value={details.design.systemType} className="opacity-80" /> : null}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Client ID</p>
              <p className="mt-3 text-sm font-medium text-white">{clientId}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Request Created</p>
              <p className="mt-3 text-sm font-medium text-white">
                {details.design?.createdAt ? new Date(details.design.createdAt).toLocaleString() : 'Unavailable'}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Deployed At</p>
              <p className="mt-3 text-sm font-medium text-white">
                {details.design?.deployedAt ? new Date(details.design.deployedAt).toLocaleString() : 'Not deployed'}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <h3 className="text-lg font-semibold text-slate-100">Deployment Controls</h3>
          <p className="mt-2 text-sm text-slate-400">
            Pick the pre-built system that fits this client, then approve or deploy the request.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Assigned System</label>
              <select value={systemType} onChange={(event) => setSystemType(event.target.value)} className="input-field">
                <option value="travel">Travel Booking</option>
                <option value="event">Event Booking</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={processing || isApproved || isDeployed}
                onClick={onApprove}
                className="secondary-button border-sky-400/40 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApproved ? 'Approved' : 'Approve'}
              </button>
              <button
                type="button"
                disabled={processing || isDeployed}
                onClick={onDeploy}
                className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeployed ? 'Deployed' : 'Deploy'}
              </button>
            </div>
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
