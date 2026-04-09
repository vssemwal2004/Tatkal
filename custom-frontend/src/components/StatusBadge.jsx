const labels = {
  draft: 'Draft',
  pending: 'Pending',
  in_review: 'In Review',
  approved: 'In Review',
  deployed: 'Deployed'
};

const styles = {
  draft: 'border-slate-500/30 bg-slate-500/10 text-slate-200',
  pending: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  in_review: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  approved: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  deployed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
      styles[status] || styles.draft
    }`}
  >
    {labels[status] || 'Draft'}
  </span>
);

export default StatusBadge;
