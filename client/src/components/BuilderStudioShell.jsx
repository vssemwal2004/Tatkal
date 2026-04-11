import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  LayoutDashboard,
  LayoutTemplate,
  LogIn,
  PanelLeftOpen,
  ReceiptText,
  SendHorizonal,
  Sparkles,
  Ticket
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useBuilder } from '../context/BuilderContext';
import { builderSteps } from '../data/builderSteps';

const stepIcons = {
  login: LogIn,
  dashboard: LayoutDashboard,
  seats: Ticket,
  payment: ReceiptText,
  history: LayoutTemplate
};

const formatSaveLabel = (saveState, lastSavedAt) => {
  if (saveState === 'saving') {
    return 'Saving changes';
  }

  if (saveState === 'saved' && lastSavedAt) {
    return `Saved ${lastSavedAt}`;
  }

  if (saveState === 'error') {
    return 'Needs attention';
  }

  return 'Autosave ready';
};

const BuilderStudioShell = ({ step }) => {
  const navigate = useNavigate();
  const [stepNavExpanded, setStepNavExpanded] = useState(false);
  const {
    builderState,
    hydrated,
    lastSavedAt,
    saveState,
    submitDesign,
    submitError,
    submitState,
    updateRoutes,
    updateSection
  } = useBuilder();

  const activeIndex = builderSteps.findIndex((item) => item.id === step.id);
  const previousStep = activeIndex > 0 ? builderSteps[activeIndex - 1] : null;
  const nextStep = activeIndex < builderSteps.length - 1 ? builderSteps[activeIndex + 1] : null;
  const CurrentBuilder = step.BuilderComponent;
  const CurrentPreview = step.PreviewComponent;

  const handleSubmit = async () => {
    try {
      await submitDesign();
      navigate(`/client/track?clientId=${builderState.project.clientId}`);
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  return (
    <main className="client-shell">
      <section className="mb-5 rounded-[28px] border border-[rgba(13,67,97,0.08)] bg-white/75 px-5 py-4 shadow-[0_16px_36px_rgba(13,67,97,0.06)] backdrop-blur-sm sm:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="dashboard-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Customize Frontend + Backend
            </div>
            <h1 className="mt-4 text-[1.65rem] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2rem]">
              {builderState.project.projectName || 'Untitled Platform'}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              A focused builder interface where every change on the left reflects instantly inside the product preview on
              the right.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StudioStat label="Business type" value={builderState.project.businessType === 'event' ? 'Event' : 'Travel'} />
            <StudioStat label="Draft status" value={formatSaveLabel(saveState, lastSavedAt)} />
            <StudioStat label="Preview" value={hydrated ? 'Live sync' : 'Loading'} />
          </div>
        </div>
      </section>

      <section
        className={`grid gap-5 transition-[grid-template-columns] duration-300 ease-in-out ${
          stepNavExpanded ? 'xl:grid-cols-[232px_360px_minmax(0,1fr)]' : 'xl:grid-cols-[92px_360px_minmax(0,1fr)]'
        }`}
      >
        <aside className="hidden xl:block" onMouseEnter={() => setStepNavExpanded(true)} onMouseLeave={() => setStepNavExpanded(false)}>
          <div className="sticky top-24 h-[calc(100vh-8rem)] w-full overflow-hidden rounded-[28px] border border-[rgba(13,67,97,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,250,255,0.96))] shadow-[0_18px_40px_rgba(13,67,97,0.08)] transition-[width] duration-300 ease-in-out">
            <div className="flex h-full flex-col px-3 py-4">
              <div className={`mb-5 flex items-center ${stepNavExpanded ? 'justify-start' : 'justify-center'}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[0_12px_26px_rgba(178,75,243,0.2)]">
                  <PanelLeftOpen className="h-4 w-4" />
                </div>
                <div
                  className={`ml-3 min-w-0 overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-in-out ${
                    stepNavExpanded ? 'max-w-[160px] translate-x-0 opacity-100' : 'max-w-0 -translate-x-1 opacity-0'
                  }`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Builder</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">Journey Steps</p>
                </div>
              </div>

              <div className="mb-4 px-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(13,67,97,0.08)]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-secondary))] transition-all duration-300"
                    style={{ width: `${((activeIndex + 1) / builderSteps.length) * 100}%` }}
                  />
                </div>
              </div>

              <p
                className={`mb-4 px-1 text-[11px] text-[var(--color-muted)] transition-[max-height,opacity,transform] duration-300 ease-in-out ${
                  stepNavExpanded ? 'max-h-10 translate-y-0 opacity-100' : 'max-h-0 -translate-y-1 opacity-0'
                }`}
              >
                Step {activeIndex + 1} of {builderSteps.length}
              </p>

              <nav className="flex-1 space-y-2">
                {builderSteps.map((item, index) => {
                  const Icon = stepIcons[item.route] || LayoutTemplate;
                  const isActive = item.id === step.id;
                  const isCompleted = index < activeIndex;

                  return (
                    <Link
                      key={item.id}
                      to={`/client/builder/${item.route}`}
                      className={`relative flex items-center gap-3 rounded-[20px] px-3 py-3 transition-all duration-300 ${
                        isActive
                          ? 'bg-[rgba(178,75,243,0.12)] text-[var(--color-primary)] shadow-[inset_0_0_0_1px_rgba(178,75,243,0.18)]'
                          : 'text-[var(--color-secondary)] hover:bg-[rgba(178,75,243,0.05)]'
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-2 bottom-2 rounded-full transition-all duration-300 ${
                          isActive ? 'w-[3px] bg-[var(--color-primary)] opacity-100' : 'w-0 opacity-0'
                        }`}
                      />
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] ${
                          isActive
                            ? 'bg-white shadow-[0_10px_18px_rgba(178,75,243,0.16)]'
                            : isCompleted
                              ? 'bg-[rgba(178,75,243,0.1)]'
                              : 'bg-[rgba(13,67,97,0.06)]'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div
                        className={`min-w-0 overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-in-out ${
                          stepNavExpanded ? 'max-w-[140px] translate-x-0 opacity-100' : 'max-w-0 -translate-x-1 opacity-0'
                        }`}
                      >
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                          {isCompleted ? 'Completed' : `Step ${index + 1}`}
                        </p>
                        <p className="mt-1 truncate text-[13px] font-medium text-slate-950">{item.short}</p>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        <aside className="order-2 xl:order-none">
          <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-hidden rounded-[28px] border border-[rgba(13,67,97,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,251,255,0.96))] shadow-[0_20px_42px_rgba(13,67,97,0.08)]">
            <div className="flex h-full flex-col">
              <div className="border-b border-[rgba(13,67,97,0.08)] px-5 py-4">
                <p className="client-section-title">Configuration Panel</p>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-semibold text-slate-950">{step.label}</h2>
                    <p className="mt-1 text-[11px] leading-5 text-[var(--color-muted)]">{step.summary}</p>
                  </div>
                  <div className="rounded-full bg-[rgba(178,75,243,0.08)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    Live edit
                  </div>
                </div>
              </div>

              <div className="builder-config-scroll flex-1 overflow-y-auto px-4 py-4">
                <CurrentBuilder
                  businessType={builderState.project.businessType}
                  config={builderState[step.id]}
                  project={builderState.project}
                  routes={builderState.routes}
                  updateRoutes={updateRoutes}
                  updateSection={(value) => updateSection(step.id, value)}
                />
              </div>
            </div>
          </div>
        </aside>

        <section className="order-1 xl:order-none">
          <div className="space-y-4">
            <div className="rounded-[28px] border border-[rgba(13,67,97,0.08)] bg-white/78 p-4 shadow-[0_18px_40px_rgba(13,67,97,0.08)] backdrop-blur-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="client-section-title">Live Preview</p>
                  <h2 className="mt-2 text-[15px] font-semibold text-slate-950">Real-time screen rendering inside a laptop frame</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(178,75,243,0.06)] px-3 py-2 text-[11px] font-medium text-[var(--color-secondary)]">
                  <Eye className="h-4 w-4 text-[var(--color-primary)]" />
                  Instant updates
                </div>
              </div>

              <CurrentPreview
                businessType={builderState.project.businessType}
                config={builderState[step.id]}
                project={builderState.project}
                routes={builderState.routes}
              />
            </div>

            <div className="rounded-[24px] border border-[rgba(13,67,97,0.08)] bg-white p-4 shadow-[0_16px_36px_rgba(13,67,97,0.06)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="client-section-title">Workflow Actions</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                    Navigate step by step, keep the preview clean, and submit once the full journey is ready.
                  </p>
                  {submitError ? (
                    <p className="mt-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                      {submitError}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {previousStep ? (
                    <Link className="button-secondary" to={`/client/builder/${previousStep.route}`}>
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Link>
                  ) : (
                    <Link className="button-secondary" to="/client/workspace">
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Workspace
                    </Link>
                  )}

                  {nextStep ? (
                    <Link className="button-secondary" to={`/client/builder/${nextStep.route}`}>
                      Next
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  ) : null}

                  <button className="button-primary" onClick={handleSubmit} type="button">
                    <SendHorizonal className="mr-2 h-4 w-4" />
                    {submitState === 'submitting' ? 'Submitting...' : 'Submit Design'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

const StudioStat = ({ label, value }) => (
  <div className="rounded-[20px] border border-[rgba(13,67,97,0.08)] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(13,67,97,0.05)]">
    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</p>
    <p className="mt-1.5 text-sm font-semibold text-slate-950">{value}</p>
  </div>
);

export default BuilderStudioShell;
