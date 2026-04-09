import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-glow backdrop-blur md:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 px-8 py-10 md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">TATKAL</p>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight text-white">
              Operate client booking systems from one premium control center.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              Review incoming UI builder submissions, inspect configuration JSON, map each client to a pre-built
              booking engine, and launch deployments with a clean SaaS workflow.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                'Centralized request review for travel and event clients',
                'Readable configuration panels for every booking flow step',
                'Prototype-ready deployment simulation backed by MongoDB'
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
          <h2 className="mt-3 text-3xl font-semibold text-slate-100">Admin Login</h2>
          <p className="mt-2 text-sm text-slate-400">Access client requests, approvals, deployments, and live platform health.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
                placeholder="admin@tatkal.io"
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

            <button type="submit" disabled={loading} className="primary-button w-full">
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
