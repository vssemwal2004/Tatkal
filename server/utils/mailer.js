const nodemailer = require('nodemailer');

const buildTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
};

const getFromAddress = () => process.env.SMTP_FROM || process.env.SMTP_USER;

const escapeHtml = (value) => {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const formatCurrency = (amount, currency = 'INR') => {
  const safeAmount = Number(amount || 0);
  if (currency === 'INR') {
    return `₹${safeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${currency} ${safeAmount.toFixed(2)}`;
};

const sendBookingConfirmation = async ({
  to,
  booking,
  routeLabel,
  seatLabel,
  busName,
  busNumber,
  busType,
  journeyDate,
  departureTime,
  arrivalTime,
  amount,
  paymentId
}) => {
  const transporter = buildTransport();
  if (!transporter) {
    return { skipped: true, reason: 'smtp_not_configured' };
  }

  const from = getFromAddress();
  if (!from || !to) {
    return { skipped: true, reason: 'missing_from_or_to' };
  }

  const subject = 'Your Tatkal booking is confirmed';
  const routeText = routeLabel || booking.routeId;
  const seatText = seatLabel || booking.seatId;
  const createdAt = booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-IN') : null;
  const journeyDateText = journeyDate ? new Date(journeyDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
  const amountText = formatCurrency(amount ?? booking.amount, 'INR');
  const paymentText = paymentId || booking?.payment?.paymentId || booking?.payment?.orderId || 'N/A';

  const textLines = [
    'Your seat is booked successfully.',
    `Route: ${routeText || 'N/A'}`,
    `Seat: ${seatText || 'N/A'}`,
    `Booking ID: ${booking._id}`,
    journeyDateText ? `Journey Date: ${journeyDateText}` : null,
    departureTime || arrivalTime ? `Departure: ${departureTime || 'N/A'} | Arrival: ${arrivalTime || 'N/A'}` : null,
    `Amount Paid: ${amountText}`,
    `Payment ID: ${paymentText}`,
    createdAt ? `Booked At: ${createdAt}` : null
  ].filter(Boolean);

  const html = `
  <div style="margin:0;padding:24px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
      <div style="padding:20px 24px;background:#f1f6ff;border-bottom:1px solid #dbe7ff;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <tr>
            <td style="font-size:13px;color:#1d4ed8;font-weight:600;">Booking ID</td>
            <td align="right" style="font-size:13px;color:#1d4ed8;font-weight:600;">Status</td>
          </tr>
          <tr>
            <td style="font-size:18px;color:#1d4ed8;font-weight:700;padding-top:6px;">${escapeHtml(booking._id)}</td>
            <td align="right" style="padding-top:6px;">
              <span style="display:inline-block;background:#dcfce7;color:#166534;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:700;">Confirmed</span>
            </td>
          </tr>
        </table>
      </div>

      <div style="padding:22px 24px 8px;">
        <h2 style="margin:0 0 14px;font-size:20px;color:#0f172a;">Journey Details</h2>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;">
              <div style="font-size:12px;color:#64748b;">Bus Details</div>
              <div style="font-size:16px;font-weight:700;color:#0f172a;">${escapeHtml(busName || 'N/A')}</div>
              <div style="font-size:13px;color:#475569;">${escapeHtml(busNumber || 'N/A')} • ${escapeHtml(busType || 'N/A')}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;">
              <div style="font-size:12px;color:#64748b;">Route</div>
              <div style="font-size:16px;font-weight:700;color:#0f172a;">${escapeHtml(routeText || 'N/A')}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0 2px;">
              <div style="font-size:12px;color:#64748b;">Date & Time</div>
              <div style="font-size:16px;font-weight:700;color:#0f172a;">${escapeHtml(journeyDateText || 'N/A')}</div>
              <div style="font-size:13px;color:#475569;">Departure: ${escapeHtml(departureTime || 'N/A')} | Arrival: ${escapeHtml(arrivalTime || 'N/A')}</div>
            </td>
          </tr>
        </table>
      </div>

      <div style="padding:18px 24px;border-top:1px solid #e2e8f0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <tr>
            <td style="padding-right:12px;vertical-align:top;width:50%;">
              <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:8px;">Seat Information</div>
              <div style="background:#f8fafc;border-radius:12px;padding:14px;">
                <div style="font-size:12px;color:#64748b;">Seat Number</div>
                <div style="font-size:22px;font-weight:700;color:#1d4ed8;margin-top:4px;">${escapeHtml(seatText || 'N/A')}</div>
                <div style="font-size:12px;color:#64748b;margin-top:8px;">Total: 1 seat</div>
              </div>
            </td>
            <td style="padding-left:12px;vertical-align:top;width:50%;">
              <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:8px;">Payment Details</div>
              <div style="background:#f8fafc;border-radius:12px;padding:14px;">
                <div style="font-size:12px;color:#64748b;">Amount Paid</div>
                <div style="font-size:22px;font-weight:700;color:#16a34a;margin-top:4px;">${escapeHtml(amountText)}</div>
                <div style="font-size:12px;color:#64748b;margin-top:8px;">Payment ID</div>
                <div style="font-size:12px;color:#0f172a;word-break:break-all;">${escapeHtml(paymentText)}</div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div style="padding:10px 24px 22px;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#64748b;">
        ${createdAt ? `Booked on ${escapeHtml(createdAt)}` : ''}
      </div>
    </div>
  </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    text: textLines.join('\n'),
    html
  });

  return { sent: true };
};

module.exports = {
  sendBookingConfirmation
};
