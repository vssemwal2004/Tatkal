import { ArrowLeft, ArrowRight, CheckCircle2, Eye, LayoutTemplate, SendHorizonal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useBuilder } from '../context/BuilderContext';
import { builderSteps } from '../data/builderSteps';

const formatSaveLabel = (saveState, lastSavedAt) => {
  if (saveState === 'saving') {
    return 'Saving changes';
  }

  if (saveState === 'saved' && lastSavedAt) {
    return `Saved ${lastSavedAt}`;
  }

  if (saveState === 'error') {
    return 'Autosave needs attention';
  }

  return 'Autosave ready';
};

const BuilderStudioShell = ({ step }) => {
  const navigate = useNavigate();
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
      <section className="client-card client-surface p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="client-section-title">Template Studio</p>
            <h1 className="mt-2 text-[1.9rem] font-semibold tracking-[-0.03em] text-slate-950 sm:text-[2.4rem]">
              {builderState.project.projectName || 'Untitled Platform'}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              Build each screen as an independent page, keep the customer journey structured, and send the admin a
              route-ready design package instead of one mixed template.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StudioStat
              icon={LayoutTemplate}
              label="Business Type"
              value={builderState.project.businessType === 'event' ? 'Event' : 'Travel'}
            />
            <StudioStat icon={CheckCircle2} label="Draft Status" value={formatSaveLabel(saveState, lastSavedAt)} />
            <StudioStat icon={Eye} label="Builder Ready" value={hydrated ? 'Synced' : 'Loading'} />
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {builderSteps.map((item, index) => {
            const isActive = item.id === step.id;

            return (
              <Link
                key={item.id}
                to={`/client/builder/${item.route}`}
                className={`client-tab min-w-[134px] ${isActive ? 'client-tab-active' : 'client-tab-idle'}`}
              >
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Page {index + 1}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{item.short}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-24">
          <div className="space-y-4 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:pr-1">
            <div className="client-card p-4">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4 text-brand-500" />
                <p className="client-section-title">Current Page</p>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">{step.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.summary}</p>
            </div>

            <CurrentBuilder
              businessType={builderState.project.businessType}
              config={builderState[step.id]}
              project={builderState.project}
              routes={builderState.routes}
              updateRoutes={updateRoutes}
              updateSection={(value) => updateSection(step.id, value)}
            />
          </div>
        </aside>

        <div className="space-y-4">
          <CurrentPreview
            businessType={builderState.project.businessType}
            config={builderState[step.id]}
            project={builderState.project}
            routes={builderState.routes}
          />

          <div className="client-card p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="client-section-title">Workflow</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Keep each page isolated, move through the builder in order, and submit when the full customer flow is
                  ready for admin conversion.
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
                  <Link className="button-secondary" to="/client/dashboard">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Dashboard
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
    </main>
  );
};

const StudioStat = ({ icon: Icon, label, value }) => (
  <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
    <div className="flex items-center gap-2 text-slate-500">
      <Icon className="h-4 w-4 text-brand-500" />
      <span className="text-[10px] uppercase tracking-[0.22em]">{label}</span>
    </div>
    <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
  </div>
);

export default BuilderStudioShell;
