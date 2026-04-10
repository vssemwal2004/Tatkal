import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import BuilderEntryPage from './pages/BuilderEntryPage';
import BuilderPage from './pages/BuilderPage';
import BusinessTypePage from './pages/BusinessTypePage';
import ClientDashboardDesignPage from './pages/ClientDashboardDesignPage';
import ClientHistoryDesignPage from './pages/ClientHistoryDesignPage';
import ClientLoginDesignPage from './pages/ClientLoginDesignPage';
import ClientPaymentDesignPage from './pages/ClientPaymentDesignPage';
import ClientSeatDesignPage from './pages/ClientSeatDesignPage';
import ClientWorkspacePage from './pages/ClientWorkspacePage';
import ClientsPage from './pages/ClientsPage';
import DashboardPage from './pages/DashboardPage';
import DeploymentsPage from './pages/DeploymentsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import RequestsPage from './pages/RequestsPage';
import SettingsPage from './pages/SettingsPage';
import TrackingPage from './pages/TrackingPage';

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route element={<ProtectedRoute requiredRole="admin" />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="requests/:clientId" element={<RequestDetailsPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="deployments" element={<DeploymentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute requiredRole="client" />}>
      <Route path="/client" element={<Navigate to="/client/dashboard" replace />} />
      <Route path="/client/dashboard" element={<ClientWorkspacePage />} />
      <Route path="/client/builder-entry" element={<BuilderEntryPage />} />
      <Route path="/client/business-type" element={<BusinessTypePage />} />
      <Route path="/client/builder" element={<BuilderPage />} />
      <Route path="/client/builder/login" element={<ClientLoginDesignPage />} />
      <Route path="/client/builder/dashboard" element={<ClientDashboardDesignPage />} />
      <Route path="/client/builder/seats" element={<ClientSeatDesignPage />} />
      <Route path="/client/builder/payment" element={<ClientPaymentDesignPage />} />
      <Route path="/client/builder/history" element={<ClientHistoryDesignPage />} />
      <Route path="/client/track" element={<TrackingPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
