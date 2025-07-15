import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import defaultProfile from '../../../assets/images/default-profile.png';
import 'bootstrap-icons/font/bootstrap-icons.css';


const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex flex-column p-3 bg-light vh-100 border-end" style={{ width: '250px' }}>
      <div className="text-center mb-4">
        <img
          src={user?.photo || defaultProfile}
          alt="Profile"
          className="rounded-circle mb-2"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
        <h5 className="mb-0">{user?.name}</h5>
        <small className="text-muted">{user?.email}</small>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : 'text-dark'}`}>
            <i className="bi bi-house-door me-2"></i> Home
          </Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : 'text-dark'}`}>
              <i className="bi bi-people me-2"></i> Users Dashboard
            </Link>
          </li>
        )}
        <li>
          <Link to="/placeholder1" className={`nav-link ${isActive('/placeholder1') ? 'active' : 'text-dark'}`}>
            <i className="bi bi-gear me-2"></i> Placeholder 1
          </Link>
        </li>
        <li>
          <Link to="/placeholder2" className={`nav-link ${isActive('/placeholder2') ? 'active' : 'text-dark'}`}>
            <i className="bi bi-info-circle me-2"></i> Placeholder 2
          </Link>
        </li>
      </ul>

      <hr />
      <div>
        <button className="btn btn-outline-danger w-100" onClick={logout}>
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
