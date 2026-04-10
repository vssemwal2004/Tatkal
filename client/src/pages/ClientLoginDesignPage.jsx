import AppHeader from '../components/AppHeader';
import BuilderStudioShell from '../components/BuilderStudioShell';
import { getBuilderStepByRoute } from '../data/builderSteps';

const ClientLoginDesignPage = () => (
  <div className="min-h-screen">
    <AppHeader />
    <BuilderStudioShell step={getBuilderStepByRoute('login')} />
  </div>
);

export default ClientLoginDesignPage;
