import PreviewFrame from '../PreviewFrame';

const bookings = [
  { id: 'BK-1024', route: 'Ahmedabad to Pune', status: 'Completed', date: 'Apr 12, 2026' },
  { id: 'BK-1025', route: 'Mumbai to Jaipur', status: 'Refunded', date: 'Apr 16, 2026' },
  { id: 'BK-1026', route: 'Delhi to Udaipur', status: 'Upcoming', date: 'Apr 24, 2026' }
];

const HistoryPreview = ({ config }) => (
  <PreviewFrame title="Order History Preview">
    <div className="mx-auto max-w-5xl rounded-[30px] border border-white/10 p-6" style={{ backgroundColor: config.surfaceColor, color: config.textColor }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] opacity-60">Order history</p>
          <h3 className="mt-2 text-3xl font-bold">Customer bookings</h3>
        </div>
        <div
          className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]"
          style={{ backgroundColor: `${config.headerColor}20`, color: config.headerColor }}
        >
          Auto-generated summary
        </div>
      </div>

      {config.layout === 'card' ? (
        <div className="grid gap-4 md:grid-cols-3">
          {bookings.map((booking) => (
            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5" key={booking.id}>
              <p className="text-xs uppercase tracking-[0.22em] opacity-60">{booking.id}</p>
              <h4 className="mt-3 text-xl font-bold">{booking.route}</h4>
              <p className="mt-2 text-sm opacity-75">{booking.date}</p>
              <div
                className="mt-5 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: `${config.headerColor}20`, color: config.headerColor }}
              >
                {booking.status}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[26px] border border-white/10 bg-black/15">
          <div
            className="grid grid-cols-[1.1fr_1.6fr_1fr_1fr] gap-4 px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em]"
            style={{ color: config.headerColor }}
          >
            <span>Booking ID</span>
            <span>Route</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          {bookings.map((booking) => (
            <div className="grid grid-cols-[1.1fr_1.6fr_1fr_1fr] gap-4 border-t border-white/8 px-5 py-4 text-sm" key={booking.id}>
              <span>{booking.id}</span>
              <span>{booking.route}</span>
              <span>{booking.status}</span>
              <span>{booking.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </PreviewFrame>
);

export default HistoryPreview;
