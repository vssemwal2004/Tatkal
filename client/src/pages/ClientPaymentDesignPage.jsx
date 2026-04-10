import AppHeader from '../components/AppHeader';
import BuilderStudioShell from '../components/BuilderStudioShell';
import { getBuilderStepByRoute } from '../data/builderSteps';

const ClientPaymentDesignPage = () => (
  <div className="min-h-screen">
    <AppHeader />
    <BuilderStudioShell step={getBuilderStepByRoute('payment')} />
  </div>
);

export default ClientPaymentDesignPage;
