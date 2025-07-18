// resources/js/components/badge/BadgeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { badgeApi, badgeUtils } from '../../services/badgeApi';

const BadgeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    activeBadges: 0,
    expiredBadges: 0,
    expiringSoon: 0,
    readyForCreation: 0, // Admin only
  });
  const [loading, setLoading] = useState(true);
  const [recentBadges, setRecentBadges] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const requests = await badgeApi.getBadgeRequests();
      
      // Calculate statistics
      const totalRequests = requests.length;
      const pendingRequests = requests.filter(r => r.status === 'pending').length;
      const approvedRequests = requests.filter(r => r.status === 'approved').length;
      const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
      
      const badges = requests.filter(r => r.status === 'approved' && r.badge_created);
      const activeBadges = badges.filter(b => !badgeUtils.isExpired(b.valid_until)).length;
      const expiredBadges = badges.filter(b => badgeUtils.isExpired(b.valid_until)).length;
      const expiringSoon = badges.filter(b => 
        !badgeUtils.isExpired(b.valid_until) && badgeUtils.getDaysRemaining(b.valid_until) <= 7
      ).length;
      
      // Admin-only stat
      const readyForCreation = user?.is_admin ? 
        requests.filter(r => r.status === 'approved' && !r.badge_created).length : 0;

      setStats({
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        activeBadges,
        expiredBadges,
        expiringSoon,
        readyForCreation,
      });

      // Get recent badges (last 5)
      const recentBadgeList = badges
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentBadges(recentBadgeList);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="h3 mb-0">Badge Dashboard</h1>
              <p className="text-muted">Overview of your badge requests and badges</p>
            </div>
            <div className="badge bg-info fs-6">
              <i className="fas fa-chart-bar me-2"></i>
              Dashboard
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card border-primary">
            <div className="card-body text-center">
              <i className="fas fa-list-alt fa-2x text-primary mb-3"></i>
              <h3 className="mb-1">{stats.totalRequests}</h3>
              <p className="text-muted mb-0">Total Requests</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card border-warning">
            <div className="card-body text-center">
              <i className="fas fa-clock fa-2x text-warning mb-3"></i>
              <h3 className="mb-1">{stats.pendingRequests}</h3>
              <p className="text-muted mb-0">Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card border-success">
            <div className="card-body text-center">
              <i className="fas fa-id-card fa-2x text-success mb-3"></i>
              <h3 className="mb-1">{stats.activeBadges}</h3>
              <p className="text-muted mb-0">Active Badges</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card border-danger">
            <div className="card-body text-center">
              <i className="fas fa-exclamation-triangle fa-2x text-danger mb-3"></i>
              <h3 className="mb-1">{stats.expiringSoon}</h3>
              <p className="text-muted mb-0">Expiring Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Statistics */}
      {user?.is_admin && (
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card border-info">
              <div className="card-body text-center">
                <i className="fas fa-plus-circle fa-2x text-info mb-3"></i>
                <h3 className="mb-1">{stats.readyForCreation}</h3>
                <p className="text-muted mb-0">Ready for Badge Creation</p>
                <Link to="/admin/create-badge" className="btn btn-sm btn-info mt-2">
                  <i className="fas fa-plus me-1"></i>
                  Create Badges
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-secondary">
              <div className="card-body text-center">
                <i className="fas fa-tasks fa-2x text-secondary mb-3"></i>
                <h3 className="mb-1">{stats.pendingRequests}</h3>
                <p className="text-muted mb-0">Requests to Review</p>
                <Link to="/admin/badge-requests" className="btn btn-sm btn-secondary mt-2">
                  <i className="fas fa-eye me-1"></i>
                  Review Requests
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Badges */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Badges
              </h5>
            </div>
            <div className="card-body">
              {recentBadges.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No badges created yet</p>
                  <Link to="/badge-request" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Request Your First Badge
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Zones</th>
                        <th>Valid Until</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBadges.map((badge) => {
                        const badgeStatus = badgeUtils.getBadgeStatus(badge.valid_until);
                        return (
                          <tr key={badge.id}>
                            <td>
                              <span className="badge bg-info">
                                {badge.type?.replace('_', ' ')}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {badgeUtils.formatZones(badge.requested_zones)}
                              </small>
                            </td>
                            <td>
                              {badgeUtils.formatDate(badge.valid_until)}
                            </td>
                            <td>
                              <span className={`badge ${badgeStatus.className}`}>
                                {badgeStatus.text}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => badgeUtils.downloadBadgeFile(badge.id)}
                              >
                                <i className="fas fa-download me-1"></i>
                                Download
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {recentBadges.length > 0 && (
              <div className="card-footer text-center">
                <Link to="/badges" className="btn btn-outline-primary">
                  <i className="fas fa-eye me-2"></i>
                  View All Badges
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDashboard;