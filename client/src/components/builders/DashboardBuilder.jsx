import { ColorField, ControlSection, FileUploadField, RangeField, TextField } from '../FormPrimitives';

const DashboardBuilder = ({ config, routes = [], updateRoutes, updateSection, businessType }) => {
  const isEvent = businessType === 'event';
  const labels = {
    fromLabel: isEvent ? 'City label' : 'From label',
    toLabel: isEvent ? 'Venue label' : 'To label',
    buttonLabel: isEvent ? 'Button label' : 'Button label',
    catalogTitle: isEvent ? 'Event Catalog' : 'Route Catalog',
    catalogSubtitle: isEvent
      ? 'These events power the result cards in the generated website flow.'
      : 'These routes power the result cards in the generated website flow.',
    fromField: isEvent ? 'City' : 'From',
    toField: isEvent ? 'Venue' : 'To',
    operatorField: isEvent ? 'Organizer' : 'Operator',
    departureField: isEvent ? 'Start time' : 'Departure',
    arrivalField: isEvent ? 'End time' : 'Arrival',
    priceField: isEvent ? 'Ticket price' : 'Price',
    seatsField: isEvent ? 'Tickets Left' : 'Seats Left'
  };

  return (
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
        placeholder="rgba(255, 255, 255, 0.92)"
        value={config.panelColor}
      />
    </ControlSection>

    <ControlSection subtitle="Tune the composition of the booking search panel." title="Layout Controls">
      <RangeField label="Preview width" max={100} min={60} onChange={(width) => updateSection({ width })} unit="%" value={config.width} />
      <RangeField label="Preview height" max={90} min={48} onChange={(height) => updateSection({ height })} unit="%" value={config.height} />
      <RangeField label="Card size" max={95} min={52} onChange={(cardSize) => updateSection({ cardSize })} unit="%" value={config.cardSize} />
    </ControlSection>

    <ControlSection subtitle="Customize the dashboard search labels and CTA copy." title="Content">
      <TextField
        label={labels.fromLabel}
        onChange={(fromLabel) => updateSection({ fromLabel })}
        placeholder={isEvent ? 'City' : 'From'}
        value={config.fromLabel}
      />
      <TextField
        label={labels.toLabel}
        onChange={(toLabel) => updateSection({ toLabel })}
        placeholder={isEvent ? 'Venue' : 'To'}
        value={config.toLabel}
      />
      <TextField
        label={labels.buttonLabel}
        onChange={(buttonLabel) => updateSection({ buttonLabel })}
        placeholder={isEvent ? 'Search events' : 'Search routes'}
        value={config.buttonLabel}
      />
    </ControlSection>

    <ControlSection subtitle={labels.catalogSubtitle} title={labels.catalogTitle}>
      <div className="space-y-3">
        {routes.map((route, index) => (
          <div key={route.id || index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label={labels.fromField}
                onChange={(value) => updateRouteField(updateRoutes, index, 'from', value)}
                placeholder={isEvent ? 'Mumbai' : 'Ahmedabad'}
                value={route.from}
              />
              <TextField
                label={labels.toField}
                onChange={(value) => updateRouteField(updateRoutes, index, 'to', value)}
                placeholder={isEvent ? 'Stadium Night' : 'Mumbai'}
                value={route.to}
              />
              <TextField
                label={labels.operatorField}
                onChange={(value) => updateRouteField(updateRoutes, index, 'operator', value)}
                placeholder={isEvent ? 'Tatkal Live' : 'Royal Express'}
                value={route.operator}
              />
              <TextField
                label="Duration"
                onChange={(value) => updateRouteField(updateRoutes, index, 'duration', value)}
                placeholder="10h 30m"
                value={route.duration}
              />
              <TextField
                label={labels.departureField}
                onChange={(value) => updateRouteField(updateRoutes, index, 'departure', value)}
                placeholder={isEvent ? '18:30' : '07:15'}
                value={route.departure}
              />
              <TextField
                label={labels.arrivalField}
                onChange={(value) => updateRouteField(updateRoutes, index, 'arrival', value)}
                placeholder={isEvent ? '23:00' : '17:45'}
                value={route.arrival}
              />
              <TextField
                label={labels.priceField}
                onChange={(value) => updateRouteField(updateRoutes, index, 'price', value)}
                placeholder="1240"
                type="number"
                value={route.price}
              />
              <TextField
                label={labels.seatsField}
                onChange={(value) => updateRouteField(updateRoutes, index, 'seatsLeft', value)}
                placeholder="8"
                type="number"
                value={route.seatsLeft}
              />
            </div>
          </div>
        ))}
      </div>
    </ControlSection>
    </div>
  );
};

const updateRouteField = (updateRoutes, index, field, value) => {
  if (!updateRoutes) {
    return;
  }

  updateRoutes((current) =>
    current.map((route, routeIndex) =>
      routeIndex === index
        ? {
            ...route,
            [field]: field === 'price' || field === 'seatsLeft' ? Number(value) || 0 : value
          }
        : route
    )
  );
};

export default DashboardBuilder;
