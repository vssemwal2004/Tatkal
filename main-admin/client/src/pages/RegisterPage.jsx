import { useState } from 'react';
import { Link } from 'react-router-dom';

import { getClientAppUrl, registerAccount } from '../services/authService';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: 'travel'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password must match.');
      return;
    }

    setLoading(true);

    try {
      const data = await registerAccount({
        name: form.name,
        email: form.email,
        password: form.password,
        businessType: form.businessType
      });

      redirectToClientApp(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-glow backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
        <HeroPanel />

        <section className="p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-300">Client Registration</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-100">Create Client Account</h2>
          <p className="mt-2 text-sm text-slate-400">Register here and continue directly into the custom builder dashboard.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Field
              label="Name"
              onChange={(value) => setForm((current) => ({ ...current, name: value }))}
              placeholder="Aarav Shah"
              value={form.name}
            />
            <Field
              label="Email"
              onChange={(value) => setForm((current) => ({ ...current, email: value }))}
              placeholder="client@brand.com"
              type="email"
              value={form.email}
            />
            <Field
              label="Password"
              onChange={(value) => setForm((current) => ({ ...current, password: value }))}
              placeholder="Minimum 6 characters"
              type="password"
              value={form.password}
            />
            <Field
              label="Confirm Password"
              onChange={(value) => setForm((current) => ({ ...current, confirmPassword: value }))}
              placeholder="Repeat password"
              type="password"
              value={form.confirmPassword}
            />

            <div>
              <label className="mb-2 block text-sm text-slate-300" htmlFor="businessType">
                Business Type
              </label>
              <select
                id="businessType"
                className="input-field"
                onChange={(event) => setForm((current) => ({ ...current, businessType: event.target.value }))}
                value={form.businessType}
              >
                <option value="travel">Travel Booking</option>
                <option value="event">Event Booking</option>
              </select>
            </div>

            {error ? <ErrorBox message={error} /> : null}

            <button type="submit" disabled={loading} className="primary-button w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{' '}
            <Link className="font-semibold text-cyan-300" to="/login">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

const HeroPanel = () => (
  <section className="relative hidden overflow-hidden border-r border-white/10 px-8 py-10 md:block">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_30%)]" />
    <div className="relative">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">TATKAL Unified Access</p>
      <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight text-white">
        One authentication surface for admins and clients.
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
        Both frontends use the same backend and Mongo database, while each role lands in the right workspace after authentication.
      </p>
      <div className="mt-8 grid gap-4">
        {[
          'Clients register once and continue in the custom builder',
          'Admins stay inside the operational dashboard',
          'Both flows authenticate against the same backend'
        ].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            {item}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="mb-2 block text-sm text-slate-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="input-field"
      placeholder={placeholder}
      required
    />
  </div>
);

const ErrorBox = ({ message }) => (
  <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{message}</p>
);

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

export default RegisterPage;
