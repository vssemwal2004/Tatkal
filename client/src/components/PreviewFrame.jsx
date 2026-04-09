const PreviewFrame = ({ title, children }) => (
  <div className="tatkal-shell overflow-hidden rounded-[32px]">
    <div className="flex items-center gap-2 border-b border-white/8 px-5 py-4">
      <span className="h-3 w-3 rounded-full bg-rose-400" />
      <span className="h-3 w-3 rounded-full bg-amber-300" />
      <span className="h-3 w-3 rounded-full bg-emerald-400" />
      <span className="ml-3 text-xs uppercase tracking-[0.24em] text-slate-400">{title}</span>
    </div>
    <div className="tatkal-grid min-h-[520px] p-5">{children}</div>
  </div>
);

export default PreviewFrame;
