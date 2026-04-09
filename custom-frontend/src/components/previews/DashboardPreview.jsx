import PreviewFrame from '../PreviewFrame';

const statCards = [
  { label: 'Live Routes', value: '32' },
  { label: 'Daily Bookings', value: '1.4k' },
  { label: 'Average Rating', value: '4.8' }
];

const DashboardPreview = ({ config, project }) => (
  <PreviewFrame title="Dashboard Preview">
    <div className="flex h-full items-center justify-center">
      <div
        className="overflow-hidden rounded-[30px] border border-white/10 transition-all duration-300"
        style={{
          width: `${config.width}%`,
          minHeight: `${config.height * 5.6}px`,
          backgroundImage: config.backgroundImage
            ? `linear-gradient(180deg, rgba(5, 10, 20, 0.45), rgba(5, 10, 20, 0.86)), url(${config.backgroundImage})`
            : 'linear-gradient(135deg, rgba(61, 217, 197, 0.12), rgba(7, 17, 31, 0.92))',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="p-6" style={{ color: config.textColor }}>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] opacity-70">{project.businessType} booking</p>
              <h3 className="mt-2 font-display text-3xl font-bold">
                {project.projectName || 'Atlas Connect'} Dashboard
              </h3>
            </div>
            <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm">
              Personalized booking workspace
            </div>
          </div>

          <div
            className="rounded-[28px] border border-white/10 p-5"
            style={{
              width: `${config.cardSize}%`,
              backgroundColor: config.panelColor
            }}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <SearchField label={config.fromLabel} value="Ahmedabad" />
              <SearchField label={config.toLabel} value="Mumbai" />
              <button
                className="rounded-[22px] px-4 py-4 text-sm font-semibold"
                style={{ backgroundColor: config.buttonColor, color: '#061018' }}
                type="button"
              >
                {config.buttonLabel}
              </button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {statCards.map((card) => (
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4" key={card.label}>
                  <p className="text-xs uppercase tracking-[0.22em] opacity-60">{card.label}</p>
                  <p className="mt-3 font-display text-2xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </PreviewFrame>
);

const SearchField = ({ label, value }) => (
  <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
    <p className="mt-2 text-sm font-medium text-white">{value}</p>
  </div>
);

export default DashboardPreview;
