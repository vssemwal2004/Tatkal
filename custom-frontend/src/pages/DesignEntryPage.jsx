import { useNavigate } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useBuilder } from '../context/BuilderContext';

const options = [
  {
    id: 'frontend-backend',
    title: 'Customize Frontend + Backend',
    description: 'Full guided builder with live preview, autosave, final submission, and tracking.',
    active: true
  },
  {
    id: 'backend-only',
    title: 'Full Backend Only',
    description: 'Reserved for future workflows focused on backend-only generation.',
    active: false
  },
  {
    id: 'customize-backend-only',
    title: 'Customize Backend Only',
    description: 'Reserved for future guided backend configuration support.',
    active: false
  }
];

const DesignEntryPage = () => {
  const navigate = useNavigate();
  const { builderState, updateProject } = useBuilder();

  const handleSelect = (mode, isActive) => {
    if (!isActive) {
      return;
    }

    updateProject({ mode });
    navigate('/business-type');
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-aurora-300">Design entry</p>
          <h1 className="mt-4 font-display text-5xl font-bold text-white">Choose how you want to build with TATKAL</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            The full frontend + backend path is ready for the MVP. The other modes are shown as roadmap placeholders so the product direction stays clear.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {options.map((option) => (
            <button
              className={`tatkal-shell rounded-[32px] p-7 text-left transition ${
                option.active ? 'hover:-translate-y-1 hover:border-aurora-400/30' : 'opacity-70'
              }`}
              key={option.id}
              onClick={() => handleSelect(option.id, option.active)}
              type="button"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                  {option.active ? 'Available' : 'Coming soon'}
                </span>
                {builderState.project.mode === option.id ? (
                  <span className="rounded-full bg-aurora-500/10 px-3 py-1 text-xs font-semibold text-aurora-300">
                    Current
                  </span>
                ) : null}
              </div>
              <h2 className="mt-8 font-display text-3xl font-bold text-white">{option.title}</h2>
              <p className="mt-4 leading-7 text-slate-300">{option.description}</p>
              <div className="mt-8 text-sm font-semibold text-white">
                {option.active ? 'Continue to Business Type' : 'Placeholder only'}
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DesignEntryPage;
