// resources/js/components/badge/BadgeCreation.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { badgeApi, badgeUtils } from '../../services/badgeApi';

const BadgeCreation = () => {
  const { user } = useAuth();
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      const approved = await badgeApi.getApprovedRequests();
      setApprovedRequests(approved);
    } catch (error) {
      console.error('Error fetching approved requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate badge number in format BDG-YYYYMMDD-XXXXXX
  const generateBadgeNumber = () => {
  // Generate a unique badge number string, e.g.:
  return 'BDG-' + new Date().toISOString().slice(0,10).replace(/-/g, '') + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};


  // Open modal and generate badge number
  const openModalWithBadgeNumber = (request) => {
    setSelectedRequest(request);
    setBadgeNumber(generateBadgeNumber());
  };

  const handleCreateBadge = async (requestId) => {
  setCreating(true);
  setMessage('');

  try {
    const badgeNumber = generateBadgeNumber();

    await badgeApi.createBadge({ badge_request_id: requestId, badge_number: badgeNumber });

    setMessage('Badge created successfully!');
    fetchApprovedRequests();
    setSelectedRequest(null);
  } catch (error) {
    setMessage(error.message || 'Failed to create badge');
    console.error('Error creating badge:', error);
  } finally {
    setCreating(false);
  }
};

  const formatZones = badgeUtils.formatZones;
  const formatDate = badgeUtils.formatDate;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Page header */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Create Badges</h1>
              <p className="text-muted">Create badges from approved requests</p>
            </div>
            <div className="badge bg-success fs-6">
              <i className="fas fa-plus-circle me-2"></i>
              Badge Creation
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error message */}
      {message && (
        <div
          className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}
        >
          <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {/* Approved requests list */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-list me-2"></i>
                Approved Requests Ready for Badge Creation
              </h5>
            </div>
            <div className="card-body">
              {approvedRequests.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No Approved Requests</h5>
                  <p className="text-muted">There are no approved badge requests ready for badge creation.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>User</th>
                        <th>Type</th>
                        <th>Zones</th>
                        <th>Valid Period</th>
                        <th>Approved Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedRequests.map((request) => (
                        <tr key={request.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                                <i className="fas fa-user text-white"></i>
                              </div>
                              <div>
                                <h6 className="mb-0">{request.user?.name}</h6>
                                <small className="text-muted">{request.user?.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">{request.type?.replace('_', ' ')}</span>
                          </td>
                          <td>
                            <span className="text-muted">{formatZones(request.requested_zones)}</span>
                          </td>
                          <td>
                            <div>
                              <small className="text-muted">From:</small> {formatDate(request.valid_from)}<br />
                              <small className="text-muted">To:</small> {formatDate(request.valid_until)}
                            </div>
                          </td>
                          <td>
                            <span className="text-muted">{formatDate(request.updated_at)}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openModalWithBadgeNumber(request)}
                                disabled={creating}
                              >
                                <i className="fas fa-eye me-1"></i>
                                View Details
                              </button>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setBadgeNumber(generateBadgeNumber());
                                  handleCreateBadge(request.id, badgeNumber);
                                }}
                                disabled={creating}
                              >
                                {creating ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                    Creating...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-plus me-1"></i>
                                    Create Badge
                                  </>
                                )}
                              </button>
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
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-info-circle me-2"></i>
                    Request Details
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedRequest(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6>User Information</h6>
                      <p><strong>Name:</strong> {selectedRequest.user?.name}</p>
                      <p><strong>Email:</strong> {selectedRequest.user?.email}</p>
                      <p><strong>Request Type:</strong> {selectedRequest.type?.replace('_', ' ')}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Access Details</h6>
                      <p><strong>Requested Zones:</strong> {formatZones(selectedRequest.requested_zones)}</p>
                      <p><strong>Valid From:</strong> {formatDate(selectedRequest.valid_from)}</p>
                      <p><strong>Valid Until:</strong> {formatDate(selectedRequest.valid_until)}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <h6>Admin Comments</h6>
                      <p className="text-muted">{selectedRequest.admin_comment || 'No comments provided'}</p>
                    </div>
                  </div>

                  {/* Display generated badge number */}
                  <div className="mb-3">
                    <label htmlFor="badgeNumber" className="form-label">Badge Number</label>
                    <input
                      type="text"
                      id="badgeNumber"
                      className="form-control"
                      value={badgeNumber}
                      readOnly
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedRequest(null)}>
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleCreateBadge}
                    disabled={creating || !badgeNumber}
                  >
                    {creating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Creating Badge...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-1"></i>
                        Create Badge
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default BadgeCreation;
