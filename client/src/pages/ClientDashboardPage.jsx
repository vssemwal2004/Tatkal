import { Link } from 'react-router-dom';

import AppHeader from '../components/AppHeader';

const ClientDashboardPage = () => {
  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="client-shell">
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-8 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:px-8 sm:py-10">
          <h1 className="text-balance text-[2.2rem] font-semibold tracking-[-0.06em] text-[color:var(--color-secondary)] sm:text-[3rem]">
            Build. Customize. Deploy. Instantly
          </h1>

          <div className="mt-8">
            <div className="inline-flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-[color:var(--color-bg-tint)] p-3 sm:flex-row">
              <Link
                to="/client/workspace"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(178,75,243,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(178,75,243,0.34)]"
              >
                Customize Frontend with Backend
              </Link>

              <button
                type="button"
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-400"
              >
                Customize Backend
              </button>

              <Link
                to="/client/full-backend"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[color:var(--color-secondary)] shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.07)]"
              >
                Backend Only
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClientDashboardPage;
