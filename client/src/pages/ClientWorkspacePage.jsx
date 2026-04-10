import { ArrowRight, CheckCircle2, Layers3, Route, Settings2, Ticket, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useBuilder } from '../context/BuilderContext';

const workspaceCards = [
  {
    title: 'Project Setup',
    description: 'Set business type, platform name, and owner details before designing.',
    to: '/client/business-type',
    icon: Settings2
  },
  {
    title: 'Login Page',
    description: 'Control headline, fields, colors, and first impression.',
    to: '/client/builder/login',
    icon: CheckCircle2
  },
  {
    title: 'Search Dashboard',
    description: 'Design the main dashboard and route-search experience.',
    to: '/client/builder/dashboard',
    icon: Route
  },
  {
    title: 'Seat Selection',
    description: 'Style the seat grid or ticket zones without mixing pages together.',
    to: '/client/builder/seats',
    icon: Ticket
  },
  {
    title: 'Payment Page',
    description: 'Refine the checkout step, methods, and action styling.',
    to: '/client/builder/payment',
    icon: Wallet
  },
  {
    title: 'Booking History',
    description: 'Define how confirmed bookings appear once the flow is complete.',
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
        <section className="client-hero rounded-[36px] p-6 sm:p-8">
          <div className="max-w-3xl">
            <p className="client-section-title">Client Dashboard</p>
            <h1 className="mt-3 text-[2.35rem] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[3.1rem]">
              Build a cleaner website flow page by page.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              This workspace keeps the template structured: login first, dashboard next, then routes, seats, payment,
              and history. Each screen is edited separately so the admin side can turn it into a professional website
              instead of a single static file.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MetricCard label="Platform" value={builderState.project.projectName || 'Untitled'} />
            <MetricCard label="Business Type" value={builderState.project.businessType} />
            <MetricCard label="Pages in Flow" value="5 design pages" />
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {workspaceCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link key={card.to} to={card.to} className="client-card client-card-hover p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
                <h2 className="mt-6 text-lg font-semibold text-slate-950">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              </Link>
            );
          })}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="client-card p-5">
            <p className="client-section-title">Recommended Flow</p>
            <div className="mt-4 space-y-3">
              {[
                '1. Configure project basics first so the correct business type and labels are shared everywhere.',
                '2. Design each customer page in its own route instead of combining all screens into one template.',
                '3. Submit the design only after the full journey is reviewed from login through history.'
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="client-card p-5">
            <p className="client-section-title">Status</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">Ready for structured export</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The admin export now targets a real page-based website package, so what you prepare here will map more
              cleanly to dashboard, results, seat, payment, and history pages.
            </p>
            <Link className="button-primary mt-5" to="/client/builder/login">
              Open Builder
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

const MetricCard = ({ label, value }) => (
  <div className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
    <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
    <p className="mt-2 text-base font-semibold text-slate-950 capitalize">{value}</p>
  </div>
);

export default ClientWorkspacePage;
