const styles = {
  pending: 'border-amber-400/40 bg-amber-500/10 text-amber-200',
  approved: 'border-sky-400/40 bg-sky-500/10 text-sky-200',
  deployed: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  travel: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200',
  event: 'border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200'
};

const StatusBadge = ({ value, className = '' }) => (
  <span
    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize tracking-wide ${
      styles[value] || 'border-slate-600 bg-slate-800/80 text-slate-200'
    } ${className}`.trim()}
  >
    {value}
  </span>
);

export default StatusBadge;
