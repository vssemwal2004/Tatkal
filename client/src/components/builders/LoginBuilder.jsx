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
        description="Keep the email field visually emphasized on the sign-in form."
        label="Username field"
        onChange={(showUsername) => updateSection({ showUsername })}
      />
      <ToggleField
        checked={config.showPassword}
        description="Keep the password field visually emphasized on the sign-in form."
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

    <ControlSection subtitle="Control which fields appear on the separate register page." title="Register Page">
      <TextField
        label="Register headline"
        onChange={(registerHeadline) => updateSection({ registerHeadline })}
        placeholder="Create account"
        value={config.registerHeadline}
      />
      <TextField
        label="Register subheading"
        onChange={(registerSubheading) => updateSection({ registerSubheading })}
        placeholder="Guide customers through account creation"
        value={config.registerSubheading}
      />
      <ToggleField checked={config.signUpName} label="Name" onChange={(signUpName) => updateSection({ signUpName })} />
      <ToggleField
        checked={config.signUpEmail}
        description="Email stays required for account creation and login."
        label="Email"
        onChange={(signUpEmail) => updateSection({ signUpEmail })}
      />
      <ToggleField
        checked={config.signUpPassword}
        description="Password stays required for account creation and login."
        label="Password"
        onChange={(signUpPassword) => updateSection({ signUpPassword })}
      />
    </ControlSection>

    <ControlSection subtitle="Use theme values for a lighter, cleaner first screen." title="Colors">
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
