import PageHeader from '../components/PageHeader';

const SettingsPage = () => (
  <section className="space-y-6 fade-rise">
    <PageHeader
      eyebrow="Platform Setup"
      title="Settings"
      description="This MVP keeps settings lightweight, but the page is ready for environment controls and deployment presets."
    />

    <div className="grid gap-4 lg:grid-cols-2">
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-slate-100">Backend Environment</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>`PORT` controls the Express server port.</p>
          <p>`MONGO_URI` connects the admin services to MongoDB.</p>
          <p>`JWT_SECRET` signs admin access tokens.</p>
          <p>`ADMIN_EMAIL` and `ADMIN_PASSWORD` seed the first admin user.</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-slate-100">Security Notes</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>`VITE_API_URL` points the React app to the Express API.</p>
          <p>Tokens are stored in `localStorage` for the admin session.</p>
          <p>All `/api/admin/*` routes require both a valid JWT and the admin role.</p>
          <p>Deployment credentials are generated per project and stored with the design record.</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-100">Future Extension Points</h3>
        <p className="mt-3 text-sm text-slate-400">
          This layout is ready for deployment presets, integration keys, default branding templates, and richer analytics
          without changing the current routing structure.
        </p>
      </div>
    </div>
  </section>
);

export default SettingsPage;
