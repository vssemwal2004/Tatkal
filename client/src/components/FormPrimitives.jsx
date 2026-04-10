import { readFileAsDataUrl } from '../utils/fileHelpers';

export const ControlSection = ({ title, subtitle, children }) => (
  <section className="client-card p-4">
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      {subtitle ? <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p> : null}
    </div>
    <div className="space-y-3">{children}</div>
  </section>
);

export const TextField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</span>
    <input
      className="field-base"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  </label>
);

export const ToggleField = ({ label, description, checked, onChange }) => (
  <label className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
    <div className="min-w-0">
      <p className="text-sm font-medium text-slate-900">{label}</p>
      {description ? <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p> : null}
    </div>
    <button
      className={`relative mt-0.5 h-6 w-11 rounded-full transition ${checked ? 'bg-brand-600' : 'bg-slate-300'}`}
      onClick={(event) => {
        event.preventDefault();
        onChange(!checked);
      }}
      type="button"
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${checked ? 'left-5.5' : 'left-0.5'}`} />
    </button>
  </label>
);

export const ColorField = ({ label, value, onChange }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</span>
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
      <input
        className="h-10 w-12 rounded-lg border border-slate-200 bg-transparent"
        onChange={(event) => onChange(event.target.value)}
        type="color"
        value={normalizeColorValue(value)}
      />
      <input className="field-base bg-white" onChange={(event) => onChange(event.target.value)} value={value} />
    </div>
  </label>
);

export const RangeField = ({ label, min, max, step = 1, value, unit = '', onChange }) => (
  <label className="block space-y-2">
    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
      <span>{label}</span>
      <span>
        {value}
        {unit}
      </span>
    </div>
    <input
      className="w-full accent-brand-600"
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
  <label className="block space-y-1.5">
    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</span>
    <select className="field-base" disabled={disabled} onChange={(event) => onChange(event.target.value)} value={value}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export const FileUploadField = ({ label, value, onChange, helper }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</span>
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
      <input
        className="field-base"
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
      {helper ? <p className="mt-2 text-[11px] leading-5 text-slate-500">{helper}</p> : null}
      {value ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
          <img alt={label} className="h-16 w-full rounded-lg object-cover" src={value} />
        </div>
      ) : null}
    </div>
  </label>
);

const normalizeColorValue = (value) => (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : '#0f172a');
