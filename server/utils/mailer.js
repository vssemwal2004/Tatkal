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

const sendBookingConfirmation = async ({ to, booking, routeLabel, seatLabel }) => {
  const transporter = buildTransport();
  if (!transporter) {
    return { skipped: true, reason: 'smtp_not_configured' };
  }

  const from = getFromAddress();
  if (!from || !to) {
    return { skipped: true, reason: 'missing_from_or_to' };
  }

  const subject = 'Your Tatkal booking is confirmed';
  const routeText = routeLabel ? `Route: ${routeLabel}` : `Route ID: ${booking.routeId}`;
  const seatText = seatLabel || booking.seatId;
  const createdAt = booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-IN') : null;

  const textLines = [
    'Your seat is booked successfully.',
    routeText,
    `Seat: ${seatText}`,
    `Booking ID: ${booking._id}`,
    createdAt ? `Booked At: ${createdAt}` : null
  ].filter(Boolean);

  await transporter.sendMail({
    from,
    to,
    subject,
    text: textLines.join('\n')
  });

  return { sent: true };
};

module.exports = {
  sendBookingConfirmation
};
