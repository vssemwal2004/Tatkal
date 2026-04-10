import { ColorField, ControlSection, FileUploadField, RangeField, TextField } from '../FormPrimitives';

const DashboardBuilder = ({ config, routes = [], updateRoutes, updateSection }) => (
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
      <TextField label="From label" onChange={(fromLabel) => updateSection({ fromLabel })} placeholder="From" value={config.fromLabel} />
      <TextField label="To label" onChange={(toLabel) => updateSection({ toLabel })} placeholder="To" value={config.toLabel} />
      <TextField
        label="Button label"
        onChange={(buttonLabel) => updateSection({ buttonLabel })}
        placeholder="Search routes"
        value={config.buttonLabel}
      />
    </ControlSection>

    <ControlSection subtitle="These routes power the result cards in the generated website flow." title="Route Catalog">
      <div className="space-y-3">
        {routes.map((route, index) => (
          <div key={route.id || index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label="From"
                onChange={(value) => updateRouteField(updateRoutes, index, 'from', value)}
                placeholder="Ahmedabad"
                value={route.from}
              />
              <TextField label="To" onChange={(value) => updateRouteField(updateRoutes, index, 'to', value)} placeholder="Mumbai" value={route.to} />
              <TextField
                label="Operator"
                onChange={(value) => updateRouteField(updateRoutes, index, 'operator', value)}
                placeholder="Royal Express"
                value={route.operator}
              />
              <TextField
                label="Duration"
                onChange={(value) => updateRouteField(updateRoutes, index, 'duration', value)}
                placeholder="10h 30m"
                value={route.duration}
              />
              <TextField
                label="Departure"
                onChange={(value) => updateRouteField(updateRoutes, index, 'departure', value)}
                placeholder="07:15"
                value={route.departure}
              />
              <TextField
                label="Arrival"
                onChange={(value) => updateRouteField(updateRoutes, index, 'arrival', value)}
                placeholder="17:45"
                value={route.arrival}
              />
              <TextField
                label="Price"
                onChange={(value) => updateRouteField(updateRoutes, index, 'price', value)}
                placeholder="1240"
                type="number"
                value={route.price}
              />
              <TextField
                label="Seats Left"
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
