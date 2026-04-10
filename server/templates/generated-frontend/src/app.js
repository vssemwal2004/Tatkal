const app = document.getElementById('app');
const TOKEN_KEY = 'tatkal_generated_token';
const USER_KEY = 'tatkal_generated_user';
const BOOKING_KEY = 'tatkal_generated_booking';

const generated = window.__TATKAL_GENERATED_CONFIG__ || {};
const config = generated.config || {};
const project = generated.project || {};
const routes = generated.routes || [];
const clientId = project.clientId || '';
const backendBaseUrl = String(generated.backendBaseUrl || '').replace(/\/$/, '');

const state = {
  token: localStorage.getItem(TOKEN_KEY) || '',
  user: loadStoredUser(),
  booking: loadStoredBooking()
};

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function loadStoredBooking() {
  try {
    const raw = localStorage.getItem(BOOKING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveSession(token, user) {
  state.token = token || '';
  state.user = user || null;

  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
}

function saveBooking(booking) {
  state.booking = booking || null;

  if (!booking) {
    localStorage.removeItem(BOOKING_KEY);
    return;
  }

  localStorage.setItem(BOOKING_KEY, JSON.stringify(booking));
}

function money(value) {
  return `INR ${Number(value || 0).toLocaleString('en-IN')}`;
}

function getInitial(value) {
  return String(value || 'T').trim().charAt(0).toUpperCase() || 'T';
}

function setTheme() {
  const root = document.documentElement;
  root.style.setProperty('--brand', config.dashboard?.buttonColor || '#2563eb');
  root.style.setProperty('--brand-strong', config.payment?.accentColor || '#1d4ed8');
  root.style.setProperty('--seat-available', config.seatSelection?.availableColor || '#bfdbfe');
  root.style.setProperty('--seat-selected', config.seatSelection?.selectedColor || '#2563eb');
  root.style.setProperty('--seat-booked', config.seatSelection?.bookedColor || '#fb7185');
  root.style.setProperty('--history-accent', config.history?.headerColor || '#2563eb');
  root.style.setProperty('--login-bg', config.loginPage?.backgroundColor || '#f8fafc');
  root.style.setProperty('--login-text', config.loginPage?.textColor || '#0f172a');
}

async function api(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {})
  };

  if (options.auth !== false && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(`${backendBaseUrl}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return payload;
}

function navigate(path) {
  history.pushState({}, '', path);
  renderRoute();
}

function guardAuth() {
  if (!state.token) {
    navigate('/login');
    return false;
  }
  return true;
}

function seatLayout(layout) {
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
}

function shell(body, showNav = true) {
  const logo = config.loginPage?.logo
    ? `<img class="brand-logo" alt="Project logo" src="${config.loginPage.logo}" />`
    : `<div class="brand-badge">${getInitial(project.projectName)}</div>`;

  const nav = showNav && state.token
    ? `
      <div class="nav-links">
        <a class="nav-link ${location.pathname === '/dashboard' ? 'active' : ''}" href="/dashboard" data-nav>Dashboard</a>
        <a class="nav-link ${location.pathname === '/history' ? 'active' : ''}" href="/history" data-nav>History</a>
        <button class="logout-link" type="button" data-logout>Logout</button>
      </div>
    `
    : '';

  return `
    <div class="app-shell">
      <div class="topbar">
        <div class="brand">
          ${logo}
          <div>
            <p class="brand-title">Generated Frontend</p>
            <p class="brand-name">${project.projectName || 'TATKAL Platform'}</p>
          </div>
        </div>
        ${nav}
      </div>
      ${body}
    </div>
  `;
}

function setPage(body, showNav = true) {
  app.innerHTML = shell(body, showNav);

  document.querySelectorAll('[data-nav]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      navigate(element.getAttribute('href'));
    });
  });

  const logoutButton = document.querySelector('[data-logout]');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      saveSession('', null);
      saveBooking(null);
      navigate('/login');
    });
  }
}

function renderLogin(message = '') {
  const loginConfig = config.loginPage || {};
  setPage(
    `
    <div class="page-card">
      <div class="login-shell">
        <section class="login-hero">
          <div class="eyebrow">Login First Workflow</div>
          <h1>${loginConfig.headline || 'Welcome back'}</h1>
          <p class="spacer-top helper">${loginConfig.subheading || 'Login first, then continue to dashboard and booking.'}</p>
          <div class="summary-card spacer-top">
            <div class="meta-label">Client ID</div>
            <h3>${clientId}</h3>
            <p class="helper">All booking and payment calls are sent to your central backend for this client.</p>
          </div>
        </section>
        <section class="login-form-card">
          <form id="login-form" class="feature-list">
            <div class="field-group">
              <label>Email</label>
              <input class="field" type="email" name="email" required />
            </div>
            <div class="field-group">
              <label>Password</label>
              <input class="field" type="password" name="password" required />
            </div>
            <button class="button" type="submit">Login</button>
          </form>
          <div class="inline-actions spacer-top">
            <span class="helper">Need an account?</span>
            <a class="button secondary" href="/register" data-nav>Register</a>
          </div>
          ${message ? `<div class="alert success spacer-top">${message}</div>` : ''}
          <div id="login-error"></div>
        </section>
      </div>
    </div>
    `,
    false
  );

  document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const response = await api('/auth/login', {
        method: 'POST',
        auth: false,
        body: {
          email: form.get('email'),
          password: form.get('password')
        }
      });

      saveSession(response.token, response.user);
      navigate('/dashboard');
    } catch (error) {
      document.getElementById('login-error').innerHTML = `<div class="alert error">${error.message}</div>`;
    }
  });
}

function renderRegister() {
  const loginConfig = config.loginPage || {};
  const showName = loginConfig.signUpName !== false;

  setPage(
    `
    <div class="page-card">
      <div class="page-grid two-column">
        <section class="section">
          <div class="eyebrow">Create Account</div>
          <h2>Register and continue to dashboard</h2>
          <p class="helper spacer-top">Registration is saved in your backend and then logs in automatically.</p>
        </section>
        <section class="section">
          <form id="register-form" class="feature-list">
            ${showName ? `
            <div class="field-group">
              <label>Name</label>
              <input class="field" name="name" type="text" />
            </div>` : ''}
            <div class="field-group">
              <label>Email</label>
              <input class="field" name="email" type="email" required />
            </div>
            <div class="field-group">
              <label>Password</label>
              <input class="field" name="password" type="password" required />
            </div>
            <button class="button" type="submit">Create account</button>
          </form>
          <div class="inline-actions spacer-top">
            <a class="button ghost" href="/login" data-nav>Back to login</a>
          </div>
          <div id="register-error"></div>
        </section>
      </div>
    </div>
    `,
    false
  );

  document.getElementById('register-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '');
    const password = String(form.get('password') || '');

    try {
      await api('/auth/register', {
        method: 'POST',
        auth: false,
        body: {
          name: form.get('name'),
          email,
          password
        }
      });

      const response = await api('/auth/login', {
        method: 'POST',
        auth: false,
        body: { email, password }
      });

      saveSession(response.token, response.user);
      navigate('/dashboard');
    } catch (error) {
      document.getElementById('register-error').innerHTML = `<div class="alert error">${error.message}</div>`;
    }
  });
}

function renderDashboard() {
  if (!guardAuth()) return;

  const fromOptions = [...new Set(routes.map((route) => route.from).filter(Boolean))];
  const toOptions = [...new Set(routes.map((route) => route.to).filter(Boolean))];

  setPage(`
    <section class="hero">
      <div class="eyebrow">Customer Dashboard</div>
      <h1>${project.projectName || 'Booking Dashboard'}</h1>
      <p class="helper spacer-top">Search routes and continue to seat selection.</p>
      <div class="metric-grid spacer-top">
        <div class="metric-card"><div class="metric-label">Business Type</div><div class="metric-value">${project.businessType || 'travel'}</div></div>
        <div class="metric-card"><div class="metric-label">Routes</div><div class="metric-value">${routes.length}</div></div>
        <div class="metric-card"><div class="metric-label">Signed In</div><div class="metric-value">${state.user?.name || state.user?.email || ''}</div></div>
      </div>
    </section>
    <section class="page-card spacer-top">
      <div class="page-grid">
        <form id="search-form" class="feature-list">
          <div class="field-group">
            <label>${config.dashboard?.fromLabel || 'From'}</label>
            <select class="select" name="from">${fromOptions.map((item) => `<option value="${item}">${item}</option>`).join('')}</select>
          </div>
          <div class="field-group">
            <label>${config.dashboard?.toLabel || 'To'}</label>
            <select class="select" name="to">${toOptions.map((item) => `<option value="${item}">${item}</option>`).join('')}</select>
          </div>
          <button class="button" type="submit">${config.dashboard?.buttonLabel || 'Search routes'}</button>
        </form>
      </div>
    </section>
  `);

  document.getElementById('search-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    navigate(`/results?from=${encodeURIComponent(form.get('from'))}&to=${encodeURIComponent(form.get('to'))}`);
  });
}

function renderResults() {
  if (!guardAuth()) return;

  const params = new URLSearchParams(location.search);
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const items = routes.filter((route) => (!from || route.from === from) && (!to || route.to === to));

  setPage(`
    <section class="hero">
      <div class="eyebrow">Matching Routes</div>
      <h1>${from || 'Any origin'} to ${to || 'Any destination'}</h1>
      <p class="helper spacer-top">Choose one route to continue.</p>
    </section>
    <section class="page-card spacer-top">
      <div class="page-grid">
        <div class="result-list">
          ${items.length ? items.map((route) => `
            <article class="result-card">
              <div class="tag">${route.operator || 'Operator'}</div>
              <h3>${route.from} to ${route.to}</h3>
              <div class="meta-row"><span>${route.departure} - ${route.arrival}</span><strong>${money(route.price)}</strong></div>
              <div class="inline-actions spacer-top">
                <a class="button" href="/seats?routeId=${encodeURIComponent(route.id)}" data-nav>Select seats</a>
              </div>
            </article>
          `).join('') : '<div class="empty-state">No routes matched this search.</div>'}
        </div>
      </div>
    </section>
  `);
}

function renderSeats() {
  if (!guardAuth()) return;

  const routeId = new URLSearchParams(location.search).get('routeId');
  const route = routes.find((item) => item.id === routeId);

  if (!route) {
    navigate('/dashboard');
    return;
  }

  const rows = seatLayout(config.seatSelection?.layout);

  setPage(`
    <section class="hero">
      <div class="eyebrow">Seat Selection</div>
      <h1>${route.from} to ${route.to}</h1>
      <p class="helper spacer-top">Pick a seat and lock it through your backend.</p>
    </section>
    <section class="page-card spacer-top">
      <div class="page-grid">
        <div class="seat-grid">
          ${rows.map((row) => `
            <div class="seat-row" style="grid-template-columns: repeat(${row.length}, minmax(0, 1fr));">
              ${row.map((seatId) => seatId ? `<button class="seat available" type="button" data-seat="${seatId}">${seatId}</button>` : '<div class="seat-gap"></div>').join('')}
            </div>
          `).join('')}
        </div>
        <div id="seat-error"></div>
      </div>
    </section>
  `);

  document.querySelectorAll('[data-seat]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        const response = await api('/booking/lock', {
          method: 'POST',
          body: {
            clientId,
            routeId,
            seatId: button.getAttribute('data-seat')
          }
        });

        saveBooking({
          routeId,
          seatId: button.getAttribute('data-seat'),
          lockId: response.lockId
        });
        navigate(`/payment?routeId=${encodeURIComponent(routeId)}`);
      } catch (error) {
        document.getElementById('seat-error').innerHTML = `<div class="alert error">${error.message}</div>`;
      }
    });
  });
}

function renderPayment() {
  if (!guardAuth()) return;

  const routeId = new URLSearchParams(location.search).get('routeId');
  const route = routes.find((item) => item.id === routeId);
  const booking = state.booking;

  if (!route || !booking || booking.routeId !== routeId) {
    navigate('/dashboard');
    return;
  }

  setPage(`
    <section class="hero">
      <div class="eyebrow">Payment</div>
      <h1>Confirm your booking</h1>
      <p class="helper spacer-top">Payment and booking confirmation are sent to your backend APIs.</p>
    </section>
    <section class="page-card spacer-top">
      <div class="page-grid two-column">
        <div class="section">
          <div class="meta-label">Route</div>
          <h2>${route.from} to ${route.to}</h2>
          <p class="helper spacer-top">Seat ${booking.seatId}</p>
        </div>
        <div class="section">
          <h2>${money(route.price)}</h2>
          <form id="payment-form" class="feature-list spacer-top">
            <div class="field-group">
              <label>Passenger name</label>
              <input class="field" name="passengerName" required />
            </div>
            <button class="button" type="submit">Pay and confirm</button>
          </form>
          <div id="payment-error"></div>
        </div>
      </div>
    </section>
  `);

  document.getElementById('payment-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      await api('/payment/create-order', {
        method: 'POST',
        body: {
          amount: Number(route.price || 0),
          clientId
        }
      });

      await api('/booking/confirm', {
        method: 'POST',
        body: {
          lockId: booking.lockId,
          amount: Number(route.price || 0),
          currency: 'INR'
        }
      });

      saveBooking(null);
      navigate('/history');
    } catch (error) {
      document.getElementById('payment-error').innerHTML = `<div class="alert error">${error.message}</div>`;
    }
  });
}

async function renderHistory() {
  if (!guardAuth()) return;

  try {
    const response = await api(`/booking/history?clientId=${encodeURIComponent(clientId)}`);
    const items = response.items || [];

    setPage(`
      <section class="hero">
        <div class="eyebrow">Booking History</div>
        <h1>Your bookings</h1>
        <p class="helper spacer-top">History is loaded from your backend.</p>
      </section>
      <section class="page-card spacer-top">
        <div class="page-grid">
          ${items.length ? `
            <table class="history-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Seat</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item) => `
                  <tr>
                    <td>${item.routeId}</td>
                    <td>${item.seatId}</td>
                    <td>${item.status}</td>
                    <td>${money(item.amount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<div class="empty-state">No bookings yet.</div>'}
        </div>
      </section>
    `);
  } catch (error) {
    setPage(`<div class="alert error">${error.message}</div>`);
  }
}

async function renderRoute() {
  const pathname = location.pathname;

  if (pathname === '/' || pathname === '/login') {
    renderLogin();
    return;
  }

  if (pathname === '/register') {
    renderRegister();
    return;
  }

  if (pathname === '/dashboard') {
    renderDashboard();
    return;
  }

  if (pathname === '/results') {
    renderResults();
    return;
  }

  if (pathname === '/seats') {
    renderSeats();
    return;
  }

  if (pathname === '/payment') {
    renderPayment();
    return;
  }

  if (pathname === '/history') {
    await renderHistory();
    return;
  }

  navigate('/login');
}

function bootstrap() {
  if (!backendBaseUrl) {
    app.innerHTML = '<div class="app-shell"><div class="alert error">Missing backend base URL in generated-config.js</div></div>';
    return;
  }

  setTheme();
  renderRoute();
}

window.addEventListener('popstate', () => {
  renderRoute();
});

bootstrap();
