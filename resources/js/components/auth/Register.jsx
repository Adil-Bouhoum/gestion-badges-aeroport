import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoImage from '../../../assets/images/Menara_Ap_Logo.png';
import backgroundImage from '../../../assets/images/airport-background.jpg';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        fonction: '',
        service: '',
        password: '',
        password_confirmation: ''
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // List of available functions and services
    const fonctions = [
        'Security Officer',
        'Operations Manager',
        'Baggage Handler',
        'Customs Agent',
        'Air Traffic Controller',
        'Maintenance Technician'
    ];

    const services = [
        'Security',
        'Operations',
        'Passenger Services',
        'Customs',
        'Air Traffic Control',
        'Maintenance'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await register(formData);
            navigate('/dashboard'); // Redirect after successful registration
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden p-3"
            style={{
                background: 'linear-gradient(rgba(0, 35, 102, 0.85), rgba(0, 35, 102, 0.85))'
            }}>
            
            {/* Blurry Background Image */}
            <div className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(5px) brightness(0.7)',
                    zIndex: -1,
                    transform: 'scale(1.05)'
                }}>
            </div>

            {/* Registration Card */}
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden" 
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}>
                
                {/* Logo Header */}
                <div className="bg-primary py-4 text-center bg-transparent">
                    <img src={logoImage} alt="Menara AP Logo" 
                        style={{ 
                            height: '80px',
                            maxWidth: '80%',
                            objectFit: 'contain'
                        }} />
                </div>
                
                <div className="card-body p-4 p-md-5">
                    <h3 className="text-center mb-4" style={{ color: '#002366' }}>
                        Airport Staff Registration
                    </h3>
                    
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center mb-4">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full Name*</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                style={{ borderColor: '#002366' }}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address*</label>
                            <input
                                type="email"
                                className="form-control form-control-lg"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                style={{ borderColor: '#002366' }}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="fonction" className="form-label">Job Function*</label>
                            <select
                                className="form-select form-select-lg"
                                id="fonction"
                                name="fonction"
                                required
                                value={formData.fonction}
                                onChange={handleChange}
                                style={{ borderColor: '#002366' }}
                            >
                                <option value="">Select your function</option>
                                {fonctions.map((fonction, index) => (
                                    <option key={index} value={fonction}>{fonction}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="service" className="form-label">Department/Service*</label>
                            <select
                                className="form-select form-select-lg"
                                id="service"
                                name="service"
                                required
                                value={formData.service}
                                onChange={handleChange}
                                style={{ borderColor: '#002366' }}
                            >
                                <option value="">Select your service</option>
                                {services.map((service, index) => (
                                    <option key={index} value={service}>{service}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password*</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                id="password"
                                name="password"
                                required
                                minLength="8"
                                value={formData.password}
                                onChange={handleChange}
                                style={{ borderColor: '#002366' }}
                            />
                            <small className="text-muted">Minimum 8 characters</small>
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="password_confirmation" className="form-label">Confirm Password*</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                id="password_confirmation"
                                name="password_confirmation"
                                required
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                style={{ borderColor: '#002366' }}
                            />
                        </div>
                        
                        <div className="d-grid mb-3">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg fw-bold"
                                disabled={loading}
                                style={{ 
                                    backgroundColor: '#002366',
                                    borderColor: '#002366'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Registering Staff...
                                    </>
                                ) : 'Register Account'}
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <p className="mb-0">
                                Already have an account?{' '}
                                <a href="/login" className="text-decoration-none" 
                                    style={{ color: '#002366', fontWeight: '500' }}>
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
                
                <div className="card-footer bg-light text-center py-3">
                    <small className="text-muted">
                        © {new Date().getFullYear()} Office National Des Aéroports - Badge Management System
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Register;