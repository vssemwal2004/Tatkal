import { ColorField, ControlSection, SelectField } from '../FormPrimitives';

const SeatBuilder = ({ config, updateSection, businessType }) => (
  <div className="space-y-5">
    <ControlSection
      subtitle={
        businessType === 'event'
          ? 'Configure tiered ticket zones with a familiar seat-color legend.'
          : 'Configure the bus seat arrangement and its booking states.'
      }
      title={businessType === 'event' ? 'Ticket Layout' : 'Seat Layout'}
    >
      <SelectField
        label={businessType === 'event' ? 'Zone density' : 'Seat layout'}
        onChange={(layout) => updateSection({ layout })}
        options={[
          { label: '2 x 2 layout', value: '2x2' },
          { label: '2 x 3 layout', value: '2x3' }
        ]}
        value={config.layout}
      />
      <ColorField
        label="Available color"
        onChange={(availableColor) => updateSection({ availableColor })}
        value={config.availableColor}
      />
      <ColorField
        label="Selected color"
        onChange={(selectedColor) => updateSection({ selectedColor })}
        value={config.selectedColor}
      />
      <ColorField label="Booked color" onChange={(bookedColor) => updateSection({ bookedColor })} value={config.bookedColor} />
    </ControlSection>
  </div>
);

export default SeatBuilder;
