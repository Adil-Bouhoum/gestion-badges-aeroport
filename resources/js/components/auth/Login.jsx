import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import backgroundImage from '../../../assets/images/airport-background.jpg';
import logoImage from '../../../assets/images/Menara_Ap_Logo.png';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [localError, setLocalError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, error: authError } = useAuth(); // Remove setError from here
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLocalError('');

        try {
            await login(formData);
            navigate('/dashboard', { replace: true });
        } catch (error) {
            // Handle error from login promise
            setLocalError(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
             style={{
                 background: 'linear-gradient(rgba(0, 35, 102, 0.7), rgba(0, 35, 102, 0.7))',
                 padding: '1rem'
             }}>
            
            {/* Blurry Background Image */}
            <div className="position-absolute top-0 start-0 w-100 h-100"
                 style={{
                     backgroundImage: `url(${backgroundImage})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     filter: 'blur(8px)',
                     zIndex: -1,
                     transform: 'scale(1.1)' // Prevents blurry edges
                 }}>
            </div>

            <div className="card shadow-sm position-relative" style={{ 
                width: '100%', 
                maxWidth: '28rem',
                borderTop: '4px solid #002366',
                backgroundColor: 'rgba(255, 255, 255, 0.95)' // Slightly transparent white
            }}>
                <div className="card-body p-4">
                    <div className="text-center mb-4">
                        <img src={logoImage} alt="Menara AP Logo" 
                             style={{ height: '60px', marginBottom: '1rem' }} />
                        <h2 className="fw-bold mb-1" style={{ color: '#002366' }}>
                            Sign in to your account
                        </h2>
                        <p className="text-muted small">
                            Office National Des Aéroports
                        </p>
                    </div>
                    
                    {(authError || localError) && (
                        <div className="alert alert-danger d-flex align-items-center">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>{authError || localError}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="d-grid mb-3">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ backgroundColor: '#002366', borderColor: '#002366' }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Signing in...
                                    </>
                                ) : 'Sign in'}
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <a href="/forgot-password" className="text-decoration-none" style={{ color: '#002366' }}>
                                Forgot password?
                            </a>
                        </div>
                    </form>
                    
                    <div className="text-center mt-4 pt-3 border-top">
                        <small className="text-muted">
                            Don't have an account?{' '}
                            <a href="/register" className="text-decoration-none fw-bold" style={{ color: '#002366' }}>
                                Register
                            </a>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;