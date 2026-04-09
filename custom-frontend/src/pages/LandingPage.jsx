import { Link } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    title: 'Config-driven builder',
    body: 'Shape your booking platform through guided controls that produce clean structured JSON.'
  },
  {
    title: 'Instant live preview',
    body: 'See login, dashboard, checkout, and order-history changes reflected in real time.'
  },
  {
    title: 'Admin-ready submission',
    body: 'Submit the final build request and keep track of progress without leaving the client panel.'
  }
];

const steps = [
  'Choose your platform mode and business type.',
  'Customize each booking page through five guided builder phases.',
  'Auto-save, submit, and track your project through deployment.'
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main>
        <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="fade-up">
              <div className="mb-6 inline-flex rounded-full border border-aurora-400/20 bg-aurora-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-aurora-300">
                SaaS Builder Platform
              </div>
              <h1 className="max-w-3xl font-display text-5xl font-bold leading-tight text-white md:text-6xl">
                Design your own booking platform without touching code.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                TATKAL helps travel and event businesses craft polished booking experiences through a premium guided builder with real-time preview, autosave, and project tracking.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
              <Link className="button-primary" to={isAuthenticated ? '/dashboard' : '/login'}>
                {isAuthenticated ? 'Open Client Panel' : 'Start Designing'}
              </Link>
                <Link className="button-secondary" to="/track">
                  Track My Project
                </Link>
              </div>
            </div>

            <div className="tatkal-shell rounded-[36px] p-6">
              <div className="tatkal-grid rounded-[28px] border border-white/8 bg-slate-950/55 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricCard label="Builder Phases" value="5" />
                  <MetricCard label="Live Preview" value="Instant" />
                  <MetricCard label="Storage Format" value="JSON" />
                  <MetricCard label="Status Tracking" value="Enabled" />
                </div>
                <div className="mt-5 rounded-[28px] border border-white/8 bg-white/5 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Preview snapshot</p>
                      <p className="mt-2 font-display text-2xl font-bold text-white">Travel dashboard</p>
                    </div>
                    <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      Live
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-slate-950/85 p-5">
                    <div className="grid gap-3 md:grid-cols-3">
                      <PreviewTile label="From" value="Ahmedabad" />
                      <PreviewTile label="To" value="Mumbai" />
                      <div className="rounded-[20px] bg-aurora-500 px-4 py-4 text-center text-sm font-semibold text-slate-950">
                        Search journeys
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="grid gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <div className="tatkal-shell rounded-[30px] p-6" key={feature.title}>
                <p className="text-xs uppercase tracking-[0.28em] text-aurora-300">Feature</p>
                <h2 className="mt-4 font-display text-2xl font-bold text-white">{feature.title}</h2>
                <p className="mt-4 leading-7 text-slate-300">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="tatkal-shell rounded-[36px] p-8">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-flame-400">How it works</p>
                <h2 className="mt-4 font-display text-4xl font-bold text-white">A guided flow built for fast MVP delivery</h2>
              </div>
              <div className="grid gap-4">
                {steps.map((step, index) => (
                  <div className="rounded-[26px] border border-white/8 bg-white/5 p-5" key={step}>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Step {index + 1}</p>
                    <p className="mt-3 text-base leading-7 text-slate-200">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
          <div className="rounded-[36px] border border-aurora-400/20 bg-gradient-to-r from-aurora-500/15 via-white/5 to-flame-500/15 p-8 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-aurora-300">Ready to start</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white">Build your booking experience today</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Start with a travel or event template, tune every core page, and send your final design to the TATKAL team.
            </p>
          <Link className="button-primary mt-8" to={isAuthenticated ? '/dashboard' : '/login'}>
            {isAuthenticated ? 'Continue Building' : 'Start Designing'}
          </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

const MetricCard = ({ label, value }) => (
  <div className="rounded-[24px] border border-white/8 bg-white/5 p-5">
    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
    <p className="mt-3 font-display text-3xl font-bold text-white">{value}</p>
  </div>
);

const PreviewTile = ({ label, value }) => (
  <div className="rounded-[20px] border border-white/8 bg-white/5 px-4 py-4">
    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
    <p className="mt-2 text-sm text-white">{value}</p>
  </div>
);

export default LandingPage;
