import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Copy, Loader2, Server, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { fetchFullBackendInfo, fetchFullBackendStatus } from '../services/fullBackendService';

const FullBackendPage = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendInfo, setBackendInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [fullBackendEnabled, setFullBackendEnabled] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  const loadStatus = async () => {
    setStatusLoading(true);
    try {
      const response = await fetchFullBackendStatus();
      const payload = response?.data || response;
      const enabled = payload?.fullBackendEnabled !== false;
      setFullBackendEnabled(enabled);

      if (enabled) {
        const infoResponse = await fetchFullBackendInfo();
        setBackendInfo(infoResponse?.data || infoResponse);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to load full backend status.');
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleFetch = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetchFullBackendInfo();
      const payload = response?.data || response;
      setBackendInfo(payload);
      setFullBackendEnabled(true);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Unable to fetch the endpoint.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!backendInfo?.baseUrl) return;
    try {
      await navigator.clipboard.writeText(backendInfo.baseUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="client-shell">
        <section className="client-hero rounded-[36px] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Full Backend Access
              </div>
              <h1 className="mt-4 text-[2.2rem] font-semibold tracking-[-0.05em] text-slate-950 sm:text-[3rem]">
                Use our backend in your own product.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Confirm access to get the base API URL. Set it in your app once and start calling the
                backend services from your code.
              </p>
            </div>

            <Link className="button-secondary inline-flex items-center gap-2" to="/client/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="client-card p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Get your API base URL</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This single base URL unlocks all backend services. You only need to set it once in your
                  code or environment configuration.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {statusLoading ? 'Checking status...' : fullBackendEnabled ? 'Full Backend On' : 'Full Backend Off'}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600"
                />
                I want to use the full backend and will set the base URL in my app.
              </label>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="button-primary"
                type="button"
                onClick={handleFetch}
                disabled={!confirmed || loading || fullBackendEnabled}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Fetching...
                  </span>
                ) : (
                  'Get Endpoint'
                )}
              </button>
              <Link className="button-secondary" to="/client/dashboard">
                Cancel
              </Link>
            </div>
          </div>

          <div className="client-card p-6">
            <p className="client-section-title">How to use it</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                1. Save the base URL below.
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                2. Set it as your API base in the frontend or backend app.
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                3. Call our endpoints for login, booking, and more.
              </div>
            </div>
          </div>
        </section>

        {backendInfo?.baseUrl ? (
          <section className="mt-6 client-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Your API Base URL</h3>
                <p className="text-sm text-slate-600">Set this once and start using the backend.</p>
              </div>
              <button className="button-secondary" type="button" onClick={handleCopy}>
                {copied ? (
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Copied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Copy
                  </span>
                )}
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-4 font-mono text-sm text-slate-100 break-all">
              {backendInfo.baseUrl}
            </div>

            {backendInfo.note ? (
              <p className="mt-4 text-sm text-slate-600">{backendInfo.note}</p>
            ) : null}
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default FullBackendPage;
