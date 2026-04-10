import PreviewFrame from '../PreviewFrame';

const LoginPreview = ({ config, project }) => (
  <PreviewFrame title="Login Page Preview">
    <div
      className="flex min-h-[470px] items-center justify-center rounded-[28px] border border-slate-200 p-5"
      style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
    >
      <div className="grid w-full max-w-5xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-7 shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
          <div className="mb-8 flex items-center gap-4">
            {config.logo ? (
              <img alt="Logo preview" className="h-14 w-14 rounded-2xl object-cover" src={config.logo} />
            ) : (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white"
                style={{ backgroundColor: config.buttonColor }}
              >
                {project.projectName?.slice(0, 1) || 'T'}
              </div>
            )}
            <div>
              <p className="text-xl font-bold">{project.projectName || 'TATKAL Suite'}</p>
              <p className="text-sm text-slate-500">{config.subheading}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            <div>
              <p className="text-2xl font-bold">{config.headline}</p>
              <p className="mt-2 text-sm text-slate-500">Secure access for your customers and operators.</p>
            </div>
            {config.showUsername ? <FieldCard label="Username" /> : null}
            {config.showPassword ? <FieldCard label="Password" type="password" /> : null}
            {config.showForgotPassword ? <p className="text-right text-xs font-medium text-slate-500">Forgot Password?</p> : null}
            <button className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: config.buttonColor }} type="button">
              Sign in
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-7">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Signup Preview</p>
          <p className="mt-4 text-2xl font-bold">Create customer account</p>
          <div className="mt-6 space-y-4">
            {config.signUpName ? <FieldCard label="Full name" /> : null}
            {config.signUpEmail ? <FieldCard label="Email address" /> : null}
            {config.signUpPassword ? <FieldCard label="Password" type="password" /> : null}
          </div>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            Real preview updates instantly as each toggle and color setting changes.
          </div>
        </div>
      </div>
    </div>
  </PreviewFrame>
);

const FieldCard = ({ label, type = 'text' }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
    <p className="mt-2 text-sm text-slate-600">{type === 'password' ? '********' : `Enter ${label.toLowerCase()}`}</p>
  </div>
);

export default LoginPreview;
