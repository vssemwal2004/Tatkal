import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { getAdminAppUrl } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    role: 'client',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(form);

      if (data.role === 'admin') {
        const adminRedirectUrl = new URL(getAdminAppUrl());
        adminRedirectUrl.searchParams.set('token', data.token);
        adminRedirectUrl.searchParams.set('email', data.user?.email || form.email);
        window.location.href = adminRedirectUrl.toString();
        return;
      }

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-aurora-300">Secure Login</p>
            <h1 className="mt-4 font-display text-5xl font-bold text-white">
              Login as admin or client from one premium access page
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Admins move into the control panel. Clients move into their SaaS dashboard and continue designing or tracking booking platforms.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <FeatureCard
                title="Admin Access"
                body="Open the admin dashboard to review requests, approvals, and deployments."
              />
              <FeatureCard
                title="Client Access"
                body="Enter the builder dashboard to design, save, submit, and track your project."
              />
            </div>
          </div>

          <div className="tatkal-shell rounded-[36px] p-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Login as</span>
                <select
                  className="field-base"
                  onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                  value={form.role}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Email</span>
                <input
                  className="field-base"
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder={form.role === 'admin' ? 'admin@tatkal.io' : 'client@brand.com'}
                  type="email"
                  value={form.email}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Password</span>
                <input
                  className="field-base"
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Enter your password"
                  type="password"
                  value={form.password}
                />
              </label>

              {error ? <p className="text-sm text-rose-300">{error}</p> : null}

              <button className="button-primary w-full" disabled={loading} type="submit">
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-400">
              New client?{' '}
              <Link className="font-semibold text-aurora-300" to="/register">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ title, body }) => (
  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
    <p className="text-xs uppercase tracking-[0.24em] text-flame-400">{title}</p>
    <p className="mt-3 leading-7 text-slate-200">{body}</p>
  </div>
);

export default LoginPage;
