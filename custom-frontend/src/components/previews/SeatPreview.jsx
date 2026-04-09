import PreviewFrame from '../PreviewFrame';

const buildSeatRows = (layout) =>
  layout === '2x3'
    ? [
        ['A1', 'A2', null, 'A3', 'A4'],
        ['B1', 'B2', null, 'B3', 'B4'],
        ['C1', 'C2', null, 'C3', 'C4'],
        ['D1', 'D2', null, 'D3', 'D4']
      ]
    : [
        ['A1', 'A2', null, 'A3'],
        ['B1', 'B2', null, 'B3'],
        ['C1', 'C2', null, 'C3'],
        ['D1', 'D2', null, 'D3']
      ];

const SeatPreview = ({ config, project }) => (
  <PreviewFrame title={project.businessType === 'event' ? 'Ticket Layout Preview' : 'Seat Layout Preview'}>
    {project.businessType === 'event' ? (
      <EventPreview config={config} />
    ) : (
      <TravelPreview config={config} />
    )}
  </PreviewFrame>
);

const TravelPreview = ({ config }) => {
  const seatRows = buildSeatRows(config.layout);

  return (
    <div className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-slate-950/70 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Bus layout</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">Choose your seat</h3>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">
          Layout {config.layout}
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-xs text-slate-300">
        <Legend color={config.availableColor} label="Available" />
        <Legend color={config.selectedColor} label="Selected" />
        <Legend color={config.bookedColor} label="Booked" />
      </div>
      <div className="space-y-3 rounded-[26px] border border-white/8 bg-white/5 p-5">
        {seatRows.map((row, rowIndex) => (
          <div className="grid gap-3" key={`row-${rowIndex}`} style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}>
            {row.map((seat, seatIndex) =>
              seat ? (
                <Seat
                  color={
                    rowIndex === 0 && seatIndex === 0
                      ? config.selectedColor
                      : seat.endsWith('3') || seat.endsWith('4')
                        ? config.bookedColor
                        : config.availableColor
                  }
                  key={seat}
                  label={seat}
                />
              ) : (
                <div key={`gap-${rowIndex}-${seatIndex}`} />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EventPreview = ({ config }) => (
  <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
    {[
      { name: 'Premium Deck', color: config.selectedColor, note: 'Closest to stage' },
      { name: 'Gold Zone', color: config.availableColor, note: 'High demand visibility' },
      { name: 'Standard Bay', color: config.bookedColor, note: 'Mostly reserved already' }
    ].map((zone) => (
      <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6" key={zone.name}>
        <div className="mb-5 h-36 rounded-[24px]" style={{ backgroundColor: zone.color }} />
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{zone.note}</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-white">{zone.name}</h3>
        <p className="mt-3 text-sm text-slate-300">Uses the same config-driven seat state palette as the travel builder.</p>
      </div>
    ))}
  </div>
);

const Seat = ({ color, label }) => (
  <div
    className="flex h-16 items-center justify-center rounded-2xl text-sm font-semibold text-slate-950"
    style={{ backgroundColor: color }}
  >
    {label}
  </div>
);

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
    <span>{label}</span>
  </div>
);

export default SeatPreview;
