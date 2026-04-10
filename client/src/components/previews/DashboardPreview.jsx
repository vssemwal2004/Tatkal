import PreviewFrame from '../PreviewFrame';

const statCards = [
  { label: 'Live Routes', value: '32' },
  { label: 'Daily Bookings', value: '1.4k' },
  { label: 'Average Rating', value: '4.8' }
];

const fallbackRoutes = [
  { id: 'route-preview-1', from: 'Ahmedabad', to: 'Mumbai', operator: 'Royal Express', departure: '07:15', arrival: '17:45', price: 1240, seatsLeft: 8 },
  { id: 'route-preview-2', from: 'Surat', to: 'Pune', operator: 'Western Connect', departure: '21:00', arrival: '06:50', price: 1180, seatsLeft: 11 }
];

const DashboardPreview = ({ config, project, routes = [] }) => (
  <PreviewFrame title="Dashboard Preview">
    <div className="flex h-full items-center justify-center">
      <div
        className="overflow-hidden rounded-[30px] border border-slate-200 transition-all duration-300 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
        style={{
          width: `${config.width}%`,
          minHeight: `${config.height * 5.6}px`,
          backgroundImage: config.backgroundImage
            ? `linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.92)), url(${config.backgroundImage})`
            : 'linear-gradient(135deg, rgba(219, 234, 254, 0.95), rgba(255, 255, 255, 0.92))',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="p-6" style={{ color: config.textColor }}>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{project.businessType} booking</p>
              <h3 className="mt-2 text-3xl font-bold">{project.projectName || 'Atlas Connect'} Dashboard</h3>
            </div>
            <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600">
              Personalized booking workspace
            </div>
          </div>

          <div
            className="rounded-[28px] border border-slate-200 p-5 shadow-[0_12px_26px_rgba(15,23,42,0.06)]"
            style={{
              width: `${config.cardSize}%`,
              backgroundColor: config.panelColor
            }}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <SearchField label={config.fromLabel} value="Ahmedabad" />
              <SearchField label={config.toLabel} value="Mumbai" />
              <button className="rounded-[22px] px-4 py-4 text-sm font-semibold text-white" style={{ backgroundColor: config.buttonColor }} type="button">
                {config.buttonLabel}
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              {(routes.length ? routes : fallbackRoutes).slice(0, 2).map((route) => (
                <div key={route.id} className="rounded-[22px] border border-slate-200 bg-white/80 px-4 py-3 text-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {route.from} to {route.to}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {route.operator} • {route.departure} - {route.arrival}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-950">Rs {route.price}</p>
                      <p className="mt-1 text-xs text-slate-500">{route.seatsLeft} seats left</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {statCards.map((card) => (
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4" key={card.label}>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{card.label}</p>
                  <p className="mt-3 text-2xl font-bold">{card.value}</p>
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
  <div className="rounded-[22px] border border-slate-200 bg-white/80 px-4 py-4">
    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
    <p className="mt-2 text-sm font-medium text-slate-950">{value}</p>
  </div>
);

export default DashboardPreview;
