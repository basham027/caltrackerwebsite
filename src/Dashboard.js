
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      // Simulate checking authentication status
      // In a real app, this would check tokens, session, etc.
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (isAuthenticated === 'true') {
        setUser({
          name: localStorage.getItem('userName') || 'User',
          email: localStorage.getItem('userEmail') || 'user@example.com'
        });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-nav">
          <div className="dashboard-logo">
            <img src="logo_rounded.png" alt="CapCal AI" className="nav-logo" />
            <span>CapCal AI Dashboard</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Track your calories and reach your fitness goals with CapCal AI.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Today's Calories</h3>
            <div className="metric">
              <span className="metric-number">1,250</span>
              <span className="metric-unit">kcal</span>
            </div>
            <p className="metric-goal">Goal: 2,000 kcal</p>
          </div>

          <div className="dashboard-card">
            <h3>Protein</h3>
            <div className="metric">
              <span className="metric-number">85</span>
              <span className="metric-unit">g</span>
            </div>
            <p className="metric-goal">Goal: 120g</p>
          </div>

          <div className="dashboard-card">
            <h3>Water Intake</h3>
            <div className="metric">
              <span className="metric-number">6</span>
              <span className="metric-unit">glasses</span>
            </div>
            <p className="metric-goal">Goal: 8 glasses</p>
          </div>

          <div className="dashboard-card">
            <h3>Weight Progress</h3>
            <div className="metric">
              <span className="metric-number">72.5</span>
              <span className="metric-unit">kg</span>
            </div>
            <p className="metric-goal">Target: 70kg</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary">Log Food</button>
            <button className="action-btn">Add Exercise</button>
            <button className="action-btn">Update Weight</button>
            <button className="action-btn">View Reports</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
