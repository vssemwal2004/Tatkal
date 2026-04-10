const app = document.getElementById('app');
const SESSION_KEY = 'tatkal-generated-session';
const BOOKING_KEY = 'tatkal-generated-booking';

const state = {
  config: null,
  session: null,
  booking: loadBooking()
};

function loadBooking() {
  try {
    const value = localStorage.getItem(BOOKING_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

function saveBooking(booking) {
  state.booking = booking;

  if (!booking) {
    localStorage.removeItem(BOOKING_KEY);
    return;
  }

  localStorage.setItem(BOOKING_KEY, JSON.stringify(booking));
}

function loadToken() {
  return localStorage.getItem(SESSION_KEY) || '';
}

function saveToken(token) {
  if (!token) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(SESSION_KEY, token);
}

async function api(path, options = {}) {
  const config = {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  if (options.auth !== false) {
    const token = loadToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(path, config);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || 'Request failed.');
    error.payload = payload;
    throw error;
  }

  return payload;
}

function navigate(path) {
  window.history.pushState({}, '', path);
  renderRoute();
}

function requireAuth() {
  if (!state.session) {
    navigate('/login');
    return false;
  }

  return true;
}

function getInitial(projectName) {
  return String(projectName || 'T').trim().charAt(0).toUpperCase() || 'T';
}

function money(value) {
  return `INR ${Number(value || 0).toLocaleString('en-IN')}`;
}

function setTheme(config) {
  const root = document.documentElement;
  root.style.setProperty('--brand', config.dashboard?.buttonColor || '#2563eb');
  root.style.setProperty('--brand-strong', config.payment?.accentColor || '#1d4ed8');
  root.style.setProperty('--seat-available', config.seatSelection?.availableColor || '#bfdbfe');
  root.style.setProperty('--seat-selected', config.seatSelection?.selectedColor || '#2563eb');
  root.style.setProperty('--seat-booked', config.seatSelection?.bookedColor || '#fb7185');
  root.style.setProperty('--history-accent', config.history?.headerColor || '#2563eb');
  root.style.setProperty('--login-bg', config.loginPage?.backgroundColor || '#f8fafc');
  root.style.setProperty('--login-text', config.loginPage?.textColor || '#0f172a');
  root.style.setProperty('--surface', config.payment?.surfaceColor || '#ffffff');
}

function layout({ body, showNav = true }) {
  const config = state.config;
  const project = config.project || {};
  const logo = config.loginPage?.logo
    ? `<img class="brand-logo" alt="Project logo" src="${config.loginPage.logo}" />`
    : `<div class="brand-badge">${getInitial(project.projectName)}</div>`;

  const nav = showNav && state.session
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
            <p class="brand-title">Generated Platform</p>
            <p class="brand-name">${project.projectName || 'TATKAL Project'}</p>
          </div>
        </div>
        ${nav}
      </div>
      ${body}
    </div>
  `;
}

function attachGlobalEvents() {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigate(link.getAttribute('href'));
    });
  });

  const logoutButton = document.querySelector('[data-logout]');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      saveToken('');
      saveBooking(null);
      state.session = null;
      navigate('/login');
    });
  }
}

function setPage(body, options = {}) {
  app.innerHTML = layout({ body, showNav: options.showNav !== false });
  attachGlobalEvents();
}

function renderLoginPage(message = '') {
  const config = state.config;
  const project = config.project || {};
  const loginConfig = config.loginPage || {};
  const registerFields = [
    loginConfig.signUpName !== false ? 'Name' : null,
    'Email',
    'Password'
  ].filter(Boolean);

  setPage(
    `
      <div class="page-card">
        <div class="login-shell">
          <section class="login-hero">
            <div class="eyebrow">Login First Workflow</div>
            <h1>${loginConfig.headline || 'Welcome back'}</h1>
            <p class="spacer-top helper">${loginConfig.subheading || 'Login opens first, and registration stays one click away on a separate page.'}</p>
            <div class="feature-list spacer-top">
              <div class="summary-card">
                <div class="meta-label">Entry Flow</div>
                <h3>Login opens first</h3>
                <p class="helper">Customers start at the login screen and move into the dashboard after authentication.</p>
              </div>
              <div class="summary-card">
                <div class="meta-label">Register Page</div>
                <h3>Separate account creation</h3>
                <p class="helper">The register link opens a dedicated account page with fields based on the approved design.</p>
              </div>
              <div class="summary-card">
                <div class="meta-label">Business Type</div>
                <h3>${project.businessType || 'travel'} platform</h3>
                <p class="helper">Routes, seats, payment, and history are already wired to the backend package in this ZIP.</p>
              </div>
            </div>
          </section>

          <section class="login-form-card">
            <div class="eyebrow">Secure Access</div>
            <h2>${project.projectName || 'Customer Login'}</h2>
            <p class="helper spacer-top">Use your credentials to continue to the dashboard.</p>
            <form id="login-form" class="feature-list spacer-top">
              <div class="field-group">
                <label for="login-email">Email</label>
                <input class="field" id="login-email" name="email" placeholder="customer@example.com" type="email" required />
              </div>
              <div class="field-group">
                <label for="login-password">Password</label>
                <input class="field" id="login-password" name="password" placeholder="Enter your password" type="password" required />
              </div>
              ${loginConfig.showForgotPassword !== false ? '<div class="helper">Forgot password can be connected later to your preferred recovery flow.</div>' : ''}
              <button class="button" type="submit">Login</button>
            </form>
            <div class="inline-actions spacer-top">
              <span class="helper">Need an account?</span>
              <a class="button secondary" href="/register" data-nav>Register</a>
            </div>
            <div class="spacer-top helper">Register page fields: ${registerFields.join(', ') || 'Email and Password'}.</div>
            ${message ? `<div class="alert success">${message}</div>` : ''}
            <div id="login-error"></div>
          </section>
        </div>
      </div>
    `,
    { showNav: false }
  );

  document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const response = await api('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: {
          email: form.get('email'),
          password: form.get('password')
        }
      });

      saveToken(response.token);
      state.session = response.user;
      navigate('/dashboard');
    } catch (error) {
      document.getElementById('login-error').innerHTML = `<div class="alert error">${error.message}</div>`;
    }
  });
}

function renderRegisterPage() {
  const config = state.config;
  const loginConfig = config.loginPage || {};

  setPage(
    `
      <div class="page-card">
        <div class="page-grid two-column">
          <section class="section">
            <div class="eyebrow">Create Account</div>
            <h2>Register from a dedicated page</h2>
            <p class="helper spacer-top">This page opens from the login screen so account creation stays separate from sign-in.</p>
            <div class="feature-list spacer-top">
              <div class="summary-card">
                <div class="meta-label">Configured Fields</div>
                <h3>Driven by the client design</h3>
                <p class="helper">Only the fields enabled in the builder are shown here.</p>
              </div>
              <div class="summary-card">
                <div class="meta-label">Next Step</div>
                <h3>Auto login after register</h3>
                <p class="helper">A successful registration moves the user directly to the dashboard flow.</p>
              </div>
            </div>
          </section>

          <section class="section">
            <form id="register-form" class="feature-list">
              ${loginConfig.signUpName !== false ? `
                <div class="field-group">
                  <label for="register-name">Name</label>
                  <input class="field" id="register-name" name="name" placeholder="Enter your full name" type="text" />
                </div>
              ` : ''}
              <div class="field-group">
                <label for="register-email">Email</label>
                <input class="field" id="register-email" name="email" placeholder="customer@example.com" type="email" required />
              </div>
              <div class="field-group">
                <label for="register-password">Password</label>
                <input class="field" id="register-password" name="password" placeholder="Create a password" type="password" required />
              </div>
              <button class="button" type="submit">Create account</button>
            </form>
            <div class="inline-actions spacer-top">
              <span class="helper">Already registered?</span>
              <a class="button ghost" href="/login" data-nav>Back to login</a>
            </div>
            <div id="register-error"></div>
          </section>
        </div>
      </div>
    `,
    { showNav: false }
  );

  document.getElementById('register-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get('email');
    const password = form.get('password');

    try {
      await api('/api/auth/register', {
        method: 'POST',
        auth: false,
        body: {
          name: form.get('name'),
          email,
          password
        }
      });

      const response = await api('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: { email, password }
      });

      saveToken(response.token);
      state.session = response.user;
      navigate('/dashboard');
    } catch (error) {
      document.getElementById('register-error').innerHTML = `<div class="alert error">${error.message}</div>`;
    }
  });
}

function renderDashboardPage() {
  if (!requireAuth()) {
    return;
  }

  const config = state.config;
  const routes = config.routes || [];
  const fromOptions = [...new Set(routes.map((route) => route.from).filter(Boolean))];
  const toOptions = [...new Set(routes.map((route) => route.to).filter(Boolean))];

  setPage(`
    <section class="hero">
      <div class="eyebrow">Customer Dashboard</div>
      <h1>${config.project.projectName || 'Booking Dashboard'}</h1>
      <p class="helper spacer-top">After login the customer lands here, selects ${config.dashboard?.fromLabel || 'From'} and ${config.dashboard?.toLabel || 'To'}, and continues to the next page.</p>
      <div class="metric-grid spacer-top">
        <div class="metric-card">
          <div class="metric-label">Business Type</div>
          <div class="metric-value">${config.project.businessType || 'travel'}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Routes</div>
          <div class="metric-value">${routes.length}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Signed In As</div>
          <div class="metric-value">${state.session.name}</div>
        </div>
      </div>
    </section>

    <section class="page-card spacer-top">
      <div class="page-grid">
        <div class="section">
          <div class="eyebrow">Search Journey</div>
          <h2>Move to the next page from here</h2>
          <form id="search-form" class="feature-list spacer-top">
            <div class="field-group">
              <label for="search-from">${config.dashboard?.fromLabel || 'From'}</label>
              <select class="select" id="search-from" name="from" required>
                ${fromOptions.map((item) => `<option value="${item}">${item}</option>`).join('')}
              </select>
            </div>
            <div class="field-group">
              <label for="search-to">${config.dashboard?.toLabel || 'To'}</label>
              <select class="select" id="search-to" name="to" required>
                ${toOptions.map((item) => `<option value="${item}">${item}</option>`).join('')}
              </select>
            </div>
            <button class="button" type="submit">${config.dashboard?.buttonLabel || 'Search routes'}</button>
          </form>
        </div>
      </div>
    </section>
  `);

  document.getElementById('search-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const from = encodeURIComponent(form.get('from'));
    const to = encodeURIComponent(form.get('to'));
    navigate(`/results?from=${from}&to=${to}`);
  });
}

async function renderResultsPage() {
  if (!requireAuth()) {
    return;
  }

  const params = new URLSearchParams(location.search);
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const response = await api(`/api/routes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, { auth: false });
  const items = response.items || [];

  setPage(`
    <section class="hero">
      <div class="eyebrow">Matching Routes</div>
      <h1>${from || 'Any origin'} to ${to || 'Any destination'}</h1>
      <p class="helper spacer-top">Choose a route to continue into seat selection.</p>
    </section>

    <section class="page-card spacer-top">
      <div class="page-grid">
        <div class="result-list">
          ${items.length ? items.map((route) => `
            <article class="result-card">
              <div class="tag">${route.operator || 'Operator'}</div>
              <h3>${route.from} to ${route.to}</h3>
              <div class="meta-row"><span>${route.departure} - ${route.arrival}</span><strong>${money(route.price)}</strong></div>
              <div class="meta-row"><span>${route.duration}</span><span>${route.seatsLeft} seats left</span></div>
              <div class="inline-actions spacer-top">
                <a class="button" href="/seats?routeId=${encodeURIComponent(route.id)}" data-nav>Select seats</a>
              </div>
            </article>
          `).join('') : '<div class="empty-state">No routes matched this search. Go back to the dashboard and try another pair.</div>'}
        </div>
      </div>
    </section>
  `);
}

async function renderSeatsPage() {
  if (!requireAuth()) {
    return;
  }

  const routeId = new URLSearchParams(location.search).get('routeId');
  if (!routeId) {
    navigate('/dashboard');
    return;
  }

  const [route, seatData] = await Promise.all([
    api(`/api/routes/${encodeURIComponent(routeId)}`, { auth: false }),
    api(`/api/seats?routeId=${encodeURIComponent(routeId)}`, { auth: false })
  ]);

  const rows = seatData.seats || [];
  setPage(`
    <section class="hero">
      <div class="eyebrow">Seat Selection</div>
      <h1>${route.from} to ${route.to}</h1>
      <p class="helper spacer-top">Select an available seat to continue to payment.</p>
      <div class="inline-actions spacer-top">
        <div class="tag">Available</div>
        <div class="tag" style="background: rgba(37, 99, 235, 0.16); color: #1d4ed8;">Selected</div>
        <div class="tag" style="background: rgba(251, 113, 133, 0.18); color: #b91c1c;">Booked</div>
      </div>
    </section>

    <section class="page-card spacer-top">
      <div class="page-grid">
        <div class="seat-grid">
          ${rows.map((row) => `
            <div class="seat-row" style="grid-template-columns: repeat(${row.length}, minmax(0, 1fr));">
              ${row.map((seat) => {
                if (!seat) {
                  return '<div class="seat-gap"></div>';
                }

                return `<button class="seat ${seat.status}" type="button" data-seat="${seat.id}" ${seat.status !== 'available' ? 'disabled' : ''}>${seat.id}</button>`;
              }).join('')}
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
        const response = await api('/api/seats/lock', {
          method: 'POST',
          body: {
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

async function renderPaymentPage() {
  if (!requireAuth()) {
    return;
  }

  const routeId = new URLSearchParams(location.search).get('routeId');
  const booking = state.booking;

  if (!routeId || !booking || booking.routeId !== routeId) {
    navigate('/dashboard');
    return;
  }

  const route = await api(`/api/routes/${encodeURIComponent(routeId)}`, { auth: false });
  const options = Object.entries(state.config.payment?.options || {}).filter(([, enabled]) => enabled);

  setPage(`
    <section class="hero">
      <div class="eyebrow">Payment</div>
      <h1>Confirm your booking</h1>
      <p class="helper spacer-top">This step is backed by the generated backend and confirms the booking into history.</p>
    </section>

    <section class="page-card spacer-top">
      <div class="page-grid two-column">
        <div class="section">
          <div class="meta-label">Selected Route</div>
          <h2>${route.from} to ${route.to}</h2>
          <p class="helper spacer-top">${route.operator} · Seat ${booking.seatId}</p>
          <div class="payment-options spacer-top">
            ${options.map(([key]) => `<div class="summary-card"><strong>${key}</strong><p class="helper">Enabled from the approved client design.</p></div>`).join('')}
          </div>
        </div>

        <div class="section">
          <div class="meta-label">Fare Summary</div>
          <h2>${money(route.price)}</h2>
          <form id="payment-form" class="feature-list spacer-top">
            <div class="field-group">
              <label for="passenger-name">Passenger name</label>
              <input class="field" id="passenger-name" name="passengerName" placeholder="Enter traveler name" required />
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
      const order = await api('/api/payments/create-order', {
        method: 'POST',
        body: {
          routeId,
          seatId: booking.seatId
        }
      });

      await api('/api/bookings/confirm', {
        method: 'POST',
        body: {
          routeId,
          seatId: booking.seatId,
          lockId: booking.lockId,
          orderId: order.orderId
        }
      });

      saveBooking(null);
      navigate('/history');
    } catch (error) {
      document.getElementById('payment-error').innerHTML = `<div class="alert error">${error.message}</div>`;
    }
  });
}

async function renderHistoryPage() {
  if (!requireAuth()) {
    return;
  }

  const response = await api('/api/bookings/history');
  const items = response.items || [];
  const historyConfig = state.config.history || {};

  const historyBody = historyConfig.layout === 'card'
    ? `
      <div class="history-grid">
        ${items.map((item) => `
          <article class="history-card">
            <div class="tag">${item.status}</div>
            <h3>${item.routeLabel}</h3>
            <p class="helper spacer-top">Seat ${item.seatId} · ${item.operator}</p>
            <div class="meta-row"><span>${new Date(item.createdAt).toLocaleString()}</span><strong>${item.priceLabel}</strong></div>
          </article>
        `).join('')}
      </div>
    `
    : `
      <table class="history-table">
        <thead>
          <tr>
            <th>Booking</th>
            <th>Route</th>
            <th>Seat</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item) => `
            <tr>
              <td>${item.id}</td>
              <td>${item.routeLabel}</td>
              <td>${item.seatId}</td>
              <td>${item.status}</td>
              <td>${item.priceLabel}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

  setPage(`
    <section class="hero">
      <div class="eyebrow">Booking History</div>
      <h1>Your confirmed bookings</h1>
      <p class="helper spacer-top">Every confirmed payment is recorded here through the generated backend.</p>
    </section>

    <section class="page-card spacer-top">
      <div class="page-grid">
        ${items.length ? historyBody : '<div class="empty-state">No bookings yet. Complete the dashboard to seat to payment flow to see history here.</div>'}
      </div>
    </section>
  `);
}

async function renderRoute() {
  if (!state.config) {
    return;
  }

  const pathname = location.pathname;

  if (pathname === '/' || pathname === '/login') {
    renderLoginPage();
    return;
  }

  if (pathname === '/register') {
    renderRegisterPage();
    return;
  }

  if (pathname === '/dashboard') {
    renderDashboardPage();
    return;
  }

  if (pathname === '/results') {
    await renderResultsPage();
    return;
  }

  if (pathname === '/seats') {
    await renderSeatsPage();
    return;
  }

  if (pathname === '/payment') {
    await renderPaymentPage();
    return;
  }

  if (pathname === '/history') {
    await renderHistoryPage();
    return;
  }

  navigate('/login');
}

async function bootstrap() {
  try {
    state.config = await api('/api/config', { auth: false });
    setTheme(state.config);

    const token = loadToken();
    if (token) {
      try {
        const session = await api('/api/session');
        state.session = session.user;
      } catch (error) {
        saveToken('');
        state.session = null;
      }
    }

    await renderRoute();
  } catch (error) {
    app.innerHTML = `<div class="app-shell"><div class="alert error">${error.message}</div></div>`;
  }
}

window.addEventListener('popstate', () => {
  renderRoute();
});

bootstrap();
