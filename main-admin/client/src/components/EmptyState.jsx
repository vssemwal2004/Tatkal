const EmptyState = ({ title, description }) => (
  <div className="glass-card rounded-3xl p-8 text-center">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{description}</p>
  </div>
);

export default EmptyState;
