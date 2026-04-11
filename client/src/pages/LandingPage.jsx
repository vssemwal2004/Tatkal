import { ArrowRight, BadgeCheck, LayoutTemplate, Rocket, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, role } = useAuth();

  const primaryLink = isAuthenticated ? (role === 'admin' ? '/admin' : '/client/dashboard') : '/register';
  const secondaryLink = isAuthenticated ? (role === 'admin' ? '/admin' : '/client/track') : '/login';

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="w-full rounded-[36px] border border-slate-200 bg-white/88 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-xs font-bold tracking-[0.22em] text-white">
              TK
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-slate-950">TATKAL</p>
              <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">Platform Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={secondaryLink} className="button-secondary hidden sm:inline-flex">
              {isAuthenticated ? 'Track Project' : 'Login'}
            </Link>
            <Link to={primaryLink} className="button-primary">
              {isAuthenticated ? 'Open Dashboard' : 'Design Your Platform'}
            </Link>
          </div>
        </header>

        <section className="grid gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-brand-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              Page-Based Client Studio
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Build a polished booking platform with cleaner routing, lighter UI, and a structured customer journey.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              TATKAL helps clients configure each screen separately, preview every change instantly, submit a
              route-ready design, and hand admin a professional multi-page website package instead of one static file.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={primaryLink} className="button-primary">
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Builder'}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/client/track" className="button-secondary">
                Track Project
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <MetricCard value="5" label="design pages" />
              <MetricCard value="Live" label="autosave preview" />
              <MetricCard value="Multi" label="route-ready export" />
            </div>
          </div>

          <div className="space-y-4">
            <FeatureCard
              icon={LayoutTemplate}
              title="Design Page by Page"
              text="Login, dashboard, seats, payment, and history are edited independently so nothing overlaps."
            />
            <FeatureCard
              icon={Workflow}
              title="Submit with Structure"
              text="The admin side receives a cleaner configuration map that can be turned into a real website flow."
            />
            <FeatureCard
              icon={Rocket}
              title="Deploy with Confidence"
              text="Generated client packages now support separate pages, login-first navigation, and route-driven behavior."
            />
          </div>
        </section>
      </div>
    </main>
  );
};

const MetricCard = ({ value, label }) => (
  <div className="client-card p-4">
    <p className="text-2xl font-semibold text-slate-950">{value}</p>
    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, text }) => (
  <article className="client-card p-5">
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
      </div>
    </div>
  </article>
);

export default LandingPage;
