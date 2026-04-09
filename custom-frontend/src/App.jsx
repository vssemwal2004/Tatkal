import { Navigate, Route, Routes } from 'react-router-dom';

import BuilderPage from './pages/BuilderPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import BusinessTypePage from './pages/BusinessTypePage';
import DesignEntryPage from './pages/DesignEntryPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TrackingPage from './pages/TrackingPage';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute role="client">
          <ClientDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/design-entry"
      element={
        <ProtectedRoute role="client">
          <DesignEntryPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/business-type"
      element={
        <ProtectedRoute role="client">
          <BusinessTypePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/builder"
      element={
        <ProtectedRoute role="client">
          <BuilderPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/track"
      element={
        <ProtectedRoute role="client">
          <TrackingPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
