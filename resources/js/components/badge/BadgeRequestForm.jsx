import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const BadgeRequestForm = ({ onRequestSubmitted }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: '', // Changed from 'duration' to match backend
    request_reason: '', // Changed from 'reason' to match backend
    requested_zones: [], // Changed from 'access_zones' and now using array
    additional_info: '' // This will map to 'admin_comment' in backend
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleZoneChange = (zone) => {
    setFormData(prev => {
      const newZones = prev.requested_zones.includes(zone)
        ? prev.requested_zones.filter(z => z !== zone)
        : [...prev.requested_zones, zone];
      return { ...prev, requested_zones: newZones };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const payload = {
        type: formData.type,
        request_reason: formData.request_reason,
        requested_zones: formData.requested_zones.join(','), // Convert array to comma-separated string
        admin_comment: formData.additional_info,
        // These dates would need to be calculated based on type
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: calculateEndDate(formData.type)
      };

      const response = await fetch('/api/badge-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setFormData({
        type: '',
        request_reason: '',
        requested_zones: [],
        additional_info: ''
      });
      
      alert('Badge request submitted successfully!');
      onRequestSubmitted?.(data);
    } catch (error) {
      console.error('Error:', error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        alert(error.message || 'Failed to submit request');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to calculate end date based on badge type
  const calculateEndDate = (type) => {
    const date = new Date();
    switch(type) {
      case '1_day': date.setDate(date.getDate() + 1); break;
      case '1_week': date.setDate(date.getDate() + 7); break;
      case '1_month': date.setMonth(date.getMonth() + 1); break;
      case '3_months': date.setMonth(date.getMonth() + 3); break;
      case '6_months': date.setMonth(date.getMonth() + 6); break;
      case '1_year': date.setFullYear(date.getFullYear() + 1); break;
      case 'permanent': return null; // Permanent badges might not need end date
      default: return null;
    }
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="fas fa-id-badge me-2"></i>
          Submit Badge Request
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="request_reason" className="form-label">
                  Reason for Badge Request <span className="text-danger">*</span>
                </label>
                <textarea
                  id="request_reason"
                  name="request_reason"
                  className={`form-control ${errors.request_reason ? 'is-invalid' : ''}`}
                  value={formData.request_reason}
                  onChange={handleChange}
                  rows="3"
                  required
                />
                {errors.request_reason && (
                  <div className="invalid-feedback">{errors.request_reason}</div>
                )}
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="type" className="form-label">
                  Badge Type <span className="text-danger">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select badge type...</option>
                  <option value="1_day">1 Day</option>
                  <option value="1_week">1 Week</option>
                  <option value="1_month">1 Month</option>
                  <option value="3_months">3 Months</option>
                  <option value="6_months">6 Months</option>
                  <option value="1_year">1 Year</option>
                  <option value="permanent">Permanent</option>
                </select>
                {errors.type && (
                  <div className="invalid-feedback">{errors.type}</div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Access Zones Required <span className="text-danger">*</span>
            </label>
            <div className="row">
              {['terminal', 'airside', 'cargo', 'maintenance'].map(zone => (
                <div className="col-md-6" key={zone}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={zone}
                      checked={formData.requested_zones.includes(zone)}
                      onChange={() => handleZoneChange(zone)}
                    />
                    <label className="form-check-label" htmlFor={zone}>
                      {zone.charAt(0).toUpperCase() + zone.slice(1).replace('_', ' ')} Area
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {errors.requested_zones && (
              <div className="text-danger small mt-1">{errors.requested_zones}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="additional_info" className="form-label">
              Additional Information
            </label>
            <textarea
              id="additional_info"
              name="additional_info"
              className="form-control"
              value={formData.additional_info}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFormData({
                  type: '',
                  request_reason: '',
                  requested_zones: [],
                  additional_info: ''
                });
                setErrors({});
              }}
            >
              <i className="fas fa-times me-2"></i>
              Clear Form
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BadgeRequestForm;