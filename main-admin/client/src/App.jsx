import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import DeploymentsPage from './pages/DeploymentsPage';
import LoginPage from './pages/LoginPage';
import ManagementPage from './pages/ManagementPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import RequestsPage from './pages/RequestsPage';
import SettingsPage from './pages/SettingsPage';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/requests/:clientId" element={<RequestDetailsPage />} />
        <Route path="/management" element={<ManagementPage />} />
        <Route path="/deployments" element={<DeploymentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
