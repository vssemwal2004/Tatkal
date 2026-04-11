import { readFileAsDataUrl } from '../utils/fileHelpers';

export const ControlSection = ({ title, subtitle, children }) => (
  <section className="rounded-[20px] border border-[rgba(13,67,97,0.08)] bg-white px-4 py-4 shadow-[0_10px_22px_rgba(13,67,97,0.04)]">
    <div className="mb-4 border-b border-[rgba(13,67,97,0.08)] pb-3">
      <h3 className="text-[13px] font-semibold text-slate-950">{title}</h3>
      {subtitle ? <p className="mt-1 text-[11px] leading-5 text-[var(--color-muted)]">{subtitle}</p> : null}
    </div>
    <div className="space-y-2.5">{children}</div>
  </section>
);

export const TextField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <label className="block space-y-1">
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{label}</span>
    <input
      className="field-base min-h-[42px] text-[13px]"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  </label>
);

export const ToggleField = ({ label, description, checked, onChange }) => (
  <label className="flex items-start justify-between gap-3 rounded-[16px] border border-[rgba(13,67,97,0.08)] bg-[rgba(248,251,255,0.9)] px-3 py-3">
    <div className="min-w-0">
      <p className="text-[13px] font-medium text-slate-900">{label}</p>
      {description ? <p className="mt-1 text-[11px] leading-5 text-[var(--color-muted)]">{description}</p> : null}
    </div>
    <button
      className={`relative mt-0.5 h-6 w-11 rounded-full transition-all duration-300 ${checked ? 'bg-[var(--color-primary)]' : 'bg-slate-300'}`}
      onClick={(event) => {
        event.preventDefault();
        onChange(!checked);
      }}
      type="button"
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ${checked ? 'left-5.5' : 'left-0.5'}`} />
    </button>
  </label>
);

export const ColorField = ({ label, value, onChange }) => (
  <label className="block space-y-1">
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{label}</span>
    <div className="flex items-center gap-2 rounded-[16px] border border-[rgba(13,67,97,0.08)] bg-[rgba(248,251,255,0.9)] p-2">
      <input
        className="h-10 w-12 rounded-lg border border-[rgba(13,67,97,0.1)] bg-transparent"
        onChange={(event) => onChange(event.target.value)}
        type="color"
        value={normalizeColorValue(value)}
      />
      <input className="field-base min-h-[40px] bg-white text-[13px]" onChange={(event) => onChange(event.target.value)} value={value} />
    </div>
  </label>
);

export const RangeField = ({ label, min, max, step = 1, value, unit = '', onChange }) => (
  <label className="block space-y-2">
    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
      <span>{label}</span>
      <span>
        {value}
        {unit}
      </span>
    </div>
    <input
      className="w-full accent-[var(--color-primary)]"
      max={max}
      min={min}
      onChange={(event) => onChange(Number(event.target.value))}
      step={step}
      type="range"
      value={value}
    />
  </label>
);

export const SelectField = ({ label, value, onChange, options, disabled = false }) => (
  <label className="block space-y-1">
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{label}</span>
    <select className="field-base min-h-[42px] text-[13px]" disabled={disabled} onChange={(event) => onChange(event.target.value)} value={value}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export const FileUploadField = ({ label, value, onChange, helper }) => (
  <label className="block space-y-1">
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{label}</span>
    <div className="rounded-[16px] border border-dashed border-[rgba(13,67,97,0.18)] bg-[rgba(248,251,255,0.9)] p-3">
      <input
        className="field-base min-h-[42px] text-[13px]"
        onChange={async (event) => {
          const file = event.target.files?.[0];

          if (!file) {
            return;
          }

          const nextValue = await readFileAsDataUrl(file);
          onChange(nextValue);
        }}
        type="file"
      />
      {helper ? <p className="mt-2 text-[11px] leading-5 text-[var(--color-muted)]">{helper}</p> : null}
      {value ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-[rgba(13,67,97,0.08)] bg-white p-2">
          <img alt={label} className="h-16 w-full rounded-lg object-cover" src={value} />
        </div>
      ) : null}
    </div>
  </label>
);

const normalizeColorValue = (value) => (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : '#0f172a');
