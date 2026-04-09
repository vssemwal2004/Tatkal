import PreviewFrame from '../PreviewFrame';

const LoginPreview = ({ config, project }) => (
  <PreviewFrame title="Login Page Preview">
    <div
      className="flex min-h-[470px] items-center justify-center rounded-[28px] border border-white/8 p-5"
      style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
    >
      <div className="grid w-full max-w-5xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-white/8 bg-black/20 p-7">
          <div className="mb-8 flex items-center gap-4">
            {config.logo ? (
              <img alt="Logo preview" className="h-14 w-14 rounded-2xl object-cover" src={config.logo} />
            ) : (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
                style={{ backgroundColor: config.buttonColor, color: '#04111e' }}
              >
                {project.projectName?.slice(0, 1) || 'T'}
              </div>
            )}
            <div>
              <p className="font-display text-xl font-bold">{project.projectName || 'TATKAL Suite'}</p>
              <p className="text-sm opacity-70">{config.subheading}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-[24px] border border-white/8 bg-black/25 p-6">
            <div>
              <p className="font-display text-2xl font-bold">{config.headline}</p>
              <p className="mt-2 text-sm opacity-75">Secure access for your customers and operators.</p>
            </div>
            {config.showUsername ? <FieldCard label="Username" /> : null}
            {config.showPassword ? <FieldCard label="Password" type="password" /> : null}
            {config.showForgotPassword ? (
              <p className="text-right text-xs font-medium opacity-75">Forgot Password?</p>
            ) : null}
            <button
              className="w-full rounded-2xl px-4 py-3 text-sm font-semibold"
              style={{ backgroundColor: config.buttonColor, color: '#061018' }}
              type="button"
            >
              Sign in
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/8 bg-white/6 p-7">
          <p className="text-xs uppercase tracking-[0.28em] opacity-60">Signup Preview</p>
          <p className="mt-4 font-display text-2xl font-bold">Create customer account</p>
          <div className="mt-6 space-y-4">
            {config.signUpName ? <FieldCard label="Full name" /> : null}
            {config.signUpEmail ? <FieldCard label="Email address" /> : null}
            {config.signUpPassword ? <FieldCard label="Password" type="password" /> : null}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm opacity-75">
            Real preview updates instantly as each toggle and color setting changes.
          </div>
        </div>
      </div>
    </div>
  </PreviewFrame>
);

const FieldCard = ({ label, type = 'text' }) => (
  <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.22em] opacity-60">{label}</p>
    <p className="mt-2 text-sm opacity-80">{type === 'password' ? '••••••••' : `Enter ${label.toLowerCase()}`}</p>
  </div>
);

export default LoginPreview;
