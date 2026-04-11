import { ArrowRight, CheckCircle2, Layers3, Route, Settings2, Sparkles, Target, Ticket, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useBuilder } from '../context/BuilderContext';

const workspaceCards = [
  {
    title: 'Project Setup',
    description: 'Set business type, platform name, owner details, and the shared project foundation before design starts.',
    to: '/client/business-type',
    icon: Settings2
  },
  {
    title: 'Login Page',
    description: 'Shape the welcome experience, field layout, colors, and the first visual impression of your product.',
    to: '/client/builder/login',
    icon: CheckCircle2
  },
  {
    title: 'Search Dashboard',
    description: 'Design the core dashboard experience where users search routes and move deeper into the journey.',
    to: '/client/builder/dashboard',
    icon: Route
  },
  {
    title: 'Seat Selection',
    description: 'Create a cleaner selection flow with stronger seat states, hierarchy, and clearer customer actions.',
    to: '/client/builder/seats',
    icon: Ticket
  },
  {
    title: 'Payment Page',
    description: 'Refine the checkout moment with stronger layout, trust cues, and polished conversion styling.',
    to: '/client/builder/payment',
    icon: Wallet
  },
  {
    title: 'Booking History',
    description: 'Define the post-booking experience so confirmations and previous journeys feel structured and premium.',
    to: '/client/builder/history',
    icon: Layers3
  }
];

const ClientWorkspacePage = () => {
  const { builderState } = useBuilder();

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="client-shell">
        <section className="client-hero overflow-hidden rounded-[40px] px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
            <div className="fade-rise max-w-4xl">
              <div className="dashboard-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em]">
                <Sparkles className="h-3.5 w-3.5" />
                Frontend + Backend Studio
              </div>
              <h1 className="mt-5 text-[2.4rem] font-semibold tracking-[-0.06em] text-slate-950 sm:text-[3.8rem]">
                Build the full customer journey in one polished workspace.
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                This redesigned studio keeps every page of your booking product organized, visual, and easier to build.
                Use the workspace below to move through setup, login, dashboard, seats, payment, and booking history
                like a modern startup product team.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link className="button-primary" to="/client/builder/login">
                  Continue Designing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link className="button-secondary" to="/client/business-type">
                  Update Project Setup
                </Link>
              </div>
            </div>

            <div className="grid gap-4 fade-rise sm:grid-cols-3 xl:grid-cols-1">
              <MetricCard label="Platform" value={builderState.project.projectName || 'Untitled Platform'} />
              <MetricCard label="Business Type" value={builderState.project.businessType} />
              <MetricCard label="Design Journey" value="5 structured pages" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="client-card p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="client-section-title">Workspace Flow</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  A clear page-by-page system instead of scattered screens.
                </h2>
              </div>
              <div className="hidden rounded-full bg-[rgba(178,75,243,0.06)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)] md:block">
                Startup UI Flow
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workspaceCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <Link
                    key={card.to}
                    to={card.to}
                    className="client-card client-card-hover fade-rise group flex min-h-[250px] flex-col justify-between overflow-hidden p-5"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[rgba(178,75,243,0.1)] text-[var(--color-primary)] transition group-hover:scale-105 group-hover:bg-[rgba(178,75,243,0.14)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="rounded-full border border-[rgba(13,67,97,0.08)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                        Step {index + 1}
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-[1.28rem] font-semibold tracking-[-0.03em] text-slate-950">{card.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{card.description}</p>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-[rgba(13,67,97,0.08)] pt-5">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-secondary)]">
                        <Target className="h-4 w-4 text-[var(--color-primary)]" />
                        Open section
                      </span>
                      <ArrowRight className="h-4 w-4 text-[var(--color-primary)] transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="client-card p-6">
              <p className="client-section-title">Recommended Flow</p>
              <div className="mt-5 space-y-3">
                {[
                  'Start with project setup so the business type, labels, and owner details stay consistent across the journey.',
                  'Move through login, dashboard, seats, payment, and history in sequence for a smoother product narrative.',
                  'Review the whole flow before submission so the export feels connected, premium, and launch-ready.'
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-[rgba(13,67,97,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,251,255,0.94))] px-4 py-4"
                  >
                    <p className="text-sm leading-7 text-[var(--color-muted)]">
                      <span className="mr-2 font-semibold text-[var(--color-primary)]">0{index + 1}.</span>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="client-card p-6">
              <p className="client-section-title">Workspace Status</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                Ready for a more premium structured export
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                This workspace now feels more intentional and startup-focused. Every section maps clearly into the
                product flow so your handoff into the final build is more organized and easier to manage.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InsightMini label="Live Mode" value="Frontend + Backend" />
                <InsightMini label="Builder State" value="Ready to continue" />
              </div>
              <Link className="button-primary mt-6" to="/client/builder/login">
                Open Builder
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const MetricCard = ({ label, value }) => (
  <div className="rounded-[24px] border border-white/80 bg-white/88 px-4 py-4 shadow-[0_16px_36px_rgba(13,67,97,0.08)] backdrop-blur-sm">
    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">{label}</p>
    <p className="mt-2 text-base font-semibold capitalize text-slate-950">{value}</p>
  </div>
);

const InsightMini = ({ label, value }) => (
  <div className="rounded-[22px] border border-[rgba(13,67,97,0.08)] bg-[rgba(248,251,255,0.86)] px-4 py-4">
    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</p>
    <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
  </div>
);

export default ClientWorkspacePage;
