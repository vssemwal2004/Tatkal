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
                  className="h-14 w-auto select-none"
                  draggable="false"
                />

                <div className="mt-6">
                  <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.15rem]">
                    Sign in
                  </h1>
                  <p className="mt-2 text-sm leading-7 text-slate-700/80">
                    Continue to your workspace with your email and password.
                  </p>
                </div>

                <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-700/70">Email</span>
                    <input
                      className="field-base"
                      placeholder="you@company.com"
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      required
                    />
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-700/70">Password</span>
                    <input
                      className="field-base"
                      placeholder="Enter your password"
                      type="password"
                      value={form.password}
                      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                      required
                    />
                  </label>

                  {error ? (
                    <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(178,75,243,0.28)] ring-1 ring-white/20 transition will-change-transform hover:-translate-y-0.5 hover:bg-accent/95 hover:shadow-[0_22px_55px_rgba(178,75,243,0.34)] focus:outline-none focus:ring-4 focus:ring-accent/20 active:translate-y-0 active:shadow-[0_10px_22px_rgba(15,23,42,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Signing in...' : 'Login'}
                  </button>
                </form>

                <p className="mt-5 text-sm text-slate-600">
                  Don&apos;t have an account?{' '}
                  <Link className="font-semibold text-platform hover:underline" to="/register">
                    Create Account
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

export default LoginPage;
