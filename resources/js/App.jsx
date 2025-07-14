// resources/js/App.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import '../css/app.css';

// Loading Component
const Loading = () => {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted">Loading...</p>
            </div>
        </div>
    );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <Loading />;
    }
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <Loading />;
    }
    
    return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// Dashboard Component (temporary)
const Dashboard = () => {
    const { user, logout } = useAuth();
    
    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <span className="navbar-brand">Airport Badge System</span>
                    <div className="navbar-nav ms-auto">
                        <span className="navbar-text me-3">Welcome, {user?.name}</span>
                        <button 
                            className="btn btn-outline-light btn-sm"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="mb-0">Dashboard</h4>
                            </div>
                            <div className="card-body">
                                <h5>Welcome to the Airport Badge Management System</h5>
                                <p>You are logged in as: <strong>{user?.name}</strong></p>
                                <p>Function: <strong>{user?.fonction}</strong></p>
                                <p>Service: <strong>{user?.service}</strong></p>
                                <p>Email: <strong>{user?.email}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function AppRoutes() {
    return (
        <Router>
            <Routes>
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
                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                {/* Add other protected routes here */}
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <div>
            <AppRoutes />
        </div>
    );
}

// Render the app
const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);

export default App;