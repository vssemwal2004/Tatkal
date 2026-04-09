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
import { rememberTrackingId } from '../services/clientService';
import { saveDesign, submitDesign } from '../services/designService';

const BuilderPage = () => {
  const navigate = useNavigate();
  const { client } = useAuth();
  const { builderState, updateSection } = useBuilder();
  const [activeStep, setActiveStep] = useState(0);
  const [saveState, setSaveState] = useState('idle');
  const [lastSavedAt, setLastSavedAt] = useState('');
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  const steps = [
    {
      id: 'loginPage',
      label: 'Login Page',
      summary: 'Configure sign-in fields, signup visibility, logo, and theme.',
      BuilderComponent: LoginBuilder,
      PreviewComponent: LoginPreview
    },
    {
      id: 'dashboard',
      label: 'Dashboard Page',
      summary: 'Control dashboard layout, background, search content, and CTA styling.',
      BuilderComponent: DashboardBuilder,
      PreviewComponent: DashboardPreview
    },
    {
      id: 'seatSelection',
      label: builderState.project.businessType === 'event' ? 'Ticket Layout' : 'Seat Selection',
      summary: 'Customize the booking availability palette and seat arrangement.',
      BuilderComponent: SeatBuilder,
      PreviewComponent: SeatPreview
    },
    {
      id: 'payment',
      label: 'Payment Page',
      summary: 'Shape the checkout theme, methods, and payment CTA look.',
      BuilderComponent: PaymentBuilder,
      PreviewComponent: PaymentPreview
    },
    {
      id: 'history',
      label: 'Order History',
      summary: 'Decide between table and card history views with custom styling.',
      BuilderComponent: HistoryBuilder,
      PreviewComponent: HistoryPreview
    }
  ];

  const currentStep = steps[activeStep];
  const CurrentBuilder = currentStep.BuilderComponent;
  const CurrentPreview = currentStep.PreviewComponent;
  const canSave = Boolean(builderState.project.projectName.trim()) && builderState.project.mode === 'frontend-backend';

  useEffect(() => {
    if (!canSave) {
      return undefined;
    }

    setSaveState('saving');

    const timer = setTimeout(async () => {
      try {
        const payload = {
          clientId: builderState.project.clientId,
          clientName: builderState.project.projectName,
          businessType: builderState.project.businessType,
          mode: builderState.project.mode,
          email: builderState.project.contactEmail || client?.email,
          systemType: builderState.project.businessType,
          config: builderState
        };

        const data = await saveDesign(payload);
        rememberTrackingId(builderState.project.clientId);
        setSaveState('saved');
        setLastSavedAt(
          new Date(data.updatedAt || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        );
      } catch (error) {
        setSaveState('error');
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [builderState, canSave]);

  const goToStep = (direction) => {
    setActiveStep((current) => Math.min(Math.max(current + direction, 0), steps.length - 1));
  };

  const handleSubmit = async () => {
    if (!canSave) {
      setSubmitError('Set a platform name first so the design can be submitted.');
      return;
    }

    setSubmitState('submitting');
    setSubmitError('');

    try {
      const payload = {
        clientId: builderState.project.clientId,
        clientName: builderState.project.projectName,
        businessType: builderState.project.businessType,
        mode: builderState.project.mode,
        email: builderState.project.contactEmail || client?.email,
        systemType: builderState.project.businessType,
        config: builderState
      };

      await submitDesign(payload);
      rememberTrackingId(builderState.project.clientId);
      setSubmitState('submitted');
      navigate(`/track?clientId=${builderState.project.clientId}`);
    } catch (error) {
      setSubmitState('error');
      setSubmitError(error.message);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8">
        <section className="mb-8 flex flex-col gap-4 rounded-[34px] border border-white/8 bg-white/[0.03] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-aurora-300">Builder workspace</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-white">
              {builderState.project.projectName || 'Untitled Project'}
            </h1>
            <p className="mt-2 text-slate-300">
              {builderState.project.businessType === 'event' ? 'Event booking' : 'Travel booking'} platform configured as structured JSON.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={submitState === 'submitted' ? 'pending' : saveState === 'error' ? 'draft' : 'draft'} />
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {saveState === 'saving' && 'Auto-saving draft...'}
              {saveState === 'saved' && `Saved at ${lastSavedAt}`}
              {saveState === 'error' && 'Auto-save failed'}
              {saveState === 'idle' && 'Autosave ready'}
            </div>
            <button className="button-secondary" onClick={() => navigate('/track')} type="button">
              Track My Project
            </button>
          </div>
        </section>

        <section className="mb-6 grid gap-3 lg:grid-cols-5">
          {steps.map((step, index) => {
            const isActive = index === activeStep;

            return (
              <button
                className={`rounded-[24px] border px-4 py-4 text-left transition ${
                  isActive
                    ? 'border-aurora-400/40 bg-aurora-500/10 text-white shadow-glow'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                }`}
                key={step.id}
                onClick={() => setActiveStep(index)}
                type="button"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Phase {index + 1}</p>
                <p className="mt-2 font-display text-lg font-semibold">{step.label}</p>
              </button>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="tatkal-shell rounded-[30px] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-flame-400">Current Phase</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white">{currentStep.label}</h2>
              <p className="mt-3 leading-7 text-slate-300">{currentStep.summary}</p>
            </div>
            <CurrentBuilder
              businessType={builderState.project.businessType}
              config={builderState[currentStep.id]}
              updateSection={(value) => updateSection(currentStep.id, value)}
            />
          </div>

          <div className="space-y-5">
            <CurrentPreview config={builderState[currentStep.id]} project={builderState.project} />

            <div className="tatkal-shell rounded-[30px] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Builder actions</p>
                  <p className="mt-2 text-slate-300">Move through phases, then submit the full configuration to admin.</p>
                  {submitError ? <p className="mt-2 text-sm text-rose-300">{submitError}</p> : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="button-secondary"
                    disabled={activeStep === 0}
                    onClick={() => goToStep(-1)}
                    type="button"
                  >
                    Previous
                  </button>
                  <button
                    className="button-secondary"
                    disabled={activeStep === steps.length - 1}
                    onClick={() => goToStep(1)}
                    type="button"
                  >
                    Next
                  </button>
                  <button className="button-primary" onClick={handleSubmit} type="button">
                    {submitState === 'submitting' ? 'Submitting...' : 'Submit & Generate Platform'}
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

export default BuilderPage;
