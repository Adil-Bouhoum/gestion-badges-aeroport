import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const BadgeRequestManagement = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [processingRequest, setProcessingRequest] = useState(null);
  
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
        if (response.status === 403) {
          setError('You are not authorized to view requests');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch requests');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };
  console.log(user)
  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      setProcessingRequest(requestId);
      const comment = prompt(`Enter comment for ${newStatus} status:`) || '';
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/badge-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          admin_comment: comment
        })
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === requestId ? updatedRequest : req
          )
        );
        alert(`Request ${newStatus} successfully!`);
      } else {
        if (response.status === 403) {
          alert('You need admin privileges to perform this action');
        } else {
          const errorData = await response.json();
          alert(errorData.message || `Failed to ${newStatus} request`);
        }
      }
    } catch (err) {
      alert('Network error. Please try again.');
      console.error('Error updating request status:', err);
    } finally {
      setProcessingRequest(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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

  const formatDuration = (type) => {
    const durationMap = {
      '1_day': '1 Day',
      '1_week': '1 Week',
      '1_month': '1 Month',
      '3_months': '3 Months',
      '6_months': '6 Months',
      '1_year': '1 Year',
      'permanent': 'Permanent',
      'temporary': 'Temporary',
      'contractor': 'Contractor'
    };
    return durationMap[type] || type;
  };

  const formatAccessZones = (zones) => {
    if (!zones) return 'None specified';
    return zones.split(',').map(zone => zone.trim()).join(', ');
  };

  const filteredRequests = requests.filter(request => {
    if (statusFilter === 'all') return true;
    return request.status === statusFilter;
  });

  const getStatusCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading badge requests...</p>
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
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <i className="fas fa-tasks me-2"></i>
            Badge Request Management
          </h5>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={fetchRequests}
            title="Refresh"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
        
        <div className="mt-3">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button
                className={`nav-link ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All <span className="badge bg-secondary ms-1">{statusCounts.all}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending <span className="badge bg-warning ms-1">{statusCounts.pending}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${statusFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setStatusFilter('approved')}
              >
                Approved <span className="badge bg-success ms-1">{statusCounts.approved}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${statusFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected <span className="badge bg-danger ms-1">{statusCounts.rejected}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="card-body">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
            <p className="text-muted">
              {statusFilter === 'all' 
                ? 'No badge requests found.' 
                : `No ${statusFilter} requests found.`
              }
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Type</th>
                  <th>Access Zones</th>
                  <th>Dates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-circle bg-primary text-white me-2">
                          {request.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="fw-semibold">{request.user?.name || 'Unknown User'}</div>
                          <small className="text-muted">{request.user?.email || 'No email'}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(request.status)}>
                        <i className={`${getStatusIcon(request.status)} me-1`}></i>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }}>
                        {request.request_reason}
                      </div>
                      {request.admin_comment && (
                        <small className="text-muted d-block">
                          <strong>Admin Note:</strong> {request.admin_comment}
                        </small>
                      )}
                    </td>
                    <td>{formatDuration(request.type)}</td>
                    <td>
                      <small className="text-muted">
                        {formatAccessZones(request.requested_zones)}
                      </small>
                    </td>
                    <td>
                      <small className="d-block">
                        <strong>From:</strong> {formatDate(request.valid_from)}
                      </small>
                      <small className="d-block">
                        <strong>To:</strong> {request.valid_until ? formatDate(request.valid_until) : 'Permanent'}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => {
                            alert(`Request Details:\n\nUser: ${request.user?.name || 'Unknown'}\nEmail: ${request.user?.email || 'No email'}\nReason: ${request.request_reason}\nType: ${formatDuration(request.type)}\nAccess Zones: ${formatAccessZones(request.requested_zones)}\nAdmin Comment: ${request.admin_comment || 'None'}\nStatus: ${request.status}\nValid From: ${formatDate(request.valid_from)}\nValid Until: ${request.valid_until ? formatDate(request.valid_until) : 'Permanent'}\nSubmitted: ${formatDate(request.created_at)}`);
                          }}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        
                        {request.status === 'pending' && user.is_admin && (
                          <>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => updateRequestStatus(request.id, 'approved')}
                              disabled={processingRequest === request.id}
                              title="Approve Request"
                            > Approve
                              {processingRequest === request.id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                <i className="fas fa-check"></i>
                              )}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => updateRequestStatus(request.id, 'rejected')}
                              disabled={processingRequest === request.id}
                              title="Reject Request"
                            > Reject
                              {processingRequest === request.id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                <i className="fas fa-times"></i>
                              )}
                            </button>
                          </>
                        )}
                        
                        {request.status === 'approved' && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              // TODO: Implement PDF generation
                              alert('PDF generation feature coming soon!');
                            }}
                            title="Generate Badge PDF"
                          >
                            <i className="fas fa-file-pdf"></i>
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

export default BadgeRequestManagement;