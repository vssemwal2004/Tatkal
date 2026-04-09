import { ArrowRight, BadgeCheck, LayoutTemplate, Rocket, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, role } = useAuth();

  const primaryLink = isAuthenticated ? (role === 'admin' ? '/admin' : '/client/builder-entry') : '/register';
  const secondaryLink = isAuthenticated ? (role === 'admin' ? '/admin' : '/client/track') : '/login';

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-white/10 bg-slate-950/75 shadow-[0_30px_100px_rgba(2,6,23,0.45)] backdrop-blur-xl">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-aurora-400/30 bg-aurora-500/10 text-xs font-bold tracking-[0.22em] text-aurora-300">
              TK
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-white">TATKAL</p>
              <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">Platform Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={secondaryLink} className="button-secondary hidden sm:inline-flex">
              {isAuthenticated ? 'Track Project' : 'Login'}
            </Link>
            <Link to={primaryLink} className="button-primary">
              {isAuthenticated ? 'Open Workspace' : 'Design Your Platform'}
            </Link>
          </div>
        </header>

        <section className="grid gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-aurora-400/20 bg-aurora-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-aurora-200">
              <BadgeCheck className="h-3.5 w-3.5" />
              Client Experience Redesign
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Build a polished booking platform with a guided studio that feels fast, clear, and professional.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              TATKAL helps clients configure their platform screen by screen, preview every change instantly, submit the
              final setup, and track deployment without leaving the same product.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={primaryLink} className="button-primary">
                <span>{isAuthenticated ? 'Go to Builder' : 'Start Builder'}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/client/track" className="button-secondary">
                Track Project
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <MetricCard value="5" label="guided steps" />
              <MetricCard value="Live" label="screen preview" />
              <MetricCard value="Shared" label="admin workflow" />
            </div>
          </div>

          <div className="space-y-4">
            <FeatureCard
              icon={LayoutTemplate}
              title="Design Your Platform"
              text="Choose the booking type, tune the UI, and keep everything config-driven with no code editing."
            />
            <FeatureCard
              icon={Workflow}
              title="Submit with Confidence"
              text="Auto-save keeps work safe while the final submit sends your latest design to the admin review queue."
            />
            <FeatureCard
              icon={Rocket}
              title="Track Deployment"
              text="Once approved, your project shows deployment status, generated site URL, and credentials in one place."
            />
          </div>
        </section>
      </div>
    </main>
  );
};

const MetricCard = ({ value, label }) => (
  <div className="client-card p-4">
    <p className="text-2xl font-semibold text-white">{value}</p>
    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, text }) => (
  <article className="client-card p-5">
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] text-aurora-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-400">{text}</p>
      </div>
    </div>
  </article>
);

export default LandingPage;
