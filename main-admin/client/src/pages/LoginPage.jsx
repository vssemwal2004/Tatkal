import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { getClientAppUrl, loginAccount } from '../services/authService';

const LoginPage = () => {
  const { login, isAuthenticated, loading: adminLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ role: 'admin', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (form.role === 'admin') {
        await login(form.email, form.password);
        navigate('/');
        return;
      }

      const data = await loginAccount(form);
      redirectToClientApp(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-glow backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 px-8 py-10 md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">TATKAL Unified Access</p>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight text-white">
              Shared login for admins and clients.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              Admins continue to the operational control center. Clients continue to the custom builder dashboard and registration flow, while both use the same backend and Mongo database.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                'Admin login opens requests, deployments, and management',
                'Client login opens the custom dashboard and builder',
                'Client registration is available from this same entry point'
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-300">Secure Access</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-100">Login</h2>
          <p className="mt-2 text-sm text-slate-400">Choose a role, sign in once, and we route you to the correct workspace.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm text-slate-300" htmlFor="role">
                Login as
              </label>
              <select
                id="role"
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                className="input-field"
              >
                <option value="admin">Admin</option>
                <option value="client">Client</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="input-field"
                placeholder={form.role === 'admin' ? 'admin@tatkal.io' : 'client@brand.com'}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            {error ? <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

            <button type="submit" disabled={adminLoading || submitting} className="primary-button w-full">
              {adminLoading || submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Need a client account?{' '}
            <Link className="font-semibold text-cyan-300" to="/register">
              Create Account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

const redirectToClientApp = (data) => {
  const redirectUrl = new URL(getClientAppUrl());
  redirectUrl.searchParams.set('token', data.token);
  redirectUrl.searchParams.set('role', data.role);
  redirectUrl.searchParams.set('clientId', data.user?.clientId || '');
  redirectUrl.searchParams.set('name', data.user?.name || '');
  redirectUrl.searchParams.set('email', data.user?.email || '');
  redirectUrl.searchParams.set('businessType', data.user?.businessType || 'travel');
  window.location.href = redirectUrl.toString();
};

export default LoginPage;
