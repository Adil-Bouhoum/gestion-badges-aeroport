// components/badge/BadgeRequestList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const BadgeRequestList = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/badge-requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.data || data);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch requests');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refreshTrigger]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'approved':
        return 'badge bg-success';
      case 'rejected':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock';
      case 'approved':
        return 'fas fa-check-circle';
      case 'rejected':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration) => {
    const durationMap = {
      '1_day': '1 Day',
      '1_week': '1 Week',
      '1_month': '1 Month',
      '3_months': '3 Months',
      '6_months': '6 Months',
      '1_year': '1 Year',
      'permanent': 'Permanent'
    };
    return durationMap[duration] || duration;
  };

  const formatAccessZones = (zones) => {
    if (!zones) return 'None specified';
    return zones.split(',').map(zone => zone.trim()).join(', ');
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading your badge requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button 
            className="btn btn-primary"
            onClick={fetchRequests}
          >
            <i className="fas fa-redo me-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="fas fa-list me-2"></i>
          Your Badge Requests
        </h5>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={fetchRequests}
          title="Refresh"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      <div className="card-body">
        {requests.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
            <p className="text-muted">No badge requests found.</p>
            <p className="text-muted">Submit your first request above!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Duration</th>
                  <th>Access Zones</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <span className={getStatusBadgeClass(request.status)}>
                        <i className={`${getStatusIcon(request.status)} me-1`}></i>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }}>
                        {request.reason}
                      </div>
                    </td>
                    <td>{formatDuration(request.duration)}</td>
                    <td>
                      <small className="text-muted">
                        {formatAccessZones(request.access_zones)}
                      </small>
                    </td>
                    <td>
                      <small className="text-muted">
                        {formatDate(request.created_at)}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => {
                            // Show detailed view modal or expand row
                            alert(`Request Details:\n\nReason: ${request.reason}\nDuration: ${formatDuration(request.duration)}\nAccess Zones: ${formatAccessZones(request.access_zones)}\nAdditional Info: ${request.additional_info || 'None'}\nStatus: ${request.status}\nSubmitted: ${formatDate(request.created_at)}`);
                          }}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {request.status === 'approved' && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => {
                              // TODO: Implement PDF download
                              alert('PDF download feature coming soon!');
                            }}
                            title="Download Badge PDF"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeRequestList;