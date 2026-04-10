import AppHeader from '../components/AppHeader';
import BuilderStudioShell from '../components/BuilderStudioShell';
import { getBuilderStepByRoute } from '../data/builderSteps';

const ClientSeatDesignPage = () => (
  <div className="min-h-screen">
    <AppHeader />
    <BuilderStudioShell step={getBuilderStepByRoute('seats')} />
  </div>
);

export default ClientSeatDesignPage;
