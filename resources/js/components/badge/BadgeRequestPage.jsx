// components/badge/BadgeRequestPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BadgeRequestForm from './BadgeRequestForm';
import BadgeRequestList from './BadgeRequestList';

const BadgeRequestPage = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRequestSubmitted = (newRequest) => {
    // Trigger refresh of the request list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Badge Request</h1>
              <p className="text-muted">Submit and manage your airport badge requests</p>
            </div>
            <div className="badge bg-primary fs-6">
              <i className="fas fa-user me-2"></i>
              {user?.name || 'User'}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <BadgeRequestForm onRequestSubmitted={handleRequestSubmitted} />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <BadgeRequestList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default BadgeRequestPage;