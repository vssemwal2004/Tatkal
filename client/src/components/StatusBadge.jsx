const styles = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  approved: 'border-sky-200 bg-sky-50 text-sky-700',
  deployed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  inactive: 'border-rose-200 bg-rose-50 text-rose-700',
  travel: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  event: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700'
};

const StatusBadge = ({ value, className = '' }) => (
  <span
    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize tracking-wide ${
      styles[value] || 'border-slate-200 bg-slate-100 text-slate-700'
    } ${className}`.trim()}
  >
    {value}
  </span>
);

export default StatusBadge;
