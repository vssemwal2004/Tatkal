import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { loading, login, register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password must match.');
      return;
    }

    try {
      await register({
        email: form.email,
        password: form.password
      });
      await login({
        email: form.email,
        password: form.password
      });
      navigate('/client/builder-entry', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account right now.');
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="client-shell">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section>
            <p className="client-section-title">Client Registration</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Create your account and enter the platform studio.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Register once, get your client identity on login, and start configuring the booking system without touching code.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <MiniFeature title="Quick Setup" text="Email and password only" />
              <MiniFeature title="Shared Login" text="Admin and client in one app" />
              <MiniFeature title="Direct Builder" text="Go straight to design flow" />
            </div>
          </section>

          <section className="tatkal-shell rounded-[28px] p-5 sm:p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Email</span>
                <input
                  className="field-base"
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="client@brand.com"
                  type="email"
                  value={form.email}
                  required
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Password</span>
                <input
                  className="field-base"
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Minimum 6 characters"
                  type="password"
                  value={form.password}
                  required
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Confirm Password</span>
                <input
                  className="field-base"
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  placeholder="Repeat your password"
                  type="password"
                  value={form.confirmPassword}
                  required
                />
              </label>

              {error ? <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

              <button className="button-primary w-full" disabled={loading} type="submit">
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-400">
              Already have an account?{' '}
              <Link className="font-semibold text-aurora-300" to="/login">
                Login
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

const MiniFeature = ({ title, text }) => (
  <div className="client-card p-4">
    <p className="text-sm font-semibold text-white">{title}</p>
    <p className="mt-1 text-sm text-slate-400">{text}</p>
  </div>
);

export default RegisterPage;
