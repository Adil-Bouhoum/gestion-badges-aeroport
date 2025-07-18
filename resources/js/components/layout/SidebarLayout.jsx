import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import defaultProfile from '../../../assets/images/default-profile.png';

const SidebarLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/home', icon: 'fas fa-home', label: 'Home' },
    { path: '/badge-request', icon: 'fas fa-id-badge', label: 'Badge Request' },
    { path: '/badges', icon: 'fas fa-id-card', label: 'My Badges' },
    { path: '/dashboard', icon: 'fas fa-users', label: 'User Management', adminOnly: true },
    { path: '/admin/badge-requests', icon: 'fas fa-tasks', label: 'Request Management', adminOnly: true },
    { path: '/admin/create-badge', icon: 'fas fa-plus-circle', label: 'Create Badge', adminOnly: true },
    { path: '/placeholder1', icon: 'fas fa-box', label: 'Placeholder 1' },
    { path: '/placeholder2', icon: 'fas fa-cog', label: 'Placeholder 2' }
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className={`bg-dark text-white ${isCollapsed ? 'collapsed-sidebar' : 'sidebar'}`}>
        <div className="p-3">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className={`mb-0 ${isCollapsed ? 'd-none' : ''}`}>
              <i className="fas fa-plane me-2"></i> Office National des Aéroports
            </h4>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <i className={`fas fa-${isCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
            </button>
          </div>
        </div>

        <nav className="mt-3">
          <ul className="nav nav-pills flex-column">
            {menuItems.map((item) => {
              if (item.adminOnly && user?.is_admin !== true) return null;
              return (
                <li className="nav-item" key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link text-white ${isActive(item.path) ? 'active' : ''}`}
                    title={isCollapsed ? item.label : ''}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    <i className={`${item.icon} ${isCollapsed ? 'text-center' : 'me-2'}`}></i>
                    {!isCollapsed && item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto p-3">
          {!isCollapsed && (
            <div className="text-center mb-3">
              <img
                src={user?.photo || defaultProfile}
                alt="Profile"
                className="rounded-circle mb-2"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
              <div className="fw-semibold">{user?.name || 'User'}</div>
              <small className="text-muted">{user?.email}</small>
            </div>
          )}
          <button
            className="btn btn-outline-light btn-sm w-100"
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : ''}
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-fill">
        {/* Top Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">
              <i className="fas fa-id-badge me-2"></i> Airport Badge Management System
            </span>
            <div className="navbar-nav ms-auto">
              <div className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#!"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="avatar-circle bg-primary text-white me-2">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {user?.name || 'User'}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><h6 className="dropdown-header">Account</h6></li>
                  <li><span className="dropdown-item-text">Email: {user?.email}</span></li>
                  <li><span className="dropdown-item-text">Admin: {user?.is_admin ? 'Yes' : 'No'}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-4">
          {children}
        </main>
      </div>

      <style jsx>{`
        .sidebar {
          width: 250px;
          transition: width 0.3s ease;
        }
        .collapsed-sidebar {
          width: 70px;
          transition: width 0.3s ease;
        }
        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }
        .nav-link.active {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default SidebarLayout;
