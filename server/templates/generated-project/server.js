const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 5000);
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'app-data.json');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let buffer = '';

    req.on('data', (chunk) => {
      buffer += chunk.toString();

      if (buffer.length > 1_000_000) {
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      if (!buffer) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(buffer));
      } catch (error) {
        reject(new Error('Invalid JSON payload'));
      }
    });

    req.on('error', reject);
  });

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
};

const sendFile = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(res, 404, { message: 'File not found' });
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
};

const createId = (prefix) => `${prefix}_${crypto.randomBytes(6).toString('hex')}`;
const hashPassword = (password) => crypto.createHash('sha256').update(String(password)).digest('hex');

const formatNameFromEmail = (email) =>
  String(email || '')
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Customer';

const buildSeatTemplate = (layout) => {
  if (layout === '2x3') {
    return [
      ['A1', 'A2', null, 'A3', 'A4'],
      ['B1', 'B2', null, 'B3', 'B4'],
      ['C1', 'C2', null, 'C3', 'C4'],
      ['D1', 'D2', null, 'D3', 'D4']
    ];
  }

  return [
    ['A1', 'A2', null, 'A3'],
    ['B1', 'B2', null, 'B3'],
    ['C1', 'C2', null, 'C3'],
    ['D1', 'D2', null, 'D3']
  ];
};

const cleanExpiredLocks = (data) => {
  const now = Date.now();
  data.seatLocks = (data.seatLocks || []).filter((lock) => {
    if (lock.status !== 'locked') {
      return true;
    }

    return new Date(lock.expiresAt).getTime() > now;
  });
};

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return '';
  }

  return authHeader.slice(7).trim();
};

const getAuthenticatedUser = (req, data) => {
  cleanExpiredLocks(data);

  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }

  const session = (data.sessions || []).find((item) => item.token === token);
  if (!session) {
    return null;
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    data.sessions = data.sessions.filter((item) => item.token !== token);
    writeData(data);
    return null;
  }

  return (data.users || []).find((user) => user.id === session.userId) || null;
};

const findRouteById = (data, routeId) => (data.routes || []).find((route) => route.id === routeId);
const getReservedSeatCount = (data, routeId) =>
  (data.bookings || []).filter((item) => item.routeId === routeId).length +
  (data.seatLocks || []).filter((item) => item.routeId === routeId && item.status === 'locked').length;

const decorateRoute = (data, route) => ({
  ...route,
  seatsLeft: Math.max(Number(route.seatsLeft || 0) - getReservedSeatCount(data, route.id), 0)
});

const buildPublicConfig = (data) => ({
  project: data.project,
  loginPage: data.config.loginPage,
  dashboard: data.config.dashboard,
  seatSelection: data.config.seatSelection,
  payment: data.config.payment,
  history: data.config.history,
  routes: (data.routes || []).map((route) => decorateRoute(data, route))
});

const buildSeatPayload = (data, routeId) => {
  const seatRows = buildSeatTemplate(data.config.seatSelection?.layout);
  const bookedIds = new Set(
    (data.bookings || [])
      .filter((item) => item.routeId === routeId)
      .map((item) => item.seatId)
  );
  const lockedIds = new Set(
    (data.seatLocks || [])
      .filter((item) => item.routeId === routeId && item.status === 'locked')
      .map((item) => item.seatId)
  );

  return seatRows.map((row) =>
    row.map((seatId) => {
      if (!seatId) {
        return null;
      }

      return {
        id: seatId,
        status: bookedIds.has(seatId) || lockedIds.has(seatId) ? 'booked' : 'available'
      };
    })
  );
};

const handleApiRequest = async (req, res, url) => {
  const data = readData();
  cleanExpiredLocks(data);

  if (url.pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, { message: 'Generated project is running' });
    return;
  }

  if (url.pathname === '/api/config' && req.method === 'GET') {
    sendJson(res, 200, buildPublicConfig(data));
    return;
  }

  if (url.pathname === '/api/session' && req.method === 'GET') {
    const user = getAuthenticatedUser(req, data);

    if (!user) {
      sendJson(res, 401, { message: 'Unauthorized' });
      return;
    }

    sendJson(res, 200, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    return;
  }

  if (url.pathname === '/api/auth/register' && req.method === 'POST') {
    const body = await parseBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();
    const name = String(body.name || '').trim() || formatNameFromEmail(email);

    if (!email || !password) {
      sendJson(res, 400, { message: 'Email and password are required.' });
      return;
    }

    if ((data.users || []).some((user) => user.email === email)) {
      sendJson(res, 409, { message: 'An account with this email already exists.' });
      return;
    }

    const user = {
      id: createId('user'),
      name,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    data.users.push(user);
    writeData(data);

    sendJson(res, 201, {
      message: 'Account created successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    return;
  }

  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();
    const user = (data.users || []).find((item) => item.email === email);

    if (!user || user.passwordHash !== hashPassword(password)) {
      sendJson(res, 401, { message: 'Invalid credentials.' });
      return;
    }

    const token = createId('session');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

    data.sessions = (data.sessions || []).filter((item) => item.userId !== user.id);
    data.sessions.push({
      token,
      userId: user.id,
      expiresAt
    });
    writeData(data);

    sendJson(res, 200, {
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    return;
  }

  if (url.pathname === '/api/routes' && req.method === 'GET') {
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const items = (data.routes || []).filter((route) => {
      if (from && route.from !== from) {
        return false;
      }

      if (to && route.to !== to) {
        return false;
      }

      return true;
    });

    sendJson(res, 200, { items: items.map((route) => decorateRoute(data, route)) });
    return;
  }

  if (url.pathname.startsWith('/api/routes/') && req.method === 'GET') {
    const routeId = decodeURIComponent(url.pathname.split('/').pop());
    const route = findRouteById(data, routeId);

    if (!route) {
      sendJson(res, 404, { message: 'Route not found.' });
      return;
    }

    sendJson(res, 200, decorateRoute(data, route));
    return;
  }

  if (url.pathname === '/api/seats' && req.method === 'GET') {
    const routeId = url.searchParams.get('routeId');
    const route = findRouteById(data, routeId);

    if (!route) {
      sendJson(res, 404, { message: 'Route not found.' });
      return;
    }

    sendJson(res, 200, {
      route,
      seats: buildSeatPayload(data, routeId)
    });
    return;
  }

  if (url.pathname === '/api/seats/lock' && req.method === 'POST') {
    const user = getAuthenticatedUser(req, data);
    if (!user) {
      sendJson(res, 401, { message: 'Login required.' });
      return;
    }

    const body = await parseBody(req);
    const routeId = String(body.routeId || '').trim();
    const seatId = String(body.seatId || '').trim();
    const route = findRouteById(data, routeId);

    if (!route || !seatId) {
      sendJson(res, 400, { message: 'routeId and seatId are required.' });
      return;
    }

    const seatGrid = buildSeatPayload(data, routeId).flat().filter(Boolean);
    const seat = seatGrid.find((item) => item.id === seatId);

    if (!seat || seat.status !== 'available') {
      sendJson(res, 409, { message: 'Seat is no longer available.' });
      return;
    }

    data.seatLocks = (data.seatLocks || []).filter(
      (lock) => !(lock.userId === user.id && lock.routeId === routeId && lock.status === 'locked')
    );

    const lock = {
      id: createId('lock'),
      userId: user.id,
      routeId,
      seatId,
      status: 'locked',
      expiresAt: new Date(Date.now() + 1000 * 60 * 10).toISOString()
    };

    data.seatLocks.push(lock);
    writeData(data);

    sendJson(res, 200, {
      message: 'Seat locked successfully.',
      lockId: lock.id,
      expiresAt: lock.expiresAt
    });
    return;
  }

  if (url.pathname === '/api/payments/create-order' && req.method === 'POST') {
    const user = getAuthenticatedUser(req, data);
    if (!user) {
      sendJson(res, 401, { message: 'Login required.' });
      return;
    }

    const body = await parseBody(req);
    const route = findRouteById(data, String(body.routeId || '').trim());

    if (!route) {
      sendJson(res, 404, { message: 'Route not found.' });
      return;
    }

    const order = {
      id: createId('order'),
      userId: user.id,
      routeId: route.id,
      seatId: String(body.seatId || '').trim(),
      amount: Number(route.price || 0),
      currency: 'INR',
      status: 'created',
      createdAt: new Date().toISOString()
    };

    data.payments.push(order);
    writeData(data);

    sendJson(res, 200, {
      message: 'Payment order created.',
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
    return;
  }

  if (url.pathname === '/api/bookings/confirm' && req.method === 'POST') {
    const user = getAuthenticatedUser(req, data);
    if (!user) {
      sendJson(res, 401, { message: 'Login required.' });
      return;
    }

    const body = await parseBody(req);
    const lockId = String(body.lockId || '').trim();
    const orderId = String(body.orderId || '').trim();
    const lock = (data.seatLocks || []).find((item) => item.id === lockId && item.userId === user.id);
    const payment = (data.payments || []).find((item) => item.id === orderId && item.userId === user.id);

    if (!lock || lock.status !== 'locked') {
      sendJson(res, 400, { message: 'Seat lock is invalid or has expired.' });
      return;
    }

    if (new Date(lock.expiresAt).getTime() <= Date.now()) {
      lock.status = 'expired';
      writeData(data);
      sendJson(res, 400, { message: 'Seat lock has expired.' });
      return;
    }

    if (!payment || payment.status !== 'created') {
      sendJson(res, 400, { message: 'Payment order not found.' });
      return;
    }

    const route = findRouteById(data, lock.routeId);
    if (!route) {
      sendJson(res, 404, { message: 'Route not found.' });
      return;
    }

    const booking = {
      id: createId('booking'),
      userId: user.id,
      routeId: route.id,
      seatId: lock.seatId,
      amount: payment.amount,
      currency: payment.currency,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    payment.status = 'paid';
    lock.status = 'confirmed';
    data.bookings.push(booking);
    writeData(data);

    sendJson(res, 201, {
      message: 'Booking confirmed successfully.',
      bookingId: booking.id
    });
    return;
  }

  if (url.pathname === '/api/bookings/history' && req.method === 'GET') {
    const user = getAuthenticatedUser(req, data);
    if (!user) {
      sendJson(res, 401, { message: 'Login required.' });
      return;
    }

    const items = (data.bookings || [])
      .filter((item) => item.userId === user.id)
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .map((booking) => {
        const route = findRouteById(data, booking.routeId);

        return {
          ...booking,
          routeLabel: route ? `${route.from} to ${route.to}` : booking.routeId,
          operator: route?.operator || data.project.projectName,
          priceLabel: `INR ${Number(booking.amount || 0).toLocaleString('en-IN')}`
        };
      });

    sendJson(res, 200, { items });
    return;
  }

  sendJson(res, 404, { message: 'API route not found.' });
};

const serveStatic = (req, res, url) => {
  let pathname = url.pathname;

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const targetPath = path.join(PUBLIC_DIR, pathname);
  const normalizedPath = path.normalize(targetPath);

  if (!normalizedPath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { message: 'Forbidden' });
    return;
  }

  if (fs.existsSync(normalizedPath) && fs.statSync(normalizedPath).isFile()) {
    sendFile(res, normalizedPath);
    return;
  }

  sendFile(res, path.join(PUBLIC_DIR, 'index.html'));
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith('/api/')) {
      await handleApiRequest(req, res, url);
      return;
    }

    if (req.method !== 'GET') {
      sendJson(res, 405, { message: 'Method not allowed.' });
      return;
    }

    serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { message: error.message || 'Internal server error.' });
  }
});

server.listen(PORT, () => {
  console.log(`Generated project is running on http://localhost:${PORT}`);
});
