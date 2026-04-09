import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { useBuilder } from '../context/BuilderContext';

const businessCards = [
  { id: 'travel', title: 'Travel Booking', description: 'Builder includes dashboard and travel seat selection preview.' },
  { id: 'event', title: 'Event Booking', description: 'Builder adapts the same workflow for event-focused ticketing experiences.' }
];

const BusinessTypePage = () => {
  const navigate = useNavigate();
  const { builderState, updateProject } = useBuilder();
  const { client } = useAuth();
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!builderState.project.projectName.trim()) {
      setError('Add a platform name before opening the builder.');
      return;
    }

    setError('');
    navigate('/builder');
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="tatkal-shell rounded-[34px] p-7">
            <p className="text-xs uppercase tracking-[0.28em] text-flame-400">Project Setup</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white">Define the business and project identity</h1>
            <div className="mt-8 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Platform name</span>
                <input
                  className="field-base"
                  onChange={(event) => updateProject({ projectName: event.target.value })}
                  placeholder="SkyLuxe Express"
                  value={builderState.project.projectName}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Owner name</span>
                <input
                  className="field-base"
                  onChange={(event) => updateProject({ ownerName: event.target.value })}
                  placeholder="Aarav Shah"
                  value={builderState.project.ownerName || client?.name || ''}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Contact email</span>
                <input
                  className="field-base"
                  onChange={(event) => updateProject({ contactEmail: event.target.value })}
                  placeholder="owner@brand.com"
                  type="email"
                  value={builderState.project.contactEmail || client?.email || ''}
                />
              </label>
            </div>
            <div className="mt-6 rounded-[24px] border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Project ID</p>
              <p className="mt-2 font-mono text-sm text-slate-200">{builderState.project.clientId}</p>
            </div>
            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
            <button className="button-primary mt-8 w-full" onClick={handleContinue} type="button">
              Continue to Builder
            </button>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-aurora-300">Business Type</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white">Choose the booking experience you want to design</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {businessCards.map((card) => {
                const isSelected = builderState.project.businessType === card.id;

                return (
                  <button
                    className={`rounded-[32px] border p-7 text-left transition ${
                      isSelected
                        ? 'border-aurora-400/40 bg-aurora-500/10 shadow-glow'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                    key={card.id}
                    onClick={() => updateProject({ businessType: card.id })}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Template</span>
                      {isSelected ? (
                        <span className="rounded-full bg-aurora-500/15 px-3 py-1 text-xs font-semibold text-aurora-300">
                          Selected
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-6 font-display text-3xl font-bold text-white">{card.title}</h3>
                    <p className="mt-4 leading-7 text-slate-300">{card.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessTypePage;
