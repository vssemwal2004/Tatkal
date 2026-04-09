import { ColorField, ControlSection, FileUploadField, RangeField, TextField } from '../FormPrimitives';

const DashboardBuilder = ({ config, updateSection }) => (
  <div className="space-y-5">
    <ControlSection subtitle="Set the visual mood of the booking dashboard." title="Hero Surface">
      <FileUploadField
        helper="Upload a banner or ambience image for the dashboard hero."
        label="Background image"
        onChange={(backgroundImage) => updateSection({ backgroundImage })}
        value={config.backgroundImage}
      />
      <ColorField label="Button color" onChange={(buttonColor) => updateSection({ buttonColor })} value={config.buttonColor} />
      <ColorField label="Text color" onChange={(textColor) => updateSection({ textColor })} value={config.textColor} />
      <TextField
        label="Surface tone"
        onChange={(panelColor) => updateSection({ panelColor })}
        placeholder="rgba(7, 17, 31, 0.84)"
        value={config.panelColor}
      />
    </ControlSection>

    <ControlSection subtitle="Tune the composition of the booking search panel." title="Layout Controls">
      <RangeField label="Preview width" max={100} min={60} onChange={(width) => updateSection({ width })} unit="%" value={config.width} />
      <RangeField label="Preview height" max={90} min={48} onChange={(height) => updateSection({ height })} unit="%" value={config.height} />
      <RangeField label="Card size" max={95} min={52} onChange={(cardSize) => updateSection({ cardSize })} unit="%" value={config.cardSize} />
    </ControlSection>

    <ControlSection subtitle="Customize the dashboard search labels and CTA copy." title="Content">
      <TextField label="From label" onChange={(fromLabel) => updateSection({ fromLabel })} placeholder="From" value={config.fromLabel} />
      <TextField label="To label" onChange={(toLabel) => updateSection({ toLabel })} placeholder="To" value={config.toLabel} />
      <TextField
        label="Button label"
        onChange={(buttonLabel) => updateSection({ buttonLabel })}
        placeholder="Search journeys"
        value={config.buttonLabel}
      />
    </ControlSection>
  </div>
);

export default DashboardBuilder;
