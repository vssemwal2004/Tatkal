import PreviewFrame from '../PreviewFrame';

const buttonRadius = {
  rounded: '24px',
  pill: '999px',
  soft: '18px'
};

const PaymentPreview = ({ config, project }) => {
  const isEvent = project?.businessType === 'event';
  const paymentOptions = [
    { id: 'upi', label: 'UPI' },
    { id: 'card', label: 'Card' },
    { id: 'netBanking', label: 'Net Banking' },
    { id: 'wallet', label: 'Wallet' }
  ].filter((option) => config.options[option.id]);

  return (
    <PreviewFrame title="Payment Page Preview">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[30px] border border-slate-200 p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]" style={{ backgroundColor: config.surfaceColor, color: config.textColor }}>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Secure checkout</p>
          <h3 className="mt-2 text-3xl font-bold">{isEvent ? 'Confirm your tickets' : 'Confirm your booking'}</h3>
          <div className="mt-6 space-y-4">
            {paymentOptions.map((option, index) => (
              <div
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4"
                key={option.id}
                style={{
                  backgroundColor: index === 0 ? `${config.accentColor}18` : '#f8fafc'
                }}
              >
                <span>{option.label}</span>
                <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{index === 0 ? 'Preferred' : 'Available'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{isEvent ? 'Ticket summary' : 'Fare summary'}</p>
          <div className="mt-6 space-y-4">
            <SummaryRow label={isEvent ? 'Ticket price' : 'Base fare'} value="Rs 1,240" />
            <SummaryRow label="Taxes" value="Rs 110" />
            <SummaryRow label="Service fee" value="Rs 40" />
          </div>
          <div className="mt-6 border-t border-slate-200 pt-5">
            <SummaryRow label="Total" value="Rs 1,390" />
          </div>
          <button
            className="mt-8 w-full px-4 py-4 text-sm font-semibold text-white"
            style={{
              backgroundColor: config.accentColor,
              borderRadius: buttonRadius[config.buttonStyle] || buttonRadius.rounded
            }}
            type="button"
          >
            Pay & Confirm
          </button>
        </div>
      </div>
    </PreviewFrame>
  );
};

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-950">{value}</span>
  </div>
);

export default PaymentPreview;
