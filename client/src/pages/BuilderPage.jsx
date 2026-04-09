import { CheckCircle2, ChevronLeft, ChevronRight, Eye, LayoutPanelLeft, Save, SendHorizonal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import DashboardBuilder from '../components/builders/DashboardBuilder';
import HistoryBuilder from '../components/builders/HistoryBuilder';
import LoginBuilder from '../components/builders/LoginBuilder';
import PaymentBuilder from '../components/builders/PaymentBuilder';
import SeatBuilder from '../components/builders/SeatBuilder';
import DashboardPreview from '../components/previews/DashboardPreview';
import HistoryPreview from '../components/previews/HistoryPreview';
import LoginPreview from '../components/previews/LoginPreview';
import PaymentPreview from '../components/previews/PaymentPreview';
import SeatPreview from '../components/previews/SeatPreview';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useBuilder } from '../context/BuilderContext';
import { fetchDesign, saveDesign } from '../services/designService';
import { rememberTrackingId } from '../services/builderStorage';

const steps = [
  {
    id: 'loginPage',
    short: 'Login',
    label: 'Login Page',
    summary: 'Configure the welcome screen, logo, fields, and text styling.',
    BuilderComponent: LoginBuilder,
    PreviewComponent: LoginPreview
  },
  {
    id: 'dashboard',
    short: 'Dashboard',
    label: 'Dashboard',
    summary: 'Adjust the search hero, card size, labels, and visual tone.',
    BuilderComponent: DashboardBuilder,
    PreviewComponent: DashboardPreview
  },
  {
    id: 'seatSelection',
    short: 'Seats',
    label: 'Seat Selection',
    summary: 'Set the layout and booking state colors for seats or ticket zones.',
    BuilderComponent: SeatBuilder,
    PreviewComponent: SeatPreview
  },
  {
    id: 'payment',
    short: 'Payment',
    label: 'Payment',
    summary: 'Shape the payment page theme, button style, and visible options.',
    BuilderComponent: PaymentBuilder,
    PreviewComponent: PaymentPreview
  },
  {
    id: 'history',
    short: 'History',
    label: 'History',
    summary: 'Choose a clean history layout and refine the table or card styling.',
    BuilderComponent: HistoryBuilder,
    PreviewComponent: HistoryPreview
  }
];

const BuilderPage = () => {
  const navigate = useNavigate();
  const { client } = useAuth();
  const { builderState, replaceBuilderState, updateSection } = useBuilder();
  const [activeStep, setActiveStep] = useState(0);
  const [saveState, setSaveState] = useState('idle');
  const [lastSavedAt, setLastSavedAt] = useState('');
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  const currentStep = steps[activeStep];
  const CurrentBuilder = currentStep.BuilderComponent;
  const CurrentPreview = currentStep.PreviewComponent;

  useEffect(() => {
    const loadExistingDesign = async () => {
      if (!client?.clientId) {
        return;
      }

      try {
        const data = await fetchDesign(client.clientId);
        if (data?.config) {
          replaceBuilderState(data.config);
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Failed to load existing design:', error);
        }
      } finally {
        setHydrated(true);
      }
    };

    loadExistingDesign();
  }, [client?.clientId, replaceBuilderState]);

  useEffect(() => {
    if (!hydrated || !builderState.project.clientId) {
      return undefined;
    }

    setSaveState('saving');

    const timer = setTimeout(async () => {
      try {
        const data = await saveDesign({
          clientId: builderState.project.clientId,
          config: builderState
        });

        rememberTrackingId(builderState.project.clientId);
        setSaveState('saved');
        setLastSavedAt(
          new Date(data.design?.updatedAt || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        );
      } catch (error) {
        setSaveState('error');
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [builderState, hydrated]);

  const goToStep = (direction) => {
    setActiveStep((current) => Math.min(Math.max(current + direction, 0), steps.length - 1));
  };

  const handleSubmit = async () => {
    if (!builderState.project.projectName.trim()) {
      setSubmitError('Set a platform name first so the design can be submitted.');
      return;
    }

    setSubmitState('submitting');
    setSubmitError('');

    try {
      await saveDesign({
        clientId: builderState.project.clientId,
        config: builderState
      });
      rememberTrackingId(builderState.project.clientId);
      setSubmitState('submitted');
      navigate(`/client/track?clientId=${builderState.project.clientId}`);
    } catch (error) {
      setSubmitState('error');
      setSubmitError(error.response?.data?.message || 'Failed to submit the design.');
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="client-card p-5 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="client-section-title">Platform Studio</p>
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {builderState.project.projectName || 'Untitled Platform'}
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                A cleaner editor for your {builderState.project.businessType === 'event' ? 'event' : 'travel'} booking
                platform with live preview and automatic draft saving.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StudioStat
                icon={CheckCircle2}
                label="Business Type"
                value={builderState.project.businessType === 'event' ? 'Event' : 'Travel'}
              />
              <StudioStat icon={Save} label="Draft Status" value={formatSaveLabel(saveState, lastSavedAt)} />
              <StudioStat icon={Eye} label="Preview" value="Live Sync" />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {steps.map((step, index) => {
              const isActive = index === activeStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`client-tab min-w-[132px] ${isActive ? 'client-tab-active' : 'client-tab-idle'}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Step {index + 1}</p>
                  <p className="mt-1 text-sm font-semibold">{step.short}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-24">
            <div className="space-y-4 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:pr-1">
              <div className="tatkal-shell rounded-[24px] p-4">
                <div className="flex items-center gap-2">
                  <LayoutPanelLeft className="h-4 w-4 text-aurora-300" />
                  <p className="client-section-title">Current Step</p>
                </div>
                <h2 className="mt-2 text-xl font-semibold text-white">{currentStep.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{currentStep.summary}</p>
              </div>

              <CurrentBuilder
                businessType={builderState.project.businessType}
                config={builderState[currentStep.id]}
                updateSection={(value) => updateSection(currentStep.id, value)}
              />
            </div>
          </aside>

          <div className="space-y-4">
            <CurrentPreview config={builderState[currentStep.id]} project={builderState.project} />

            <div className="tatkal-shell rounded-[24px] p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="client-section-title">Actions</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Move through each step, keep refining your screens, and submit when the platform looks right.
                  </p>
                  {submitError ? <p className="mt-2 text-sm text-rose-300">{submitError}</p> : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="button-secondary" disabled={activeStep === 0} onClick={() => goToStep(-1)} type="button">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </button>
                  <button
                    className="button-secondary"
                    disabled={activeStep === steps.length - 1}
                    onClick={() => goToStep(1)}
                    type="button"
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                  <button className="button-primary" onClick={handleSubmit} type="button">
                    <SendHorizonal className="mr-2 h-4 w-4" />
                    {submitState === 'submitting' ? 'Submitting...' : 'Submit Platform'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const StudioStat = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
    <div className="flex items-center gap-2 text-slate-400">
      <Icon className="h-4 w-4 text-aurora-300" />
      <span className="text-[11px] uppercase tracking-[0.2em]">{label}</span>
    </div>
    <p className="mt-2 text-sm font-semibold text-white">{value}</p>
  </div>
);

const formatSaveLabel = (saveState, lastSavedAt) => {
  if (saveState === 'saving') {
    return 'Saving';
  }
  if (saveState === 'saved') {
    return `Saved ${lastSavedAt}`;
  }
  if (saveState === 'error') {
    return 'Retry needed';
  }
  return 'Autosave ready';
};

export default BuilderPage;
