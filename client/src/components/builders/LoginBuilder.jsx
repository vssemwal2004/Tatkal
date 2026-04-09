import { ColorField, ControlSection, FileUploadField, TextField, ToggleField } from '../FormPrimitives';

const LoginBuilder = ({ config, updateSection }) => (
  <div className="space-y-5">
    <ControlSection subtitle="Define the first impression of your booking platform." title="Branding & Fields">
      <FileUploadField
        helper="Upload a square logo for the login experience."
        label="Logo"
        onChange={(logo) => updateSection({ logo })}
        value={config.logo}
      />
      <TextField label="Headline" onChange={(headline) => updateSection({ headline })} placeholder="Welcome back" value={config.headline} />
      <TextField
        label="Subheading"
        onChange={(subheading) => updateSection({ subheading })}
        placeholder="Describe the login experience"
        value={config.subheading}
      />
      <ToggleField
        checked={config.showUsername}
        description="Show username input on the sign-in form."
        label="Username field"
        onChange={(showUsername) => updateSection({ showUsername })}
      />
      <ToggleField
        checked={config.showPassword}
        description="Show password input on the sign-in form."
        label="Password field"
        onChange={(showPassword) => updateSection({ showPassword })}
      />
      <ToggleField
        checked={config.showForgotPassword}
        description="Allow a forgot password helper link."
        label="Forgot password link"
        onChange={(showForgotPassword) => updateSection({ showForgotPassword })}
      />
    </ControlSection>

    <ControlSection subtitle="Control which sign-up fields are visible." title="Signup Form">
      <ToggleField checked={config.signUpName} label="Name" onChange={(signUpName) => updateSection({ signUpName })} />
      <ToggleField checked={config.signUpEmail} label="Email" onChange={(signUpEmail) => updateSection({ signUpEmail })} />
      <ToggleField
        checked={config.signUpPassword}
        label="Password"
        onChange={(signUpPassword) => updateSection({ signUpPassword })}
      />
    </ControlSection>

    <ControlSection subtitle="Use theme values for a premium dark layout." title="Colors">
      <ColorField
        label="Background color"
        onChange={(backgroundColor) => updateSection({ backgroundColor })}
        value={config.backgroundColor}
      />
      <ColorField label="Button color" onChange={(buttonColor) => updateSection({ buttonColor })} value={config.buttonColor} />
      <ColorField label="Text color" onChange={(textColor) => updateSection({ textColor })} value={config.textColor} />
    </ControlSection>
  </div>
);

export default LoginBuilder;
