import { readFileAsDataUrl } from '../utils/fileHelpers';

export const ControlSection = ({ title, subtitle, children }) => (
  <section className="tatkal-shell rounded-[28px] p-5">
    <div className="mb-4">
      <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

export const TextField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-200">{label}</span>
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
  <label className="flex items-start justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
    <div>
      <p className="text-sm font-medium text-slate-100">{label}</p>
      {description ? <p className="mt-1 text-xs text-slate-400">{description}</p> : null}
    </div>
    <button
      className={`relative mt-1 h-7 w-12 rounded-full transition ${
        checked ? 'bg-aurora-500' : 'bg-slate-700'
      }`}
      onClick={(event) => {
        event.preventDefault();
        onChange(!checked);
      }}
      type="button"
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  </label>
);

export const ColorField = ({ label, value, onChange }) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-200">{label}</span>
    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 p-3">
      <input
        className="h-11 w-14 rounded-xl border border-white/10 bg-transparent"
        onChange={(event) => onChange(event.target.value)}
        type="color"
        value={normalizeColorValue(value)}
      />
      <input
        className="field-base bg-transparent"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </div>
  </label>
);

export const RangeField = ({ label, min, max, step = 1, value, unit = '', onChange }) => (
  <label className="block space-y-2">
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-slate-200">{label}</span>
      <span className="text-slate-400">
        {value}
        {unit}
      </span>
    </div>
    <input
      className="w-full accent-aurora-500"
      max={max}
      min={min}
      onChange={(event) => onChange(Number(event.target.value))}
      step={step}
      type="range"
      value={value}
    />
  </label>
);

export const SelectField = ({ label, value, onChange, options }) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-200">{label}</span>
    <select className="field-base" onChange={(event) => onChange(event.target.value)} value={value}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export const FileUploadField = ({ label, value, onChange, helper }) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-200">{label}</span>
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/4 p-4">
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
      {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}
      {value ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-2">
          <img alt={label} className="h-20 w-full rounded-xl object-cover" src={value} />
        </div>
      ) : null}
    </div>
  </label>
);

const normalizeColorValue = (value) =>
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : '#0f172a';
