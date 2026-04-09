import { ArrowRight, CalendarDays } from 'lucide-react';

import StatusBadge from './StatusBadge';

const RequestCard = ({ request, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="glass-card group flex w-full items-center justify-between gap-3 rounded-3xl p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-400/50 hover:bg-slate-900/80"
  >
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold text-slate-100">{request.clientName}</h3>
        <StatusBadge value={request.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge value={request.businessType} />
        <span className="text-xs text-slate-500">Client ID: {request.clientId}</span>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
        <CalendarDays className="h-4 w-4" />
        {new Date(request.createdAt).toLocaleString()}
      </p>
    </div>
    <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-brand-300" />
  </button>
);

export default RequestCard;
