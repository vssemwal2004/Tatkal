import { Laptop2, Sparkles } from 'lucide-react';

const PreviewFrame = ({ title, children }) => (
  <div className="tatkal-shell overflow-hidden rounded-[28px]">
    <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">{title}</span>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400">
          <Laptop2 className="h-3.5 w-3.5" />
          Desktop
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-aurora-400/20 bg-aurora-500/10 px-2.5 py-1 text-[11px] text-aurora-200">
          <Sparkles className="h-3.5 w-3.5" />
          Live
        </span>
      </div>
    </div>
    <div className="tatkal-grid min-h-[480px] p-4 sm:p-5">{children}</div>
  </div>
);

export default PreviewFrame;
