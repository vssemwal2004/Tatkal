import { ColorField, ControlSection, SelectField, ToggleField, TextField } from '../FormPrimitives';

const PaymentBuilder = ({ config, updateSection }) => (
  <div className="space-y-5">
    <ControlSection subtitle="Shape the payment section’s theme and action style." title="Theme">
      <SelectField
        label="Button style"
        onChange={(buttonStyle) => updateSection({ buttonStyle })}
        options={[
          { label: 'Rounded', value: 'rounded' },
          { label: 'Pill', value: 'pill' },
          { label: 'Soft', value: 'soft' }
        ]}
        value={config.buttonStyle}
      />
      <ColorField
        label="Accent color"
        onChange={(accentColor) => updateSection({ accentColor })}
        value={config.accentColor}
      />
      <ColorField
        label="Text color"
        onChange={(textColor) => updateSection({ textColor })}
        value={config.textColor}
      />
      <TextField
        label="Surface color"
        onChange={(surfaceColor) => updateSection({ surfaceColor })}
        value={config.surfaceColor}
      />
    </ControlSection>

    <ControlSection subtitle="Toggle the payment methods that appear in the UI." title="Payment Options">
      <ToggleField
        checked={config.options.upi}
        label="UPI"
        onChange={(upi) => updateSection((current) => ({ ...current, options: { ...current.options, upi } }))}
      />
      <ToggleField
        checked={config.options.card}
        label="Card"
        onChange={(card) => updateSection((current) => ({ ...current, options: { ...current.options, card } }))}
      />
      <ToggleField
        checked={config.options.netBanking}
        label="Net Banking"
        onChange={(netBanking) =>
          updateSection((current) => ({ ...current, options: { ...current.options, netBanking } }))
        }
      />
      <ToggleField
        checked={config.options.wallet}
        label="Wallet"
        onChange={(wallet) =>
          updateSection((current) => ({ ...current, options: { ...current.options, wallet } }))
        }
      />
    </ControlSection>
  </div>
);

export default PaymentBuilder;
