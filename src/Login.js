
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://us-central1-calorie-tracker-app-87bcb.cloudfunctions.net/loginWithPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login successful
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', data.user?.displayName || formData.email.split('@')[0]);
        localStorage.setItem('userEmail', formData.email);
        
        // Store auth token if provided
        if (data.idToken) {
          localStorage.setItem('authToken', data.idToken);
        }
        
        setLoading(false);
        navigate('/dashboard');
      } else {
        // Login failed
        setError(data.message || 'Invalid email or password');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="logo_rounded.png" alt="CapCal AI" className="login-logo" />
          <h1>Welcome Back</h1>
          <p>Sign in to your CapCal AI account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <button onClick={goHome} className="back-home-btn">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
