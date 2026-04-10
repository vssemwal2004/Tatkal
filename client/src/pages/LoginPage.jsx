import { ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const getRedirectPath = (role) => (role === 'admin' ? '/admin' : '/client/dashboard');

const LoginPage = () => {
  const { isAuthenticated, loading, login, role } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(role)} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await login(form);
      navigate(getRedirectPath(response.role));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[34px] border border-slate-200 bg-white/92 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden border-r border-slate-200 p-8 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.14),transparent_30%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-brand-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Access
            </span>
            <h1 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950">
              One login for admin operations and the client website workspace.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-8 text-slate-600">
              Admins open the control panel. Clients move into a lighter, route-based studio where each website page is
              designed separately and exported more professionally.
            </p>

            <div className="mt-10 space-y-3">
              <PromoCard title="Client Dashboard" text="Structured page editing, autosave, live preview, and tracking." />
              <PromoCard title="Admin Console" text="Requests, approvals, clients, deployments, and export controls." />
              <PromoCard title="Shared Auth" text="JWT-based access for both roles with one login endpoint." />
            </div>
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-8">
          <div className="w-full">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              Welcome back
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Login</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Use your admin or client credentials to continue to the correct workspace.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Email</span>
                <input
                  className="field-base"
                  placeholder="admin@tatkal.com or client@example.com"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Password</span>
                <input
                  className="field-base"
                  placeholder="Enter your password"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
              </label>

              {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

              <button type="submit" disabled={loading} className="button-primary w-full">
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-600">
              Need a client account?{' '}
              <Link className="font-semibold text-brand-700" to="/register">
                Register now
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const PromoCard = ({ title, text }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
    <p className="text-sm font-semibold text-slate-950">{title}</p>
    <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
  </div>
);

export default LoginPage;
