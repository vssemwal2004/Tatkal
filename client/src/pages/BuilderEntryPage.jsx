import { CheckCircle2, Layers3, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useBuilder } from '../context/BuilderContext';

const options = [
  {
    id: 'frontend-backend',
    title: 'Customize Frontend + Backend',
    description: 'Build the full booking experience with live preview, configuration, and deployment submission.',
    enabled: true,
    icon: CheckCircle2
  },
  {
    id: 'backend-only',
    title: 'Full Backend',
    description: 'Reserved for a future release.',
    enabled: false,
    icon: Lock
  },
  {
    id: 'customize-backend-only',
    title: 'Customize Backend',
    description: 'Reserved for a future release.',
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

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.28em] text-aurora-300">Builder Entry</p>
          <h1 className="mt-4 text-5xl font-bold text-white">Choose how you want to build your platform.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            The guided builder is available now for the full frontend and backend flow. The other tracks are visible so the product roadmap is clear.
          </p>
        </div>

        <section className="grid gap-5 lg:grid-cols-3">
          {options.map((option) => {
            const Icon = option.icon;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={!option.enabled}
                className={`rounded-[32px] border p-7 text-left transition ${
                  option.enabled
                    ? 'border-aurora-400/30 bg-aurora-500/10 hover:-translate-y-1 hover:border-aurora-300/60'
                    : 'cursor-not-allowed border-white/10 bg-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-cyan-300" />
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                    {option.enabled ? 'Available' : 'Soon'}
                  </span>
                </div>
                <h2 className="mt-8 text-2xl font-semibold text-white">{option.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{option.description}</p>
              </button>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default BuilderEntryPage;
