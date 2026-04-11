import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
      navigate('/client/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account right now.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="relative h-[460px] w-full overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.08)] sm:h-[520px] lg:h-[560px]">
          <img
            src="/login.webp"
            alt=""
            className="h-full w-full select-none object-cover object-center"
            draggable="false"
          />

          <div className="absolute inset-0">
            <div className="flex h-full w-full items-center">
              <div className="w-full max-w-sm px-6 py-8 sm:px-10 sm:py-10">
                <img
                  src="/logo.png"
                  alt="Tatkal"
                  className="h-[4.2rem] w-auto select-none"
                  draggable="false"
                />

                <div className="mt-6">
                  <h1 className="text-2xl font-semibold text-slate-950">Create Account</h1>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Create your client login to enter the platform studio.
                  </p>
                </div>

                <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-700/70">Email</span>
                    <input
                      className="field-base"
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder="you@company.com"
                      type="email"
                      value={form.email}
                      required
                    />
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-700/70">Password</span>
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
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-700/70">Confirm Password</span>
                    <input
                      className="field-base"
                      onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                      placeholder="Repeat your password"
                      type="password"
                      value={form.confirmPassword}
                      required
                    />
                  </label>

                  {error ? (
                    <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                      {error}
                    </p>
                  ) : null}

                  <button
                    className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(178,75,243,0.28)] ring-1 ring-white/20 transition will-change-transform hover:-translate-y-0.5 hover:bg-accent/95 hover:shadow-[0_22px_55px_rgba(178,75,243,0.34)] focus:outline-none focus:ring-4 focus:ring-accent/20 active:translate-y-0 active:shadow-[0_10px_22px_rgba(15,23,42,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? 'Creating account...' : 'Register'}
                  </button>
                </form>

                <p className="mt-5 text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link className="font-semibold text-platform hover:underline" to="/login">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
