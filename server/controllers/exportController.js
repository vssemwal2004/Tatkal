const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const Client = require('../models/Client');
const Design = require('../models/Design');

const readInlineCssFromDist = () => {
  const distDir = path.resolve(__dirname, '..', '..', 'client', 'dist');
  const indexPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexPath)) {
    throw new Error('client/dist/index.html not found. Run `npm run build` in client first.');
  }

  const html = fs.readFileSync(indexPath, 'utf-8');
  const cssRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/g;
  let cssOutput = '';
  let match;

  while ((match = cssRegex.exec(html)) !== null) {
    const href = match[1];
    const cleaned = href.replace(/^\/+/, '');
    const filePath = path.join(distDir, cleaned);
    if (fs.existsSync(filePath)) {
      cssOutput += fs.readFileSync(filePath, 'utf-8') + '\n';
    }
  }

  return cssOutput;
};

const safe = (value, fallback = '') => (value === undefined || value === null ? fallback : String(value));

const buildClientPreviewHtml = ({ client, design }) => {
  const config = design?.config || {};
  const project = config.project || {};
  const login = config.loginPage || {};
  const dashboard = config.dashboard || {};
  const seat = config.seatSelection || {};
  const payment = config.payment || {};
  const history = config.history || {};

  const routes = config.routes || [];
  const apiBase = process.env.PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
  const clientId = project.clientId || client?.clientId || '';
  const css = readInlineCssFromDist();
  const businessType = project.businessType || client?.businessType || 'travel';

  const seatLayout = seat.layout === '2x3'
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

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safe(project.projectName, 'Tatkal Client')}</title>
    <style>${css}</style>
    <style>.hidden{display:none}</style>
  </head>
  <body class="min-h-screen bg-slate-950 text-white">
    <header class="sticky top-0 z-40 border-b border-white/8 bg-slate-950/60 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-aurora-400/30 bg-aurora-500/10 text-sm font-bold text-aurora-300">TK</div>
          <div>
            <p class="text-lg font-bold tracking-wide text-white">TATKAL</p>
            <p class="text-xs uppercase tracking-[0.28em] text-slate-400">${safe(project.projectName, client?.name || 'Client Suite')}</p>
          </div>
        </div>
        <nav class="flex items-center gap-3">
          <button class="rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-white/6 hover:text-white" onclick="showSection('login')">Login</button>
          <button class="rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-white/6 hover:text-white" onclick="showSection('dashboard')">Dashboard</button>
          <button class="rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-white/6 hover:text-white" onclick="showSection('seat')">${businessType === 'event' ? 'Tickets' : 'Seats'}</button>
          <button class="rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-white/6 hover:text-white" onclick="showSection('payment')">Payment</button>
          <button class="rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-white/6 hover:text-white" onclick="showSection('history')">History</button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-5 py-12 sm:px-8 space-y-12">
      <section id="section-login" class="tatkal-shell rounded-[32px] p-5">
        <div class="flex items-center gap-2 border-b border-white/8 px-5 py-4">
          <span class="h-3 w-3 rounded-full bg-rose-400"></span>
          <span class="h-3 w-3 rounded-full bg-amber-300"></span>
          <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
          <span class="ml-3 text-xs uppercase tracking-[0.24em] text-slate-400">Login Page Preview</span>
        </div>
        <div class="tatkal-grid min-h-[520px] p-5">
          <div class="flex min-h-[470px] items-center justify-center rounded-[28px] border border-white/8 p-5" style="background-color:${safe(login.backgroundColor, '#07111f')}; color:${safe(login.textColor, '#eef2ff')}">
            <div class="grid w-full max-w-5xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div class="rounded-[28px] border border-white/8 bg-black/20 p-7">
                <div class="mb-8 flex items-center gap-4">
                  ${login.logo ? `<img alt="Logo preview" class="h-14 w-14 rounded-2xl object-cover" src="${login.logo}" />` : `
                  <div class="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold" style="background-color:${safe(login.buttonColor, '#3dd9c5')}; color:#04111e">
                    ${(safe(project.projectName, 'T')[0] || 'T')}
                  </div>`}
                  <div>
                    <p class="text-xl font-bold">${safe(project.projectName, 'TATKAL Suite')}</p>
                    <p class="text-sm opacity-70">${safe(login.subheading, 'Launch premium booking experiences in minutes.')}</p>
                  </div>
                </div>

                <div class="space-y-4 rounded-[24px] border border-white/8 bg-black/25 p-6">
                  <div>
                    <p class="text-2xl font-bold">${safe(login.headline, 'Welcome back')}</p>
                    <p class="mt-2 text-sm opacity-75">Secure access for your customers and operators.</p>
                  </div>
                  ${login.showUsername !== false ? `<div class="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.22em] opacity-60">Username</p>
                    <input id="login-email" class="mt-2 w-full bg-transparent text-sm opacity-80 outline-none" placeholder="Enter username" />
                  </div>` : ''}
                  ${login.showPassword !== false ? `<div class="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.22em] opacity-60">Password</p>
                    <input id="login-password" type="password" class="mt-2 w-full bg-transparent text-sm opacity-80 outline-none" placeholder="••••••••" />
                  </div>` : ''}
                  ${login.showForgotPassword !== false ? `<p class="text-right text-xs font-medium opacity-75">Forgot Password?</p>` : ''}
                  <button class="w-full rounded-2xl px-4 py-3 text-sm font-semibold" style="background-color:${safe(login.buttonColor, '#3dd9c5')}; color:#061018" onclick="login()" type="button">
                    Sign in
                  </button>
                </div>
              </div>

              <div class="rounded-[28px] border border-white/8 bg-white/6 p-7">
                <p class="text-xs uppercase tracking-[0.28em] opacity-60">Signup Preview</p>
                <p class="mt-4 text-2xl font-bold">Create customer account</p>
                <div class="mt-6 space-y-4">
                  ${login.signUpName !== false ? `<div class="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.22em] opacity-60">Full name</p>
                    <p class="mt-2 text-sm opacity-80">Enter full name</p>
                  </div>` : ''}
                  ${login.signUpEmail !== false ? `<div class="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.22em] opacity-60">Email address</p>
                    <p class="mt-2 text-sm opacity-80">Enter email address</p>
                  </div>` : ''}
                  ${login.signUpPassword !== false ? `<div class="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.22em] opacity-60">Password</p>
                    <p class="mt-2 text-sm opacity-80">••••••••</p>
                  </div>` : ''}
                </div>
                <div class="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm opacity-75">
                  Real preview updates instantly as each toggle and color setting changes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section-dashboard" class="tatkal-shell rounded-[32px] p-5 hidden">
        <div class="flex items-center gap-2 border-b border-white/8 px-5 py-4">
          <span class="h-3 w-3 rounded-full bg-rose-400"></span>
          <span class="h-3 w-3 rounded-full bg-amber-300"></span>
          <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
          <span class="ml-3 text-xs uppercase tracking-[0.24em] text-slate-400">Dashboard Preview</span>
        </div>
        <div class="tatkal-grid min-h-[520px] p-5">
          <div class="flex h-full items-center justify-center">
            <div class="overflow-hidden rounded-[30px] border border-white/10 transition-all duration-300"
              style="width:${safe(dashboard.width, 88)}%; min-height:${safe(dashboard.height, 74) * 5.6}px; background-image:${dashboard.backgroundImage ? `linear-gradient(180deg, rgba(5, 10, 20, 0.45), rgba(5, 10, 20, 0.86)), url(${dashboard.backgroundImage})` : 'linear-gradient(135deg, rgba(61, 217, 197, 0.12), rgba(7, 17, 31, 0.92))'}; background-size:cover; background-position:center;">
              <div class="p-6" style="color:${safe(dashboard.textColor, '#f8fafc')}">
                <div class="mb-8 flex items-center justify-between">
                  <div>
                    <p class="text-xs uppercase tracking-[0.24em] opacity-70">${safe(project.businessType, 'travel')} booking</p>
                    <h3 class="mt-2 text-3xl font-bold">${safe(project.projectName, 'Atlas Connect')} Dashboard</h3>
                  </div>
                  <div class="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm">Personalized booking workspace</div>
                </div>

                <div class="rounded-[28px] border border-white/10 p-5" style="width:${safe(dashboard.cardSize, 72)}%; background-color:${safe(dashboard.panelColor, 'rgba(7, 17, 31, 0.84)')}">
                  <div class="grid gap-4 md:grid-cols-3">
                    <div class="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
                      <p class="text-xs uppercase tracking-[0.22em] text-slate-400">${safe(dashboard.fromLabel, 'From')}</p>
                      <p class="mt-2 text-sm font-medium text-white">Ahmedabad</p>
                    </div>
                    <div class="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
                      <p class="text-xs uppercase tracking-[0.22em] text-slate-400">${safe(dashboard.toLabel, 'To')}</p>
                      <p class="mt-2 text-sm font-medium text-white">Mumbai</p>
                    </div>
                    <button class="rounded-[22px] px-4 py-4 text-sm font-semibold" style="background-color:${safe(dashboard.buttonColor, '#3dd9c5')}; color:#061018" type="button">
                      ${safe(dashboard.buttonLabel, 'Search journeys')}
                    </button>
                  </div>
                  <div class="mt-5 grid gap-4 md:grid-cols-3">
                    ${['Live Routes','Daily Bookings','Average Rating'].map((label, idx) => `<div class="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p class="text-xs uppercase tracking-[0.22em] opacity-60">${label}</p>
                      <p class="mt-3 text-2xl font-bold">${['32','1.4k','4.8'][idx]}</p>
                    </div>`).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section-seat" class="tatkal-shell rounded-[32px] p-5 hidden">
        <div class="flex items-center gap-2 border-b border-white/8 px-5 py-4">
          <span class="h-3 w-3 rounded-full bg-rose-400"></span>
          <span class="h-3 w-3 rounded-full bg-amber-300"></span>
          <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
          <span class="ml-3 text-xs uppercase tracking-[0.24em] text-slate-400">${businessType === 'event' ? 'Ticket Layout Preview' : 'Seat Layout Preview'}</span>
        </div>
        <div class="tatkal-grid min-h-[520px] p-5">
          ${businessType === 'event' ? `
            <div class="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
              ${[
                { name: 'Premium Deck', color: seat.selectedColor || '#3dd9c5', note: 'Closest to stage' },
                { name: 'Gold Zone', color: seat.availableColor || '#7dd3fc', note: 'High demand visibility' },
                { name: 'Standard Bay', color: seat.bookedColor || '#f97360', note: 'Mostly reserved already' }
              ].map((zone) => `
                <div class="rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
                  <div class="mb-5 h-36 rounded-[24px]" style="background-color:${zone.color}"></div>
                  <p class="text-xs uppercase tracking-[0.24em] text-slate-400">${zone.note}</p>
                  <h3 class="mt-2 text-2xl font-bold text-white">${zone.name}</h3>
                  <p class="mt-3 text-sm text-slate-300">Uses the same config-driven seat state palette as the travel builder.</p>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-slate-950/70 p-6">
              <div class="mb-5 flex items-center justify-between">
                <div>
                  <p class="text-xs uppercase tracking-[0.24em] text-slate-400">Bus layout</p>
                  <h3 class="mt-2 text-2xl font-bold text-white">Choose your seat</h3>
                </div>
                <div class="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">Layout ${safe(seat.layout, '2x2')}</div>
              </div>
              <div class="mb-6 flex flex-wrap gap-3 text-xs text-slate-300">
                <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2"><span class="h-3 w-3 rounded-full" style="background-color:${safe(seat.availableColor, '#7dd3fc')}"></span><span>Available</span></div>
                <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2"><span class="h-3 w-3 rounded-full" style="background-color:${safe(seat.selectedColor, '#3dd9c5')}"></span><span>Selected</span></div>
                <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2"><span class="h-3 w-3 rounded-full" style="background-color:${safe(seat.bookedColor, '#f97360')}"></span><span>Booked</span></div>
              </div>

              <div class="mb-4 flex flex-wrap gap-3">
                <select id="route-select" class="field-base">
                  ${(routes || []).map((route) => `<option value="${route.id || route.routeId || route.name || ''}">${route.label || route.name || route.route || 'Route'}</option>`).join('')}
                </select>
                <button class="button-secondary" type="button" onclick="loadSeats()">Load Seats</button>
              </div>

              <div id="seat-grid" class="space-y-3 rounded-[26px] border border-white/8 bg-white/5 p-5">
                ${seatLayout.map((row) => `
                  <div class="grid gap-3" style="grid-template-columns: repeat(${row.length}, minmax(0, 1fr))">
                    ${row.map((seatId) => seatId ? `
                      <button class="flex h-16 items-center justify-center rounded-2xl text-sm font-semibold text-slate-950" style="background-color:${safe(seat.availableColor, '#7dd3fc')}" data-seat="${seatId}">
                        ${seatId}
                      </button>
                    ` : `<div></div>`).join('')}
                  </div>
                `).join('')}
              </div>
            </div>
          `}
        </div>
      </section>

      <section id="section-payment" class="tatkal-shell rounded-[32px] p-5 hidden">
        <div class="flex items-center gap-2 border-b border-white/8 px-5 py-4">
          <span class="h-3 w-3 rounded-full bg-rose-400"></span>
          <span class="h-3 w-3 rounded-full bg-amber-300"></span>
          <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
          <span class="ml-3 text-xs uppercase tracking-[0.24em] text-slate-400">Payment Page Preview</span>
        </div>
        <div class="tatkal-grid min-h-[520px] p-5">
          <div class="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div class="rounded-[30px] border border-white/10 p-6" style="background-color:${safe(payment.surfaceColor, '#0c1728')}; color:${safe(payment.textColor, '#f8fafc')}">
              <p class="text-xs uppercase tracking-[0.24em] opacity-60">Secure checkout</p>
              <h3 class="mt-2 text-3xl font-bold">Confirm your booking</h3>
              <div class="mt-6 space-y-4">
                ${[
                  { id: 'upi', label: 'UPI' },
                  { id: 'card', label: 'Card' },
                  { id: 'netBanking', label: 'Net Banking' },
                  { id: 'wallet', label: 'Wallet' }
                ].filter((option) => payment?.options ? payment.options[option.id] : option.id !== 'wallet').map((option, idx) => `
                  <div class="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-4" style="background-color:${idx === 0 ? `${safe(payment.accentColor, '#3dd9c5')}20` : 'rgba(255,255,255,0.03)'}">
                    <span>${option.label}</span>
                    <span class="text-xs uppercase tracking-[0.22em] opacity-70">${idx === 0 ? 'Preferred' : 'Available'}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="rounded-[30px] border border-white/10 bg-slate-950/70 p-6 text-white">
              <p class="text-xs uppercase tracking-[0.24em] text-slate-400">Fare summary</p>
              <div class="mt-6 space-y-4">
                ${[['Base fare','Rs 1,240'],['Taxes','Rs 110'],['Service fee','Rs 40']].map((row) => `
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-slate-300">${row[0]}</span>
                    <span class="font-semibold text-white">${row[1]}</span>
                  </div>
                `).join('')}
              </div>
              <div class="mt-6 border-t border-white/10 pt-5">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-300">Total</span>
                  <span class="font-semibold text-white">Rs 1,390</span>
                </div>
              </div>
              <div class="mt-6">
                <input id="payment-amount" class="input-field w-full" placeholder="Amount" type="number" />
                <button class="mt-4 w-full px-4 py-4 text-sm font-semibold text-slate-950" style="background-color:${safe(payment.accentColor, '#3dd9c5')}; border-radius:${payment.buttonStyle === 'pill' ? '999px' : payment.buttonStyle === 'soft' ? '18px' : '24px'}" onclick="createPayment()" type="button">
                  Pay & Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section-history" class="tatkal-shell rounded-[32px] p-5 hidden">
        <div class="flex items-center gap-2 border-b border-white/8 px-5 py-4">
          <span class="h-3 w-3 rounded-full bg-rose-400"></span>
          <span class="h-3 w-3 rounded-full bg-amber-300"></span>
          <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
          <span class="ml-3 text-xs uppercase tracking-[0.24em] text-slate-400">Order History Preview</span>
        </div>
        <div class="tatkal-grid min-h-[520px] p-5">
          <div class="mx-auto max-w-5xl rounded-[30px] border border-white/10 p-6" style="background-color:${safe(history.surfaceColor, '#0c1728')}; color:${safe(history.textColor, '#e2e8f0')}">
            <div class="mb-6 flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.24em] opacity-60">Order history</p>
                <h3 class="mt-2 text-3xl font-bold">Customer bookings</h3>
              </div>
              <div class="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]" style="background-color:${safe(history.headerColor, '#3dd9c5')}20; color:${safe(history.headerColor, '#3dd9c5')}">
                Auto-generated summary
              </div>
            </div>
            <div id="history-list"></div>
            <button class="button-secondary mt-6" onclick="loadHistory()">Refresh history</button>
          </div>
        </div>
      </section>
    </main>

    <script>
      const API_BASE = ${JSON.stringify(apiBase)};
      const CLIENT_ID = ${JSON.stringify(clientId)};
      let token = localStorage.getItem('tatkal_token') || '';

      const showSection = (key) => {
        ['login','dashboard','seat','payment','history'].forEach((section) => {
          const el = document.getElementById('section-' + section);
          if (el) el.classList.toggle('hidden', section !== key);
        });
      };

      const login = async () => {
        const email = document.getElementById('login-email')?.value?.trim();
        const password = document.getElementById('login-password')?.value?.trim();
        const res = await fetch(API_BASE + '/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || 'Login failed');
          return;
        }
        token = data.token;
        localStorage.setItem('tatkal_token', token);
        alert('Login success');
      };

      const loadSeats = () => {
        const routeId = document.getElementById('route-select')?.value || '';
        const seatButtons = document.querySelectorAll('[data-seat]');
        seatButtons.forEach((btn) => {
          btn.onclick = async () => {
            const seatId = btn.getAttribute('data-seat');
            const res = await fetch(API_BASE + '/booking/lock', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
              body: JSON.stringify({ clientId: CLIENT_ID, routeId, seatId })
            });
            const data = await res.json();
            if (!res.ok) {
              alert(data.message || 'Failed to lock seat');
              return;
            }
            alert('Seat locked for a short time');
          };
        });
      };

      const createPayment = async () => {
        const amount = Number(document.getElementById('payment-amount')?.value || 0);
        const res = await fetch(API_BASE + '/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ amount, clientId: CLIENT_ID })
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || 'Payment init failed');
          return;
        }
        alert('Payment order created: ' + data.orderId);
      };

      const loadHistory = async () => {
        const res = await fetch(API_BASE + '/booking/history', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        const list = document.getElementById('history-list');
        list.innerHTML = '';
        if (!res.ok) {
          list.textContent = data.message || 'Failed to load history';
          return;
        }
        if (!data.items || !data.items.length) {
          list.innerHTML = '<p class="text-sm text-slate-400">No bookings yet.</p>';
          return;
        }
        const layout = ${JSON.stringify(history.layout || 'table')};
        if (layout === 'card') {
          list.className = 'grid gap-4 md:grid-cols-3';
          data.items.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'rounded-[26px] border border-white/10 bg-black/20 p-5';
            div.innerHTML = '<p class="text-xs uppercase tracking-[0.22em] opacity-60">' + (item.id || '') + '</p>' +
              '<h4 class="mt-3 text-xl font-bold">' + (item.routeId || '') + '</h4>' +
              '<p class="mt-2 text-sm opacity-75">' + new Date(item.createdAt).toLocaleDateString() + '</p>' +
              '<div class="mt-5 inline-flex rounded-full px-3 py-1 text-xs font-semibold" style="background-color:${safe(history.headerColor, '#3dd9c5')}20; color:${safe(history.headerColor, '#3dd9c5')}">' +
              (item.status || 'confirmed') + '</div>';
            list.appendChild(div);
          });
        } else {
          list.className = 'overflow-hidden rounded-[26px] border border-white/10 bg-black/15';
          const header = document.createElement('div');
          header.className = 'grid grid-cols-[1.1fr_1.6fr_1fr_1fr] gap-4 px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em]';
          header.style.color = ${JSON.stringify(history.headerColor || '#3dd9c5')};
          header.innerHTML = '<span>Booking ID</span><span>Route</span><span>Status</span><span>Date</span>';
          list.appendChild(header);
          data.items.forEach((item) => {
            const row = document.createElement('div');
            row.className = 'grid grid-cols-[1.1fr_1.6fr_1fr_1fr] gap-4 border-t border-white/8 px-5 py-4 text-sm';
            row.innerHTML = '<span>' + (item.id || '') + '</span>' +
              '<span>' + (item.routeId || '') + '</span>' +
              '<span>' + (item.status || 'confirmed') + '</span>' +
              '<span>' + new Date(item.createdAt).toLocaleDateString() + '</span>';
            list.appendChild(row);
          });
        }
      };

      showSection('login');
      loadSeats();
    </script>
  </body>
</html>`;
};

const exportClientZip = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findOne({ clientId }).lean();
    const design = await Design.findOne({ clientId }).sort({ createdAt: -1 }).lean();

    if (!client || !design) {
      return res.status(404).json({ message: 'Client or design not found for export' });
    }

    if (!['approved', 'deployed', 'pending'].includes(design.status)) {
      return res.status(400).json({ message: 'Design status is not ready for export.' });
    }

    const html = buildClientPreviewHtml({ client, design });
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (archiveError) => {
      throw archiveError;
    });

    res.attachment(`${clientId}-frontend.zip`);
    archive.pipe(res);

    archive.append(html, { name: 'index.html' });
    archive.append(JSON.stringify(design.config || {}, null, 2), { name: 'config.json' });
    archive.append(
      JSON.stringify(
        {
          clientId,
          designId: design._id,
          updatedAt: design.updatedAt,
          exportedAt: new Date().toISOString()
        },
        null,
        2
      ),
      { name: 'meta.json' }
    );

    await archive.finalize();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  exportClientZip
};
