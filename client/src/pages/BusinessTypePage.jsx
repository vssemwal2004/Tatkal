import { BusFront, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { useBuilder } from '../context/BuilderContext';

const businessCards = [
  {
    id: 'travel',
    title: 'Travel Booking',
    description: 'Perfect for buses, routes, seats, and travel checkout journeys.',
    icon: BusFront
  },
  {
    id: 'event',
    title: 'Event Booking',
    description: 'Uses the same studio flow with event-oriented seat and ticket styling.',
    icon: CalendarDays
  }
];

const BusinessTypePage = () => {
  const navigate = useNavigate();
  const { client } = useAuth();
  const { builderState, updateProject } = useBuilder();
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!builderState.project.projectName.trim()) {
      setError('Add a platform name before opening the builder.');
      return;
    }

    setError('');
    navigate('/client/builder');
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="client-shell">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className="tatkal-shell rounded-[28px] p-5">
            <p className="client-section-title">Project Setup</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Set the basics before you start designing.</h1>

            <div className="mt-6 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Platform Name</span>
                <input
                  className="field-base"
                  onChange={(event) => updateProject({ projectName: event.target.value })}
                  placeholder="SkyLuxe Express"
                  value={builderState.project.projectName}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Owner Name</span>
                <input
                  className="field-base"
                  onChange={(event) => updateProject({ ownerName: event.target.value })}
                  placeholder="Aarav Shah"
                  value={builderState.project.ownerName || client?.name || ''}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Contact Email</span>
                <input
                  className="field-base"
                  onChange={(event) => updateProject({ contactEmail: event.target.value })}
                  placeholder="owner@brand.com"
                  type="email"
                  value={builderState.project.contactEmail || client?.email || ''}
                />
              </label>
            </div>

            <div className="client-input-card mt-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Client ID</p>
              <p className="mt-2 break-all font-mono text-sm text-slate-200">{builderState.project.clientId}</p>
            </div>

            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

            <button className="button-primary mt-6 w-full" onClick={handleContinue} type="button">
              Continue to Builder
            </button>
          </section>

          <section>
            <p className="client-section-title">Business Type</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Pick the booking experience you want to build.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {businessCards.map((card) => {
                const Icon = card.icon;
                const isSelected = builderState.project.businessType === card.id;

                return (
                  <button
                    className={`client-card p-5 text-left transition ${
                      isSelected
                        ? 'border-aurora-400/40 bg-aurora-500/10 shadow-glow'
                        : 'hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                    key={card.id}
                    onClick={() => updateProject({ businessType: card.id })}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] text-aurora-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      {isSelected ? (
                        <span className="rounded-full border border-aurora-400/20 bg-aurora-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-aurora-200">
                          Selected
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-white">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{card.description}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BusinessTypePage;
