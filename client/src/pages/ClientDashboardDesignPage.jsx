import AppHeader from '../components/AppHeader';
import BuilderStudioShell from '../components/BuilderStudioShell';
import { getBuilderStepByRoute } from '../data/builderSteps';

const ClientDashboardDesignPage = () => (
  <div className="min-h-screen">
    <AppHeader />
    <BuilderStudioShell step={getBuilderStepByRoute('dashboard')} />
  </div>
);

export default ClientDashboardDesignPage;
