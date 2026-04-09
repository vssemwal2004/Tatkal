import { ColorField, ControlSection, SelectField } from '../FormPrimitives';

const HistoryBuilder = ({ config, updateSection }) => (
  <div className="space-y-5">
    <ControlSection subtitle="Choose how historical bookings are presented." title="Layout">
      <SelectField
        label="History layout"
        onChange={(layout) => updateSection({ layout })}
        options={[
          { label: 'Table layout', value: 'table' },
          { label: 'Card layout', value: 'card' }
        ]}
        value={config.layout}
      />
      <ColorField
        label="Surface color"
        onChange={(surfaceColor) => updateSection({ surfaceColor })}
        value={config.surfaceColor}
      />
      <ColorField
        label="Text color"
        onChange={(textColor) => updateSection({ textColor })}
        value={config.textColor}
      />
      <ColorField
        label="Header color"
        onChange={(headerColor) => updateSection({ headerColor })}
        value={config.headerColor}
      />
    </ControlSection>
  </div>
);

export default HistoryBuilder;
