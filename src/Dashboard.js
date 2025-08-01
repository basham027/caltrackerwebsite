
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (isAuthenticated === 'true') {
          setUser({
            name: localStorage.getItem('userName') || 'User',
            email: localStorage.getItem('userEmail') || 'user@example.com'
          });

          // Fetch dashboard data from API using POST
          const currentDate = new Date();
          const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
          
          const payload = {
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            includeCosts: "true"
          };

          const response = await fetch('https://getfirestoreusage-zbhi5gq6gq-uc.a.run.app', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });
          
          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
          } else {
            setError('Failed to fetch dashboard data');
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {dashboardData ? (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>API Response</h3>
              <div className="api-data">
                {typeof dashboardData === 'object' ? (
                  <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
                ) : (
                  <p>{dashboardData}</p>
                )}
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Data Status</h3>
              <div className="metric">
                <span className="metric-number">✓</span>
                <span className="metric-unit">Connected</span>
              </div>
              <p className="metric-goal">API is responding</p>
            </div>

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
          </div>
        ) : (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Loading Data...</h3>
              <p>Fetching your dashboard information</p>
            </div>
          </div>
        )}

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
