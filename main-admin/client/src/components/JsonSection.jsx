const JsonSection = ({ title, data }) => (
  <section className="glass-card rounded-3xl p-4">
    <h4 className="mb-3 text-base font-semibold text-slate-200">{title}</h4>
    <pre className="max-h-80 overflow-auto rounded-2xl border border-white/5 bg-slate-950/80 p-3 text-xs leading-6 text-slate-300">
      {JSON.stringify(data || {}, null, 2)}
    </pre>
  </section>
);

export default JsonSection;
