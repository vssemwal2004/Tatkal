import { ArrowRight, LayoutDashboard, LockKeyhole, Rocket, WandSparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, role } = useAuth();

  const primaryLink = isAuthenticated ? (role === 'admin' ? '/admin' : '/client/builder-entry') : '/login';
  const builderLink = isAuthenticated && role === 'client' ? '/client/builder-entry' : '/register';

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col rounded-[2rem] border border-white/10 bg-slate-950/65 shadow-glow backdrop-blur">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">TATKAL</p>
            <h1 className="mt-2 text-xl font-semibold text-white">Booking Platform Operating System</h1>
          </div>
          <Link to={primaryLink} className="primary-button">
            {isAuthenticated ? 'Open Workspace' : 'Get Started'}
          </Link>
        </header>

        <section className="grid flex-1 gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand-300">Shared SaaS Platform</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Manage deployments on the admin side and design booking platforms on the client side.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              TATKAL now supports the full loop: client registration, guided UI building, live preview, submission,
              admin approval, and deployment tracking inside a single full-stack codebase.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={primaryLink} className="primary-button">
                <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started'}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="secondary-button border-white/10 bg-white/5 text-slate-100 hover:border-cyan-400/30 hover:bg-white/10"
              >
                Login
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <FeatureIcon icon={LayoutDashboard} title="Admin Control" text="Review requests, clients, and deployments." />
              <FeatureIcon icon={WandSparkles} title="Client Builder" text="Design every screen with live config previews." />
              <FeatureIcon icon={LockKeyhole} title="JWT Protected" text="Both roles are secured through shared auth." />
              <FeatureIcon icon={Rocket} title="Deploy & Track" text="Generate URLs and track rollout status." />
            </div>
          </div>

          <div className="grid gap-4">
            <article className="glass-card rounded-[1.75rem] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">Admin</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Control Center</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Monitor client demand, review JSON-driven platform requests, approve work, and deploy generated sites.
              </p>
            </article>

            <article className="glass-card rounded-[1.75rem] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">Design Your Platform</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Guided Client Builder</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Clients can register, choose a platform type, customize five key screens, and submit directly to admin.
              </p>
              <Link to={builderLink} className="primary-button mt-6">
                Start Builder
              </Link>
            </article>

            <article className="glass-card rounded-[1.75rem] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">Tracking</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Deployment Visibility</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Submitted projects move through pending, approved, and deployed states with site URLs and credentials.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
};

const FeatureIcon = ({ icon: Icon, title, text }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
    <Icon className="h-5 w-5 text-cyan-300" />
    <p className="mt-4 text-sm font-medium text-white">{title}</p>
    <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
  </div>
);

export default LandingPage;
