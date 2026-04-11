import PreviewFrame from '../PreviewFrame';

const LoginPreview = ({ config, project }) => (
  <PreviewFrame>
    <div
      className="flex min-h-[360px] items-center justify-center rounded-[18px] border border-[rgba(13,67,97,0.06)] p-3 transition-all duration-300"
      style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
    >
      <div className="grid w-full max-w-4xl gap-3 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="rounded-[20px] border border-[rgba(13,67,97,0.06)] bg-white/92 p-4 shadow-[0_12px_30px_rgba(13,67,97,0.06)]">
          <div className="mb-6 flex items-center gap-3">
            {config.logo ? (
              <img alt="Logo preview" className="h-10 w-10 rounded-[12px] object-cover" src={config.logo} />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-[12px] text-sm font-semibold text-white"
                style={{ backgroundColor: config.buttonColor }}
              >
                {project.projectName?.slice(0, 1) || 'T'}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">{project.projectName || 'Tatkal Suite'}</p>
              <p className="text-xs text-slate-500">{config.subheading}</p>
            </div>
          </div>

          <div className="space-y-2.5 rounded-[16px] border border-[rgba(13,67,97,0.06)] bg-[#fbfdff] p-3">
            <div>
              <p className="text-base font-semibold">{config.headline}</p>
              <p className="mt-1 text-xs text-slate-500">Secure access for your customers and operators.</p>
            </div>
            <FieldCard label="Email" />
            <FieldCard label="Password" type="password" />
            {config.showForgotPassword ? <p className="text-right text-[11px] font-medium text-slate-500">Forgot password?</p> : null}
            <button className="w-full rounded-[14px] px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-300" style={{ backgroundColor: config.buttonColor }} type="button">
              Sign in
            </button>
            <p className="text-center text-[12px] text-slate-500">
              Need an account? <span className="font-semibold">Register</span>
            </p>
          </div>
        </div>

        <div className="rounded-[20px] border border-[rgba(13,67,97,0.06)] bg-white/88 p-4 shadow-[0_12px_30px_rgba(13,67,97,0.05)]">
          <p className="text-base font-semibold text-slate-950">{config.registerHeadline || 'Create account'}</p>
          <p className="mt-1 text-[12px] text-slate-500">{config.registerSubheading || 'Create your account to continue'}</p>
          <div className="mt-4 space-y-2.5">
            {config.signUpName ? <FieldCard label="Full name" /> : null}
            <FieldCard label="Email address" />
            <FieldCard label="Password" type="password" />
          </div>
          <button className="mt-4 w-full rounded-[14px] px-4 py-2.5 text-[13px] font-semibold text-white" style={{ backgroundColor: config.buttonColor }} type="button">
            Create account
          </button>
        </div>
      </div>
    </div>
  </PreviewFrame>
);

const FieldCard = ({ label, type = 'text' }) => (
  <div className="rounded-[14px] border border-[rgba(13,67,97,0.06)] bg-white px-3.5 py-3">
    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <p className="mt-1.5 text-[13px] text-slate-600">{type === 'password' ? '********' : `Enter ${label.toLowerCase()}`}</p>
  </div>
);

export default LoginPreview;
