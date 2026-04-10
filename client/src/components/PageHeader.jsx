const PageHeader = ({ eyebrow = 'TATKAL', title, description, action }) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-slate-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

export default PageHeader;
