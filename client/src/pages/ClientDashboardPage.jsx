import { ArrowRight, BadgeCheck, CheckCircle2, Code2, Layers3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';

const solutionCards = [
  {
    title: 'Customize Frontend + Backend',
    description:
      'Continue with the current complete flow and customize the booking journey page by page from login to history.',
    highlight: 'Available now',
    status: 'ready',
    to: '/client/workspace',
    icon: Sparkles
  },
  {
    title: 'Full Backend',
    description:
      'A backend-focused setup flow for teams who already have a frontend and only need APIs, data models, and logic.',
    highlight: 'Available now',
    status: 'ready',
    to: '/client/full-backend',
    icon: Layers3
  },
  {
    title: 'Customize Backend',
    description:
      'A guided backend customization mode for refining only the server-side workflow, integrations, and operations.',
    highlight: 'Coming Soon',
    status: 'soon',
    icon: Code2
  }
];

const ClientDashboardPage = () => {
  const { client } = useAuth();

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="client-shell">
        <section className="client-hero overflow-hidden rounded-[36px] px-6 py-7 sm:px-8 sm:py-9">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                Post Login Workspace
              </span>
              <h1 className="mt-4 text-[2.2rem] font-semibold tracking-[-0.05em] text-slate-950 sm:text-[3.2rem]">
                Choose how you want to build your project.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                We added a cleaner client-side page after login so users can clearly choose the workflow they need.
                The complete frontend + backend journey and the full backend flow are ready to use right now.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <SummaryCard label="Client" value={client?.name || 'Workspace User'} />
              <SummaryCard label="Live Option" value="2 available flows" />
              <SummaryCard label="Roadmap" value="Customize backend next" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {solutionCards.map((card) => {
            const Icon = card.icon;
            const isReady = card.status === 'ready';
            const content = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-[22px] ${isReady ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${
                      isReady
                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    {card.highlight}
                  </span>
                </div>

                <div className="mt-8">
                  <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-slate-950">{card.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    {isReady ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Layers3 className="h-4 w-4" />}
                    <span>{isReady ? 'Ready to continue' : 'Launching soon'}</span>
                  </div>
                  <span className={`inline-flex items-center gap-2 text-sm font-semibold ${isReady ? 'text-brand-700' : 'text-slate-400'}`}>
                    {isReady ? 'Open flow' : 'Unavailable'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </>
            );

            if (isReady) {
              return (
                <Link
                  key={card.title}
                  to={card.to}
                  className="client-card client-card-hover flex min-h-[320px] flex-col justify-between p-6"
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={card.title}
                type="button"
                disabled
                className="client-card flex min-h-[320px] cursor-not-allowed flex-col justify-between border-slate-200/90 bg-white/70 p-6 text-left opacity-90"
              >
                {content}
              </button>
            );
          })}
        </section>
      </main>
    </div>
  );
};

const SummaryCard = ({ label, value }) => (
  <div className="rounded-[24px] border border-white/80 bg-white/85 px-4 py-4 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-sm">
    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">{label}</p>
    <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
  </div>
);

export default ClientDashboardPage;
