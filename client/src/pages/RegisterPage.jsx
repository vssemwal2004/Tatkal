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

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-aurora-300">Client Registration</p>
            <h1 className="mt-4 text-5xl font-bold text-white">Create your client account and start building.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Register once, receive your client identity on first login, and move directly into the TATKAL guided builder.
            </p>
          </div>

          <div className="tatkal-shell rounded-[36px] p-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Email</span>
                <input
                  className="field-base"
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="client@brand.com"
                  type="email"
                  value={form.email}
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Password</span>
                <input
                  className="field-base"
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Minimum 6 characters"
                  type="password"
                  value={form.password}
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Confirm Password</span>
                <input
                  className="field-base"
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  placeholder="Repeat your password"
                  type="password"
                  value={form.confirmPassword}
                  required
                />
              </label>

              {error ? <p className="text-sm text-rose-300">{error}</p> : null}

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
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
