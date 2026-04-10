const StatCard = ({ title, value, caption, accent = 'from-brand-500 to-brand-400', icon: Icon }) => (
  <article className="glass-card fade-rise overflow-hidden rounded-3xl p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className={`mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r ${accent}`} />
        <p className="text-sm text-slate-400">{title}</p>
        <h3 className="mt-2 text-3xl font-semibold text-slate-900">{value}</h3>
        {caption ? <p className="mt-2 text-sm text-slate-500">{caption}</p> : null}
      </div>
      {Icon ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  </article>
);

export default StatCard;
