import { CheckCircle2, Layers3, Lock, MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useBuilder } from '../context/BuilderContext';

const options = [
  {
    id: 'frontend-backend',
    title: 'Customize Frontend + Backend',
    description: 'Use the full guided studio with live preview, autosave, and final submission.',
    enabled: true,
    icon: CheckCircle2
  },
  {
    id: 'backend-only',
    title: 'Full Backend',
    description: 'Planned for a future release.',
    enabled: false,
    icon: Lock
  },
  {
    id: 'customize-backend-only',
    title: 'Customize Backend',
    description: 'Planned for a future release.',
    enabled: false,
    icon: Layers3
  }
];

const BuilderEntryPage = () => {
  const navigate = useNavigate();
  const { updateProject } = useBuilder();

  const handleSelect = (option) => {
    if (!option.enabled) {
      return;
    }

    updateProject({ mode: option.id });
    navigate('/client/business-type');
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="client-shell">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="client-section-title">Builder Entry</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Choose the build mode for your platform.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Keep it simple for now with the full guided flow. The other two options stay visible but locked so the experience stays clear.
            </p>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          {options.map((option) => {
            const Icon = option.icon;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={!option.enabled}
                className={`client-card p-5 text-left transition ${
                  option.enabled
                    ? 'hover:-translate-y-1 hover:border-aurora-400/40 hover:bg-aurora-500/10'
                    : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04] text-aurora-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    {option.enabled ? 'Available' : 'Soon'}
                  </span>
                </div>
                <h2 className="mt-6 text-xl font-semibold text-white">{option.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{option.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white">
                  <span>{option.enabled ? 'Continue' : 'Not available'}</span>
                  {option.enabled ? <MoveRight className="h-4 w-4" /> : null}
                </div>
              </button>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default BuilderEntryPage;
