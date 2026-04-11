import { CalendarClock, Layers3 } from 'lucide-react';

import StatusBadge from './StatusBadge';

const ClientCard = ({ client, onToggleStatus, onToggleFullBackend, onDelete, processing = false }) => (
  <article className="glass-card group rounded-3xl p-5 transition hover:-translate-y-0.5 hover:border-brand-400/50 hover:bg-slate-900/80">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-slate-100">{client.name}</h3>
        <p className="mt-1 text-sm text-slate-600 transition-colors group-hover:text-slate-400">Client ID: {client.clientId}</p>
      </div>
      <StatusBadge value={client.status} />
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <StatusBadge value={client.businessType} />
      <StatusBadge value={client.status} className="opacity-80" />
      <StatusBadge value={client.isActive ? 'active' : 'inactive'} className="opacity-80" />
      <StatusBadge value={client.fullBackendEnabled ? 'full backend on' : 'full backend off'} className="opacity-80" />
    </div>

    <div className="mt-5 space-y-3 text-sm text-slate-600 transition-colors group-hover:text-slate-400">
      <p className="flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-slate-500" />
        Last request: {client.lastRequestAt ? new Date(client.lastRequestAt).toLocaleString() : 'No requests yet'}
      </p>
      <p className="flex items-center gap-2">
        <Layers3 className="h-4 w-4 text-slate-500" />
        Site URL: {client.siteUrl || 'Not deployed'}
      </p>
    </div>

    <div className="mt-5 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={processing}
        onClick={() => onToggleStatus?.(client)}
        className="secondary-button border-sky-400/40 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {client.isActive ? 'Disable Client ID' : 'Activate Client ID'}
      </button>
      <button
        type="button"
        disabled={processing}
        onClick={() => onToggleFullBackend?.(client)}
        className="secondary-button border-amber-400/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {client.fullBackendEnabled ? 'Disable Full Backend' : 'Enable Full Backend'}
      </button>
      <button
        type="button"
        disabled={processing}
        onClick={() => onDelete?.(client)}
        className="secondary-button border-red-400/40 bg-red-500/10 text-red-200 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Delete Client
      </button>
    </div>
  </article>
);

export default ClientCard;
