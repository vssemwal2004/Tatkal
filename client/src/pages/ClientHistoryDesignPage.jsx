import AppHeader from '../components/AppHeader';
import BuilderStudioShell from '../components/BuilderStudioShell';
import { getBuilderStepByRoute } from '../data/builderSteps';

const ClientHistoryDesignPage = () => (
  <div className="min-h-screen">
    <AppHeader />
    <BuilderStudioShell step={getBuilderStepByRoute('history')} />
  </div>
);

export default ClientHistoryDesignPage;
