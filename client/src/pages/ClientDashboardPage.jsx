import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Code2,
  FolderKanban,
  Layers3,
  Rocket,
  Sparkles,
  Wand2
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';

const solutionCards = [
  {
    title: 'Customize Frontend with Backend',
    price: '$50/month',
    description: 'Complete design and workflow control for your full booking platform experience.',
    status: 'ready',
    to: '/client/workspace',
    icon: Sparkles,
    cta: 'Open Workspace'
  },
  {
    title: 'Full Backend',
    price: '$20/month',
    description: 'Use the full backend directly in your own product and get the API base setup from the client area.',
    status: 'ready',
    to: '/client/full-backend',
    icon: Layers3,
    cta: 'Open Full Backend'
  },
  {
    title: 'Customize Backend',
    price: '$25/month',
    description: 'Tune backend workflows, integrations, and internal logic while keeping the frontend untouched.',
    status: 'soon',
    icon: Code2,
    cta: 'Coming Soon'
  }
];

const ClientDashboardPage = () => {
  const { client } = useAuth();
  const [activeTab, setActiveTab] = useState(solutionCards[0].title);
  const selectedCard = solutionCards.find((card) => card.title === activeTab) || solutionCards[0];

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="client-shell">
        <section className="client-hero overflow-hidden rounded-[40px] px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-8">
            <div className="dashboard-pill inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Client Dashboard
            </div>
            <h1 className="max-w-4xl text-[2.5rem] font-semibold tracking-[-0.06em] text-slate-950 sm:text-[4rem]">
              Build. Customize. Deploy. Instantly
            </h1>
            <div className="grid gap-4 md:grid-cols-3">
              <OverviewStat icon={FolderKanban} label="Active projects" value="03" detail="2 in design, 1 in review" />
              <OverviewStat icon={Activity} label="Recent activity" value="12 updates" detail="Latest draft synced today" />
              <OverviewStat icon={Rocket} label="Quick actions" value="Ready" detail="Launch your next customization flow" />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
            <div className="client-card p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="client-section-title">Plans</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">Choose your workspace mode</h2>
                </div>
                <div className="hidden rounded-full bg-[rgba(178,75,243,0.06)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)] md:block">
                  Interactive Tabs
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {solutionCards.map((card) => {
                  const Icon = card.icon;
                  const isActive = activeTab === card.title;
                  const isReady = card.status === 'ready';

                  return (
                    <button
                      key={card.title}
                      type="button"
                      onClick={() => setActiveTab(card.title)}
                      className={`client-card ${isActive ? 'dashboard-tab-active' : 'dashboard-tab-idle'} flex min-h-[260px] flex-col justify-between p-5 text-left transition`}
                    >
                      <div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-[18px] ${isActive ? 'bg-white text-[var(--color-primary)]' : 'bg-[rgba(178,75,243,0.08)] text-[var(--color-secondary)]'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-slate-950">{card.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{card.description}</p>
                      </div>

                      <div className="mt-6 border-t border-[rgba(13,67,97,0.1)] pt-4">
                        <p className="text-2xl font-semibold text-[var(--color-secondary)]">{card.price}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`inline-flex items-center gap-2 text-sm font-medium ${isReady ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {isReady ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                            {isReady ? 'Available now' : 'Coming soon'}
                          </span>
                          {isActive ? <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">Active</span> : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="client-card p-6">
                <p className="client-section-title">Quick Actions</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Move your project forward</h2>
                <div className="mt-5 space-y-3">
                  {selectedCard.status === 'ready' ? (
                    <Link to={selectedCard.to} className="button-primary w-full justify-center">
                      {selectedCard.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  ) : (
                    <button type="button" disabled className="button-secondary w-full justify-center opacity-70">
                      {selectedCard.cta}
                    </button>
                  )}
                  <Link to="/client/track" className="button-secondary w-full justify-center">
                    Track Current Project
                  </Link>
                </div>
              </div>

              <div className="client-card p-6">
                <p className="client-section-title">Quick Insights</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <InsightRow icon={BarChart3} label="Workspace owner" value={client?.name || 'Client'} />
                  <InsightRow icon={Wand2} label="Selected mode" value={selectedCard.title} />
                  <InsightRow icon={Code2} label="Billing" value={selectedCard.price} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="client-card p-6 sm:p-7">
            <p className="client-section-title">What You Can Do</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">Everything stays clean, structured, and launch-ready.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <FeatureCard
                icon={Sparkles}
                title="Customize faster"
                text="Shape pages, flows, and configuration paths from a clean client workspace."
              />
              <FeatureCard
                icon={Layers3}
                title="Manage modules"
                text="Switch between frontend-plus-backend and backend-focused plans with clear pricing."
              />
              <FeatureCard
                icon={Rocket}
                title="Deploy confidently"
                text="Keep project decisions organized before sending the work into the next delivery step."
              />
              <FeatureCard
                icon={Activity}
                title="Stay informed"
                text="Review quick status insights, actions, and recent progress from one view."
              />
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="client-card p-6">
              <p className="client-section-title">Recent Activity</p>
              <div className="mt-5 space-y-3">
                <ActivityItem title="Workspace synced" text="Your latest dashboard selection and project data are ready." />
                <ActivityItem title="Pricing updated" text="Plans now show monthly pricing for each customization path." />
                <ActivityItem title="Quick access enabled" text="Profile dropdown and fast actions are available from the header." />
              </div>
            </div>

            <div className="client-card p-6">
              <p className="client-section-title">Usage Stats</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <UsageCard value="87%" label="Setup readiness" />
                <UsageCard value="03" label="Actions available" />
                <UsageCard value="24/7" label="Workspace access" />
                <UsageCard value="01" label="Live plan active" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const OverviewStat = ({ icon: Icon, label, value, detail }) => (
  <div className="rounded-[26px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_36px_rgba(13,67,97,0.08)] backdrop-blur-sm transition hover:-translate-y-1">
    <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[rgba(178,75,243,0.1)] text-[var(--color-primary)]">
      <Icon className="h-5 w-5" />
    </div>
    <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    <p className="mt-2 text-sm text-[var(--color-muted)]">{detail}</p>
  </div>
);

const InsightRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-[20px] border border-[rgba(13,67,97,0.08)] bg-[rgba(248,251,255,0.9)] px-4 py-4">
    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[rgba(178,75,243,0.08)] text-[var(--color-primary)]">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, text }) => (
  <div className="rounded-[24px] border border-[rgba(13,67,97,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,251,255,0.94))] p-5 transition hover:-translate-y-1 hover:border-[rgba(178,75,243,0.2)]">
    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[rgba(178,75,243,0.1)] text-[var(--color-primary)]">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{text}</p>
  </div>
);

const ActivityItem = ({ title, text }) => (
  <div className="rounded-[22px] border border-[rgba(13,67,97,0.08)] bg-[rgba(248,251,255,0.9)] px-4 py-4 transition hover:border-[rgba(178,75,243,0.2)]">
    <p className="text-sm font-semibold text-slate-950">{title}</p>
    <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{text}</p>
  </div>
);

const UsageCard = ({ value, label }) => (
  <div className="rounded-[22px] border border-[rgba(13,67,97,0.08)] bg-white p-4 text-center">
    <p className="text-2xl font-semibold text-[var(--color-secondary)]">{value}</p>
    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</p>
  </div>
);

export default ClientDashboardPage;
