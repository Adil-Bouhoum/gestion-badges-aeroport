// resources/js/App.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserManagement from './components/dashboard/UserManagement';
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

// Public Route Wrapper
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;
  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

// Sample Home Page
const Home = () => (
  <div>
    <h2>Welcome to the Home Page</h2>
    <p>This is a placeholder Home page.</p>
  </div>
);

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
                <Route path="dashboard" element={<UserManagement />} />
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
