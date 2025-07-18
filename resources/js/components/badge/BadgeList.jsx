// resources/js/components/badge/BadgeList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { badgeApi, badgeUtils } from '../../services/badgeApi';

const BadgeList = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    fetchUserBadges();
  }, []);

  const fetchUserBadges = async () => {
    try {
      const userBadges = await badgeApi.getUserBadges();
      setBadges(userBadges);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBadge = async (badgeId) => {
    try {
      await badgeUtils.downloadBadgeFile(badgeId);
    } catch (error) {
      console.error('Error downloading badge:', error);
    }
  };

  const formatZones = badgeUtils.formatZones;
  const formatDate = badgeUtils.formatDate;
  const isExpired = badgeUtils.isExpired;
  const getDaysRemaining = badgeUtils.getDaysRemaining;

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
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">My Badges</h1>
              <p className="text-muted">View and download your airport access badges</p>
            </div>
            <div className="badge bg-warning fs-6">
              <i className="fas fa-id-card me-2"></i>
              Badge Collection
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-list me-2"></i>
                Your Created Badges
              </h5>
            </div>
            <div className="card-body">
              {badges.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-id-card fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No Badges Available</h5>
                  <p className="text-muted">You don't have any created badges yet. Submit a badge request to get started.</p>
                  <a href="/badge-request" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Request New Badge
                  </a>
                </div>
              ) : (
                <div className="row">
                  {badges.map((badge) => (
                    <div key={badge.id} className="col-md-6 col-lg-4 mb-4">
                      <div className={`card h-100 ${isExpired(badge.valid_until) ? 'border-danger' : 'border-success'}`}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="badge-icon bg-primary rounded-circle p-3">
                              <i className="fas fa-id-badge fa-2x text-white"></i>
                            </div>
                            <div>
                              {isExpired(badge.valid_until) ? (
                                <span className="badge bg-danger">Expired</span>
                              ) : getDaysRemaining(badge.valid_until) <= 7 ? (
                                <span className="badge bg-warning">Expires Soon</span>
                              ) : (
                                <span className="badge bg-success">Active</span>
                              )}
                            </div>
                          </div>
                          
                          <h5 className="card-title">
                            {badge.type?.replace('_', ' ')} Badge
                          </h5>
                          
                          <div className="mb-3">
                            <small className="text-muted">Access Zones:</small>
                            <div className="mt-1">
                              {formatZones(badge.requested_zones).split(', ').map((zone, index) => (
                                <span key={index} className="badge bg-info me-1 mb-1">
                                  {zone}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="row text-center mb-3">
                            <div className="col-6">
                              <small className="text-muted">Valid From</small>
                              <div className="fw-bold">{formatDate(badge.valid_from)}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Valid Until</small>
                              <div className="fw-bold">{formatDate(badge.valid_until)}</div>
                            </div>
                          </div>
                          
                          {!isExpired(badge.valid_until) && (
                            <div className="text-center mb-3">
                              <small className="text-muted">
                                {getDaysRemaining(badge.valid_until)} days remaining
                              </small>
                            </div>
                          )}
                        </div>
                        
                        <div className="card-footer bg-transparent">
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm flex-fill"
                              onClick={() => setSelectedBadge(badge)}
                            >
                              <i className="fas fa-eye me-1"></i>
                              View Details
                            </button>
                            <button
                              className="btn btn-success btn-sm flex-fill"
                              onClick={() => handleDownloadBadge(badge.id)}
                            >
                              <i className="fas fa-download me-1"></i>
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-id-badge me-2"></i>
                  Badge Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedBadge(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <div className="badge-preview bg-primary text-white p-4 rounded">
                          <i className="fas fa-id-badge fa-3x mb-3"></i>
                          <h5 className="mb-2">{user?.name}</h5>
                          <p className="mb-1">{selectedBadge.type?.replace('_', ' ')} Badge</p>
                          <small>ID: {selectedBadge.id}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6>Badge Information</h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Type:</strong></td>
                          <td>{selectedBadge.type?.replace('_', ' ')}</td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>
                            {isExpired(selectedBadge.valid_until) ? (
                              <span className="badge bg-danger">Expired</span>
                            ) : (
                              <span className="badge bg-success">Active</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Valid From:</strong></td>
                          <td>{formatDate(selectedBadge.valid_from)}</td>
                        </tr>
                        <tr>
                          <td><strong>Valid Until:</strong></td>
                          <td>{formatDate(selectedBadge.valid_until)}</td>
                        </tr>
                        <tr>
                          <td><strong>Created:</strong></td>
                          <td>{formatDate(selectedBadge.created_at)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <h6>Access Zones</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {formatZones(selectedBadge.requested_zones).split(', ').map((zone, index) => (
                        <span key={index} className="badge bg-info fs-6 p-2">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {selectedBadge.admin_comment && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6>Admin Comments</h6>
                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        {selectedBadge.admin_comment}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedBadge(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleDownloadBadge(selectedBadge.id)}
                >
                  <i className="fas fa-download me-1"></i>
                  Download Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedBadge && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default BadgeList;