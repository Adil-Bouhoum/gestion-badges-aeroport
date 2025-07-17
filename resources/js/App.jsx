// resources/js/App.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserManagement from './components/dashboard/UserManagement';
import BadgeRequestPage from './components/badge/BadgeRequestPage';
import BadgeRequestManagement from './components/badge/BadgeRequestManagement';
import SidebarLayout from './components/layout/SidebarLayout';
import '../css/app.css';

// Loading Spinner
const Loading = () => (
  <div className="min-vh-100 d-flex align-items-center justify-content-center">
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">Loading...</p>
    </div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.is_admin) return <Navigate to="/home" replace />;

  return children;
};

// Public Route Wrapper
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;
  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

// Sample Home Page
const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Welcome back, {user?.name}!</h1>
              <p className="text-muted">Airport Badge Management System</p>
            </div>
            <div className="badge bg-primary fs-6">
              <i className="fas fa-user me-2"></i>
              {user?.role || 'User'}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card border-primary">
            <div className="card-body text-center">
              <i className="fas fa-id-badge fa-3x text-primary mb-3"></i>
              <h5 className="card-title">Request Badge</h5>
              <p className="card-text">Submit a new badge request for airport access</p>
              <a href="/badge-request" className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>
                New Request
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card border-info">
            <div className="card-body text-center">
              <i className="fas fa-list fa-3x text-info mb-3"></i>
              <h5 className="card-title">My Requests</h5>
              <p className="card-text">View and track your badge request status</p>
              <a href="/badge-request" className="btn btn-info">
                <i className="fas fa-eye me-2"></i>
                View Requests
              </a>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card border-success">
              <div className="card-body text-center">
                <i className="fas fa-tasks fa-3x text-success mb-3"></i>
                <h5 className="card-title">Manage Requests</h5>
                <p className="card-text">Review and approve badge requests</p>
                <a href="/admin/badge-requests" className="btn btn-success">
                  <i className="fas fa-cog me-2"></i>
                  Manage
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-info-circle me-2"></i>
                System Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Badge Request Process:</h6>
                  <ol className="list-unstyled">
                    <li><i className="fas fa-check text-success me-2"></i>Submit badge request with required information</li>
                    <li><i className="fas fa-check text-success me-2"></i>Admin reviews and processes your request</li>
                    <li><i className="fas fa-check text-success me-2"></i>Download approved badge as PDF</li>
                  </ol>
                </div>
                <div className="col-md-6">
                  <h6>Access Zones Available:</h6>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-plane me-2 text-primary"></i>Terminal Area</li>
                    <li><i className="fas fa-plane-departure me-2 text-primary"></i>Airside Area</li>
                    <li><i className="fas fa-box me-2 text-primary"></i>Cargo Area</li>
                    <li><i className="fas fa-tools me-2 text-primary"></i>Maintenance Area</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample Placeholder Page
const Placeholder = ({ title }) => (
  <div>
    <h2>{title}</h2>
    <p>This is a placeholder page for {title}.</p>
  </div>
);

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected with Sidebar */}
        <Route path="/*" element={
          <ProtectedRoute>
            <SidebarLayout>
              <Routes>
                <Route path="home" element={<Home />} />
                <Route path="badge-request" element={<BadgeRequestPage />} />
                
                {/* Admin Routes */}
                <Route path="dashboard" element={
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                } />
                <Route path="admin/badge-requests" element={
                  <AdminRoute>
                    <BadgeRequestManagement />
                  </AdminRoute>
                } />
                
                <Route path="placeholder1" element={<Placeholder title="Placeholder 1" />} />
                <Route path="placeholder2" element={<Placeholder title="Placeholder 2" />} />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </SidebarLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

// Render App
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<React.StrictMode><App /></React.StrictMode>);

export default App;