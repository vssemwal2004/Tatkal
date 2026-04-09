import PreviewFrame from '../PreviewFrame';

const buttonRadius = {
  rounded: '24px',
  pill: '999px',
  soft: '18px'
};

const PaymentPreview = ({ config }) => {
  const paymentOptions = [
    { id: 'upi', label: 'UPI' },
    { id: 'card', label: 'Card' },
    { id: 'netBanking', label: 'Net Banking' },
    { id: 'wallet', label: 'Wallet' }
  ].filter((option) => config.options[option.id]);

  return (
    <PreviewFrame title="Payment Page Preview">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[30px] border border-white/10 p-6" style={{ backgroundColor: config.surfaceColor, color: config.textColor }}>
          <p className="text-xs uppercase tracking-[0.24em] opacity-60">Secure checkout</p>
          <h3 className="mt-2 text-3xl font-bold">Confirm your booking</h3>
          <div className="mt-6 space-y-4">
            {paymentOptions.map((option, index) => (
              <div
                className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-4"
                key={option.id}
                style={{
                  backgroundColor: index === 0 ? `${config.accentColor}20` : 'rgba(255,255,255,0.03)'
                }}
              >
                <span>{option.label}</span>
                <span className="text-xs uppercase tracking-[0.22em] opacity-70">{index === 0 ? 'Preferred' : 'Available'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-slate-950/70 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Fare summary</p>
          <div className="mt-6 space-y-4">
            <SummaryRow label="Base fare" value="Rs 1,240" />
            <SummaryRow label="Taxes" value="Rs 110" />
            <SummaryRow label="Service fee" value="Rs 40" />
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <SummaryRow label="Total" value="Rs 1,390" />
          </div>
          <button
            className="mt-8 w-full px-4 py-4 text-sm font-semibold text-slate-950"
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
    <span className="text-slate-300">{label}</span>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

export default PaymentPreview;
